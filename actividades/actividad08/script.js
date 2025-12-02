    class Calculator {
      constructor() {
        this.variablesInput = document.getElementById('variables');
        this.equationsInput = document.getElementById('equations');
        this.calculateButton = document.getElementById('calculate-btn');
        this.resultDiv = document.getElementById('result');
        this.infoCard = document.querySelector('.info-card');
        this.init();
      }

      init() {
        this.calculateButton.addEventListener('click', () => this.calculate());
      }

      parseVariables(text) {
        const vars = {};
        const lines = text.split('\n').filter(l => l.trim());

        for (const line of lines) {
          const parts = line.split(',');
          for (const part of parts) {
            const match = part.trim().match(/^(\w+)\s*=\s*(.+)$/);
            if (match) {
              const [, key, val] = match;
              vars[key] = this.evaluateExpression(val.trim(), vars);
            }
          }
        }
        return vars;
      }

      evaluateExpression(expr, vars) {
        if (!/^[a-zA-Z0-9+\-*/().\s^]+$/.test(expr)) {
          throw new Error(`Expresión no válida: ${expr}`);
        }
        let exp = expr.replace(/\^/g, '**');
        for (const [k, v] of Object.entries(vars)) {
          exp = exp.replace(new RegExp(`\\b${k}\\b`, 'g'), v);
        }
        if (/[a-zA-Z]/.test(exp)) throw new Error(`Variable indefinida en: ${expr}`);
        return Function(`"use strict"; return (${exp})`)();
      }

      calculate() {
        try {
          const vars = this.parseVariables(this.variablesInput.value.trim());
          const equations = this.equationsInput.value.trim().split('\n').filter(l => l.trim());
          const results = [];

          for (const eq of equations) {
            const match = eq.match(/^(\w+)\s*=\s*(.+)$/);
            if (match) {
              const [, key, val] = match;
              vars[key] = this.evaluateExpression(val, vars);
              results.push(`${key} = ${vars[key]}`);
            } else {
              results.push(`${eq} = ${this.evaluateExpression(eq, vars)}`);
            }
          }

          this.showResult(results.join('\n'), 'success');
        } catch (e) {
          this.showResult(e.message, 'error');
        }
      }

      showResult(msg, type) {
        this.resultDiv.textContent = msg;
        this.infoCard.className = `info-card result-${type}`;
      }
    }

    document.addEventListener('DOMContentLoaded', () => new Calculator());