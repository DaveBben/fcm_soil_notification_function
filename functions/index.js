const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

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
      const newValue = snap.data();
      const moisture = newValue.moisture;
      const voltage = newValue.battery;
      const id = newValue.id;

      const TOPIC = "plants";

      // If it's greater than 2700 then it's probably a false reading
      if (moisture > 1920 && moisture < 2700) {
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
    });

