from flask import Flask, render_template, request, session, redirect, url_for
from educationapp import app
import pandas as pd
import requests
import json
from sklearn.externals import joblib
import jsonify

@app.route("/")
def index():
    return render_template("index.html")
@app.route('/predict', methods=['POST'])
def predict():
    # 取得傳入的參數並轉成 DataFrame    
    json_ = request.form.to_dict()
    print(json_)
    query_df = pd.DataFrame([json_])
    # 簡單的資料處理（編碼類別型變數、確認欄位、補值等等）
    # query = pd.get_dummies(query_df)
    # model_columns = joblib.load('model_columns.pkl')
    # query = query.reindex(columns=model_columns, fill_value=0)
    # for col in model_columns:
    #     if col not in query.columns:
    #         query[col] = 0
    # 預測
    rfr=joblib.load('../Capstone-Project/educationapp/static/model/model1.pkl')
    prediction = rfr.predict(query_df).tolist()
    return json.dumps({'prediction': prediction})
