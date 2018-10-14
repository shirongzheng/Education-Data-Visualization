from flask import Flask, render_template, request, session, redirect, url_for
from educationapp import app
import json

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/bargraph")
def bargraph():
    return render_template("bargraph.html")

@app.route("/graph")
def graph():
    return render_template("graph.html")