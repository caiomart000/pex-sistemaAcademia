const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxt9sA6nr7TtpsLtb-UQC6lx1phTmmN5K8NmEiNGDa-4A7M_6PtIKFekVtHt9hilEmAFA/exec"; // Lembre-se de manter o seu link aqui

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

// LÓGICA DE INSCRIÇÃO (CORRIDA)
async function inscrever() {
  const btn = document.getElementById('btn-inscrever');
  btn.disabled = true; 
  btn.innerText = "Enviando...";

  const data = {
    mode: 'corrida',
    nome: document.getElementById('c-nome').value,
    email: document.getElementById('c-email').value,
    telefone: document.getElementById('c-tel').value,
    idade: document.getElementById('c-idade').value
  };

  try {
    const res = await callServer(data);
    if(res.ok) {
      draw(res.bib); // Desenha o número de peito
      alert("Inscrição confirmada!");
      
      // LIMPA OS CAMPOS DO FORMULÁRIO DE CORRIDA
      document.getElementById('c-nome').value = "";
      document.getElementById('c-email').value = "";
      document.getElementById('c-tel').value = "";
      document.getElementById('c-idade').value = "";
    }
  } catch (error) {
    alert("Erro ao enviar: " + error);
  } finally {
    btn.disabled = false; 
    btn.innerText = "Finalizar Inscrição";
  }
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

// LÓGICA DE AGENDAMENTO (PERSONAL)
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

  try {
    const res = await callServer(data);
    if(res.ok) {
      alert(res.message);
      
      // LIMPA OS CAMPOS DO FORMULÁRIO DE AGENDAMENTO
      document.getElementById('a-data').value = "";
      document.getElementById('a-slots').innerHTML = "<option>Selecione a data...</option>";
      document.getElementById('a-nome').value = "";
      document.getElementById('a-cpf').value = "";
    }
  } catch (error) {
    alert("Erro ao agendar: " + error);
  } finally {
    btn.disabled = false;
  }
}
