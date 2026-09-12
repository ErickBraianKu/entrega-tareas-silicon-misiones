const LIMITE = 280;

const area = document.querySelector("#texto");
const caracteres = document.querySelector("#caracteres");
const palabras = document.querySelector("#palabras");
const sinEspacios = document.querySelector("#sinEspacios");
const restantes = document.querySelector("#restantes");
const limpiar = document.querySelector("#limpiar");
const aviso = document.querySelector("#aviso");
const progreso = document.querySelector("#progreso");
const tarjetaRestantes = document.querySelector(".tarjeta-restantes");

function contarPalabras(texto) {
  const t = texto.trim();

  if (t === "") {
    return 0;
  }

  return t.split(/\s+/).length;
}

function actualizar() {
  const texto = area.value;
  const cantidadCaracteres = texto.length;
  const cantidadPalabras = contarPalabras(texto);
  const cantidadSinEspacios = texto.replaceAll(" ", "").length;
  const cantidadRestante = LIMITE - cantidadCaracteres;
  const excedeLimite = cantidadCaracteres > LIMITE;
  const porcentaje = Math.min((cantidadCaracteres / LIMITE) * 100, 100);

  caracteres.textContent = cantidadCaracteres;
  palabras.textContent = cantidadPalabras;
  sinEspacios.textContent = cantidadSinEspacios;
  restantes.textContent = cantidadRestante;
  progreso.style.width = `${porcentaje}%`;

  area.classList.toggle("excedido", excedeLimite);
  restantes.classList.toggle("excedido", excedeLimite);
  aviso.classList.toggle("excedido", excedeLimite);
  progreso.classList.toggle("excedido", excedeLimite);
  tarjetaRestantes.classList.toggle("excedido", excedeLimite);

  aviso.textContent = excedeLimite
    ? `Te pasaste por ${Math.abs(cantidadRestante)} caracteres.`
    : `Límite sugerido: ${LIMITE} caracteres.`;
}

area.addEventListener("input", actualizar);

limpiar.addEventListener("click", () => {
  area.value = "";
  area.focus();
  actualizar();
});

actualizar();
