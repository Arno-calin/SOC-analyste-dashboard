import csv
import random

with open("src/data/randomBrutData.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["date", "protocole", "number"])

    for date in range(365): 
        for protocole in [("TCP",20,40), ("UDP",80,100), ("SSH",2, 10)]:
            writer.writerow([date,protocole[0],random.randint(protocole[1], protocole[2])])
