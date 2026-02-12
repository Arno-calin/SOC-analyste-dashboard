from flask import Flask
from flask import render_template
import pandas as pd
import numpy as np


app = Flask(__name__)

@app.route('/hello/')
@app.route('/hello/<name>')
def hello(name=None):
    return render_template('hello.html', person=name)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/data/')
def data(name=None):
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
