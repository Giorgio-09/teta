const bottoni_modalita = document.querySelectorAll('.button_modalita');
const modals = document.querySelectorAll('.modalita_selezionata');

function mostraModalita(index) {
  // Nascondi tutte
  modals.forEach(m => m.style.display = 'none');
  // Mostra solo la selezionata con display flex (come definito in CSS per .modalita_selezionata)
  modals[index].style.display = 'flex';
}
mostraModalita(0); // Mostra la prima modalità all'avvio

bottoni_modalita.forEach((btn, i) => {
  btn.addEventListener('click', () => mostraModalita(i));
});

// Funzioni helper per estrarre giorno e mese da input date (yyyy-mm-dd)
function estraiGiornoMese(dataStr) {
  if (!dataStr) return null;
  const [anno, mese, giorno] = dataStr.split('-').map(Number);
  return { giorno, mese };
}

// Azioni su click dei bottoni azione
document.getElementById('button_1').addEventListener('click', () => {
  const messaggio = document.getElementById('input_1').value;
  fetch('http://127.0.0.1:5000/cifra', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaggio })
  })
  .then(res => res.json())
  .then(data => document.getElementById('output_1').value = data.risultato || "Errore")
  .catch(() => document.getElementById('output_1').value = "Errore di connessione");
});

document.getElementById('button_2').addEventListener('click', () => {
  const messaggio = document.getElementById('input_2').value;
  const dataStr = document.getElementById('input_data_1').value;
  const data = estraiGiornoMese(dataStr);

  if (!data) {
    document.getElementById('output_2').value = "Inserisci una data valida";
    return;
  }

  fetch('http://127.0.0.1:5000/cifra', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaggio, giorno: data.giorno, mese: data.mese })
  })
  .then(res => res.json())
  .then(data => document.getElementById('output_2').value = data.risultato || "Errore")
  .catch(() => document.getElementById('output_2').value = "Errore di connessione");
});

document.getElementById('button_3').addEventListener('click', () => {
  const messaggio = document.getElementById('input_3').value;
  const dataStr = document.getElementById('input_data_2').value;
  const data = estraiGiornoMese(dataStr);

  if (!data) {
    document.getElementById('output_3').value = "Inserisci una data valida";
    return;
  }

  fetch('http://127.0.0.1:5000/decifra', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaggio, giorno: data.giorno, mese: data.mese })
  })
  .then(res => res.json())
  .then(data => document.getElementById('output_3').value = data.risultato || "Errore")
  .catch(() => document.getElementById('output_3').value = "Errore di connessione");
});

document.getElementById('button_4').addEventListener('click', () => {
  const messaggio = document.getElementById('input_4').value;
  const dataScritturaStr = document.getElementById('input_data_3').value;
  const giorno2 = prompt("Inserisci giorno di lettura:");
  const mese2 = prompt("Inserisci mese di lettura:");

  if (!dataScritturaStr || !giorno2 || !mese2) {
    document.getElementById('output_4').value = "Inserisci tutte le date richieste";
    return;
  }

  const dataScrittura = estraiGiornoMese(dataScritturaStr);

  fetch('http://127.0.0.1:5000/traduci', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaggio,
      giorno1: dataScrittura.giorno,
      mese1: dataScrittura.mese,
      giorno2: parseInt(giorno2),
      mese2: parseInt(mese2)
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) document.getElementById('output_4').value = data.error;
    else document.getElementById('output_4').value = data.risultato || "Errore";
  })
  .catch(() => document.getElementById('output_4').value = "Errore di connessione");
});
