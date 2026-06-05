const visor     = document.getElementById('resultado');
const expresion = document.getElementById('expresion');

let resetearTras = false;

function prepararExpresion(expr) {
  return expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
}

function actualizarExpresion(txt) {
  expresion.textContent = txt || '';
}

function mostrarEnVisor(valor, claseExtra = '') {
  visor.classList.remove('error', 'resultado-ok', 'resultado-anim');
  if (claseExtra) visor.classList.add(claseExtra);
  void visor.offsetWidth;
  visor.classList.add('resultado-anim');
  visor.value = valor;
}

function manejarNumero(valor) {
  const actual = visor.value;

  if (resetearTras) {
    resetearTras = false;
    actualizarExpresion('');
    mostrarEnVisor(valor === '.' ? '0.' : valor);
    return;
  }

  if (valor === '.') {
    const segmento = actual.split(/[\+\-\×\÷]/).pop();
    if (segmento.includes('.')) return;
    if (actual === '0' || actual === '') { mostrarEnVisor('0.'); return; }
    mostrarEnVisor(actual + '.');
    return;
  }

  if (actual === '0') { mostrarEnVisor(valor); return; }
  mostrarEnVisor(actual + valor);
}

function manejarOperador(simbolo) {
  const actual = visor.value;
  const operadores = ['+', '-', '×', '÷'];
  resetearTras = false;

  if (actual === '0') {
    alert('El formato usado no es válido!');
    return;
  }

  const ultimoChar = actual.slice(-1);
  if (operadores.includes(ultimoChar)) {
    mostrarEnVisor(actual.slice(0, -1) + simbolo);
    return;
  }
  mostrarEnVisor(actual + simbolo);
}

function manejarClear() {
  resetearTras = false;
  actualizarExpresion('');
  mostrarEnVisor('0');
}

function manejarBorrar() {
  resetearTras = false;
  const actual = visor.value;
  if (actual.length <= 1) { mostrarEnVisor('0'); return; }
  mostrarEnVisor(actual.slice(0, -1));
}

function manejarPorcentaje() {
  const actual = visor.value;
  const num = parseFloat(actual);
  if (isNaN(num)) return;
  actualizarExpresion(actual + ' %');
  mostrarEnVisor(String(num / 100));
}

function manejarIgual() {
  const actual = visor.value;
  if (actual === '0' || actual === '') return;

  actualizarExpresion(actual + ' =');

  try {
    const exprJS = prepararExpresion(actual);

    if (/\/\s*0(?![.\d])/.test(exprJS)) {
      throw new Error('División por cero');
    }

    const resultado = eval(exprJS);
    if (!isFinite(resultado)) throw new Error('División por cero');

    const fmt = parseFloat(resultado.toFixed(10)).toString();
    mostrarEnVisor(fmt, 'resultado-ok');
    resetearTras = true;

    setTimeout(() => {
      if (resetearTras) { resetearTras = false; actualizarExpresion(''); mostrarEnVisor('0'); }
    }, 4000);

  } catch (error) {
    mostrarEnVisor('Error', 'error');
    actualizarExpresion('');
    resetearTras = true;
    setTimeout(() => {
      if (resetearTras) { resetearTras = false; mostrarEnVisor('0'); }
    }, 2000);
  }
}

document.getElementById('btn-0').addEventListener('click', () => manejarNumero('0'));
document.getElementById('btn-1').addEventListener('click', () => manejarNumero('1'));
document.getElementById('btn-2').addEventListener('click', () => manejarNumero('2'));
document.getElementById('btn-3').addEventListener('click', () => manejarNumero('3'));
document.getElementById('btn-4').addEventListener('click', () => manejarNumero('4'));
document.getElementById('btn-5').addEventListener('click', () => manejarNumero('5'));
document.getElementById('btn-6').addEventListener('click', () => manejarNumero('6'));
document.getElementById('btn-7').addEventListener('click', () => manejarNumero('7'));
document.getElementById('btn-8').addEventListener('click', () => manejarNumero('8'));
document.getElementById('btn-9').addEventListener('click', () => manejarNumero('9'));
document.getElementById('btn-dot').addEventListener('click', () => manejarNumero('.'));

document.getElementById('btn-add').addEventListener('click', () => manejarOperador('+'));
document.getElementById('btn-sub').addEventListener('click', () => manejarOperador('-'));
document.getElementById('btn-mul').addEventListener('click', () => manejarOperador('×'));
document.getElementById('btn-div').addEventListener('click', () => manejarOperador('÷'));

document.getElementById('btn-c').addEventListener('click',    manejarClear);
document.getElementById('btn-back').addEventListener('click', manejarBorrar);
document.getElementById('btn-pct').addEventListener('click',  manejarPorcentaje);
document.getElementById('btn-eq').addEventListener('click',   manejarIgual);