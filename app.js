
/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger Platform Quick Start Tutorial
 *
 * This is the completed code for the Messenger Platform quick start tutorial
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 * To run this code, you must do the following:
 *
 * 1. Deploy this code to a server running Node.js
 * 2. Run `npm install`
 * 3. Update the VERIFY_TOKEN
 * 4. Add your PAGE_ACCESS_TOKEN to your environment vars
 *
 */

'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  firebase = require('firebase-admin'),
  app = express().use(body_parser.json()); // creates express http server

  firebase.initializeApp({
  credential: firebase.credential.cert({
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "project_id": process.env.FIREBASE_PROJECT_ID,
  }),
  databaseURL: "https://duwon-56700.firebaseio.com"
  });
  let db = firebase.firestore(); 




let contactct = {
  numberno:false,
}

let userEnteredPhonenum = {};




let landlordsent = {
  attach1:false,
}

let userEnteredldld_attach = {};



let toselhou_ott_byuser = {
  to_sel_hou:false,
}

let userEntered_Hou_tosel = {};

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;

  

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);   

      

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {        
        if(webhook_event.message.quick_reply){
          handleMessage(sender_psid, webhook_event.message.quick_reply);
        }else{
          handleMessage(sender_psid, webhook_event.message);
        }
                
      } else if (webhook_event.postback) {        
        handlePostback(sender_psid, webhook_event.postback);
      }
      
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


app.get('/setgsbutton',function(req,res){
    setupGetStartedButton(res);    
});

app.get('/setpersistentmenu',function(req,res){
    setupPersistentMenu(res);    
});

app.get('/clear',function(req,res){    
    removePersistentMenu(res);
});

//whitelist domains
//eg https://fbstarterbot.herokuapp.com/whitelists
app.get('/whitelists',function(req,res){    
    whitelistDomains(res);
});


// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  
    
  // Check if a token and mode were sent
  if (mode && token) {
    
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function handleMessage(sender_psid, received_message) {
  let response;
  
  // Checks if the message contains text
  if (received_message.text == "ahii") {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": "Pick a color:",
      "quick_replies":[
      {
        "content_type":"text",
        "title":"Red",
        "payload":"red-1",
        "image_url":"http://example.com/img/red.png"
      },
      {
        "content_type":"text",
        "title":"Red",
        "payload":"red-2",
        "image_url":"http://example.com/img/red.png"
      },
      {
        "content_type":"text",
        "title":"Green",
        "payload":"<POSTBACK_PAYLOAD>",
        "image_url":"http://example.com/img/green.png"
      }
    ]
    }
  }
  else if (received_message.text == "ahelloo") {
    response = {
      "text":'Say'
    }
  }
  else if (received_message.text == "hi" || received_message.text == "hello" || received_message.text == "Hi") {
    response = { "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Hi, You are warmly welcomed. Thank you for contacting us. Have a nice day!",
         "buttons":[
              {
                "type":"postback",
                "title":"Main Menu",
                "payload": "onee"
              },
              {
                "type":"postback",
                "title":"Contact us",
                "payload":"two2"
              },
                {
                "type":"postback",
                "title":"About us",
                "payload":"three3"
              }                            
            ]      
        }
      }
   }
  }
  else if (received_message.text == "Yes!!!") {
   
    received_message.text = false;
    contactct.numberno = true;
  }
   else if (received_message.text && contactct.numberno == true) {
    userEnteredPhonenum.numberno = received_message.text;
    response = {
      "text":"We have received your phone number. We will contact you within 24 hours. Thank you for contacting us. Have a nice day!"
    }
    contactct.numberno = false;
  } 
    
  else if (received_message.text == "ni hao") {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `Hao Xie Xie. Ni Hao Mah!`
    }
  }
   else if (received_message.text == "hhhhlp") {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  }  else if (received_message.payload === "ld_ottwp") {    
    response = {
      "text": "You choose: Ottara. Now send me outside picture of house as an attachment!"
    }
    received_message.payload = false;
    landlordsent.attach1 = true;
  }
     else if (received_message.attachments && landlordsent.attach1 == true) {
      userEnteredldld_attach.attach1 = received_message.attachments;
    // Get the URL of the message attachment
    let attachment_url1 = userEnteredldld_attach.attach1[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url1,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes",
                "payload": "attach_yes1",
              },
              {
                "type": "postback",
                "title": "No",
                "payload": "attach_no1",
              }
            ],
          }]
        }
      }
    }
  }
   else if (received_message.payload === "more_attach_enough") {
        response = { "attachment":{

      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Do you have what types of room?",
         "buttons":[
                    {
                    "type":"postback",
                    "title":"Only master bed room",
                    "payload": "only_master_bed_landlord"
                    },
                    {
                    "type":"postback",
                    "title":"Only bed room",
                    "payload":"only_bed_landlord"
                    },
                    {
                    "type":"postback",
                    "title":"Both",
                    "payload": "both_m_bed_landlord"
                    }                           
                  ]
                  }  
                }
        }
}
  else if (received_message.text == "1mb" || received_message.text == "2mb" || received_message.text == "3mb" || received_message.text == "4mb" || received_message.text == "5mb") {
    response = {
      "text": `You sent the message: "${received_message.text}". Please me the area of your land to be rented!`
    }
  } 
  else if (received_message.text == "1br" || received_message.text == "2br" || received_message.text == "3br" || received_message.text == "4br" || received_message.text == "5br") {
    response = {
      "text": `You sent the message: "${received_message.text}". Please me the area of your land to be rented!`
    }
  }
 else if (received_message.payload === "fivethi1") {
        response = { 
                    "text": "Choose one option",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ft1",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "ft2",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "ft3",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "ft4",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "ft5",
                        }
                      ]
              }
    } 
    else if (received_message.payload === "fivethi2") {
        response = { 
                    "text": "Choose one option",
                    "quick_replies": [  // array
                        {               // object
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ft11_second_motor",  // ft1
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "ft22_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "ft33_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "ft44_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "ft55_second_motor",
                        }
                      ]
              }

    }
      else if (received_message.payload === "fivethi3") {
        response = { 
                    "text": "Choose one option",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ft01",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "ft02",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "ft03",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "ft04",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "ft05",
                        }
                      ]
              }

    } 
      else if (received_message.payload === "fivethi4") {
        response = { 
                    "text": "Choose one option",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ft10",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "ft20",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "ft30",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "ft40",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "ft50",
                        }
                      ]
              }

    } 
      else if (received_message.payload === "fivethi5") {
        response = { 
                    "text": "Choose one option",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ft111",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "ft112",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "ft113",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "ft114",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "ft115",
                        }
                      ]
              }

    }
    // pytwp1
     else if (received_message.payload === "pytwp1") {
        response = { 
                    "text": "Now, please the one name of townships to which you want to move:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "frompyin_ft1",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "frompyin_ft2",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "frompyin_ft3",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "frompyin_ft4",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "frompyin_ft5",
                        }
                      ]
              }
    } 

    else if (received_message.payload === "frompyin_ft1") {    
    let response1 = {
      "text": "You told us that you will transfer from Pyinmana Township to Ottara Thiri Township"};
    let response2 = {
      "text": "It will cost 8000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "frompyin_ft2") {    
    let response1 = {
      "text": "You told us that you will transfer from Pyinmana Township to Pobba Thiri Township"};
    let response2 = {
      "text": "It will cost 15000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "frompyin_ft3") {    
    let response1 = {
      "text": "You told us that you will transfer from Pyinmana Township to Dekkhina Thiri Township"};
    let response2 = {
      "text": "It will cost 12000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "frompyin_ft4") {    
    let response1 = {
      "text": "You told us that you will transfer from Pyinmana Township to Zaya Thiri Township"};
    let response2 = {
      "text": "It will cost 14000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "frompyin_ft5") {    
    let response1 = {
      "text": "You told us that you will transfer from Pyinmana Township to Zabu Township"};
    let response2 = {
      "text": "It will cost 12500 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }



    // from ottara to move house 
    else if (received_message.payload === "ft1") {
      response = {
                  "text": "Now, please the one name of townships to which you want to move:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "fft2",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "fft3",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "fft4",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "fft5",
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "fft6",
                        }
                      ]

      }
    }

    else if (received_message.payload === "fft2") {    
    let response1 = {
      "text": "You told us that you will transfer from Ottara Thiri Township to Pobba Thiri Township"};
    let response2 = {
      "text": "It will cost 8000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "fft3") {    
    let response1 = {
      "text": "You told us that you will transfer from Ottara Thiri Township to Dekkhina Thiri Township"};
    let response2 = {
      "text": "It will cost 15000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "fft4") {    
    let response1 = {
      "text": "You told us that you will transfer from Ottara Thiri Township to Zaya Thiri Township"};
    let response2 = {
      "text": "It will cost 12000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "fft5") {    
    let response1 = {
      "text": "You told us that you will transfer from Ottara Thiri Township to Zabu Thiri Township"};
    let response2 = {
      "text": "It will cost 14000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "fft6") {    
    let response1 = {
      "text": "You told us that you will transfer from Ottara Thiri Township to Pyinmana Township"};
    let response2 = {
      "text": "It will cost 12500 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "ft2") {
      response = {
                  "text": "Now, please the one name of townships to which you want to move:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "2nd_fft1",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "2nd_fft3",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "2nd_fft4",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "2nd_fft5",
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "2nd_fft6",
                        }
                      ]

      }
    }

     else if (received_message.payload === "2nd_fft1") {    
    let response1 = {
      "text": "You told us that you will transfer from Pobba Thiri Township to Ottara Thiri Township"};
    let response2 = {
      "text": "It will cost 8000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "2nd_fft3") {    
    let response1 = {
      "text": "You told us that you will transfer from Pobba Thiri Township to Dekkhina Thiri Township"};
    let response2 = {
      "text": "It will cost 20000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "2nd_fft4") {    
    let response1 = {
      "text": "You told us that you will transfer from Pobba Thiri Township to Zaya Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "2nd_fft5") {    
    let response1 = {
      "text": "You told us that you will transfer from Pobba Thiri Township to Zabu Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "2nd_fft6") {    
    let response1 = {
      "text": "You told us that you will transfer from Pobba Thiri Township to Pyinmana Township"};
    let response2 = {
      "text": "It will cost 11000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }


    else if (received_message.payload === "ft3") {
      response = {
                  "text": "Now, please you the one name of townships to which you want to move:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "3rd_fft1",
                        },
                        {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "3rd_fft2",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "3rd_fft4",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "3rd_fft5",
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "3rd_fft6",
                        }
                      ]

      }
    }

    else if (received_message.payload === "3rd_fft1") {    
    let response1 = {
      "text": "You told us that you will transfer from Dekkhina Thiri Township to Ottara Thiri Township"};
    let response2 = {
      "text": "It will cost 17000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "3rd_fft2") {    
    let response1 = {
      "text": "You told us that you will transfer from Dekkhina Thiri Township to Pobba Thiri Township"};
    let response2 = {
      "text": "It will cost 20000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "3rd_fft4") {    
    let response1 = {
      "text": "You told us that you will transfer from Dekkhina Thiri Township to Zaya Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "3rd_fft5") {    
    let response1 = {
      "text": "You told us that you will transfer from Dekkhina Thiri Township to Zabu Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "3rd_fft6") {    
    let response1 = {
      "text": "You told us that you will transfer from Dekkhina Thiri Township to Pyinmana Township"};
    let response2 = {
      "text": "It will cost 11000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }


      else if (received_message.payload === "ft4") {
      response = {
                  "text": "Now, please you the one name of townships to which you want to move:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "4th_fft1",
                        },
                        {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "4th_fft2",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "4th_fft3",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "4th_fft5",
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "4th_fft6",
                        }
                      ]
      }
    }

    else if (received_message.payload === "4th_fft1") {    
    let response1 = {
      "text": "You told us that you will transfer from Zaya Thiri Township to Ottara Thiri Township"};
    let response2 = {
      "text": "It will cost 17000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "4th_fft2") {    
    let response1 = {
      "text": "You told us that you will transfer from Zaya Thiri Township to Pobba Thiri Township"};
    let response2 = {
      "text": "It will cost 20000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "4th_fft3") {    
    let response1 = {
      "text": "You told us that you will transfer from Zaya Thiri Township to Dekkhina Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "4th_fft5") {    
    let response1 = {
      "text": "You told us that you will transfer from Zaya Thiri Township to Zabu Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "4th_fft6") {    
    let response1 = {
      "text": "You told us that you will transfer from Zaya Thiri Township to Pyinmana Township"};
    let response2 = {
      "text": "It will cost 11000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }


      else if (received_message.payload === "ft5") {
      response = {
                  "text": "Now, please you the one name of townships to which you want to move:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "5th_fft1",
                        },
                        {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "5th_fft2",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "5th_fft3",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "5th_fft4",
                        },
                          {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "5th_fft5",
                        }
                      ]

      }
    }

    else if (received_message.payload === "5th_fft1") {    
    let response1 = {
      "text": "You told us that you will transfer from Zabu Thiri Township to Ottara Thiri Township"};
    let response2 = {
      "text": "It will cost 17000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "5th_fft2") {    
    let response1 = {
      "text": "You told us that you will transfer from Zabu Thiri Township to Pobba Thiri Township"};
    let response2 = {
      "text": "It will cost 20000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "5th_fft3") {    
    let response1 = {
      "text": "You told us that you will transfer from Zabu Thiri Township to Dekkhina Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "5th_fft4") {    
    let response1 = {
      "text": "You told us that you will transfer from Zabu Thiri Township to Zaya Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "5th_fft5") {    
    let response1 = {
      "text": "You told us that you will transfer from Zabu Thiri Township to Pyinmana Township"};
    let response2 = {
      "text": "It will cost 11000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }
// end of from ottara to move house



 // pytwp2
     else if (received_message.payload === "pytwp2") {
        response = { 
                    "text": "Now, please the one name of townships to which you want to move:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "frompyin_py1",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "frompyin_py2",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "frompyin_py3",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "frompyin_py4",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "frompyin_py5",
                        }
                      ]
              }
    } 

    else if (received_message.payload === "frompyin_py1") {    
    let response1 = {
      "text": "You told us that you will transfer from Pyinmana Township to Ottara Thiri Township"};
    let response2 = {
      "text": "It will cost 8000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "frompyin_py2") {    
    let response1 = {
      "text": "You told us that you will transfer from Pyinmana Township to Pobba Thiri Township"};
    let response2 = {
      "text": "It will cost 15000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "frompyin_py3") {    
    let response1 = {
      "text": "You told us that you will transfer from Pyinmana Township to Dekkhina Thiri Township"};
    let response2 = {
      "text": "It will cost 12000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "frompyin_py4") {    
    let response1 = {
      "text": "You told us that you will transfer from Pyinmana Township to Zaya Thiri Township"};
    let response2 = {
      "text": "It will cost 14000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "frompyin_py5") {    
    let response1 = {
      "text": "You told us that you will transfer from Pyinmana Township to Zabu Township"};
    let response2 = {
      "text": "It will cost 12500 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }






 // from Second Second ottara to move house 
    else if (received_message.payload === "ft11_second_motor") {
      response = {
                  "text": "Now, please the one name of townships to which you want to move:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "pobba11_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "dek11_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "zaya11_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "zabu11_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "pyin11_second_motor",
                        }
                      ]

      }
    }

    else if (received_message.payload === "pobba11_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Ottara Thiri Township to Pobba Thiri Township"};
    let response2 = {
      "text": "It will cost 8000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "dek11_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Ottara Thiri Township to Dekkhina Thiri Township"};
    let response2 = {
      "text": "It will cost 15000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "zaya11_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Ottara Thiri Township to Zaya Thiri Township"};
    let response2 = {
      "text": "It will cost 12000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "zabu11_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Ottara Thiri Township to Zabu Thiri Township"};
    let response2 = {
      "text": "It will cost 14000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "pyin11_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Ottara Thiri Township to Pyinmana Township"};
    let response2 = {
      "text": "It will cost 12500 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "ft22_second_motor") {
      response = {
                  "text": "Now, please the one name of townships to which you want to move:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ott22_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "dek22_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "zaya22_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "zabu22_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "pyin22_second_motor",
                        }
                      ]

      }
    }

     else if (received_message.payload === "ott22_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Pobba Thiri Township to Ottara Thiri Township"};
    let response2 = {
      "text": "It will cost 8000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "dek22_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Pobba Thiri Township to Dekkhina Thiri Township"};
    let response2 = {
      "text": "It will cost 20000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "zaya22_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Pobba Thiri Township to Zaya Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "zabu22_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Pobba Thiri Township to Zabu Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "pyin22_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Pobba Thiri Township to Pyinmana Township"};
    let response2 = {
      "text": "It will cost 11000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }


    else if (received_message.payload === "ft33_second_motor") {
      response = {
                  "text": "Now, please you the one name of townships to which you want to move:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ott33_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "pob33_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "zaya33_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "zabu33_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "pyin33_second_motor",
                        }
                      ]

      }
    }

    else if (received_message.payload === "ott33_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Dekkhina Thiri Township to Ottara Thiri Township"};
    let response2 = {
      "text": "It will cost 17000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "pob33_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Dekkhina Thiri Township to Pobba Thiri Township"};
    let response2 = {
      "text": "It will cost 20000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "zaya33_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Dekkhina Thiri Township to Zaya Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "zabu33_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Dekkhina Thiri Township to Zabu Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "pyin33_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Dekkhina Thiri Township to Pyinmana Township"};
    let response2 = {
      "text": "It will cost 11000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }


      else if (received_message.payload === "ft44_second_motor") {
      response = {
                  "text": "Now, please you the one name of townships to which you want to move:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ott44_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "pob44_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "dek44_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "zabu44_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "pyin44_second_motor",
                        }
                      ]
      }
    }

    else if (received_message.payload === "ott44_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Zaya Thiri Township to Ottara Thiri Township"};
    let response2 = {
      "text": "It will cost 17000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "pob44_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Zaya Thiri Township to Pobba Thiri Township"};
    let response2 = {
      "text": "It will cost 20000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "dek44_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Zaya Thiri Township to Dekkhina Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "zabu44_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Zaya Thiri Township to Zabu Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "pyin44_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Zaya Thiri Township to Pyinmana Township"};
    let response2 = {
      "text": "It will cost 11000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }


      else if (received_message.payload === "ft55_second_motor") {
      response = {
                  "text": "Now, please you the one name of townships to which you want to move:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ott55_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "pob55_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "dek55_second_motor",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "zaya55_second_motor",
                        },
                          {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "pyin55_second_motor",
                        }
                      ]

      }
    }

    else if (received_message.payload === "ott55_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Zabu Thiri Township to Ottara Thiri Township"};
    let response2 = {
      "text": "It will cost 17000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "pob55_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Zabu Thiri Township to Pobba Thiri Township"};
    let response2 = {
      "text": "It will cost 20000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "dek55_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Zabu Thiri Township to Dekkhina Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats"
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "zaya55_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Zabu Thiri Township to Zaya Thiri Township"};
    let response2 = {
      "text": "It will cost 9000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }

    else if (received_message.payload === "pyin55_second_motor") {    
    let response1 = {
      "text": "You told us that you will transfer from Zabu Thiri Township to Pyinmana Township"};
    let response2 = {
      "text": "It will cost 11000 kyats."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    }
// end of from second second ottara to move house




    

else if (received_message.payload === "ottwp") {
      response = {
                  "text": "Please type 'onef' if you are looking for one floor. For double building, plz type 'double1'.For whatever, plz type 'whatever1':"

      }
    } 
  else if (received_message.text == "onef" || received_message.text == "Onef" || received_message.text == "ONEF" ) {
    response = {
      "text":'Are you finding RC or Nancat? Plz type RC1 for RC & type Nancat1 for Nancat. Or else, do you get along with whatever RC or Nancat, so type whatever2:'
    }
  }
  else if (received_message.text == "double1" || received_message.text == "Double1" || received_message.text == "DOUBLE1" || received_message.text == "double 1" || received_message.text == "Double 1" || received_message.text == "DOUBLE 1") {
    response = {
      "text":'Are you finding RC or Nancat? Plz type RC2 for RC & type Nancat2 for Nancat. Or else, do you get along with whatever RC or Nancat, so type whatever3:'
    }
  }
  else if (received_message.text == "whatever1" || received_message.text == "Whatever1" || received_message.text == "WHATEVER1" || received_message.text == "whatever 1" || received_message.text == "Whatever 1" || received_message.text == "WHATEVER 1") {
    response = {
      "text":'Are you finding RC or Nancat? Plz type RC1 for RC & type Nancat1 for Nancat. Or else, do you get along with whatever RC or Nancat, so type whatever2:'
    }
  }
    else if (received_message.text == "RC1" || received_message.text == "rc1" || received_message.text == "Rc1" || received_message.text == "RC 1" || received_message.text == "rc 1" || received_message.text == "Rc 1") {
    response = {
       "text": "How many master bed rooms do you want?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "1mb",
                          "payload": "no_of_room_1mb",
                        },
                         {
                          "content_type": "text",
                          "title": "2mb",
                          "payload": "no_of_room_2mb",
                        },
                        {
                          "content_type": "text",
                          "title": "3mb",
                          "payload": "no_of_room_3mb",
                        },
                        {
                          "content_type": "text",
                          "title": "4mb",
                          "payload": "no_of_room_4mb",
                        },
                        {
                          "content_type": "text",
                          "title": "5mb",
                          "payload": "no_of_room_5mb",
                        }
                      ]
    }
  }



/*
 else if (received_message.payload === "ld_ottwp") {    
    response = {
      "text": "You choose: Ottara. Now send me outside picture of house as an attachment!"
    }
    received_message.payload = false;
    landlordsent.attach1 = true;
  }
     else if (received_message.attachments && landlordsent.attach1 == true) {
      userEnteredldld_attach.attach1 = received_message.attachments;
    // Get the URL of the message attachment
    let attachment_url1 = userEnteredldld_attach.attach1[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url1,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes",
                "payload": "attach_yes1",
              },
              {
                "type": "postback",
                "title": "No",
                "payload": "attach_no1",
              }
            ],
          }]
        }
      }
    }
  }
*/


 else if (received_message.payload === "tselott") {
         response = {
      "text":'Please tell the type of house that you want to sell like RC or Nancat'
    }
    received_message.payload = false;
    toselhou_ott_byuser.to_sel_hou = true;
  }
 else if (received_message.text && toselhou_ott_byuser.to_sel_hou === true) {
  userEntered_Hou_tosel.to_sel_hou = received_message.text;
         response = {
      "text":'How many floors is the house?'
    }
    toselhou_ott_byuser.to_sel_hou = false;
  }



/*
else if (received_message.text == "Yes!!!") {
   
    received_message.text = false;
    contactct.numberno = true;
  }
   else if (received_message.text && contactct.numberno == true) {
    userEnteredPhonenum.numberno = received_message.text;
    response = {
      "text":"We have received your phone number. We will contact you within 24 hours. Thank you for contacting us. Have a nice day!"
    }
    contactct.numberno = false;
  } 
*/
  

  
  // Send the response message
  callSendAPI(sender_psid, response);    
}





function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  } else if (payload === 'get_started') {
    let response1 = { 
      "attachment":{

      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Hi, You are warmly welcomed. Thank you for contacting us. Have a nice day!",
         "buttons":[
                    {
                    "type":"postback",
                    "title":"Main Menu",
                    "payload": "onee"
                    },
                    {
                    "type":"postback",
                    "title":"Contact us",
                    "payload":"two2"
                    },
                    {
                    "type":"postback",
                    "title":"About us",
                    "payload":"three3"
                    }                            
                  ]  
                }
        }
   };
   let response2 = { "attachment":{

      "type":"template",
      "payload":{
        "template_type":"button",
        "text":".",
         "buttons":[
                    {
                    "type":"postback",
                    "title":"Service charges",
                    "payload": "servch"
                    },
                    {
                    "type":"postback",
                    "title":"Moving House Service",
                    "payload":"movehou"
                    }                           
                  ]  
                }
        }
   };
   callSend(sender_psid, response1).then(()=>{
  return callSend(sender_psid, response2);
  });
 

  } else if (payload === 'onee') {
     response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                      "text": "To find the properties, please choose an option below:",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "To Sell",
                          "payload": "tosel",
                        },
                        {
                          "type": "postback",
                          "title": "To Buy",
                          "payload": "tobu",
                        },
                        {
                          "type": "postback",
                          "title": "To Rent",
                          "payload": "tore",
                        }
                      ]
            }
        }
    }
  }else if (payload === 'two2') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "generic",
                    "elements": [{
                      "title": "D",
                      "subtitle": "Office Address: No-117, Shwe Li Road, Pobba Thiri Township, Nyapyitaw, Myanmar",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "Main Menu",
                          "payload": "onee",
                        },
                        {
                          "type": "postback",
                          "title": "About us",
                          "payload": "abus",
                        }
                      ],
                    }]
                  }
                }
              }
  }else if (payload === 'tore') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                      "text": "Please choose below options:",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "Landlord landlord",
                          "payload": "ldld",
                        },
                        {
                          "type": "postback",
                          "title": "Tenant",
                          "payload": "tenan",
                        }
                      ]
                  }
                }
              }
  }else if (payload === 'ldld') {
    let response1 = { "text": "You have chose to rent out house as a Landlord." };
    let response2 = { "attachment":{

      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"In what townships is your house located? Please choose:",
         "buttons":[
                    {
                    "type":"postback",
                    "title":" In Five Thiri Twp",
                    "payload": "ldld5"
                    },
                    {
                    "type":"postback",
                    "title":"Pyinmana Twp",
                    "payload":"ldld_pyin"
                    }                            
                  ]  
                }
        }
   };
   callSend(sender_psid, response1).then(()=>{
  return callSend(sender_psid, response2);
  });
  }
  else if (payload === 'ldld5') {
         response = {
                  "text": "Please choose the one name of townships in which you want to rent a house:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ld_ottwp",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "ld_potwp",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "ld_dektwp",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "ld_zaytwp",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "ld_zabtwp",
                        }
                      ]

      }
  }
  else if (payload === 'tenan') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                      "text": "Please choose the below options:",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "House",
                          "payload": "tenanhou",
                        },
                         {
                          "type": "postback",
                          "title": "Land",
                          "payload": "tenanlan",
                        }
                      ]
                    
                  }
                }
              }
  }
  else if (payload === 'tenanhou') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                      "text": "Please choose the place in which you want to tenant house",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "In Five Thri Township",
                          "payload": "tenan5thi",
                        },
                         {
                          "type": "postback",
                          "title": "Pyinmana Township",
                          "payload": "tenanpyin",
                        }
                      ]
                    
                  }
                }
              }
  }
   else if (payload === 'tenan5thi') {
         response = {
                  "text": "Please choose the township in which you want to tenant house:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "tenanott",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "tenanpob",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "tenandek",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "tenanzay",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "tenanzabu",
                        }
                      ]

      }
  }
  else if (payload === 'tenanlan') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                      "text": "Please choose the place in which you want to tenant land:",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "In Five Thri Township",
                          "payload": "te5lan",
                        },
                         {
                          "type": "postback",
                          "title": "Pyinmana Township",
                          "payload": "tepyinlan",
                        }
                      ]
                    
                  }
                }
              }
  }
   else if (payload === 'te5lan') {
         response = {
                  "text": "Please choose the township in which you want to tenant land:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "teottl",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "tepobl",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "tedekl",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "tezayl",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "tezal",
                        }
                      ]

      }
  }
  else if (payload === 'tobu') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                     "text": "Please choose below options to buy:",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "House",
                          "payload": "hou",
                        },
                        {
                          "type": "postback",
                          "title": "Land",
                          "payload": "lann",
                        }
                      ]
                    
                  }
                }
              }
  }else if (payload === 'hou') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                      "text": "Please choose the place in which you want to buy house",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "In Five Thri Township",
                          "payload": "fethri",
                        },
                         {
                          "type": "postback",
                          "title": "Pyinmana Township",
                          "payload": "pyintwp",
                        }
                      ]
                    
                  }
                }
              }
  } else if (payload === 'fethri') {
         response = {
                  "text": "Please choose the one name of townships in which you want to buy a house:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ottwp",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "potwp",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "dektwp",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "zaytwp",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "zabtwp",
                        }
                      ]

      }
  }

  else if (payload === 'pyintwp') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                    "text": "Please choose the area of house in which you want to buy",
                    "buttons": [
                        {
                          "type": "postback",
                          "title": "40-60 ft",
                          "payload": "46ft",
                        },
                         {
                          "type": "postback",
                          "title": "60-80 ft",
                          "payload": "68ft",
                        },
                        {
                          "type": "postback",
                          "title": "other",
                          "payload": "othft",
                        }
                      ]
                  }
                }
              }
  } 
  else if (payload === '46ft') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                    "text": "Please choose the amount that you are avaliable to buy a house:",
                    "buttons": [
                        {
                          "type": "postback",
                          "title": "under 500",
                          "payload": "un500",
                        },
                         {
                          "type": "postback",
                          "title": "from 500 to 1000",
                          "payload": "f5t1",
                        },
                        {
                          "type": "postback",
                          "title": "above 1000",
                          "payload": "ab10",
                        }
                      ]
                  }
                }
              }
  } 
  else if (payload === 'othft') {
    response = { "text": "Please write the area of  property that you want to buy!" }
  } 

  else if (payload === 'ab10') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Double building",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/84321696_125821322297001_40006344756953088_n.jpg?_nc_cat=102&_nc_ohc=99juuJPWRvMAX-STauO&_nc_ht=scontent.fmdl2-2.fna&oh=e51406977910d13c914bd98264253832&oe=5EBBA528",
            "subtitle":"350 lkh, 4 mb",
            "default_action": {
              "type": "web_url",
              "url": "https://www.duwonduwon.com",
              "webview_height_ratio": "tall",
             },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.duwonduwon.com",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"inter"
              }              
                   ]      
          }
                ]
      }
    }
  }
  }

else if (payload === 'inter') {
  response ={
    "text" : "Please leave your contact number.", 
     "quick_replies":[
      {
        "content_type":"text",
        "title":"Yes!!!",
        "payload":"Yes!!!"
        
      },
      {
        "content_type":"text",
        "title":"No!!!",
        "payload":"No!!!"
        
      }
    ]

  }
}
else if (payload === 'innnter') {
  response ={
    "text" : "Please leave your contact number.", 
     "quick_replies":[
      {
        "content_type":"text",
        "title":"Sata",
        "payload":"Sata"
        
      }
    ]

  }
}
  
  else if (payload === 'lann') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                    "text": "Please choose the place in which you want to buy land:",
                    "buttons": [
                        {
                          "type": "postback",
                          "title": "Within 5 Thri Township",
                          "payload": "5fthri",
                        },
                         {
                          "type": "postback",
                          "title": "Pyinmana Township",
                          "payload": "pyi5",
                        }
                              ]
                            }
                              }
                }
  }
      else if (payload === "5fthri") {
      response = {
                  "text": "Please choose the township in which you want to buy land:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "otthi",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "pobthi",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "dekthi",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "zayathi",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "zabuthi",
                        }
                      ]

      }
    }
  else if (payload === 'pyi5') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                    "text": "Please choose the area of land that you want to buy:",
                    "buttons": [
                        {
                          "type": "postback",
                          "title": "40-60 ft",
                          "payload": "46ft",
                        },
                         {
                          "type": "postback",
                          "title": "60-80 ft",
                          "payload": "68ft",
                        },
                        {
                          "type": "postback",
                          "title": "other",
                          "payload": "othft",
                        }
                      ]
                  }
                }
              }
  } 
    else if (payload === 'servch') {
    let response1  = { "text": "Please chose one of the service charges that you want to know." };
    let response2 = { "attachment":{

      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"For",
         "buttons":[
                    {
                    "type":"postback",
                    "title":"Sell",
                    "payload": "se1"
                    },
                    {
                    "type":"postback",
                    "title":"Buy",
                    "payload":"bu2"
                    },
                    {
                    "type":"postback",
                    "title":"Rent",
                    "payload":"ren3"
                    }                            
                  ]  
                }
        }
   };
   callSend(sender_psid, response1).then(()=>{
  return callSend(sender_psid, response2);
  });
 } else if (payload === 'se1') {
    response  = { "text": "3% service charge for the property that has value under 1000 lakhs!!   And 2% service charge for the property that has value 1000 lakhs and above 1000 lakhs!!" };
 } else if (payload === 'ren3') {
    response  = { "text": "Take rent of a month from both sides whether the period is rented or not." };
 } else if (payload === 'tosel') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                      "text": "Please choose one of the options to tell what you want to sell:",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "House",
                          "payload": "hoou2",
                        },
                         {
                          "type": "postback",
                          "title": "Land",
                          "payload": "laan2",
                        }
                      ]
                  }
                }
              }
} else if (payload === 'hoou2') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                      "text": "Please choose the place in which your property is located:",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "In Five Thri Township",
                          "payload": "toselhou5",
                        },
                         {
                          "type": "postback",
                          "title": "Pyinmana Township",
                          "payload": "toselhoupyin",
                        }
                      ]
                  }
                }
              }
  }
  else if (payload === 'toselhou5') {
        response = {
                  "text": "Please choose the township in which you want to sell house:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "tselott",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "tselpob",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "tseldek",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "tselzaya",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "tselzabu",
                        }
                      ]
      }
  }


   else if (payload === 'laan2') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                      "text": "Please choose the place in which your property is located:",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "In Five Thri Township",
                          "payload": "tosel5lan",
                        },
                         {
                          "type": "postback",
                          "title": "Pyinmana Township",
                          "payload": "toselpyinlan",
                        }
                      ]
                  }
                }
              }
  }
  else if (payload === 'tosel5lan') {
         response = {
                  "text": "Please choose the township in which you want to sell land:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "tselottlan",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "tselpoblan",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "tseldeklan",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "tselzayalan",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "tselzabulan",
                        }
                      ]

      }
  }

  
  //start
  
  else if (payload === 'movehou') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
           {
            "title":"Hijet",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/87795714_131104691768664_5331501195544494080_n.jpg?_nc_cat=105&_nc_sid=a61e81&_nc_ohc=wzIfTKWOloQAX9AfZN8&_nc_ht=scontent.fmdl2-2.fna&oh=4ab72315c30f728bfdc83d57dd274725&oe=5EF9BF44",
            "subtitle":"Four wheels",
            "default_action": {
              "type": "web_url",
              "url": "https://www.everycar.jp/detail.php?make=honda&model=fit-shuttle&id=725721",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/ajax/sharer/?s=2&appid=2305272732&id=131104738435326&p[0]=131104738435326&sharer_type=all_modes&av=105772414301892",
                "title":"More Information"
              },{
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"hijet11"
              }              
            ]      
          },
          {
            "title":"Motorbike",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/87687473_131104698435330_2366752654857601024_n.jpg?_nc_cat=106&_nc_sid=a61e81&_nc_ohc=PohMBJmw7NsAX8QK734&_nc_ht=scontent.fmdl2-2.fna&oh=73aba7740a2aa1439873b30243ba1ea1&oe=5EC277A3",
            "subtitle":"Three wheels",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/ajax/sharer/?s=2&appid=2305272732&id=131104738435326&p[0]=131104738435326&sharer_type=all_modes&av=105772414301892",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/ajax/sharer/?s=2&appid=2305272732&id=131104738435326&p[0]=131104738435326&sharer_type=all_modes&av=105772414301892",
                "title":"More Information"
              },{
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"motor11"
              }              
            ]      
          },
          {
            "title":"Light Truck",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/87693358_131104725101994_936300748814155776_n.jpg?_nc_cat=108&_nc_sid=a61e81&_nc_ohc=74rZDH6-GEoAX9XVmVg&_nc_ht=scontent.fmdl2-2.fna&oh=32c6396df6233d929915858c6c4eb5d1&oe=5EEEE1B0",
            "subtitle":"Four wheels",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/ajax/sharer/?s=2&appid=2305272732&id=131104738435326&p[0]=131104738435326&sharer_type=all_modes&av=105772414301892",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/ajax/sharer/?s=2&appid=2305272732&id=131104738435326&p[0]=131104738435326&sharer_type=all_modes&av=105772414301892",
                "title":"More Information"
              },{
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"ltruck11"
              }              
            ]      
          },
           {
            "title":"Truck Car",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/87529724_131104741768659_4560297288781529088_n.jpg?_nc_cat=103&_nc_sid=a61e81&_nc_ohc=hUMhbxC5AVsAX-xiklU&_nc_ht=scontent.fmdl2-1.fna&oh=fc041fee94b9bbd1b4c9973816546bce&oe=5EBC527B",
            "subtitle":"Six wheels",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/ajax/sharer/?s=2&appid=2305272732&id=131104738435326&p[0]=131104738435326&sharer_type=all_modes&av=105772414301892",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/ajax/sharer/?s=2&appid=2305272732&id=131104738435326&p[0]=131104738435326&sharer_type=all_modes&av=105772414301892",
                "title":"More Information"
              },{
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tcar11"
              }              
            ]      
          },
           {
            "title":"Truck Car",
            "image_url":"https://scontent.fmdl4-2.fna.fbcdn.net/v/t1.0-9/84663096_102520038003268_3565139283100565504_n.jpg?_nc_cat=106&_nc_eui2=AeGKcsR5tyDJwoS8vvkGl6rn8_LcH0OkYbNSPZ0GMAT40Ynv3jTF8xeY2urRUl_PczC2v-URviXgPomifWJIMkeW5JsDPxCm8RjnF1makXhZpA&_nc_ohc=0tdY9XY8r7QAX9hiq36&_nc_pt=1&_nc_ht=scontent.fmdl4-2.fna&oh=e0f5b850f1c4824ca4ced1f3ae98453d&oe=5EC3C5A6",
            "subtitle":"Ten wheels",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/ajax/sharer/?s=2&appid=2305272732&id=131104738435326&p[0]=131104738435326&sharer_type=all_modes&av=105772414301892",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/ajax/sharer/?s=2&appid=2305272732&id=131104738435326&p[0]=131104738435326&sharer_type=all_modes&av=105772414301892",
                "title":"More Information"
              },{
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tcar22"
              }              
            ]      
          }
        ]
      }
    }
  }
}

  //end


  else if (payload === 'hijet11') {
              response = { 
                    "text": "Please choose the name of township from which you want to move:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Pyinmana Twp",
                          "payload": "pytwp1",
                        },
                         {
                          "content_type": "text",
                          "title": "Five Thiri Twp",
                          "payload": "fivethi1",
                        }
                      ]
              }
    }
    else if (payload === 'motor11') {
              response = { 
                    "text": "Please choose the name of township from which you want to move:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Pyinmana Twp",
                          "payload": "pytwp2",
                        },
                         {
                          "content_type": "text",
                          "title": "Five Thiri Twp",
                          "payload": "fivethi2",
                        }
                      ]
              }
    }
    else if (payload === 'ltruck11') {
              response = { 
                    "text": "Please choose the name of township from which you want to move:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Pyinmana Twp",
                          "payload": "pytwp3",
                        },
                         {
                          "content_type": "text",
                          "title": "Five Thiri Twp",
                          "payload": "fivethi3",
                        }
                      ]
              }
    }
     else if (payload === 'tcar11') {
              response = { 
                    "text": "Please choose the name of township from which you want to move:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Pyinmana Twp",
                          "payload": "pytwp4",
                        },
                         {
                          "content_type": "text",
                          "title": "Five Thiri Twp",
                          "payload": "fivethi4",
                        }
                      ]
              }
    } 
  else if (payload === 'tcar22') {
              response = { 
                    "text": "Please choose the name of township from which you want to move:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Pyinmana Twp",
                          "payload": "pytwp5",
                        },
                         {
                          "content_type": "text",
                          "title": "Five Thiri Twp",
                          "payload": "fivethi5",
                        }
                      ]
              }
    }
  else if (payload === "attach_yes1") {    
    response = {
      "text": "Do you want to send more picture!!",
      "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Yes",
                          "payload": "more_attach_yes",
                        },
                        {
                          "content_type": "text",
                          "title": "No, it is enough",
                          "payload": "more_attach_enough",
                        }
                      ]
    }
  }

    else if (payload === "attach_no1") {    
    response = {
      "text": "OK, send me again!"
    }
  }

 else if (payload === "only_master_bed_tenant") {
    let response1 = {
      "text":`How many master bed rooms do you have?`
    };
    let response2 = {
      "text":`Please write number of rooms with "mb" word. Like 1mb, 2mb etc. Thank you very much!`
    };
   callSend(sender_psid, response1).then(()=>{
  return callSend(sender_psid, response2);
  });
  } 

else if (payload === "only_bed_tenant") {
    let response1 = {
      "text":`How many bed rooms do you have?`
    };
    let response2 = {
      "text":`Please write number of rooms with "br" word. Like 1br, 2br etc. Thank you very much!`
    };
   callSend(sender_psid, response1).then(()=>{
  return callSend(sender_psid, response2);
  });
  }   


  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}


function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}


function callSendAPINew(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}



async function callSend(sender_psid, response){
  let send = await callSendAPINew(sender_psid, response);
  return 1;
}  


function setupGetStartedButton(res){
        var messageData = {
                "get_started":{"payload":"get_started"}                
        };
        // Start the request
        request({
            url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            form: messageData
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                res.send(body);

            } else { 
                // TODO: Handle errors
                res.send(body);
            }
        });
    } 



function setupPersistentMenu(res){
        var messageData = { 
            "persistent_menu":[
                {
                  "locale":"default",
                  "composer_input_disabled":false,
                  "call_to_actions":[
                      {
                        "title":"Info",
                        "type":"nested",
                        "call_to_actions":[
                            {
                              "title":"About Us",
                              "type":"postback",
                              "payload":"three3"
                            },
                            {
                              "title":"Contact Us",
                              "type":"postback",
                              "payload":"two2"
                            }
                        ]
                      },
                        {
                        "title":"Main Menu ",
                        "type":"postback",
                        "payload":"onee"
                    },
                       {
                        "title":"Moving House Service ",
                        "type":"postback",
                        "payload":"movehou"
                    },
                    {
                        "title":"Something",
                        "type":"postback",
                        "payload":"some2"
                    }
                ]
            },
            {
              "locale":"zh_CN",
              "composer_input_disabled":false
            }
          ]          
        };
        // Start the request
        request({
            url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            form: messageData
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                res.send(body);

            } else { 
                // TODO: Handle errors
                res.send(body);
            }
        });
    } 



function removePersistentMenu(res){
        var messageData = {
                "fields": [
                   "persistent_menu" ,
                   "get_started"                 
                ]               
        };
        // Start the request
        request({
            url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            form: messageData
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                res.send(body);

            } else { 
                // TODO: Handle errors
                res.send(body);
            }
        });
    } 


    function webviewTest(sender_psid){
  let response;
  response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Click to open webview?",                       
            "buttons": [              
              {
                "type": "web_url",
                "title": "webview",
                "url":"https://fbstarterbot.herokuapp.com/webview/"+sender_psid,
                 "webview_height_ratio": "full",
                "messenger_extensions": true,          
              },
              
            ],
          }]
        }
      }
    }
  callSendAPI(sender_psid, response);
}
