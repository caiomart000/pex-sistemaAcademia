const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyaR8lkNIW3h4ygl5Vh29tRD4t9Ut6iNM7y_DdbuzfHLfBiedPitd10OwnsDgmWtjnBng/exec";

function tab(t) {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active-card'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active-btn'));
  document.getElementById('sec-'+t).classList.add('active-card');
  document.getElementById('b'+(t=='corrida'?'1':'2')).classList.add('active-btn');
}

async function callServer(payload) {
  const response = await fetch(WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return await response.json();
}

async function inscrever() {
  const btn = document.getElementById('btn-inscrever');
  btn.disabled = true; btn.innerText = "Enviando...";

  const data = {
    mode: 'corrida',
    nome: document.getElementById('c-nome').value,
    email: document.getElementById('c-email').value,
    telefone: document.getElementById('c-tel').value,
    idade: document.getElementById('c-idade').value
  };

  const res = await callServer(data);
  if(res.ok) {
    draw(res.bib);
    alert("Inscrição confirmada!");
  }
  btn.disabled = false; btn.innerText = "Finalizar Inscrição";
}

function draw(n) {
  const area = document.getElementById('bibArea');
  area.innerHTML = '<canvas id="cv"></canvas>';
  const ctx = document.getElementById('cv').getContext('2d');
  ctx.canvas.width = 400; ctx.canvas.height = 200;
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,400,200);
  ctx.strokeStyle = '#28a745'; ctx.lineWidth = 10; ctx.strokeRect(5,5,390,190);
  ctx.fillStyle = '#000'; ctx.textAlign = 'center';
  ctx.font = 'bold 20px Arial'; ctx.fillText('ACADEMIA SUPER BOA FORMA', 200, 40);
  ctx.font = 'bold 100px Arial'; ctx.fillText(n, 200, 140);
}

async function getSlots() {
  const data = { mode: 'listSlots', date: document.getElementById('a-data').value };
  const res = await callServer(data);
  const select = document.getElementById('a-slots');
  if(res.ok) {
    select.innerHTML = res.slots.map(s => `<option value="${s}">${s}</option>`).join('');
  }
}

async function agendar() {
  const btn = document.getElementById('btn-agendar');
  btn.disabled = true;
  const data = {
    mode: 'createBooking',
    date: document.getElementById('a-data').value,
    time: document.getElementById('a-slots').value,
    nome: document.getElementById('a-nome').value,
    cpf: document.getElementById('a-cpf').value
  };
  const res = await callServer(data);
  alert(res.message);
  btn.disabled = false;
}
