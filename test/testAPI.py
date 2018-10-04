import requests
import pandas as pd
url = 'http://127.0.0.1:5000/predict'
for i in range(400):
	data = {'StudentID':i, 'Sex':0,'Subject':2, 'Attendence':1}
	response = requests.post(url, data=data)
	response.json()
	print(i,response.json())