from flask import Flask, render_template, request, session, redirect, url_for
from educationapp import app
import json

@app.route("/")
def index():
    return render_template("index.html")

