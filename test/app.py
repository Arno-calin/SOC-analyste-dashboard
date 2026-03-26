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

@app.route("/nivo")
def stats():
    return render_template('data.html')

@app.route("/vega")
def dashboard():
    return render_template('vega.html')

@app.route("/plotly")
def cacahuete():
    return render_template('plotly.html')

@app.route("/c3")
def girafe():
    return render_template('c3.html')
