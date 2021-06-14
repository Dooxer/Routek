import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
from flask import Flask, request
from flask_cors import CORS
import json
import numpy as np
import cv2
import urllib
from tensorflow import keras

app = Flask(__name__)
model = keras.models.load_model("model")
CORS(app)

threshold = 0.8

signs = {
        1: 'Speed limit (20km/h)',
        2: 'Speed limit (30km/h)',
        3: 'Speed limit (50km/h)',
        4: 'Speed limit (60km/h)',
        5: 'Speed limit (70km/h)',
        6: 'Speed limit (80km/h)',
        7: 'End of speed limit (80km/h)',
        8: 'Speed limit (100km/h)',
        9: 'Speed limit (120km/h)',
        10: 'No passing',
        11: 'No passing veh over 3.5 tons',
        12: 'Right-of-way at intersection',
        13: 'Priority road',
        14: 'Yield',
        15: 'Stop',
        16: 'No vehicles',
        17: 'Veh > 3.5 tons prohibited',
        18: 'No entry',
        19: 'General caution',
        20: 'Dangerous curve left',
        21: 'Dangerous curve right',
        22: 'Double curve',
        23: 'Bumpy road',
        24: 'Slippery road',
        25: 'Road narrows on the right',
        26: 'Road work',
        27: 'Traffic signals',
        28: 'Pedestrians',
        29: 'Children crossing',
        30: 'Bicycles crossing',
        31: 'Beware of ice/snow',
        32: 'Wild animals crossing',
        33: 'End speed + passing limits',
        34: 'Turn right ahead',
        35: 'Turn left ahead',
        36: 'Ahead only',
        37: 'Go straight or right',
        38: 'Go straight or left',
        39: 'Keep right',
        40: 'Keep left',
        41: 'Roundabout mandatory',
        42: 'End of no passing',
        43: 'End no passing veh > 3.5 tons'}

def grayscale(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return img

def equalize(img):
    img = cv2.equalizeHist(img)
    return img

def preprocessing(img):
    img = grayscale(img)
    img = equalize(img)
    img = img/255
    return img

def url_to_image(url):
    with urllib.request.urlopen(url) as res:
        image = np.asarray(bytearray(res.read()), dtype=np.uint8)
        image = cv2.imdecode(image, -1)
        return image

@app.route('/recognise', methods=['GET'])
def signRecognition():
    if 'image' in request.args:
        image = request.args['image']
    else:
        x = {
            "success": "false",
            "error": "Error: no image parameter!"
        }
        return json.dumps(x)

    image = url_to_image("http://localhost:3001/images/" + image)
    img = np.asarray(image)
    img = cv2.resize(img, (32, 32))
    img = preprocessing(img)
    img = img.reshape(1, 32, 32, 1)
    
    predictions = model.predict(img)
    classIndex = np.argmax(predictions, axis=-1)
    probabilityValue = np.amax(predictions)
    sign = signs[classIndex[0]+1]

    x = {
        "success": "true",
		"sign": sign,
        "probability": str(probabilityValue)
	}
    return json.dumps(x)

app.run(host='0.0.0.0')