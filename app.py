from flask import Flask, request, jsonify
from datetime import datetime
import string
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

alfabeto_completo = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

def ordine_lettere(giorno, mese):
    alfabeto_modificato = [None] * 26
    inizio = giorno % mese if mese != 0 else 1
    if inizio == 0:
        inizio = abs(26 - giorno)
        if inizio == 0:
            inizio = 20
    for lettera in alfabeto_completo:
        alfabeto_modificato[inizio] = lettera
        inizio += 1
        if inizio == 26:
            inizio = 0
    return dict(zip(alfabeto_completo, alfabeto_modificato))

def cifratura(alfabeto_modificato, messaggio):
    messaggio_criptato = ""
    for c in messaggio.upper():
        messaggio_criptato += alfabeto_modificato.get(c, c)
    return messaggio_criptato

def decifratura(alfabeto_modificato, messaggio_cifrato):
    dizionario_inverso = {v: k for k, v in alfabeto_modificato.items()}
    messaggio = ""
    for c in messaggio_cifrato.upper():
        messaggio += dizionario_inverso.get(c, c)
    return messaggio

def traduzione(messaggio_cifrato, giorno1, mese1, giorno2, mese2):
    alfabeto_1 = ordine_lettere(giorno1, mese1)
    decifrato = decifratura(alfabeto_1, messaggio_cifrato)
    alfabeto_2 = ordine_lettere(giorno2, mese2)
    ricifrato = cifratura(alfabeto_2, decifrato)
    return ricifrato

@app.route('/cifra', methods=['POST'])
def api_cifra():
    data = request.get_json()
    messaggio = data.get('messaggio')
    giorno = data.get('giorno')
    mese = data.get('mese')

    if messaggio is None:
        return jsonify(error="Messaggio mancante"), 400

    if not (giorno and mese):
        oggi = datetime.today()
        giorno = oggi.day
        mese = oggi.month

    try:
        giorno = int(giorno)
        mese = int(mese)
    except Exception:
        return jsonify(error="Giorno e mese devono essere numeri interi"), 400

    alfabeto_modificato = ordine_lettere(giorno, mese)
    risultato = cifratura(alfabeto_modificato, messaggio)
    return jsonify(risultato=risultato)

@app.route('/decifra', methods=['POST'])
def api_decifra():
    data = request.get_json()
    messaggio = data.get('messaggio')
    giorno = data.get('giorno')
    mese = data.get('mese')

    if messaggio is None or giorno is None or mese is None:
        return jsonify(error="Messaggio, giorno e mese sono obbligatori"), 400

    try:
        giorno = int(giorno)
        mese = int(mese)
    except Exception:
        return jsonify(error="Giorno e mese devono essere numeri interi"), 400

    alfabeto_modificato = ordine_lettere(giorno, mese)
    risultato = decifratura(alfabeto_modificato, messaggio)
    return jsonify(risultato=risultato)

@app.route('/traduci', methods=['POST'])
def api_traduci():
    data = request.get_json()
    messaggio = data.get('messaggio')
    giorno1 = data.get('giorno1')
    mese1 = data.get('mese1')
    giorno2 = data.get('giorno2')
    mese2 = data.get('mese2')

    if None in (messaggio, giorno1, mese1, giorno2, mese2):
        return jsonify(error="Messaggio, giorno1, mese1, giorno2 e mese2 sono obbligatori"), 400

    try:
        giorno1 = int(giorno1)
        mese1 = int(mese1)
        giorno2 = int(giorno2)
        mese2 = int(mese2)
    except Exception:
        return jsonify(error="Giorni e mesi devono essere numeri interi"), 400

    risultato = traduzione(messaggio, giorno1, mese1, giorno2, mese2)
    return jsonify(risultato=risultato)

if __name__ == '__main__':
    app.run(debug=True)
