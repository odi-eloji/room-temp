# MMM-room-temp
Odi and Ndey iot project

This Magic mirror module takes a room temperature reading using the Sense Hat attached to a Raspberry Pi.
With the Pi connected to the ThingSpeak MQTT broker, it publishes the temperature to a channel that Magic Mirror is subsribed to, updating the room temperature using the data entered in the channel field.

## Raspberry Pi
Download device credentials as plaintext. Create file for configuration data. Enter the contents of the plaintext credentials into file.
### Config file



In same directory create the python script for publishing temperature.
### Python Script
```
#!/usr/bin/python3

import paho.mqtt.client as mqtt
from urllib.parse import urlparse
import sys
import time
from sense_hat import SenseHat
import logging
from dotenv import dotenv_values

#Initialise SenseHAT
sense = SenseHat()


#load MQTT configuration values from .env file
config = dotenv_values(".env")

#configure Logging
logging.basicConfig(level=logging.INFO)

# Define event callbacks for MQTT
def on_connect(client, userdata, flags, rc):
    logging.info("Connection Result: " + str(rc))

def on_publish(client, obj, mid):
    logging.info("Message Sent ID: " + str(mid))

mqttc = mqtt.Client(client_id=config["clientId"])

# Assign event callbacks
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish

# parse mqtt url for connection details
url_str = sys.argv[1]
print(url_str)
url = urlparse(url_str)
base_topic = url.path[1:]

# Configure MQTT client with user name and password
mqttc.username_pw_set(config["username"], config["password"])

#Connect to MQTT Broker
mqttc.connect(url.hostname, url.port)
mqttc.loop_start()

#Set Thingspeak Channel to publish to
topic = "channels/"+config["channelId"]+"/publish"

# Publish a message to temp every 15 seconds
while True:

    try:
        temp=round(sense.get_temperature_from_pressure() + sense.get_temperature_from_humidity())/2
        payload="field1="+str(temp)
        mqttc.publish(topic, payload)
        time.sleep(int(config["transmissionInterval"]))
    except:
        logging.info('Interrupted')

    message = str(temp)
    if temp >=14:
       bg = [255,0,0]
    else:
       bg = [0,0,255]
    sense.clear(bg)
    sense.show_message(message, text_colour=[255,255,255],back_colour=bg)

    acceleration = sense.get_accelerometer_raw()
    x = acceleration['x']
    y = acceleration['y']
    z = acceleration['z']

    x=round(x, 0)
    y=round(y, 0)
    z=round(z, 0)

    if x  == -1:
       sense.set_rotation(180)
    elif y == 1:
       sense.set_rotation(90)
    elif y == -1:
       sense.set_rotation(270)
    else:
       sense.set_rotation(0)
```

## Demonstration

[![room-temp_demo](https://img.youtube.com/vi/LlKc0RUdNng/0.jpg)](https://www.youtube.com/watch?v=LlKc0RUdNng)

