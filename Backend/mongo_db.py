from pymongo import MongoClient
import json
from bson import ObjectId

HOST = 'localhost'
PORT = 27017
DATABASE_NAME = 'supermarket'
COLLECTION_NAME = 'products'

class MongoDBClient:
    def __init__(self, host, port, database, collection):
        self.client = MongoClient(host=host, port=port)
        self.db = self.client[database]
        self.collection = self.db[collection]

    def save_to_mongo(self, product):
        try:
            result = self.collection.update_one(
                {"id": product["id"], "available_start_date": product["available_start_date"]},
                {"$set": product},
                upsert=True
            )
            if result.upserted_id:
                print(f'Product with ID {product["id"]} has been successfully saved to the MongoDB collection.')
            else:
                print(f'Product with ID {product["id"]} already exists and has been updated in the MongoDB collection.')
        except Exception as e:
            print(f'An error occurred while saving the product with ID {product["id"]}. Error: {e}')

    def search(self, searchword, **kwargs):

        query = {"$and": []}

        if "brand" in kwargs and kwargs["brand"]:
            brands = [i for i in kwargs['brand']]
            query_brands = [{ "brand": {"$regex": str(brand),  "$options": "i"} } for brand in brands]
            query["$and"].append({"$or": query_brands})
            
        if "supermarket" in kwargs and kwargs["supermarket"]:
            supermarkets = [i for i in kwargs['supermarket']]
            query_supermarkets = [{ "supermarket": {"$regex": str(supermarket),  "$options": "i"} } for supermarket in supermarkets]
            query["$and"].append({"$or": query_supermarkets})

        if "min_price" in kwargs and kwargs["min_price"]:
            query_min_price = { "price": {"$gte": float(kwargs['min_price'])} }
            query["$and"].append(query_min_price)
        if "max_price" in kwargs and kwargs["max_price"]:
            query_max_price = { "price": {"$lte": float(kwargs['max_price'])} }
            query["$and"].append(query_max_price)

        if "min_price_unit" in kwargs and kwargs["min_price_unit"]:
            query_min_price_unit = { "price / unit (num)": {"$gte": float(kwargs['min_price_unit'])} }
            query["$and"].append(query_min_price_unit)
        if "max_price_unit" in kwargs and kwargs["max_price_unit"]:
            query_max_price_unit = { "price / unit (num)": {"$lte": float(kwargs['max_price_unit'])} }
            query["$and"].append(query_max_price_unit)

        if searchword:
            query_search = { "name": { "$regex": str(searchword),  "$options": "i"} }
            query["$and"].append(query_search)

        if "_id" in kwargs and kwargs["_id"]:
            query_id = { "_id": ObjectId(kwargs["_id"])}
            query["$and"].append(query_id)

        if not query["$and"]:
            query = {} 

        cursor = self.collection.find(query)
        data = [
            {key: (str(value) if isinstance(value, ObjectId) else value) for key, value in document.items()}
            for document in cursor
        ]
        count = cursor.count()
        return data, count

