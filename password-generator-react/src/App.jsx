import { useMemo, useState } from "react";

const MAYUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MINUSCULAS = "abcdefghijklmnopqrstuvwxyz";
const NUMEROS = "0123456789";
const SIMBOLOS = "!@#$%^&*";

const opcionesIniciales = {
  mayusculas: true,
  minusculas: true,
  numeros: true,
  simbolos: false,
};

function generarPassword(longitud, opciones) {
  let permitidos = "";

  if (opciones.mayusculas) permitidos += MAYUSCULAS;
  if (opciones.minusculas) permitidos += MINUSCULAS;
  if (opciones.numeros) permitidos += NUMEROS;
  if (opciones.simbolos) permitidos += SIMBOLOS;

  if (permitidos.length === 0 || longitud === 0) {
    return "";
  }

  let resultado = "";

  for (let i = 0; i < longitud; i += 1) {
    const indice = Math.floor(Math.random() * permitidos.length);
    resultado += permitidos[indice];
  }

  return resultado;
}

function calcularFortaleza(longitud, opciones) {
  let puntos = 0;

  Object.values(opciones).forEach((activo) => {
    if (activo) puntos += 1;
  });

  if (longitud >= 12) puntos += 1;

  if (puntos <= 1) return { texto: "Muy débil", nivel: 1 };
  if (puntos === 2) return { texto: "Débil", nivel: 2 };
  if (puntos === 3) return { texto: "Media", nivel: 3 };

  return { texto: "Fuerte", nivel: 4 };
}

function PasswordViewer({ password, copiado, onCopiar }) {
  return (
    <section className="visor" aria-label="Contraseña generada">
      <input
        type="text"
        value={password}
        readOnly
        placeholder="P4$5W0rD!"
        aria-label="Contraseña generada"
      />
      <button className="boton-copiar" type="button" onClick={onCopiar}>
        Copiar
      </button>
      {copiado && <span className="copiado">¡Copiado!</span>}
    </section>
  );
}

function LengthControl({ longitud, onChange }) {
  return (
    <section className="control-longitud">
      <div className="fila">
        <label htmlFor="longitud">Longitud</label>
        <strong>{longitud}</strong>
      </div>
      <input
        id="longitud"
        type="range"
        min="0"
        max="20"
        value={longitud}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </section>
  );
}

function OptionsList({ opciones, onChange }) {
  const items = [
    ["mayusculas", "Incluir mayúsculas"],
    ["minusculas", "Incluir minúsculas"],
    ["numeros", "Incluir números"],
    ["simbolos", "Incluir símbolos"],
  ];

  return (
    <section className="opciones" aria-label="Opciones de caracteres">
      {items.map(([clave, texto]) => (
        <label className="opcion" key={clave}>
          <input
            type="checkbox"
            checked={opciones[clave]}
            onChange={(event) => onChange(clave, event.target.checked)}
          />
          <span>{texto}</span>
        </label>
      ))}
    </section>
  );
}

function StrengthMeter({ fortaleza }) {
  return (
    <section className="fortaleza" aria-label="Fortaleza de la contraseña">
      <div className="fila">
        <span>FORTALEZA</span>
        <strong>{fortaleza.texto}</strong>
      </div>
      <div className="barra-fortaleza">
        {[1, 2, 3, 4].map((nivel) => (
          <span
            className={nivel <= fortaleza.nivel ? `activo nivel-${fortaleza.nivel}` : ""}
            key={nivel}
          />
        ))}
      </div>
    </section>
  );
}

function PasswordHistory({ historial }) {
  if (historial.length === 0) {
    return null;
  }

  return (
    <section className="historial">
      <h2>Últimas generadas</h2>
      <ul>
        {historial.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function App() {
  const [password, setPassword] = useState("");
  const [longitud, setLongitud] = useState(10);
  const [opciones, setOpciones] = useState(opcionesIniciales);
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [historial, setHistorial] = useState([]);

  const fortaleza = useMemo(
    () => calcularFortaleza(longitud, opciones),
    [longitud, opciones]
  );

  function cambiarOpcion(clave, valor) {
    setOpciones((actuales) => ({
      ...actuales,
      [clave]: valor,
    }));
  }

  function manejarGenerar() {
    const hayOpcionActiva = Object.values(opciones).some(Boolean);

    if (!hayOpcionActiva) {
      setError("Marcá al menos una opción para generar la contraseña.");
      setPassword("");
      return;
    }

    if (longitud === 0) {
      setError("Elegí una longitud mayor a 0.");
      setPassword("");
      return;
    }

    const nuevaPassword = generarPassword(longitud, opciones);

    setError("");
    setPassword(nuevaPassword);
    setHistorial((actual) => [nuevaPassword, ...actual].slice(0, 5));
  }

  function copiarPassword() {
    if (!password) {
      return;
    }

    navigator.clipboard.writeText(password);
    setCopiado(true);

    setTimeout(() => {
      setCopiado(false);
    }, 2000);
  }

  return (
    <main>
      <div className="app">
        <header>
          <p className="etiqueta">React + useState</p>
          <h1>Generador de contraseñas</h1>
        </header>

        <section className="tarjeta">
          <PasswordViewer
            password={password}
            copiado={copiado}
            onCopiar={copiarPassword}
          />

          <form onSubmit={(event) => event.preventDefault()}>
            <LengthControl longitud={longitud} onChange={setLongitud} />
            <OptionsList opciones={opciones} onChange={cambiarOpcion} />
            <StrengthMeter fortaleza={fortaleza} />

            {error && <p className="error">{error}</p>}

            <button className="boton-generar" type="button" onClick={manejarGenerar}>
              GENERAR →
            </button>
          </form>

          <PasswordHistory historial={historial} />
        </section>
      </div>
    </main>
  );
}

export default App;
