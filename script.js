// Elements
const disp = document.getElementById('disp');
const history = document.getElementById('history');
const memInd = document.getElementById('memInd');

// State
let current = '0';
let previous = '';
let op = '';
let memory = 0;
let isDeg = true;
let historyLog = [];

// Display
function updateDisplay() { disp.value = current; }
function addToHistory(entry) {
  historyLog.push(entry);
  if (historyLog.length > 5) historyLog.shift();
  history.textContent = historyLog[historyLog.length - 1] || '';
}

// Input
function append(val) {
  if (current === '0' || current === 'Error') current = val;
  else current += val;
  updateDisplay();
}

function backspace() {
  current = current.slice(0, -1) || '0';
  updateDisplay();
}

function clearAll() {
  current = '0';
  previous = '';
  op = '';
  updateDisplay();
  history.textContent = '';
}

// Operators
function setOp(operator) {
  if (current === 'Error') return;
  if (previous && op) equals();
  previous = current;
  op = operator;
  current = '0';
}

// Equals
function equals() {
  if (!op || !previous) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result = 0;
  let expr = '';

  try {
    switch (op) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = a / b; break;
    }
    expr = `${a} ${op} ${b} = ${result}`;
    addToHistory(expr);
    current = result.toString();
    previous = '';
    op = '';
    updateDisplay();
  } catch {
    current = 'Error';
    updateDisplay();
  }
}

// Scientific Functions
function fn(type) {
  const num = parseFloat(current);
  let result = 0;
  let expr = '';

  try {
    const rad = isDeg ? num * Math.PI / 180 : num;
    switch (type) {
      case 'sin': result = Math.sin(rad); break;
      case 'cos': result = Math.cos(rad); break;
      case 'tan': result = Math.tan(rad); break;
      case 'asin': result = (isDeg ? Math.asin(num) * 180 / Math.PI : Math.asin(num)); break;
      case 'acos': result = (isDeg ? Math.acos(num) * 180 / Math.PI : Math.acos(num)); break;
      case 'atan': result = (isDeg ? Math.atan(num) * 180 / Math.PI : Math.atan(num)); break;
      case 'log': result = Math.log10(num); break;
      case 'ln': result = Math.log(num); break;
      case 'log2': result = Math.log2(num); break;
      case 'sqrt': result = Math.sqrt(num); break;
      case 'cbrt': result = Math.cbrt(num); break;
      case 'sq': result = num * num; break;
      case 'cube': result = num * num * num; break;
      case 'pow10': result = Math.pow(10, num); break;
      case 'pow2': result = Math.pow(2, num); break;
      case 'powE': result = Math.exp(num); break;
      case 'inv': result = 1 / num; break;
      case 'percent': result = num / 100; break;
      case 'fact':
        result = 1;
        for (let i = 2; i <= num; i++) result *= i;
        break;
    }
    expr = `${type}(${num}) = ${result}`;
    addToHistory(expr);
    current = result.toString();
    updateDisplay();
  } catch {
    current = 'Error';
    updateDisplay();
  }
}

// Exponent
function powY() {
  previous = current;
  op = '^';
  current = '0';
}

// Toggle deg/rad
function toggleDeg() {
  isDeg = !isDeg;
}

// Memory
function memClear() { memory = 0; updateMem(); }
function memRecall() { current = memory.toString(); updateDisplay(); }
function memAdd() { memory += parseFloat(current) || 0; updateMem(); }
function memSub() { memory -= parseFloat(current) || 0; updateMem(); }
function updateMem() {
  memInd.classList.toggle('show', memory !== 0);
}

// Keyboard
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') append(e.key);
  if (['+', '-', '*', '/'].includes(e.key)) setOp(e.key);
  if (e.key === 'Enter') equals();
  if (e.key === 'Backspace') backspace();
  if (e.key === 'Escape') clearAll();
  if (e.key === '.') append('.');
});

updateDisplay();
updateMem();