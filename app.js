const diasSemana = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado"
];

function calcularHoras(e, s) {

  let [h1,m1] = e.split(":").map(Number);
  let [h2,m2] = s.split(":").map(Number);

  return (h2 + m2/60) - (h1 + m1/60);
}

function obtenerDia(fecha) {

  const d = new Date(fecha);

  return diasSemana[d.getDay()];
}

async function cargar() {

  const res = await fetch("/api/horas");

  const datos = await res.json();

  const tabla = document.getElementById("tabla");

  tabla.innerHTML = "";

  let totalSemana = 0;

  datos.forEach(d => {

    totalSemana += d.total;

    tabla.innerHTML += `
      <tr>
        <td>${obtenerDia(d.fecha)}</td>
        <td>${d.fecha}</td>
        <td>${d.horas.toFixed(2)}h</td>
        <td>${d.total.toFixed(2)}€</td>
      </tr>
    `;

  });

  document.getElementById("resumen").innerText =
    `💰 Total semanal: ${totalSemana.toFixed(2)}€`;

}

async function guardar() {

  let fecha = document.getElementById("fecha").value;

  let entrada = document.getElementById("entrada").value;

  let salida = document.getElementById("salida").value;

  let precio = parseFloat(document.getElementById("precio").value);

  if(!fecha || !entrada || !salida || !precio) {
    alert("Rellena todos los campos");
    return;
  }

  let horas = calcularHoras(entrada, salida);

  let total = horas * precio;

  await fetch("/api/horas", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      fecha,
      entrada,
      salida,
      horas,
      total
    })

  });

  cargar();
}

cargar();