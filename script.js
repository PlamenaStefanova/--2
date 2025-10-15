const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const historyContainer = document.getElementById("history");
const themeSelector = document.getElementById("theme-selector");
const sciToggle = document.getElementById("scientific-toggle");
const scientific = document.getElementById("scientific");
const clearHistoryBtn = document.getElementById("clear-history");

let expression = "";
let history = [];

// ===================== ИНИЦИАЛИЗАЦИЯ =====================
window.addEventListener("DOMContentLoaded", () => {
  // Зареждане на избраната тема
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.add(`${savedTheme}-theme`);
    themeSelector.value = savedTheme;
  } else {
    document.body.classList.add("light-theme");
  }

  // Зареждане на историята
  const savedHistory = localStorage.getItem("calcHistory");
  if (savedHistory) {
    history = JSON.parse(savedHistory);
    history.forEach(item => renderHistoryItem(item.expr, item.result));
  }
});

// ===================== ОСНОВНА ЛОГИКА =====================
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (!action) return;

    switch (action) {
      case "C":
      case "clear":
        expression = "";
        display.textContent = "0";
        break;
      case "CE":
      case "delete":
        expression = expression.slice(0, -1);
        display.textContent = expression || "0";
        break;
      case "=":
        try {
          const result = evaluate(expression);
          addToHistory(expression, result);
          expression = result.toString();
          display.textContent = result;
        } catch {
          display.textContent = "Грешка";
          expression = "";
        }
        break;
      default:
        expression += action;
        display.textContent = expression;
        break;
    }
  });
});

// ===================== НАУЧНИ ФУНКЦИИ =====================
function evaluate(expr) {
  expr = expr.replace(/÷/g, "/").replace(/×/g, "*");
  expr = expr.replace(/π/g, "Math.PI").replace(/e/g, "Math.E");
  expr = expr.replace(/sin\(/g, "Math.sin(");
  expr = expr.replace(/cos\(/g, "Math.cos(");
  expr = expr.replace(/tan\(/g, "Math.tan(");
  expr = expr.replace(/log\(/g, "Math.log10(");
  expr = expr.replace(/ln\(/g, "Math.log(");
  expr = expr.replace(/√/g, "Math.sqrt");
  expr = expr.replace(/(\d+)!/g, (_, n) => factorial(parseInt(n)));
  expr = expr.replace(/(\d+)\^(\d+)/g, (_, a, b) => Math.pow(a, b));
  expr = expr.replace(/\^2/g, "**2").replace(/\^3/g, "**3");
  return Function(`"use strict"; return (${expr})`)();
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0) return 1;
  return n * factorial(n - 1);
}

// ===================== ИСТОРИЯ =====================
function addToHistory(expr, result) {
  history.unshift({ expr, result });
  renderHistory();
  saveHistory();
}

function renderHistory() {
  historyContainer.innerHTML = "";
  history.forEach(item => renderHistoryItem(item.expr, item.result));
}

function renderHistoryItem(expr, result) {
  const div = document.createElement("div");
  div.classList.add("history-item");
  div.textContent = `${expr} = ${result}`;
  div.addEventListener("click", () => {
    expression = expr;
    display.textContent = expr;
  });
  historyContainer.appendChild(div);
}

// Изчистване на историята
clearHistoryBtn.addEventListener("click", () => {
  history = [];
  historyContainer.innerHTML = "";
  localStorage.removeItem("calcHistory");
});

// Запазване в LocalStorage
function saveHistory() {
  localStorage.setItem("calcHistory", JSON.stringify(history));
}

// ===================== ТЕМИ =====================
themeSelector.addEventListener("change", e => {
  const theme = e.target.value;
  document.body.className = "";
  document.body.classList.add(`${theme}-theme`);
  localStorage.setItem("theme", theme);
});

// ===================== НАУЧЕН РЕЖИМ =====================
sciToggle.addEventListener("click", () => {
  scientific.classList.toggle("hidden");
});
