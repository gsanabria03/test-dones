async function loadQuestions() {
  const res = await fetch("questions.json");
  return await res.json();
}

function createQuestionHTML(q) {
  return `
    <div class="question">
      <p><strong>${q.id}.</strong> ${q.text}</p>
      <label><input type="radio" name="q${q.id}" value="0" required> 0</label>
      <label><input type="radio" name="q${q.id}" value="1"> 1</label>
      <label><input type="radio" name="q${q.id}" value="2"> 2</label>
    </div>
  `;
}

function calculateScores(data, formData) {
  const scores = {};
  for (const group of data.groups) scores[group.id] = 0;

  for (const q of data.questions) {
    const val = parseInt(formData.get(`q${q.id}`)) || 0;
    scores[q.group] += val;
  }

  return Object.entries(scores)
    .map(([id, total]) => {
      const group = data.groups.find(g => g.id === id);
      return { name: group.name, total };
    })
    .sort((a, b) => b.total - a.total);
}

function showResults(results) {
  const container = document.getElementById("results");
  container.innerHTML = "<h2>Resultados</h2>";
  results.forEach(r => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${r.name}:</strong> ${r.total}`;
    container.appendChild(div);
  });
}

async function init() {
  const data = await loadQuestions();
  const form = document.getElementById("test-form");
  form.innerHTML = data.questions.map(createQuestionHTML).join("");

  document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const results = calculateScores(data, formData);
    showResults(results);
  });
}

init();
