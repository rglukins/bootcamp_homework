import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

# set up database
engine = create_engine("sqlite:///hawaii.sqlite")

# reflect the hawaii database
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the tables
Station = Base.classes.stations
Measurement = Base.classes.measurements

# Create the session link to the database
session = scoped_session(sessionmaker(bind=engine))

# set up Flask
app = Flask(__name__)

# establish Flask routes

@app.route("/")
def welcome():
    """List all available api routes."""
    return ( 
        "Available Routes:<br/>"
        "/api/v1.0/precipitation<br/>"
        '/api/v1.0/stations<br/>'
        '/api/v1.0/tobs<br/>'
        '/api/v1.0/<start>       #Enter dates in YYYY-MM-DD format<br/>'
        '/api/v1.0/<start>/<end>       #Enter dates in YYYY-MM-DD format'
        )

@app.route("/api/v1.0/precipitation")
def precipation():
    """Returns 12 months worth of precipitation data in json format"""
    prcp_data = session.query(Measurement.date, Measurement.prcp).filter(Measurement.date > '2016-08-23').order_by(Measurement.date).all()
    # Convert the query results to a Dictionary using `date` as the key and `prcp` as the value.
    prcp_df = pd.DataFrame(prcp_data, columns=['Date', 'Precipitation'])
    prcp_df.set_index("Date", inplace=True)
    data = prcp_df.to_dict()

    return jsonify(data)

@app.route("/api/v1.0/stations")
def stations():
    """Return a json list of stations from the dataset."""
    stations = session.query(Station.station, Station.name).all()

    return jsonify(stations)

@app.route("/api/v1.0/tobs")
def tobs():
    """Return a json list of Temperature Observations (tobs) for the previous year."""
    temp_data = [Measurement.station, Measurement.date, Measurement.tobs]
    temp_obs = session.query(*temp_data).filter(Measurement.date > '2016-08-23').order_by(Measurement.date).all()
    df = pd.DataFrame(temp_obs, columns=['station', 'date', 'tobs'])
    data = df.to_dict(orient="records")
    
    return jsonify(data)


@app.route('/api/v1.0/<start>')
def start(start):
    """returns a list featuring (min temp), (max temp) and (average temp) for the start date entered"""    
    data = session.query(Measurement.date, Measurement.tobs).filter(Measurement.date > start).all()
    df = pd.DataFrame(data, columns=['date', 'temp'])
    df['temp'] = df['temp'].astype(int)
    temp_min = int(df['temp'].min())
    temp_max = int(df['temp'].max())
    temp_av = round(float(df['temp'].mean()), 2)
    return jsonify(temp_min, temp_av, temp_max)

@app.route('/api/v1.0/<start>/<end>')
def end(start, end):
    """returns a list featuring (min temp), (max temp) and (average temp) for the date range entered"""    
    data = session.query(Measurement.date, Measurement.tobs).filter(Measurement.date > start).filter(Measurement.date < end).all()
    df = pd.DataFrame(data, columns=['date', 'temp'])
    temp_min = int(df['temp'].min())
    temp_max = int(df['temp'].max())
    temp_av = round(float(df['temp'].mean()), 2)
    return jsonify(temp_min, temp_av, temp_max)

if __name__ == '__main__':
    app.run(debug=True)