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