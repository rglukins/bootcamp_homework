from flask import Flask, render_template, jsonify, redirect
from flask_pymongo import PyMongo
import scrape_mars

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)


@app.route("/")
def index():
    mars = mongo.db.mars_data.find_one()
    return render_template("index.html", mars=mars)


@app.route("/scrape")
def scraper():
    mars = mongo.db.mars_data #name of python dictionary returned by the scraper function in scrape_mars.py
    mars_data = scrape_mars.scrape()
    mars.update(
        {},
        mars_data,
        upsert=True
    )
    return redirect("http://localhost:5000/", code=302)


if __name__ == "__main__":
    app.run(debug=True)