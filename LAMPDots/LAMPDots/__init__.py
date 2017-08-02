from flask import Flask
from flask import request
from flask import jsonify
from flask import json
from flask_sqlalchemy import SQLAlchemy
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://vagrant:11111@localhost:3306/lampdots'
db = SQLAlchemy(app)

class Dot(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  displayX = db.Column(db.Integer)
  displayY = db.Column(db.Integer)
  displayRGB = db.Column(db.String(16))

  def __init__(self, displayX, displayY, displayRGB):
    self.displayX = displayX
    self.displayY = displayY
    self.displayRGB = displayRGB

@app.route('/dots/new', methods=['POST'])
def newDot():
  dotData = request.get_json()

  dotToAdd = Dot(dotData['x'], dotData['y'], dotData['color'])
  db.session.add(dotToAdd)
  db.session.commit()
  return jsonify({
    'success': True
  })

@app.route('/dots/all', methods=['GET'])
def returnAllDots():
  returnDots = {}
  dots = Dot.query.all()
  for dot in dots:
    returnDots[dot.id] = {}
    returnDots[dot.id]['displayX'] = dot.displayX
    returnDots[dot.id]['displayY'] = dot.displayY
    returnDots[dot.id]['color'] = dot.displayRGB
  return jsonify(returnDots)


@app.route('/', methods=['GET'])
def welcome():
  return "Welcome, Paul!"

if __name__ == "__main__":
  app.run(
    debug=True,
    host="localhost",
    port=80
  )