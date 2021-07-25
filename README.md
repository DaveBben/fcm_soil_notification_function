# Google Cloud Function for Soil Sensors
This cloud function sends a push notification to the *plants* topic when the the moisture value passes a certain threshold or the battery level is too low. This is a bare bones function designed specifically for my needs using the bare minimum of code and no testing.

As part of this project, I have Arduino soil sensors that push data to a Raspberry Pi gateway. The Raspberry Pi gateway uploads that data to Google Firebase. Ths functions reads that documents and pushes a notification using FCM to my custom designed android app.

## Deploy updates:

Use command: `firebase deploy --only functions`

### Related Repos
Soil Moisture Sensor Transmitter and Receiver: [https://github.com/DaveBben/Soil_Moisture_Transmitter_Reciver](https://github.com/DaveBben/Soil_Moisture_Transmitter_Reciver)