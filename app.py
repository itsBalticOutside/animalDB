import json
from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import jwt
import datetime
from functools import wraps
import uuid, random

app = Flask(__name__)
CORS(app)

client = MongoClient(" !! CosmosDB mongoAPI Key !! ")
animalDB = client.AnimalDB
userDB = client.UserDB
userCollection = userDB.UserCollection
blacklist = userDB.blacklist

#REMEMBER TO CHANGE THE SECERT CODE
app.config['SECRET_KEY'] = 'mysecret'

# REMINDER HENRY THIS IS NOT YOUR ACTUAL APP.PY THIS IS JUST FOR UPLOADING TO GITHUB
# PLEASE REMEMBER TO UPDATE THE CODE IN HERE 

#Token requiremt decorator 
def jwt_required(func):
    @wraps(func)
    def jwt_required_wrapper(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify( {'message' : 'Token is missing'} ), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify( {'message' : 'Token is invalid'}), 401
        bl_token = blacklist.find_one({"token":token})
        if bl_token is not None:
            return make_response(jsonify( { 'message' : 'Token has been cancelled'}), 401)
        return func(*args, **kwargs)
    return jwt_required_wrapper
    
    #Use @jwt_required when class needs to have a token to use

#Admin requirment decorator 
def admin_required(func):
    @wraps(func)
    def admin_required_wrapper(*args, **kwargs):
        token = request.headers['x-access-token']
        data = jwt.decode(token, app.config['SECRET_KEY'])

        if data["admin"]:
            return func(*args, *kwargs)
        else:
            return make_response(jsonify( { "message" : "Admin access required"}), 401)
    return admin_required_wrapper

# V User ENDPOINTS V

@app.route("/api/v1.0/user/signin", methods=['GET']) 
def signin() :
    auth = request.authorization
    if auth:
        user = userCollection.find_one( {'username':auth.username} )
        if user is not None:
            if bcrypt.checkpw(bytes(auth.password, 'UTF-8'), \
                              user["password"]):
                token = jwt.encode( \
                    {'user' : auth.username,
                     'admin' : user["admin"],
                     'userID' : user["_id"],
                     'exp' : datetime.datetime.utcnow() + \
                             datetime.timedelta(minutes=30)
                        }, app.config['SECRET_KEY'])
                return make_response(jsonify( \
                   { 'token' : token.decode('UTF-8') } ), 200)
            else:
                return make_response(jsonify( \
                   { 'message':'Bad password' } ), 401)
        else:
            return make_response(jsonify( \
                { 'message':'Bad username' } ), 401)
    else:
         return make_response(jsonify( \
            { 'message':'Authentication Required' } ), 401)

@app.route("/api/v1.0/user/signup", methods=['POST'])
def signup() :    
    #Ensuring no missing form fields
    if "forename" in request.form and \
        "surname" in request.form and \
        "username" in request.form and \
        "email" in request.form and \
        "admin" in request.form and \
        "password" in request.form:
        #Creating new user document
        new_user = { "forename" : request.form["forename"],
        "surname" : request.form["surname"],
        "username" : request.form["username"],
        "email" : request.form["email"],
        "admin" : request.form["admin"],
        "password" : request.form["password"],
        "Comments" : [],
        "uploadIDs" : []
        }

        #inserting user to mongodb user collection
        
        new_user["password"] = bcrypt.hashpw(new_user["password"].encode('utf-8'), bcrypt.gensalt())
        
        new_user_id = userDB.UserCollection.insert_one(new_user)
        #Creating link to user entry so can access quickly
        new_user_link = "http://localhost:5000/api/v1.0/users/" + str(new_user_id.inserted_id)
        return make_response(jsonify({"url": new_user_link}), 201)

    else:
        #Empty form validation
        return make_response(jsonify({"error":"Missing form data"}),404)
    
#Editing user !!CANNOT CHANGE PASSWORD OR ADMIN STATUS IMPLEMENT SEPERATE FUNCTION WITH SECURITY MEASURES
@app.route("/api/v1.0/users/<string:userID>", methods=["PUT"])
def edit_user(userID):

    #Ensuring no missing form fields
    if "forename" in request.form and \
        "surname" in request.form and \
        "username" in request.form and \
        "email" in request.form :
        
       
        result = userDB.UserCollection.update_one(\
            { "_id": ObjectId(userID) }, {
                "$set" :{
                    "forename" : request.form["forename"],
                    "surname" : request.form["surname"],
                    "username" : request.form["username"],
                    "email" : request.form["email"],
                }
            } )
        if result.matched_count == 1:
            edited_user_link = \
                "http://localhost:5000/api/v1.0/users/" + userID
            return make_response(jsonify({ "url":edited_user_link}),200)
        else:
            return make_response(jsonify({"error":"Invalid user ID"}),404)
    else:
        return make_response(jsonify({"error":"Missing form data"}),404)

#Deleting user
@app.route("/api/v1.0/users/<string:userID>", methods=["DELETE"])
def delete_user(userID):
   
    user = userDB.UserCollection.find_one({"_id": ObjectId(userID)})
    if user is not None:
        userDB.UserCollection.delete_one({"_id": ObjectId(userID)})
        return jsonify({"message": "User deleted."}), 200
    return jsonify({"message": "User not found."}), 404


#Get all users
@app.route("/api/v1.0/users", methods=["GET"])
def get_users():
    users = []
    # Loop through each collection and retrieve all animals
    
    users += list(userDB.UserCollection.find())
    # Convert ObjectId fields to strings
    for user in users:
        user["_id"] = str(user["_id"])
        user["password"] = user["password"].decode('UTF-8')
    # Return all users as a JSON response
    return make_response(jsonify(users),200)

#Get Specific user
@app.route("/api/v1.0/users/<string:userID>")
def get_user(userID):
    # Loop through  collection and find the user with the specified ID
    user = userDB.UserCollection.find_one({"_id": ObjectId(userID)})
    if user is not None:
    # Convert ObjectId field to string
        user["_id"] = str(user["_id"])
        user["password"] = user["password"].decode('UTF-8')
        # Return the user as a JSON response
        return make_response( jsonify( [user] ), 200)
    # If no user is found, return a 404 error response
    return make_response( jsonify({"error" : "Invalid user ID"}), 404)

#Get user uploads
@app.route("/api/v1.0/users/<string:userID>/uploads")
def get_userUploads(userID):
    # Loop through  collection and find the user with the specified ID
    user = userCollection.find_one({"_id": ObjectId(userID)})
    if user is not None:
        uploads = user["uploadIDs"]
        
            
        # Return the user as a JSON response
        return make_response( jsonify( uploads ), 200)
    # If no user is found, return a 404 error response
    return make_response( jsonify({"error" : "Invalid user ID"}), 404)

#Sign user out
@app.route("/api/v1.0/user/signout", methods=['GET'])
@jwt_required
def logout():
    token = request.headers['x-access-token']
    blacklist.insert_one({"token":token})
    
    return make_response( jsonify( { 'message' : 'Logout successful'}), 200)

#Get signed in users userID
@app.route("/api/v1.0/user/id", methods=['POST'])
@jwt_required
def getUserID():
    #Getting userID from jwt token
    token = request.headers['x-access-token']
    data = jwt.decode(token, app.config['SECRET_KEY'])
    userID = data["userID"]
    return make_response( jsonify( userID ), 200)


# ^ User ENDPOINTS ^
# V Animal ENDPOINTS V


#Get collection of animals
@app.route("/api/v1.0/animals/<string:collection>")
def get_animalCol(collection):
    
    # Retrieve all animals from the Specific collection
    #.title() is to ensure that for example if "deer" is typed, that it is changed to "Deer" so can find collection
    animals = list(animalDB[collection.title()].find())
    for animal in animals:
        animal["_id"] = str(animal["_id"])

    return make_response(jsonify(animals),200)



# REMINDER HENRY THIS IS NOT YOUR ACTUAL APP.PY THIS IS JUST FOR UPLOADING TO GITHUB
# PLEASE REMEMBER TO UPDATE THE CODE IN HERE 

#Get gender count of collection
@app.route("/api/v1.0/animals/<string:collection>/query/genderCount")

def get_genderCount(collection):
   
    pipeline = [    {"$group": {"_id": "$Gender", "genderCount": {"$sum": 1}}}]

    genderCount = list(animalDB[collection.title()].aggregate(pipeline))

    return make_response(jsonify(genderCount),200)

#Get animals of specific gender and collection
@app.route("/api/v1.0/animals/<string:collection>/query/gender/<string:genderType>")

def get_genderCollection(collection,genderType):
    animals = list(animalDB[collection.title()].find({"Gender": genderType.title()}))
    for animal in animals:
        animal["_id"] = str(animal["_id"])
    return make_response(jsonify(animals),200)

#Get animals of specific gendder all collections
@app.route("/api/v1.0/animals/query/gender/<string:genderType>")
def get_gender(genderType):
    animals = []
    for collection in animalDB.list_collection_names():
        animals += list(animalDB[collection.title()].find({"Gender": genderType.title()}))
    # Convert ObjectId fields to strings
    for animal in animals:
        animal["_id"] = str(animal["_id"])
   
    return make_response(jsonify(animals),200)



#Get collection names
@app.route("/api/v1.0/collections")
def get_Col():
    
    collection_names = animalDB.list_collection_names()

    return make_response(jsonify(collection_names),200)

#Get all animals
@app.route("/api/v1.0/animals/", methods=["GET"])
def get_animals():
    animals = []
    # Loop through each collection and retrieve all animals
    for collection in animalDB.list_collection_names():
        animals += list(animalDB[collection].find())
    # Convert ObjectId fields to strings
    for animal in animals:
        animal["_id"] = str(animal["_id"])
    # Return all animals as a JSON response
    return make_response(jsonify(animals),200)


# REMINDER HENRY THIS IS NOT YOUR ACTUAL APP.PY THIS IS JUST FOR UPLOADING TO GITHUB
# PLEASE REMEMBER TO UPDATE THE CODE IN HERE 


#Get Specific animal - efficent query -
@app.route("/api/v1.0/animals/<string:collection>/<string:id>")
def get_animal(collection,id):
    
    #find the animal with the specified ID
    animal = animalDB[collection.title()].find_one({"_id": ObjectId(id)})
    if animal is not None:
        # Convert ObjectId field to string
        animal["_id"] = str(animal["_id"])
        # Return the animal as a JSON response
        return make_response( jsonify( [animal] ), 200)
    # If no animal is found, return a 404 error response
    return make_response( jsonify({"error" : "Invalid animal ID"}), 404)

#Get Specific animal for user profile
@app.route("/api/v1.0/animal/<string:id>", methods=["GET"])
def get_animalUserProfile(id):
    
    # Loop through each collection and try to find the animal with the specified ID
    for collection in animalDB.list_collection_names():
        animal = animalDB[collection].find_one({"_id": ObjectId(id)})
        if animal is not None:
            # Convert ObjectId field to string
            animal["_id"] = str(animal["_id"])
            # Return the animal as a JSON response
            return make_response( jsonify( [animal] ), 200)
    # If no animal is found, return a 404 error response
    return make_response( jsonify({"error" : "Invalid animal ID"}), 404)



#Old all animals method with pagination system
#@app.route("/api/v1.0/animal", methods=["GET"])
#def show_all_animals():
#    page_num, page_size = 1,12
#    if request.args.get('pn'):
#        page_num = int(request.args.get('pn'))
#    if request.args.get('ps'):
#        page_size = int(request.args.get('ps'))
#    page_start = (page_size * (page_num -1))
#
 #   data_to_return = []
 #   for animal in animals.find().skip(page_start).limit(page_size):
  #      animal['_id'] = str(animal['_id'])
  #      data_to_return.append(animal)
#
#    return make_response(jsonify(data_to_return),200)


# REMINDER HENRY THIS IS NOT YOUR ACTUAL APP.PY THIS IS JUST FOR UPLOADING TO GITHUB
# PLEASE REMEMBER TO UPDATE THE CODE IN HERE 


#Uploading animal   
@app.route("/api/v1.0/animal", methods=["POST"])
@jwt_required
def add_animal():
    #Ensuring no missing form fields
    if "Species" in request.form and \
        "Gender" in request.form and \
        "LifeStage" in request.form and \
        "Location" in request.form and \
        "image" in request.form:

        #Getting userID from jwt token
        token = request.headers['x-access-token']
        data = jwt.decode(token, app.config['SECRET_KEY'])
        userID = data["userID"]

        #Getting image path from form
        image_path = request.form["image"]

        #Uploading image to animal classification model to get a prediction on species
        animalPrediction = imageUpload.getPrediction(image_path)

        if animalPrediction is not None:
            #Uploading image to blob storage which returns the new url to be used to display image
            blob_url = imageUpload.blobUpload(image_path)

            #Creating new animal document
            new_animal = { "Species" : animalPrediction,
            "Gender" : request.form["Gender"],
            "LifeStage" : request.form["LifeStage"],
            "Location" : request.form["Location"],
            "image" : blob_url,
            "Rating" : [],
            "Comments" : [],
            "userID" : userID
            }

            #Grabbing Species from animal prediction to identify which animal collection should be added to
            collection = animalPrediction 
            #inserting animal to mongodb collection
            new_animal_id = animalDB[collection.title()].insert_one(new_animal)
            #Adding uploadID to user profile
            userCollection.update_one({"_id": ObjectId(userID)}, {'$push': {'uploadIDs' : str(new_animal_id.inserted_id)}})
            #Creating link to animals entry so can access quickly
            new_animal_link = "http://localhost:5000/api/v1.0/animals/"+ collection + str(new_animal_id.inserted_id)
            return make_response(jsonify({"url": new_animal_link}), 201)
                
        else:
            
            return make_response(jsonify({"error":"Image upload failed"}),404)

    else:
        #Empty form validation
        return make_response(jsonify({"error":"Missing form data"}),404)


#Editing animal
@app.route("/api/v1.0/animal/<string:id>", methods=["PUT"])
@jwt_required
def edit_animals(id):

    #Ensuring no missing form fields
    if "Species" in request.form and \
        "Gender" in request.form and \
        "LifeStage" in request.form and \
        "Location" in request.form:
        collection = request.form["Species"]
        result = animalDB[collection].update_one(\
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


# REMINDER HENRY THIS IS NOT YOUR ACTUAL APP.PY THIS IS JUST FOR UPLOADING TO GITHUB
# PLEASE REMEMBER TO UPDATE THE CODE IN HERE 



#Deleting animal
@app.route("/api/v1.0/animal/<string:id>", methods=["DELETE"])
@jwt_required
def delete_animal(id):
    #Goes through each collection to find a animal which has matching ID,
    #Could be less efficient than using an endpoint with a variable for Species
    #Such as /api/v1.0/animals/<string:collection>/<string:id>
    #I decided to go this way as I thought it would be a challenge to implement
    # and it was more convient to only type the ID when looking to delete
    for collection in animalDB.list_collection_names():
        animal = animalDB[collection].find_one({"_id": ObjectId(id)})
        if animal is not None:
            animalDB[collection].delete_one({"_id": ObjectId(id)})
            return jsonify({"message": "Animal deleted."}), 200
    return jsonify({"message": "Animal not found."}), 404


if __name__ == "__main__" :
    
    app.run(debug=True)


# !! V imageHandler.py code V !!


import requests
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from msrest.authentication import ApiKeyCredentials
import os
import json
from flask import Flask, jsonify, make_response, request

class imageUpload:
    def getPrediction(image_path):

        # Setting computer vison variables
        ENDPOINT = " Azure computer vision prediction endpoint"
        prediction_key = " Prediction key"
        prediction_resource_id = " Computer vision prediction subscription id"
        prediction_credentials = ApiKeyCredentials(in_headers={"Prediction-key": prediction_key})
        predictor = CustomVisionPredictionClient(ENDPOINT, prediction_credentials)
        project_id = ' Computer Vision project ID '
        publish_iteration_name= 'Iteration1'

        animals = []

        
        # Open the image file and read its content
        with open(image_path, "rb") as image_contents:
            results = predictor.classify_image(
                project_id, publish_iteration_name, image_contents.read())

            # Display the results.
            for prediction in results.predictions:
                animals.append(prediction.tag_name)
                print("\t" + prediction.tag_name +
                    ": {0:.2f}%".format(prediction.probability * 100))

        
        print("This animal is most likely " + animals[0])
        return animals[0]

    def blobUpload(image_path):

        blobUploadUrl = r' Blob storage logic app upload endpoint '

        # Open the image file and read its contents
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()
        if len(image_data) != os.path.getsize(image_path):
            return make_response(jsonify({"error":"Failed to read image file"}),404)
        else:
            print('Image file loaded successfully.')

            form_data = {
                "image": ("image.jpg", image_data, "image/jpeg")
            }

            # Make the POST request to the Logic App endpoint
            response = requests.post(blobUploadUrl, files=form_data)


            # Extract the URL of the uploaded blob from the response body
            if response.status_code == 200:
                print(response.text)
                
                blob_url = response.text
                print(f"Image uploaded successfully to " +blob_url)
                return blob_url         
            else:
                return make_response(jsonify({"error":"Image upload failed"}),404)