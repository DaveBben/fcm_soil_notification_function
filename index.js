const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

/**
 * Sends to topic
 * @param {String} topic
 * @param {Object} payload
 */
function sendToTopic(topic, payload) {
  admin.messaging().sendToTopic(topic, payload);
}

/**
 * Returns the plant name from the id
 * @param {number} id
 * @return {String}
 */
function getPlantFromID(id) {
  const mappins = {
    9466: "Pothos (Nadia)",
    16333: "Peace Lilly (Gav)",
    13043: "Aspidistra",
  };
  return mappins[id];
}

exports.checkValues = functions.firestore
    .document("plants/{id}")
    .onCreate((snap, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      const newValue = snap.data();

      // access a particular field as you would any JS property
      const moisture = newValue.moisture;
      const voltage = newValue.battery;
      const id = newValue.id;

      const TOPIC = "plants";

      if (moisture > 1920) {
        const payload = {
          notification: {
            title: `${getPlantFromID(id)} needs water`,
            body: `Sensor moisture is at ${moisture} millivolts`,
          },
        };
        sendToTopic(TOPIC, payload);
      }


      if (voltage < 3500) {
        const payload = {
          notification: {
            title: "Battery Low",
            body: `Sensor in plant ${getPlantFromID(id)} has low battery`,
          },
        };
        sendToTopic(TOPIC, payload);
      }

      // perform desired operations ...
    });

