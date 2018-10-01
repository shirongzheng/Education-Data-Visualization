from flask import Flask
app = Flask('educationapp')
import educationapp.routes
from sklearn.externals import joblib
rfr=joblib.load('../Capstone-Project/educationapp/static/model/model1.pkl')