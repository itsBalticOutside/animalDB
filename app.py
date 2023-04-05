import json
from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import uuid, random

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.AnimalDB

# Define API endpoints
#Get collection of animals
@app.route("/api/v1.0/animals/<string:collection>")
def get_animalCol(collection):
    
    # Retrieve all animals from the Specific collection
    #.title() is to ensure that for example if "deer" is typed, that it is changed to "Deer" so can find collection
    animals = list(db[collection.title()].find())
    for animal in animals:
        animal["_id"] = str(animal["_id"])

    return make_response(jsonify(animals),200)

#Get gender count of collection
@app.route("/api/v1.0/animals/<string:collection>/<string:genderID>")
def get_genderCount(collection, genderID):
   
    gender = genderID.title()
    genderCount = list(db[collection.title()].aggregate([
        {'$match': {'Gender': gender}},
        {'$group': {'_id': gender, 'total': {'$sum': 1}}}
    ]))
    return make_response(jsonify(genderCount),200)

#Get collection names
@app.route("/api/v1.0/collections")
def get_Col():
    
    collection_names = db.list_collection_names()

    return make_response(jsonify(collection_names),200)

#Get all animals
@app.route("/api/v1.0/animals", methods=["GET"])
def get_animals():
    animals = []
    # Loop through each collection and retrieve all animals
    for collection in db.list_collection_names():
        animals += list(db[collection].find())
    # Convert ObjectId fields to strings
    for animal in animals:
        animal["_id"] = str(animal["_id"])
    # Return all animals as a JSON response
    return make_response(jsonify(animals),200)

#Get Specific animal
@app.route("/api/v1.0/animal/<string:id>")
def get_animal(id):
    # Loop through each collection and try to find the animal with the specified ID
    for collection in db.list_collection_names():
        animal = db[collection].find_one({"_id": ObjectId(id)})
        if animal is not None:
            # Convert ObjectId field to string
            animal["_id"] = str(animal["_id"])
            # Return the animal as a JSON response
            return make_response( jsonify( [animal] ), 200)
    # If no animal is found, return a 404 error response
    return make_response( jsonify({"error" : "Invalid animal ID"}), 404)

#Old all animals method with pagination system
@app.route("/api/v1.0/animal", methods=["GET"])
def show_all_animals():
    page_num, page_size = 1,12
    if request.args.get('pn'):
        page_num = int(request.args.get('pn'))
    if request.args.get('ps'):
        page_size = int(request.args.get('ps'))
    page_start = (page_size * (page_num -1))

    data_to_return = []
    for animal in animals.find().skip(page_start).limit(page_size):
        animal['_id'] = str(animal['_id'])
        data_to_return.append(animal)

    return make_response(jsonify(data_to_return),200)

#Uploading animal   
@app.route("/api/v1.0/animal", methods=["POST"])
def add_animal():
    #Ensuring no missing form fields
    if "Species" in request.form and \
        "Gender" in request.form and \
        "LifeStage" in request.form and \
        "Location" in request.form and \
        "image" in request.form:
        #Creating new animal document
        new_animal = { "Species" : request.form["Species"],
        "Gender" : request.form["Gender"],
        "LifeStage" : request.form["LifeStage"],
        "Location" : request.form["Location"],
        "image" : request.form["image"],
        "Rating" : [],
        "Comments" : []
        }

        #Grabbing Species field to identify which animal collection should be added to
        collection = request.form["Species"] 
        #inserting animal to mongodb collection
        new_animal_id = db[collection.title()].insert_one(new_animal)
        #Creating link to animals entry so can access quickly
        new_animal_link = "http://localhost:5000/api/v1.0/animal/" + str(new_animal_id.inserted_id)
        return make_response(jsonify({"url": new_animal_link}), 201)

    else:
        #Empty form validation
        return make_response(jsonify({"error":"Missing form data"}),404)

#Editing animal
@app.route("/api/v1.0/animal/<string:id>", methods=["PUT"])
def edit_animals(id):

    #Ensuring no missing form fields
    if "Species" in request.form and \
        "Gender" in request.form and \
        "LifeStage" in request.form and \
        "Location" in request.form:
        collection = request.form["Species"]
        result = db[collection].update_one(\
            { "_id": ObjectId(id) }, {
                "$set" :{
                    "Species" : request.form["Species"],
                    "Gender" : request.form["Gender"],
                    "LifeStage" : request.form["LifeStage"],
                    "Location" : request.form["Location"],
                }
            } )
        if result.matched_count == 1:
            edited_animal_link = \
                "http://localhost:5000/api/v1.0/animal/" + id
            return make_response(jsonify({ "url":edited_animal_link}),200)
        else:
            return make_response(jsonify({"error":"Invalid animal ID"}),404)
    else:
        return make_response(jsonify({"error":"Missing form data"}),404)

#Deleting animal
@app.route("/api/v1.0/animal/<string:id>", methods=["DELETE"])
def delete_animal(id):
    #Goes through each collection to find a animal which has matching ID,
    #Could be less efficient than using an endpoint with a variable for Species
    #Such as /api/v1.0/animals/<string:collection>/<string:id>
    #I decided to go this way as I thought it would be a challenge to implement
    # and it was more convient to only type the ID when looking to delete
    for collection in db.list_collection_names():
        animal = db[collection].find_one({"_id": ObjectId(id)})
        if animal is not None:
            db[collection].delete_one({"_id": ObjectId(id)})
            return jsonify({"message": "Animal deleted."}), 200
    return jsonify({"message": "Animal not found."}), 404


if __name__ == "__main__" :
    
    app.run(debug=True)

