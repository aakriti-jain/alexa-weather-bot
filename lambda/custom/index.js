/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const request = require('request')

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the Weather Bot! You may ask me temperature or humidity of any region!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Weather Bot', speechText)
      .getResponse();
  },
};

const TemperatureIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TemperatureIntent';
  },
  async handle(handlerInput) {
    slots = handlerInput.requestEnvelope.request.intent.slots;
    region = slots['place'].value;
    temp = await temperature(region);
    speechText = "Temperature in " + region + " is " + temp + " degree celsius"
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Temperature in ' + region, speechText)
      .getResponse();
  },
};
function temperature(region) {
  return new Promise((resolve, reject) => {
    API_KEY = "77c94b49dca863cfe9f90fd4c0181717"
    request("http://api.openweathermap.org/data/2.5/weather?q=" + region + "&appid=" + API_KEY, (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (response.statusCode != 200) {
        reject(response.statusCode)
      }
      resolve(Math.floor(JSON.parse(body).main.temp - 273.16 + 0.5))
    })
  });
}

const HumidityIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HumidityIntent';
  },
  async handle(handlerInput) {
    slots = handlerInput.requestEnvelope.request.intent.slots;
    region = slots['place'].value;
    hum = await humidity(region);
    speechText = "Humidity in " + region + " is " + hum + " %"
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Humidity in ' + region, speechText)
      .getResponse();
  },
};
function humidity(region) {
  return new Promise((resolve, reject) => {
    API_KEY = "77c94b49dca863cfe9f90fd4c0181717"
    request("http://api.openweathermap.org/data/2.5/weather?q=" + region + "&appid=" + API_KEY, (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (response.statusCode != 200) {
        reject(response.statusCode)
      }
      resolve(Math.floor(JSON.parse(body).main.humidity + 0.5))
    })
  });
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask me temperature or humidity of any region!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Weather Bot - Help', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Weather Bot', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    TemperatureIntentHandler,
    HumidityIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
