// ===== PARTE A: array de valores simples =====
console.log("--- PARTE A ---");

let categorias = ["aventura", "acción", "rol", "deportes"];

console.log("Categorías:", categorias);
console.log("Cantidad de categorías:", categorias.length);

console.log("Primera categoría:", categorias[0]);
console.log("Última categoría:", categorias[categorias.length - 1]);

categorias.push("estrategia");
console.log("Cantidad de categorías:", categorias.length);

let categoriaEliminada = categorias.pop();
console.log("Categoría eliminada:", categoriaEliminada);


// ===== PARTE B: objeto =====
console.log("--- PARTE B ---");

let usuario = {
  nombre: "Ezequiel",
  edad: 22,
  ciudad: "Garupá",
  temaFavorito: "videojuegos"
};

console.log(
  "Nombre: " + usuario.nombre +
  " — Edad: " + usuario.edad +
  " — Ciudad: " + usuario.ciudad
);

console.log("Tema favorito:", usuario.temaFavorito);

usuario.edad = 23;
console.log("Edad actualizada:", usuario.edad);

usuario.profesion = "estudiante";
console.log("Usuario completo:", usuario);


// ===== PARTE C: array de objetos =====
console.log("--- PARTE C ---");

let catalogo = [
  {
    titulo: "The Legend of Zelda",
    categoria: "aventura",
    puntaje: 10,
    visto: true
  },
  {
    titulo: "FIFA 24",
    categoria: "deportes",
    puntaje: 8,
    visto: true
  },
  {
    titulo: "Elden Ring",
    categoria: "rol",
    puntaje: 9,
    visto: false
  },
  {
    titulo: "Counter-Strike 2",
    categoria: "acción",
    puntaje: 8,
    visto: true
  }
];

console.log("Primer título:", catalogo[0].titulo);
console.log("Puntaje del tercer elemento:", catalogo[2].puntaje);

let estadoSegundo = catalogo[1].visto ? "visto" : "pendiente";

console.log(
  catalogo[1].titulo + " — " +
  catalogo[1].categoria + " — " +
  catalogo[1].puntaje + "/10 — " +
  estadoSegundo
);

catalogo[2].puntaje = 10;
console.log("Puntaje actualizado:", catalogo[2].puntaje);

catalogo.push({
  titulo: "Minecraft",
  categoria: "supervivencia",
  puntaje: 9,
  visto: true
});

console.log("Cantidad de elementos del catálogo:", catalogo.length);


// ===== PARTE D: destructuring =====
console.log("--- PARTE D ---");

let { titulo, categoria, puntaje, visto } = catalogo[0];
let estadoPrimero = visto ? "visto" : "pendiente";

console.log(
  titulo + " — " +
  categoria + " — " +
  puntaje + "/10 — " +
  estadoPrimero
);

let { nombre, ciudad } = usuario;
console.log("Nombre:", nombre, "— Ciudad:", ciudad);

let [primero, segundo] = catalogo;
console.log("Primero:", primero.titulo);
console.log("Segundo:", segundo.titulo);


// ===== PARTE E: complementaria =====
console.log("--- PARTE E ---");

let { titulo: tituloDestacado } = catalogo[2];
console.log("Título destacado:", tituloDestacado);

let { pais = "Argentina" } = usuario;
console.log("País:", pais);

let a = 10;
let b = 20;

[a, b] = [b, a];

console.log("Valores intercambiados: b = " + b + ", a = " + a);
