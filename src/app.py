from flask import Flask, request, jsonify
from flask import render_template
import pandas as pd
import numpy as np
from scapy.all import rdpcap
from datetime import datetime
import os
import csv

app = Flask(__name__)

@app.route("/")
@app.route('/<name>')
def hello_world(name=None):
    return render_template('hello.html', person=name)

# Cette route permet de faire des calculs d'exploration de données
@app.route("/statistiques")
def stats():
    df = pd.read_csv("data/wireshark_data.csv")
    # calcul sur le csv

    # Convertir Time en float
    df["Time"] = df["Time"].astype(float)

    # Créer une colonne "date" = seconde entière
    df["date"] = np.floor(df["Time"]).astype(int)

    # Grouper par seconde et compter
    result = (
        df.groupby("date")
        .size()
        .reset_index(name="value")
    )

    data = result.to_dict(orient="records")

    return render_template('data.html', rows=data)

# Utilise directement un fichier pcap
@app.route("/old_dashboard")
def old_dashboard():
    # analyse du csv
    """
    df = pd.read_csv("data/randomBrutData.csv")
    df = []
    packets = rdpcap("data/test.pcapng")
    print(packets[0].haslayer)

    for pkt in packets: 
        #udata = pkt.hashlayer
        #df.append()
        if pkt.haslayer("TCP"):
            protocol = ("TCP")
        elif pkt.haslayer("UDP"):
            protocol = ("UDP")
        elif pkt.haslayer("ICMP"):
            protocol = ("ICMP")
        else:
            protocol = ("UNKNOWN")

        row = {
            "date":pkt.time, # convertir en date
            "protocol":protocol,
            "number":1
        }
        df.append(row)

    df = pd.DataFrame(df)
    """

    df = []
    print("début")
    packets = rdpcap("data/realistic_traffic_2026.pcap")
    print(packets[0])

    for pkt in packets: 
        #udata = pkt.hashlayer
        #df.append()
        if pkt.haslayer("TCP"):
            protocol = ("TCP")
        elif pkt.haslayer("UDP"):
            protocol = ("UDP")
        elif pkt.haslayer("ICMP"):
            protocol = ("ICMP")

        row = {
            "date":datetime.fromtimestamp(float(pkt.time)).date(),
            #"date": pd.to_datetime(pkt.time.astype(float), unit="s").dt.date,
            "protocol":protocol,
        }
        df.append(row)
    print("fin")
    df = pd.DataFrame(df)
    result=df
    result = (
        df.groupby(["date", "protocol"])
        .size()
        .reset_index(name="number")
    )
    data = result.to_dict(orient="records")

    # ouvrir un pcap
    # convertir en csv : date, protocole, number
    # 
    # une colonne totale déjà calculée


    # formatage
    """
    # Convertir Time en float
    df["Time"] = df["Time"].astype(float)

    # Créer une colonne "date" = seconde entière
    df["date"] = np.floor(df["Time"]).astype(int)

    print(df.info())

    # Grouper par seconde et compter

    result = (
        df.groupby(["date", "Protocol"])
        .size()
        .reset_index(name="value")
    )
    print(result)
    data = result.to_dict(orient="records")
    """
    
    tip = pd.read_csv("data/tip_events.csv")
    tip = tip.to_dict(orient="records")


    return render_template('dataImproved.html', rows=data, tips=tip)

# Si le fichier est au bon format ouvre directement un fichier csv
@app.route("/fast/<csv_name>")
def fast(csv_name):
    df = pd.read_csv("data/"+csv_name+".csv")
    # verifier le format des données 
    data = df.to_dict(orient="records")

    tip = pd.read_csv("data/tip_events.csv")
    tip = tip.to_dict(orient="records")
    return render_template('dataImproved.html', rows=data, tips=tip)


# Utilise directement un fichier pcap
@app.route("/dashboard")
def dashboard():
    # Lecture du csv de données qui sont triés par dates
    df = pd.read_csv("data/random_brut_data.csv")
    data = df.to_dict(orient="records")

    alert = list(df["alert"].unique())
    # Lecture des tip
    # Création d'un tableau ponctuel et d'un longue durée
    tip = pd.read_csv("data/tip_events.csv")
    mask = tip["start"] == tip["end"]
    df_identiques = tip[mask]
    df_differents = tip[~mask]
    tipU = df_identiques.to_dict(orient="records")
    tipL = df_differents.to_dict(orient="records")

    tipType = list(tip["type"].unique())

    return render_template('dataImproved.html',alerts=alert,tipsType=tipType, rows=data, tipsU=tipU, tipsL=tipL)

@app.route("/new_event", methods=["POST"])
def new_event():
    data = request.get_json()
    text = data.get("text")
    choice = data.get("choice")
    date = data.get("date")

    if text is None or choice is None or date is None:
        return jsonify({"status": "error", "message": "Missing data"}), 400
    
    text_existe = False
    lignes = []

    with open("data/tip_events.csv", mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) > 2 and row[2] == text:
                text_existe = True
                if (row[0] == row[1]):
                    if date > row[0]:
                        date1 = row[0]
                        date2 = date
                    else: 
                        date2 = row[0]
                        date1 = date 
                    for_remplacement = [date1, date2, text, choice, "false"]
                    lignes.append(for_remplacement)
            else:
                lignes.append(row)
        if not text_existe:
            for_remplacement = [date, date, text, choice, "false"]
            lignes.append(for_remplacement) 

    # Réécriture du fichier
    with open("data/tip_events.csv", mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, lineterminator='\n')
        writer.writerows(lignes)

    return jsonify({"status": "success"})

@app.route("/suppr_perso", methods=["POST"])
def suppr_perso():
    df = pd.read_csv("data/tip_events.csv")
    print(df)
    df = df[df["isDefault"]]
    df.to_csv("data/tip_events.csv", index=False)
    return jsonify({"status": "success"})
