import requests
import pandas as pd
url = 'http://127.0.0.1:5000/predict'
data = {'StudentID':233, 'Sex':0,'Subject':2, 'Attendence':1}
response = requests.post(url, data=data)
response.json()