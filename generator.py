import csv
import random
from scapy.all import *
from datetime import datetime 
import time
import os
import argparse

parser = argparse.ArgumentParser(description="Générateur aléatoire de données pour analyse SOC")

parser.add_argument(
    "--method",
    required=True,                 # rend l'argument obligatoire
    choices=["csv-brut", "pcap-realistic"],#, "pcap-semi-random", "pcap-full-random"],       # valeurs autorisées
    help="Méthode à utiliser pour générer des données"
)

parser.add_argument(
    "--output",
    type=str,
    default="random_brut_data",   # valeur par défaut
    help="Fichier d'entrée (défaut: random_brut_data)"
)

args = parser.parse_args()

if args.method == "csv-brut":
    with open("src/data/"+args.output+".csv", "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["date", "alert", "number"])

        start_date = datetime(2025, 1, 1)

        for i in range(365):
            current_day = start_date + timedelta(days=i)
            total_of_alert = 0
            for alert in [("EDR",20,40), ("IDS",80,100)]:
                number_of_alert = random.randint(alert[1], alert[2])
                writer.writerow([current_day.strftime("%Y-%m-%d"),alert[0],number_of_alert])
                total_of_alert += number_of_alert
            writer.writerow([current_day.strftime("%Y-%m-%d"),"Total",total_of_alert])
            


elif args.method == "pcap-realistic":

    # Paramètres
    OUTPUT_FILE = "src/data/realistic_traffic_2026.pcap"
    START_DATE = datetime.datetime(2026, 1, 1, 0, 0, 0)
    END_DATE = datetime.datetime(2026, 12, 31, 23, 59, 59)

    current_time = START_DATE.timestamp()
    end_time = END_DATE.timestamp()

    packets = []

    def random_ip():
        return ".".join(str(random.randint(1, 254)) for _ in range(4))

    while current_time < end_time:

        traffic_type = random.choice(["TCP", "ICMP", "UDP"])

        if traffic_type == "TCP":
            src = random_ip()
            dst = random_ip()
            sport = random.randint(1024, 65535)
            dport = random.choice([80, 443, 22, 21])

            seq = random.randint(0, 100000)
            ack = 0

            # SYN
            syn = IP(src=src, dst=dst)/TCP(sport=sport, dport=dport, flags="S", seq=seq)
            syn.time = current_time
            packets.append(syn)

            current_time += random.uniform(0.01, 0.2)

            # SYN-ACK
            synack = IP(src=dst, dst=src)/TCP(sport=dport, dport=sport, flags="SA", seq=1000, ack=seq+1)
            synack.time = current_time
            packets.append(synack)

            current_time += random.uniform(0.01, 0.2)

            # ACK
            ack_pkt = IP(src=src, dst=dst)/TCP(sport=sport, dport=dport, flags="A", seq=seq+1, ack=1001)
            ack_pkt.time = current_time
            packets.append(ack_pkt)

            # Données applicatives
            for _ in range(random.randint(1, 5)):
                current_time += random.uniform(0.01, 1)
                payload = os.urandom(random.randint(20, 200))
                data_pkt = IP(src=src, dst=dst)/TCP(sport=sport, dport=dport, flags="PA", seq=seq+1, ack=1001)/Raw(load=payload)
                data_pkt.time = current_time
                packets.append(data_pkt)

            # Fermeture connexion
            current_time += random.uniform(0.01, 0.5)
            fin = IP(src=src, dst=dst)/TCP(sport=sport, dport=dport, flags="FA", seq=seq+2, ack=1001)
            fin.time = current_time
            packets.append(fin)

        elif traffic_type == "ICMP":  # ICMP
            src = random_ip()
            dst = random_ip()

            echo_req = IP(src=src, dst=dst)/ICMP(type=8)/Raw(load=os.urandom(32))
            echo_req.time = current_time
            packets.append(echo_req)

            current_time += random.uniform(0.01, 0.3)

            echo_reply = IP(src=dst, dst=src)/ICMP(type=0)/Raw(load=os.urandom(32))
            echo_reply.time = current_time
            packets.append(echo_reply)

        elif traffic_type == "UDP":

            src = random_ip()
            dst = random_ip()
            sport = random.randint(1024, 65535)

            udp_profile = random.choice(["DNS", "APP"])

            # --- Cas DNS réaliste ---
            if udp_profile == "DNS":
                dport = 53

                # Requête DNS
                dns_req = IP(src=src, dst=dst)/UDP(sport=sport, dport=dport)/DNS(
                    rd=1,
                    qd=DNSQR(qname="example.com")
                )
                dns_req.time = current_time
                packets.append(dns_req)

                current_time += random.uniform(0.01, 0.2)

                # Réponse DNS
                dns_resp = IP(src=dst, dst=src)/UDP(sport=dport, dport=sport)/DNS(
                    id=dns_req[DNS].id,
                    qr=1,
                    aa=1,
                    qd=dns_req[DNS].qd,
                    an=DNSRR(rrname="example.com", ttl=300, rdata="93.184.216.34")
                )
                dns_resp.time = current_time
                packets.append(dns_resp)

            # --- Cas UDP applicatif ---
            else:
                dport = random.choice([5000, 12345, 161])  # exemple ports custom ou SNMP
                payload_size = random.randint(20, 400)

                udp_pkt = IP(src=src, dst=dst)/UDP(sport=sport, dport=dport)/Raw(
                    load=os.urandom(payload_size)
                )
                udp_pkt.time = current_time
                packets.append(udp_pkt)

                # Réponse éventuelle (70% de chance)
                if random.random() < 0.7:
                    current_time += random.uniform(0.01, 0.5)

                    reply = IP(src=dst, dst=src)/UDP(sport=dport, dport=sport)/Raw(
                        load=os.urandom(random.randint(20, 400))
                    )
                    reply.time = current_time
                    packets.append(reply)

        # Pause réaliste entre sessions (quelques secondes à plusieurs heures)
        current_time += random.uniform(5, 3600)
    print(f"Nombre total de paquets : {len(packets)}")

    # Écriture du fichier pcap
    wrpcap(OUTPUT_FILE, packets)

    print(f"PCAP réaliste généré : {OUTPUT_FILE}")
