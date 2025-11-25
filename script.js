// Utility: write result or error
function showResult(value) {
  document.getElementById('resultVal').innerText = value;
}

// Parse numeric input safely
function parseNumber(val) {
  if (val === null || val === undefined || val === '') return NaN;
  // use parseFloat to allow decimals and negative numbers
  return parseFloat(val);
}

// Basic operations using numbers (handles NaN)
function operate(a, b, op) {
  if (isNaN(a) || isNaN(b)) return 'Invalid Input';
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return (b === 0) ? 'Cannot divide by zero' : a / b;
    default: return 'Unknown operator';
  }
}

// Hook up legacy buttons (two-number inputs)
document.getElementById('btnAdd').addEventListener('click', () => {
  const a = parseNumber(document.getElementById('num1').value);
  const b = parseNumber(document.getElementById('num2').value);
  showResult(operate(a, b, '+'));
});
document.getElementById('btnSub').addEventListener('click', () => {
  const a = parseNumber(document.getElementById('num1').value);
  const b = parseNumber(document.getElementById('num2').value);
  showResult(operate(a, b, '-'));
});
document.getElementById('btnMul').addEventListener('click', () => {
  const a = parseNumber(document.getElementById('num1').value);
  const b = parseNumber(document.getElementById('num2').value);
  showResult(operate(a, b, '*'));
});
document.getElementById('btnDiv').addEventListener('click', () => {
  const a = parseNumber(document.getElementById('num1').value);
  const b = parseNumber(document.getElementById('num2').value);
  showResult(operate(a, b, '/'));
});

// Expression mode: parse single-string expressions like "5 + 4" or "10–6" or "7×3"
document.getElementById('btnExpr').addEventListener('click', () => {
  const raw = document.getElementById('expr').value.trim();

  // normalize some unicode operator characters and dash variants
  const normalized = raw
    .replace(/\u2215/g, '/')   // division slash
    .replace(/\u00D7/g, '*')   // multiplication ×
    .replace(/[×xX]/g, '*')    // common x
    .replace(/[÷]/g, '/')      // division sign
    .replace(/[\u2013\u2014]/g, '-') // en-dash/em-dash -> minus
    .replace(/\s+/g, ' ');     // collapse multiple spaces

  // regex to capture "number operator number"
  const exprRe = /^\s*([+-]?\d+(\.\d+)?)\s*([+\-*/])\s*([+-]?\d+(\.\d+)?)\s*$/;
  const m = normalized.match(exprRe);
  if (!m) {
    showResult('Invalid expression. Use format: 5 + 4');
    return;
  }

  const a = parseFloat(m[1]);
  const op = m[3];
  const b = parseFloat(m[4]);

  const res = operate(a, b, op);
  // format result: if numeric and not integer, show up to 10 decimal places trimmed
  if (typeof res === 'number') {
    const isInt = Number.isInteger(res);
    showResult(isInt ? res : parseFloat(res.toFixed(10)));
  } else {
    showResult(res);
  }
});

// Allow pressing Enter in expr field to calculate
document.getElementById('expr').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('btnExpr').click();
  }
});
