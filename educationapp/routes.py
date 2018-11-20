from flask import Flask, render_template, request, session, redirect, url_for
from educationapp import app
import json

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/bargraph")
def bargraph():
    return render_template("bargraph.html")

@app.route("/gender")
def gender():
    return render_template("gender.html")

@app.route("/zoomable")
def zoomable():
    return render_template("zoomable.html")

@app.route("/treemap")
def treemap():
    return render_template("treemap.html")