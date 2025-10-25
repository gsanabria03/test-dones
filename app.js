async function loadPreguntas() {
  const res = await fetch("questions.json");
  return await res.json();
}

function crearHTMLPregunta(q) {
  return `
    <div class="question">
      <p><strong>${q.id}.</strong> ${q.texto}</p>
      <label><input type="radio" name="q${q.id}" value="0" required> 0</label>
      <label><input type="radio" name="q${q.id}" value="1"> 1</label>
      <label><input type="radio" name="q${q.id}" value="2"> 2</label>
    </div>
  `;
}

function calcularResultados(data, formData) {
  const resultados = {};
  for (const grupo of data.grupos) resultados[grupo.id] = 0;

  for (const p of data.preguntas) {
    const val = parseInt(formData.get(`q${p.id}`)) || 0;
    resultados[p.grupo] += val;
  }

  return Object.entries(resultados)
    .map(([id, total]) => {
      const grupo = data.grupos.find(g => g.id === id);
      return { nombre: grupo.id, descripcion: grupo.descripcion, total };
    })
    .sort((a, b) => b.total - a.total);
}

function mostrarResultados(resultados) {
  const contenedor = document.getElementById("results");
  contenedor.innerHTML = "<h2>Resultados</h2>";
  resultados.forEach(r => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${r.nombre}:</strong> ${r.total} <br><small>${r.descripcion}</small>`;
    contenedor.appendChild(div);
  });
}

async function iniciar() {
  const data = await loadPreguntas();
  const form = document.getElementById("test-form");
  form.innerHTML = data.preguntas.map(crearHTMLPregunta).join("");

  document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const resultados = calcularResultados(data, formData);
    mostrarResultados(resultados);
  });
}

iniciar();
