from flask import Flask, g, request
from mongo_db import MongoDBClient
from flask import jsonify
import json
from flask_cors import CORS
from flask import make_response

__all__ = ['app']
app = Flask(__name__)
CORS(app)

HOST = 'localhost'
PORT = 27017
DATABASE_NAME = 'supermarket'
COLLECTION_NAME = 'products'

def get_conn():
    if not hasattr(g, 'mongo'):
        g.mongo = MongoDBClient(HOST, PORT, DATABASE_NAME, COLLECTION_NAME)
    return g.mongo

@app.route('/')
def index():
    supermarket = request.args.getlist('supermarket')
    brand = request.args.getlist('brand')
    min_price = request.args.get('minPrice')
    max_price = request.args.get('maxPrice')
    min_price_unit = request.args.get('minPriceUnit')
    max_price_unit = request.args.get('maxPriceUnit')
    _id = request.args.get('_id')

    if not any([supermarket, brand, min_price, max_price, min_price_unit, max_price_unit, _id]):
        return '<h1>Welcome to ShopSphere Backend Interface (MongoDB Version)</h1>'

    conn = get_conn()
    data, count = conn.search(None, supermarket=supermarket, brand=brand, \
        min_price=min_price, max_price=max_price, min_price_unit=min_price_unit, max_price_unit=max_price_unit, _id=_id)

    response = make_response(jsonify({
        "results": data,
        "count": count
    }))
    response.headers["Content-Type"] = "application/json"
    return response

@app.route('/<searchword>')
def get_searchdata(searchword):
    supermarket = request.args.getlist('supermarket')
    brand = request.args.getlist('brand')
    min_price = request.args.get('minPrice')
    max_price = request.args.get('maxPrice')
    min_price_unit = request.args.get('minPriceUnit')
    max_price_unit = request.args.get('maxPriceUnit')
    _id = request.args.get('_id')

    conn = get_conn()
    data, count = conn.search(searchword, supermarket=supermarket, brand=brand, \
        min_price=min_price, max_price=max_price, min_price_unit=min_price_unit, max_price_unit=max_price_unit, _id=_id)

    response = make_response(jsonify({
        "results": data,
        "count": count
    }))
    response.headers["Content-Type"] = "application/json"
    return response

if __name__ == '__main__':
    app.run()
