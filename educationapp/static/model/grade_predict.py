import pandas as pd
import re
from sklearn.externals import joblib
df = pd.read_csv('H:/SP/Capstone-Project/educationapp/static/data/db.csv')
df.Sex=df.Sex.map({'M':1,'F':0})
# for i in range(df.Subject.size):
# 	df.Subject[i]=int(str(re.findall('\d+', df.Subject[i] )[0]))
df.Subject=df.Subject.map({'gem03':0,'gsi014':1,'gsi015':2,'inf63':3,'facom49010':4,'ggi017':5,'ggi005':6,'gsi037':7,'gfm015':8,'gsi005':9})
# print(x=df.loc[:,['StudentID','Sex','Subject','Attendence']])
x=df.loc[:,['StudentID','Sex','Subject','Attendence']]
y=df.loc[:,['Grade']]


# print(x.Subject)
from sklearn.ensemble import RandomForestRegressor
rfr=RandomForestRegressor()
rfr.fit(x,y)
# print()
# print(rfr.predict([df.loc[1,['StudentID','Sex','Subject','Attendence']]]))
# print(y.iloc[1])
from sklearn.externals import joblib
joblib.dump(rfr, 'model1.pkl')
model_columns = list(x.columns)
joblib.dump(model_columns, 'model_columns.pkl')