import pandas as pd
import numpy as np
from scapy.all import rdpcap
from datetime import datetime
import argparse

parser = argparse.ArgumentParser(description="Convertit un pcap / pcapng en csv avec le format des données qui nous intéresse")

parser.add_argument(
    "--input",
    type=str,
    help="Fichier d'entrée"
)

parser.add_argument(
    "--output",
    type=str,
    default="data/converted_data.csv",   # valeur par défaut
    help="Fichier de sortie (défaut: data/converted_data.csv)"
)

args = parser.parse_args()

df = []
packets = rdpcap("data/"+args.input)
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
        "protocol":protocol,
    }
    df.append(row)

df = pd.DataFrame(df)
result=df
result = (
    df.groupby(["date", "protocol"])
    .size()
    .reset_index(name="number")
)

# ajouter column total
total = 0
date = result.iloc[0]["date"]
for i in result.itertuples(index=False):
    if date == i.date:
        total += i.number
    else:
        row = {
            "date":date, 
            "protocol":"total",
            "number":total
        }
        total = 0
        result = pd.concat([result, pd.DataFrame([row])], ignore_index=True)
        total += i.number

    date = i.date

data = result.to_dict(orient="records")
print(len(data))

result.to_csv("data/"+args.output, index=False)

print("saved")



