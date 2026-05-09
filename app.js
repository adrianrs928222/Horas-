function calcularHoras(e, s) {

  let [h1,m1] = e.split(":").map(Number);
  let [h2,m2] = s.split(":").map(Number);

  return (h2 + m2/60) - (h1 + m1/60);
}

async function cargar() {

  const res = await fetch("/api/horas");

  const datos = await res.json();

  const tabla = document.getElementById("tabla");

  tabla.innerHTML = "";

  datos.forEach(d => {

    tabla.innerHTML += `
      <tr>
        <td>${d.fecha}</td>
        <td>${d.horas.toFixed(2)}</td>
        <td>${d.total.toFixed(2)}€</td>
      </tr>
    `;

  });

}

async function guardar() {

  let fecha = document.getElementById("fecha").value;

  let entrada = document.getElementById("entrada").value;

  let salida = document.getElementById("salida").value;

  let precio = parseFloat(document.getElementById("precio").value);

  if(!fecha || !entrada || !salida || !precio) {
    alert("Rellena todo");
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

function verMes() {

  fetch("/api/horas")
    .then(res => res.json())
    .then(datos => {

      let mes = document.getElementById("mes").value;

      let filtrados = datos.filter(d => d.fecha.startsWith(mes));

      let total = 0;

      filtrados.forEach(d => {
        total += d.total;
      });

      document.getElementById("resumen").innerText =
        `💰 ${total.toFixed(2)}€ ganados en ${filtrados.length} días`;

    });

}

cargar();