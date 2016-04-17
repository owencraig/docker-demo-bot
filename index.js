var Botkit = require('botkit'),
    denodeify = require('as-promise').denodeify,
    moment = require('moment');
var request = denodeify(require('request'));
    


const TRANSLATE_HOST = process.env.TRANSLATE_HOST || '192.168.99.100:3000';

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.BOT_TOKEN,
}).startRTM()

// give the bot something to listen for.
controller.hears('toUs',['direct_message','direct_mention','mention'],function(bot,message) {
  log('got some text to translate to american english');
  getTranslation('us','intl',message.text.replace(/^toUs /,''))
  .then((result) => {
      if(result){
           bot.reply(message,result);        
      }
  })
});


controller.hears('toEn',['direct_message','direct_mention','mention'],function(bot,message) {
  log('got some text to translate to english');
  getTranslation('intl','us',message.text.replace(/^toEn /,''))
  .then((result) => {
      if(result){
           bot.reply(message,result);        
      }
  })
});

function getTranslation(to, from, message){
    log(`Getting translation for "${message}". Using ${from} => ${to}"`);
    var parts = message.split(' ');
    return Promise.all(parts.map(makeTranslateRequest.bind(null, to, from)))
        .then(parts => parts.map(getTranslationResult))
        .then(joinParts)
        .then(translated => {
            log(`Translation finished for "${message}". Using ${from} => ${to}"`);
            if(message !== translated){
                return translated;
            }
        })
    
}
function getTranslationResult(result){
    return result.translated;
}

function joinParts(parts){
    return parts.join(' ');
}

function makeTranslateRequest(to, from, word){
    log(`getting translation from http://${TRANSLATE_HOST}/${to}/${from}/${word}`);
    return request(`http://${TRANSLATE_HOST}/${to}/${from}/${word}`).then(function(result){
        return JSON.parse(result.body);;
    })
}

function getDateString(date){
    return moment(date).format('YYYY-MM-DD hh:mm:ss.SSS')
}

function log(message){
    console.log(`${getDateString()}: ${message}`);
}