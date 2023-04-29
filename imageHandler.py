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