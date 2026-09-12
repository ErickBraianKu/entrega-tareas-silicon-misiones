"use client";

import { useEffect, useMemo, useState } from "react";

const CONFIGURACIONES = {
  4: { columnas: 4, pares: 8 },
  6: { columnas: 6, pares: 18 },
};

function crearTablero(tamano = 4) {
  const { pares } = CONFIGURACIONES[tamano];
  const valores = Array.from({ length: pares }, (_, index) => index + 1);

  return [...valores, ...valores]
    .sort(() => Math.random() - 0.5)
    .map((valor, index) => ({
      id: `${valor}-${index}-${crypto.randomUUID()}`,
      valor,
      dadaVuelta: false,
      encontrada: false,
    }));
}

function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const resto = String(segundos % 60).padStart(2, "0");
  return `${minutos}:${resto}`;
}

function Ficha({ ficha, bloqueada, onSeleccionar }) {
  const visible = ficha.dadaVuelta || ficha.encontrada;

  return (
    <button
      className={`ficha ${visible ? "visible" : ""} ${
        ficha.encontrada ? "encontrada" : ""
      }`}
      onClick={() => onSeleccionar(ficha.id)}
      disabled={bloqueada || ficha.dadaVuelta || ficha.encontrada}
      aria-label={visible ? `Ficha ${ficha.valor}` : "Ficha oculta"}
    >
      <span>{visible ? ficha.valor : "?"}</span>
    </button>
  );
}

function Marcador({ etiqueta, valor }) {
  return (
    <article className="marcador">
      <span>{etiqueta}</span>
      <strong>{valor}</strong>
    </article>
  );
}

function PantallaFinal({ tiempo, movimientos, onReiniciar }) {
  return (
    <section className="victoria" aria-live="polite">
      <div>
        <p>Partida completa</p>
        <h2>¡Lo lograste!</h2>
        <span>
          Tiempo {formatearTiempo(tiempo)} · {movimientos} movimientos
        </span>
      </div>
      <button className="boton principal" onClick={onReiniciar}>
        Jugar de nuevo
      </button>
    </section>
  );
}

export default function Home() {
  const [tamano, setTamano] = useState(4);
  const [tablero, setTablero] = useState(() => crearTablero(4));
  const [movimientos, setMovimientos] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [jugando, setJugando] = useState(false);
  const [evaluando, setEvaluando] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const dadasVuelta = useMemo(
    () => tablero.filter((ficha) => ficha.dadaVuelta && !ficha.encontrada),
    [tablero]
  );

  function reiniciar(nuevoTamano = tamano) {
    setTamano(nuevoTamano);
    setTablero(crearTablero(nuevoTamano));
    setMovimientos(0);
    setTiempo(0);
    setJugando(false);
    setEvaluando(false);
    setFinalizado(false);
  }

  function seleccionarFicha(id) {
    if (evaluando || finalizado) return;

    setJugando(true);
    setTablero((actual) =>
      actual.map((ficha) =>
        ficha.id === id ? { ...ficha, dadaVuelta: true } : ficha
      )
    );
  }

  useEffect(() => {
    if (!jugando || finalizado) return;

    const intervalo = setInterval(() => {
      setTiempo((actual) => actual + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [jugando, finalizado]);

  useEffect(() => {
    if (dadasVuelta.length !== 2) return;

    setEvaluando(true);
    setMovimientos((actual) => actual + 1);

    const [primera, segunda] = dadasVuelta;

    if (primera.valor === segunda.valor) {
      setTablero((actual) =>
        actual.map((ficha) =>
          ficha.id === primera.id || ficha.id === segunda.id
            ? { ...ficha, dadaVuelta: false, encontrada: true }
            : ficha
        )
      );
      setEvaluando(false);
      return;
    }

    const pausa = setTimeout(() => {
      setTablero((actual) =>
        actual.map((ficha) =>
          ficha.id === primera.id || ficha.id === segunda.id
            ? { ...ficha, dadaVuelta: false }
            : ficha
        )
      );
      setEvaluando(false);
    }, 900);

    return () => clearTimeout(pausa);
  }, [dadasVuelta]);

  useEffect(() => {
    if (tablero.length > 0 && tablero.every((ficha) => ficha.encontrada)) {
      setFinalizado(true);
      setJugando(false);
    }
  }, [tablero]);

  return (
    <main className="pantalla">
      <header className="encabezado">
        <div>
          <p>Silicon Misiones · M4</p>
          <h1>memory</h1>
        </div>
        <button className="boton" onClick={() => reiniciar()}>
          Nueva partida
        </button>
      </header>

      <section className="configuracion" aria-label="Configuracion del tablero">
        {[4, 6].map((opcion) => (
          <button
            key={opcion}
            className={tamano === opcion ? "activo" : ""}
            onClick={() => reiniciar(opcion)}
          >
            {opcion}x{opcion}
          </button>
        ))}
      </section>

      <section
        className="tablero"
        style={{ "--columnas": CONFIGURACIONES[tamano].columnas }}
        aria-label="Tablero de juego"
      >
        {tablero.map((ficha) => (
          <Ficha
            key={ficha.id}
            ficha={ficha}
            bloqueada={evaluando}
            onSeleccionar={seleccionarFicha}
          />
        ))}
      </section>

      {finalizado && (
        <PantallaFinal
          tiempo={tiempo}
          movimientos={movimientos}
          onReiniciar={() => reiniciar()}
        />
      )}

      <footer className="resumen">
        <Marcador etiqueta="Tiempo" valor={formatearTiempo(tiempo)} />
        <Marcador etiqueta="Movimientos" valor={movimientos} />
      </footer>
    </main>
  );
}
