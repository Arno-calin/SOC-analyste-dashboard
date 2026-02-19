from flask import Flask
from flask import render_template
import pandas as pd
import numpy as np


app = Flask(__name__)

@app.route("/")
@app.route('/<name>')
def hello_world(name=None):
    return render_template('hello.html', person=name)

@app.route("/statistiques")
def stats():
    # analyse du csv
    df = pd.read_csv("data/first_data.csv")
    # formatage

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

    print(data)

    return render_template('data.html', rows=data)

@app.route("/dashboard")
def dashboard():
    # analyse du csv
    df = pd.read_csv("data/randomBrutData.csv")
    tip = pd.read_csv("data/tip_events.csv")
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
    
    data = df.to_dict(orient="records")
    tip = tip.to_dict(orient="records")


    return render_template('dataImproved.html', rows=data, tips=tip)

