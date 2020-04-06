
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




// for landlord (house)
let landlord_sent = {
  fully_address:false,
  typeOf_hou_ldld:false,
  quan_floor:false,
  typeOf_room_ldld:false,
  typeOf_both_ldld:false,
  area_landlord:false,
  attach1:false,
}
let userEntered_landlord = {};


// for landlord (land)
let ldld_land_sent = {
  address_land:false,
  typeOf_land:false,
  area_land:false,
  attach_land_ldld:false,
  estimated_price_ldld:false,
  ldld_ph_num:false,
}
let userEntered_ldld_land = {};





// for customers who want to sell their house
let toselhou_byuser = {
  to_sel_hou:false,
  howMuchRoom_hou:false,
  area_hou_inOtt:false,
  photos_ott:false,
  attach_Hou:false,
  ph_num:false,
  forSell_both_room:false,
  estimated_price_forSell:false,
}
let userEntered_Hou_tosel = {};


let tosel_land_byuser = {
  land_type_tosell:false,
  land_name_tosell:false,
  attach_land_tosell:false,
  estimated_price_land:false,
  address_land_tosell:false,
  ph_num_land:false,

}
let userEntered_land_tosel = {};




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
  }

  // five thiri (house) in landlord
  else if (received_message.payload === "ld_ottwp" || received_message.payload === "ld_potwp" || received_message.payload === "ld_dektwp" || received_message.payload === "ld_zaytwp" || received_message.payload === "ld_zaytwp") {    
    response = {
      "text": "Please tell me fully address of your house to be rented out. "
    }
    received_message.payload = false;
//  landlord_sent.attach1 = true;
    landlord_sent.fully_address = true;
  }
  else if (received_message.text && landlord_sent.fully_address === true) {
    userEntered_landlord.fully_address = received_message.text;
          response = {
                      "text":'Please tell the type of house that you want to rent out. I mean like RC or Nancat. Please tell me.'
          }
          landlord_sent.fully_address = false;
          landlord_sent.typeOf_hou_ldld = true;
  }
  else if (received_message.text && landlord_sent.typeOf_hou_ldld === true) {
    userEntered_landlord.typeOf_hou_ldld = received_message.text;
          response = {
                      "text":'How many floors is the house?'   
          }
          landlord_sent.typeOf_hou_ldld = false;
          landlord_sent.quan_floor = true;
  }
  else if (received_message.text && landlord_sent.quan_floor === true) {
    userEntered_landlord.quan_floor = received_message.text;
          response = {
                    "text": "Do you have what types of room? please tell me.",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Master Bed",
                          "payload": "hou_ldld_tell_mb",
                        },
                       
                        {
                          "content_type": "text",
                          "title": "Bed room",
                          "payload": "hou_ldld_br",
                        },
                        {
                          "content_type": "text",
                          "title": "Both",
                          "payload": "hou_ldld_both",
                        }
                      ]
          }
          landlord_sent.quan_floor = false;
     //     landlord_sent.typeOf_room_ldld = true;
  }
  
/*
  else if (received_message.text && landlord_sent.typeOf_room_ldld === true) {
    userEntered_landlord.typeOf_room_ldld = received_message.text;
          response = {
       "text": "Do you have what types of room? please tell me.",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Master Bed",
                          "payload": "hou_ldld_tell_mb",
                        },
                       
                        {
                          "content_type": "text",
                          "title": "Bed room",
                          "payload": "hou_ldld_br",
                        },
                        {
                          "content_type": "text",
                          "title": "Both",
                          "payload": "hou_ldld_both",
                        }
                      ]
    }
          landlord_sent.typeOf_room_ldld = false;

  }   
*/

  // for master bed room in landlord
 else if (received_message.payload === "hou_ldld_tell_mb") {    
    response = {
      "text": "How many master bed rooms in your house?"
    }
    received_message.payload = false;
//    toselhou_byuser.area_hou_inOtt = true;
  }

  // for bed room in landlord
   else if (received_message.payload === "hou_ldld_br") {    
    response = {
      "text": "How many bed rooms in your house?"
    }
    received_message.payload = false;
//    toselhou_byuser.area_hou_inOtt = true;
  }


  // for both master bed room and bed room in landlord
 else if (received_message.payload === "hou_ldld_both") {
   response  = { "text": "How many master bed rooms in your house?" 
  }
  received_message.payload = false;
  landlord_sent.typeOf_both_ldld = true;
}
 else if (received_message.text && landlord_sent.typeOf_both_ldld === true) {  
  userEntered_landlord.typeOf_both_ldld = received_message.text; 
    response = {
      "text": "How many bed rooms in your house?"
    }
    landlord_sent.typeOf_both_ldld = false;
//    toselhou_byuser.area_hou_inOtt = true;
  } 





// for land in landlordr
 else if (received_message.payload === "ld_ottwp_land" || received_message.payload === "ld_potwp_land" || received_message.payload === "ld_dektwp_land" || received_message.payload === "ld_zaytwp_land" || received_message.payload === "ld_zabtwp_land") {
         response = {
      "text":'Please tell me fully address of your land to be rented out.'
    }
    received_message.payload = false;
    ldld_land_sent.address_land = true;
  }
 else if (received_message.text && ldld_land_sent.address_land === true) {
  userEntered_ldld_land.address_land = received_message.text;
         response = {
      "text":'Please tell the type of land that you want to rent out.'
    }
    ldld_land_sent.address_land = false;
    ldld_land_sent.typeOf_land = true;
  }
  else if (received_message.text &&  ldld_land_sent.typeOf_land === true) {
   userEntered_ldld_land.typeOf_land = received_message.text;
         response = {
                      "text":'Please tell me the area of land that you want to rent out.'
    }
    ldld_land_sent.typeOf_land = false;
    ldld_land_sent.area_land = true;
  }
  else if (received_message.text &&  ldld_land_sent.area_land === true) {
    userEntered_ldld_land.area_land = received_message.text;
    response = {
       "text": "Could you send me some photos of your land?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "I will send now.",
                          "payload": "send_land_ph", 
                        },
                        {
                          "content_type": "text",
                          "title": "Later",
                          "payload": "later_ldld",
                        }
                      ]
    }
    ldld_land_sent.area_land = false;
  }


   else if (received_message.payload === "send_land_ph") { 
    response = {
      "text": "OK, Send me."
    }
     received_message.payload = false;
     ldld_land_sent.attach_land_ldld = true;
  }
  else if (received_message.attachments && ldld_land_sent.attach_land_ldld == true) {
      userEntered_ldld_land.attach_land_ldld = received_message.attachments; 
    // Get the URL of the message attachment
    let attachment_url_phph = userEntered_ldld_land.attach_land_ldld[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "I received your photos. Do you want to send more?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url_phph,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes",
                "payload": "attach_yes_ldld_land",
              },
              {
                "type": "postback",
                "title": "No, it is enough",
                "payload": "attach_no_ldld_land",
              }
            ],
          }]
        }
      }
    }
    ldld_land_sent.attach_land_ldld = false;
  }



  else if (received_message.text && ldld_land_sent.estimated_price_ldld == true) {
    userEntered_ldld_land.estimated_price_land = received_message.text;
    response = {
      "text":"Please leave me your phone number and I will contact you later."
    }
    ldld_land_sent.estimated_price_ldld = false;
    ldld_land_sent.ldld_ph_num = true;
  } 
  else if (received_message.text && ldld_land_sent.ldld_ph_num == true) {
    userEntered_ldld_land.ldld_ph_num = received_message.text;
    response = {
      "text":"Thanks for contacting us. Have a nice day!"
    }
    ldld_land_sent.ldld_ph_num = false;
  } 
   

/*****************************************************************/
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



/*********************************************************************************/

    
// to buy house in oattra
else if (received_message.payload === "ottwp") {
      response = {
                    "text":'Are you finding RC or Nancat?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "Other Type",
                          "payload": "nancat_ott",
                        }
                      ]

      }
  } 
  // for RC to buy house in oattra
  else if (received_message.payload === "rc_ott" ) {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "otherf_ott",
                        }
                      ]

      }
  }
 
      // one floor(RC) in oattra for area ( number of master bed room)
  else if (received_message.payload === "onef_ott") {
    response = {
                  "text": "Please choose the number of Mbr included:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 3",
                          "payload": "below3_onef_rc_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "3 and above",
                          "payload": "above3_onef_rc_ott",
                        }
                      ]
      }
  }
    // below 3 master bed one floor(RC) in oattra for area
  else if (received_message.payload === "below3_onef_rc_ott") {
    response = {
                  "text": "Do you want how much wide area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "80_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "100_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "150*150",
                          "payload": "150_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "whatever_in_ott",
                        }
                      ]
      }
  }

  // below 3 master bed one floor(RC) 100*100 in oattra for area
    else if (received_message.payload === '100_in_ott') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy house:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "below 2500",
                          "payload": "below25in100ott_inamount",
                        },
                        {
                          "content_type": "text",
                          "title": "above 2500 ",
                          "payload": "above250inab100ott_inamount",
                        }                      
                        ]
      }
  }

  // to buy Ottara, RC, one floor, Master bed, below 3, 100*100, below 2500
    else if (received_message.payload === 'below25in100ott_inamount') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 2000 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91384194_147284593484007_750540617238446080_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_ohc=tA2_J9-tGzMAX9KHy5a&_nc_ht=scontent.fmdl2-2.fna&oh=cdbdf29491d5b305d830d218345ae731&oe=5EAE5EDA",
            "subtitle":"2 MB, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
          {
            "title":"RC, 1600 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91404749_147290403483426_6641858286914109440_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_ohc=jLS6kreCqwMAX8fcYHg&_nc_ht=scontent.fmdl2-1.fna&oh=095c55f41bad95133ad3041cf5839b8b&oe=5EAD9BE3",
            "subtitle":"1MB, 3BD, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
           {
            "title":"RC, 1550 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91919114_147317480147385_4454999370881826816_n.jpg?_nc_cat=105&_nc_sid=110474&_nc_eui2=AeEGImDPuTHhTYsKjmn4ppol6Rp7BH2OzvzpGnsEfY7O_J0MxiuGK7v2BFTXqU8aSDEUK3r0EphYpF8SXHiI1L0S&_nc_ohc=EHw2O4hmNl4AX_vdOcY&_nc_ht=scontent.fmdl2-2.fna&oh=18a31bcf609b72aa74f6c50aad0ee9e1&oe=5EAD7A46",
            "subtitle":"2MB, 1BD, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
           {
            "title":"RC, 1950 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91265432_147319416813858_2383293673426124800_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeFcYq2-auP4MG_KyriFjrxUX10DOO9aAr9fXQM471oCvyW-SJghM1_9bfQPzglrTM5NIuO3Upbq1mC7BvhHrA7g&_nc_ohc=gOXJwBKHcMQAX8-TGC6&_nc_ht=scontent.fmdl2-1.fna&oh=b59b05e3cfb79119879136b7a787fafe&oe=5EADF7D4",
            "subtitle":"1MB, 2BD, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}






  /**************/
    // above 3 master bed one floor(RC) in oattra for area
  else if (received_message.payload === "above3_onef_rc_ott") {
    response = {
                  "text": "Do you want how much wide area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "mb80ott_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "mb100ott_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "150*150",
                          "payload": "mb150ott_in_ott",
                        }
                      ]
      }
  }
  // above 3 master bed one floor(RC) 150*150 in oattra for area
    else if (received_message.payload === 'mb150ott_in_ott') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy house:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "below 3500",
                          "payload": "below35in150ott_eamount",
                        },
                        {
                          "content_type": "text",
                          "title": "below 5000",
                          "payload": "below150inab5000ott_eamount",
                        }                      
                        ]
      }
  }
/*****************/


// to buy Ottara, RC, one floor, Master bed, 3 and above, 150*150, below 5000
    else if (received_message.payload === 'below150inab5000ott_eamount') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 3990 lakhs, 150*150 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91833243_147277623484704_3080627226484408320_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_ohc=W5PYefA9-YkAX9eg2-T&_nc_ht=scontent.fmdl2-2.fna&oh=a09a09a42fad4069c440b234cbb21b02&oe=5EAD6D39",
            "subtitle":"Mbr (3), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
          {
            "title":"RC, 3900 lakhs, 150*150 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92114624_147286746817125_7689532266472538112_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_ohc=NOsMs9pzWl4AX8iH-35&_nc_ht=scontent.fmdl2-2.fna&oh=c6de69d38a4e7a2640a9537f872d72ef&oe=5EAE5F45",
            "subtitle":"Mbr (3), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
          {
            "title":"RC, 3500 lakhs, 150*150 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91357395_147511736794626_7858189748081262592_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeGnZTST2DP5cIBJv_OXtnTpa9rDcWeaioNr2sNxZ5qKg93jo0cfXrAYsxHqOk394dt6VBW_o3TjHkBX8GiihwMp&_nc_ohc=cyy4XZ2iYO0AX_TNXh2&_nc_ht=scontent.fmdl2-2.fna&oh=1d91a559ea372cdfffd92cd8d68e5244&oe=5EAED720",
            "subtitle":"Mbr (3), Aircon (6), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}


/****************************/
/*
 // one floor(RC) only bed rooms special in oattra for area
  else if (received_message.payload === "onef_bed_ott") {
    response = {
                  "text": "Please choose the house in which the number of bed room has",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 3",
                          "payload": "bed3below_onef_rc_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "3 and above",
                          "payload": "bed3above_onef_rc_ott",
                        },
                       
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "whtever_onef_rc_onlybed_ott",
                        }
                      ]
      }
  }
    // below 3 bed one floor(RC) in oattra for area
  else if (received_message.payload === "bed3below_onef_rc_ott") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "onlybed80_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "onlybed100_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "150*150",
                          "payload": "onlybed150_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "onlybed_whatever_ott",
                        }
                      ]
      }
  }
    // above 3 bed one floor(RC) in oattra for area
  else if (received_message.payload === "bed3above_onef_rc_ott") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "bedroom88_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "bedroom11_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "150*150",
                          "payload": "bedroom150_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "bedroom_wharea_in_ott",
                        }
                      ]
      }
  }
// above whatever bed one floor(RC) in oattra for area
  else if (received_message.payload === "whtever_onef_rc_onlybed_ott") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "wht8_bedroom_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "wht100_bedroom_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "150*150",
                          "payload": "wht150_bedroom_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "whtwht_bedroom_in_ott",
                        }
                      ]
      }
  }
*/


/**************************/

    // two floor(RC) in oattra for area (number of master bed room)
  else if (received_message.payload === "twof_ott") {
    response = {
                  "text": "Please choose the number of Mbr included:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 3",
                          "payload": "below3_twoof_rc_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "3 and above",
                          "payload": "above3_twoof_rc_ott",
                        }
                      ]
      }
  }
    // two floor(RC) in oattra for below 3 master bed room
  else if (received_message.payload === "below3_twoof_rc_ott") {
    response = {
                  "text": "Do you want how much wide area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "tf_80_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "tf_100_in_ott",
                        }
                      ]
      }
  }


  // above 3 master bed two floor(RC) 100*100 in oattra for area
    else if (received_message.payload === 'tf_100_in_ott') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy house:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "below 2500",
                          "payload": "below25in100ott_amount",
                        },
                        {
                          "content_type": "text",
                          "title": "below 4000",
                          "payload": "below100inab4400ott_amount",
                        }                      
                        ]
      }
  }
/*****************/


// to buy Ottara, RC, two floor, Master bed, below 3, 100*100, below 5000
    else if (received_message.payload === 'below25in100ott_amount') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1500 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91637408_147281323484334_8201076709810765824_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_ohc=cgGC3-SZELMAX8N3TMe&_nc_ht=scontent.fmdl2-1.fna&oh=47e015063744af4cf9c1094d26b674dc&oe=5EAB6EC1",
            "subtitle":"2 floor,2 MB, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}


/****************************/




 
  // other floor execpt one and two floor in oattra.
  else if (received_message.payload === "otherf_ott") {
    response = {
                  "text": "There are not other floor had in any property avaliable to sell in Ottara."
      }
  }


  // for RC to buy house (nancat) in oattra
  else if (received_message.payload === "nancat_ott") {
    response = {
                    "text": "There are not any other type property avaliable to sell in Oattra."
/*                  "text": "Please choose you want to buy the house in which",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_nan_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "fourthf_nan_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "whateverf_nan_ott",
                        }
                      ]     */

      }
  }





/***************************************/
// to buy house in pobba for types of house
else if (received_message.payload === "potwp") {
      response = {
                    "text":'Are you finding RC or other type?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "Other Type",
                          "payload": "nancat_pobb",
                        }
                      ]

      }
  }
  // to buy house in pobba for floor 
  else if (received_message.payload === "rc_pobb") {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "thirdf_pobb",
                        }
                      ]

      }
  }
  /*
  // to buy house in pobba for types of room
  else if (received_message.payload === "onef_pobb") {
    response = {
                  "text": "Do you want what types of room?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "MB",
                          "payload": "onef_mb_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "BD",
                          "payload": "onef_bed_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "both",
                          "payload": "both_tybed_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "whatever_ty_pobb",
                        }
                      ]
      }
  }
  */

  /******************/

// to buy house in pobba for numbers of master bed room
  else if (received_message.payload === "onef_pobb") {
    response = {
                  "text": "Please choose the number of Mbr included:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 3",
                          "payload": "onef_b3_mb_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "3 and above",
                          "payload": "onef_above_pobb",
                        }
                      ]
      }
  }
  // to buy house in pobba for area (below 3 master bed room)
  else if (received_message.payload === "onef_b3_mb_pobb") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "a46_in_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "a68_in_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "a88in_in_pobb",
                        }
                      ]
      }
  }
   // 40*60 to buy house  in Pobba MB
    else if (received_message.payload === 'a46_in_pobb') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy land:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 500",
                          "payload": "below3_eamount",
                        },
                        {
                          "content_type": "text",
                          "title": "below 1000",
                          "payload": "belowpobb6_eamount",
                        },
                        {
                          "content_type": "text",
                          "title": "above 1000",
                          "payload": "abovepobb1000_eamount",
                        }                      ]
      }
  }
  // 60*80 to buy house  in Pobba 
   // to buy house in pobba for area (below 3 master bed room)
    else if (received_message.payload === 'a68_in_pobb') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy house:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 500",
                          "payload": "below500pobb_eamount",
                        },
                        {
                          "content_type": "text",
                          "title": "below 1000",
                          "payload": "below100pobb_eamount",
                        },
                        {
                          "content_type": "text",
                          "title": "above 1000",
                          "payload": "above1000pobb_eamount",
                        }                      
                        ]
      }
  }
    else if (received_message.payload === 'a88in_in_pobb') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy house:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "below 1000",
                          "payload": "below80in80pobb_eamount",
                        },
                        {
                          "content_type": "text",
                          "title": "above 1000",
                          "payload": "above80inab11pobb_eamount",
                        }                      
                        ]
      }
  }


  // to buy pobba, RC, one floor, master bed,  below 3mb , 40*60, below 500lakh
 else if (received_message.payload === 'below3_eamount') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 450 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91675776_147131590165974_160064454640271360_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_ohc=mYztapSdCD8AX9xaZ4v&_nc_ht=scontent.fmdl2-1.fna&oh=e4cdadb154d0b2a81a3ae9d4c55076c8&oe=5EAC2E42",
            "subtitle":"1 MB, 2 BD",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/ajax/sharer/?s=2&appid=2305272732&id=131104738435326&p[0]=131104738435326&sharer_type=all_modes&av=105772414301892",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
           {
            "title":"RC, 395 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91865315_147214446824355_8124736960364281856_n.jpg?_nc_cat=105&_nc_sid=110474&_nc_ohc=Tir6pOvB-kQAX_aoNJE&_nc_ht=scontent.fmdl2-2.fna&oh=6954df42f6ffda76a3aa6e642c4379b9&oe=5EAED2D6",
            "subtitle":"1 MB, 2 BD",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/photos/pcb.147214593491007/147214443491022/?type=3&__tn__=HH-R&eid=ARATPqkMAieZD273Dv6v20uQX3YDtd_WBSPRk2adWvYfjgfiRgp5SEQ81kv_TMf2l_belNCYmy_43f5B&__xts__%5B0%5D=68.ARD17hMbPUPk_9xnmgYscCPKzmfIBZyzL7CZvdRVY9UnrMw8b6VmsEIsQKnKiRCF0mdEBohwM6Uqugvv0WXGgkgABgimugud5ekJ6zDwq9Tol93MnM6NX2QULtzQ_917D65Ns-N89rxJHaYK0RMjK6J5I9CwKq_Pm_bxf-yJGh_CSaBZsvxYpmBbgokV69RFJQCCFsa78KfiwztgoY2JfHH9m1J7Io40RSYL5C9_oFWfDcKWfvtXWwIMWIU73lVdh-2o323kBnCibRDZG5jWee0rDGnG-MCPQt7bPcfnAuOQu884-_56-8ooPOCOaqbKdWO5ABAtWsyTPhlpFr3abgE",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/photos/pcb.147214593491007/147214443491022/?type=3&__tn__=HH-R&eid=ARATPqkMAieZD273Dv6v20uQX3YDtd_WBSPRk2adWvYfjgfiRgp5SEQ81kv_TMf2l_belNCYmy_43f5B&__xts__%5B0%5D=68.ARD17hMbPUPk_9xnmgYscCPKzmfIBZyzL7CZvdRVY9UnrMw8b6VmsEIsQKnKiRCF0mdEBohwM6Uqugvv0WXGgkgABgimugud5ekJ6zDwq9Tol93MnM6NX2QULtzQ_917D65Ns-N89rxJHaYK0RMjK6J5I9CwKq_Pm_bxf-yJGh_CSaBZsvxYpmBbgokV69RFJQCCFsa78KfiwztgoY2JfHH9m1J7Io40RSYL5C9_oFWfDcKWfvtXWwIMWIU73lVdh-2o323kBnCibRDZG5jWee0rDGnG-MCPQt7bPcfnAuOQu884-_56-8ooPOCOaqbKdWO5ABAtWsyTPhlpFr3abgE",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
             {
            "title":"RC, 475 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91342483_147219730157160_151432519563083776_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_ohc=gF746s26wlYAX92PpSB&_nc_ht=scontent.fmdl2-1.fna&oh=fad4c3a5ed76597e79a396d4cf376818&oe=5EAE3CBC",
            "subtitle":"1 MB, 2 BD",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
           {
            "title":"RC, 430 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91539419_147218910157242_6622245799793262592_n.jpg?_nc_cat=105&_nc_sid=110474&_nc_ohc=-xZXNe4SM18AX_CEt4N&_nc_ht=scontent.fmdl2-2.fna&oh=e838288daec6e3d81507975e95edd0af&oe=5EADCBEC",
            "subtitle":"1 MB, 2 BD",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/photos/pcb.147214593491007/147214443491022/?type=3&__tn__=HH-R&eid=ARATPqkMAieZD273Dv6v20uQX3YDtd_WBSPRk2adWvYfjgfiRgp5SEQ81kv_TMf2l_belNCYmy_43f5B&__xts__%5B0%5D=68.ARD17hMbPUPk_9xnmgYscCPKzmfIBZyzL7CZvdRVY9UnrMw8b6VmsEIsQKnKiRCF0mdEBohwM6Uqugvv0WXGgkgABgimugud5ekJ6zDwq9Tol93MnM6NX2QULtzQ_917D65Ns-N89rxJHaYK0RMjK6J5I9CwKq_Pm_bxf-yJGh_CSaBZsvxYpmBbgokV69RFJQCCFsa78KfiwztgoY2JfHH9m1J7Io40RSYL5C9_oFWfDcKWfvtXWwIMWIU73lVdh-2o323kBnCibRDZG5jWee0rDGnG-MCPQt7bPcfnAuOQu884-_56-8ooPOCOaqbKdWO5ABAtWsyTPhlpFr3abgE",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
            {
            "title":"RC, 430 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91770684_147154156830384_6078026130030329856_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_ohc=2f6TRttbpyEAX8-RFMY&_nc_ht=scontent.fmdl2-2.fna&oh=c09be7e8ad15787d5a83388d8b705f9e&oe=5EAC5F2C",
            "subtitle":"1 MB, 2 BD",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }


        ]
      }
    }
  }
}




// to buy pobba, RC, one floor, Master bed, below3, 60*80, below 1000
    else if (received_message.payload === 'below100pobb_eamount') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 800 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91101082_147218403490626_5572328932478287872_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_ohc=tA9NcmZy4nIAX-EXnB9&_nc_ht=scontent.fmdl2-2.fna&oh=a9562ddfe9f4d08c09ce4ec3f650482d&oe=5EAD8BC3",
            "subtitle":"1 MB, 2 BD",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
           {
            "title":"RC, 770 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91898132_147216956824104_3112675563777556480_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_ohc=vr9owKmvVswAX_8cHdt&_nc_ht=scontent.fmdl2-2.fna&oh=6e736df4d066ea559c06ce64f431c895&oe=5EAE7175",
            "subtitle":"2 MB, 1 BD",
            "default_action": {
              "type": "web_url",
              "url": "https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91101082_147218403490626_5572328932478287872_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_ohc=tA9NcmZy4nIAX-EXnB9&_nc_ht=scontent.fmdl2-2.fna&oh=a9562ddfe9f4d08c09ce4ec3f650482d&oe=5EAD8BC3",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
         

        ]
      }
    }
  }
}


  // to buy pobba, RC, one floor, Master bed, below3, 60*80, above 1000
    else if (received_message.payload === 'above1000pobb_eamount') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1280 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91316346_147213236824476_3978394636820414464_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_ohc=ASt6PtBhi_4AX8VLy-D&_nc_ht=scontent.fmdl2-2.fna&oh=fd354e2b8cf7dfe8047ae01af9b8a24d&oe=5EACA982",
            "subtitle":"2 MB, 3 BD, 1 store",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/ajax/sharer/?s=2&appid=2305272732&id=131104738435326&p[0]=131104738435326&sharer_type=all_modes&av=105772414301892",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/147213463491120/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}



  // to buy pobba, RC, one floor, Master bed, below3, 80*80, below 1000
    else if (received_message.payload === 'below80in80pobb_eamount') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 950 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91769772_147216390157494_6095292285107306496_n.jpg?_nc_cat=105&_nc_sid=110474&_nc_ohc=XQEOGFput-MAX-G4v2n&_nc_ht=scontent.fmdl2-2.fna&oh=84749e6c49babdc150c29fa47b39430c&oe=5EAC1E28",
            "subtitle":"1 MB, 3 BD",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}


/************************************/

    // to buy house in pobba for area
    // to buy house in pobba for numbers of mb room (3 and above mb)
  else if (received_message.payload === "onef_above_pobb") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "pobb_area46",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "pobb_area68",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "aaa88in_in_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "pobb_area_whatever",
                        }
                      ]
      }
  }
  /*
    // to buy house in pobba for area
  else if (received_message.payload === "whatever_mb3_pobb") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "whatever_a46_pobba",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "whatever_a68_pobba",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "a88in_in_inpobb",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "whatever_aa0_pobba",
                        }
                      ]
      }
  }
*/
  /********************/
/*
   // one floor(RC) only bed rooms special in Pobba for area
  else if (received_message.payload === "onef_bed_pobb") {
    response = {
                  "text": "Please choose the house in which the number of bed room has",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 3",
                          "payload": "bed3below_onef_rcpobb",
                        },
                        {
                          "content_type": "text",
                          "title": "3 and above",
                          "payload": "bed3above_onef_rcpobb",
                        },
                       
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "whtever_onef_onlybed_pobb",
                        }
                      ]
      }
  }
  
    // below 3 bed one floor(RC) in pobb for area
  else if (received_message.payload === "bed3below_onef_rcpobb") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "onlybed60_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "onlybed100_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "a88in_in_pobbin",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "onlybed_whatever_pobb",
                        }
                      ]
      }
  }

    // above 3 bed one floor(RC) in Pobb for area
  else if (received_message.payload === "bed3above_onef_rcpobb") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "bedroom88_in_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "bedroom11_in_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "abin88in_in_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "bedroom_wharea_in_pobb",
                        }
                      ]
      }
  }

// above whatever bed one floor(RC) in pobb for area
  else if (received_message.payload === "whtever_onef_onlybed_pobb") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "wht8_bedroom_in_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "wht100_bedroom_in_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "bba88in_in_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "whtwht_bedroom_in_pobb",
                        }
                      ]
      }
  }
*/

  /*******************/
    

   // to buy house (two floor) numbers of master bed in pobba 
  else if (received_message.payload === "twof_pobb") {
    response = {
                  "text": "Please choose the numbers of master bed rooms included:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 3",
                          "payload": "below3_twofmb_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "3 and above",
                          "payload": "above3_twofmb_pobb",
                        }
                      ]
      }
  }
    // to buy house (two floor) in pobba for area
  else if (received_message.payload === "below3_twofmb_pobb") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "twof_40_in_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "twof_60_in_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "ccin88in_in_pobb",
                        }
                      ]
      }
  }
 /*   // 60*80 to buy house  in Pobba
    else if (received_message.payload === 'twof_60_in_pobb') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy land:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 1000",
                          "payload": "below500pobb_eamount",
                        },
                        {
                          "content_type": "text",
                          "title": "below 1000",
                          "payload": "below100pobb_eamount",
                        },
                        {
                          "content_type": "text",
                          "title": "above 1000",
                          "payload": "above1000pobb_eamount",
                        }                      ]
      }
  } */
  
   // to buy house (two floor) in pobba for area
  else if (received_message.payload === "above3_twofmb_pobb") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "twof46_inpobb",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "twof68_inpobb",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "ddin88in_in_pobb",
                        }
                      ]
      }
  }


/******************************/
// to buy house in dekkhina
else if (received_message.payload === "dektwp") {
      response = {
                    "text":'Are you finding RC or other type?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "Other type",
                          "payload": "nancat_dek",
                        }
                      ]

      }
  } 
  else if (received_message.payload === "rc_dek") {
    response = {
                  "text": "Please choose the number of floor",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "thirdf_dek",
                        }
                      ]

      }
  }

  /*************/
   // one floor(RC), number of master bed rooms, in Dek for area
  else if (received_message.payload === "onef_dek") {
    response = {
                  "text": "Please choose the number of Mbr included",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 3",
                          "payload": "bed3below_onef_rcdek",
                        },
                        {
                          "content_type": "text",
                          "title": "3 and above",
                          "payload": "bed3above_onef_rcdek",
                        }
                      ]
      }
  }
    // below 3 master bed, one floor(RC), below 3, in Dek for area
  else if (received_message.payload === "bed3below_onef_rcdek") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "onlymbed60_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "onlymbed660_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "onlymbed100_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "onlymbed88in_dek",
                        },
                           {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "onlymbed100in_dek",
                        }
                      ]
      }
  }


// to buy Dekkhina, RC, one floor, Master bed (below 3), 80*80
    else if (received_message.payload === 'onlymbed88in_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 600 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92017101_147292266816573_1023803908536926208_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_ohc=tiP1mwH3AUMAX-G0iKG&_nc_ht=scontent.fmdl2-1.fna&oh=cb2e46aebe5047f54a0d42d68c80dea0&oe=5EAB4E98",
            "subtitle":"2MB, 2BD, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
          {
            "title":"RC,  1250 lakhs, 80*80ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91363682_147508756794924_5266172075797643264_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeHA6H63Lfk2n8MdoV6fvKAHQ1QLK-ETu2dDVAsr4RO7Z14RGYjL4TwfIEHEKw_aAoQ-pNJa1aobx9jRKA8XqEKL&_nc_ohc=7l9dplxRgIoAX8NLXI7&_nc_ht=scontent.fmdl2-2.fna&oh=e25ce0cd1af1007ac90094e640d1f32d&oe=5EADAF47",
            "subtitle":"Mbr-(1), Br-(2), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
          {
            "title":"RC,  1600 lakhs, 80*80ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92141669_147510473461419_5320214665735700480_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeFG4hciGlHjq_U_qpR9K4Eo49wydLulOiLj3DJ0u6U6Illm7ygoAcOSWvbGBx4b6WdPaekjsrwTdEy2TVJiJJTc&_nc_ohc=kTLjg4T1jNMAX_Vl-AF&_nc_ht=scontent.fmdl2-1.fna&oh=ec92d5fba61d4bd87819b0c517f8669f&oe=5EAD7D03",
            "subtitle":"Mbr-(2), Br-(1), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}








/***************/

    // above 3 master bed, one floor(RC), in Dek, for area
  else if (received_message.payload === "bed3above_onef_rcdek") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "mbedroom88_in_dek",
                        },
                           {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "in66onlymbed_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "mbedroom11_in_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "onlymbed88housein_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "onlymbed111in_dek",
                        }
                      ]
      }
  }


// to buy Dekkhina, RC, one floor, Master bed, 3 and above, 80*80
    else if (received_message.payload === 'onlymbed88housein_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1850 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92326542_147294886816311_3968306432951975936_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_ohc=41jDmczkfrcAX_iy7jQ&_nc_ht=scontent.fmdl2-2.fna&oh=291cdfa59dbdd0676f030af743e9963e&oe=5EABA553",
            "subtitle":"3MB, 1BD, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}




/*
// above whatever master bed one floor(RC) in Dek for area
  else if (received_message.payload === "whtever_onef_onlybed_dek") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "wht8_mbedroom_in_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "onlymbed60_inindek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "wht100_mbedroom_in_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "onlymbed100inin_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "whtwht_mbedroom_in_dek",
                        }
                      ]
      }
  }
*/

  /**********************/
/*
   // one floor(RC) only bed rooms special in Dek for area
  else if (received_message.payload === "onef_bed_dek") {
    response = {
                  "text": "Please choose the house in which the number of bed room has",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 3",
                          "payload": "bed3below_onef_rdek1",
                        },
                        {
                          "content_type": "text",
                          "title": "3 and above",
                          "payload": "bed3above_onef_rdek1",
                        },
                       
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "whtever_onef_onlybed_rdek1",
                        }
                      ]
      }
  }
    // below 3 bed one floor(RC) in dek for area
  else if (received_message.payload === "bed3below_onef_rdek1") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "onlybed60_dek1",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "onlymbedin60in_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "onlybed100_dek1",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "onlymbed80_indekin",
                        },
                       {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "onlymbed100inin_indek",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "onlybed_whatever_dek1",
                        }
                      ]
      }
  }
    // above 3 bed one floor(RC) in Dek for area
  else if (received_message.payload === "bed3above_onef_rdek1") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "bedroom88_in_dek1",
                        },
                       {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "onlymbed60_in60dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "bedroom11_in_dek1",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "onlyinmbed80in_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "onlymbed100ina_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "bedroom_wharea_in_dek1",
                        }
                      ]
      }
  } */

  /**************************************************/

  // to buy house in Zayathiri
else if (received_message.payload === "zaytwp") {
      response = {
                    "text":'Are you finding RC or other type?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_zaya1",
                        },
                        {
                          "content_type": "text",
                          "title": "Other Type",
                          "payload": "nancat_zaya1",
                        }
                      ]

      }
  }
  // to buy house, RC, in Zayathiri 
  else if (received_message.payload === "rc_zaya1") {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_zayathi",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_zayathi",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "whateverf_zayathi",
                        }
                      ]

      }
  }


  /**********************/


  // to buy house, RC, two floor, in Zayathiri 
  else if (received_message.payload === "twof_zayathi") {
    response = {
                  "text": "Please choose the land area of house you want to buy:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",                
                          "payload": "twofloor_landarea46_tobuyt_zaya",
                        },
                         {
                          "content_type": "text",
                          "title": "60*80",               // not yet
                          "payload": "twofloor_landarea68a2_tobuyt_zaya",
                        },
                        {
                          "content_type": "text",
                          "title": "other area",
                          "payload": "twofloor_landareaotherab11_tobuyt_zaya",
                        }
                      ]

      }
  }
    // to buy zayathiri, RC, two floor, 60*80
    else if (received_message.payload === 'twofloor_landarea68a2_tobuyt_zaya') {
    response = {
                "text": "There is no property avaliable. Sorry for you. Thanks for contacting us."
  }
}


    // to buy zayathiri, RC, two floor, 40*60
    else if (received_message.payload === 'twofloor_landarea46_tobuyt_zaya') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1550 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92350854_148331046712695_1514855722876141568_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeG5ZcuXasEyLdDk5VORz6R7_wo-WeJtVEP_Cj5Z4m1UQ_fjxjYC9t60tCuxT33zIGTj0s3iAKlYy1cCYkZEEZ1V&_nc_ohc=VC0_cyIzoxYAX9X3E3n&_nc_ht=scontent.fmdl2-2.fna&oh=4fe0ab1656140cb226395cf14854b060&oe=5EB180E7",
            "subtitle":"Mbr-(2), Br-(2), land type-(grant),face east and north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

  // to buy zayathiri, RC, two floor, other area
    else if (received_message.payload === 'twofloor_landareaotherab11_tobuyt_zaya') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1500 lakhs, 70*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91684696_148082903404176_4744287077787500544_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeGJrrl3pJoyH7bJsFh_A2zSY8El8xmJIX9jwSXzGYkhf7StKf4IQhKXk80QagK5ApXmLNQKOrd8a6bfq2o88g1g&_nc_ohc=h0vQlFNpx4MAX-hpFps&_nc_ht=scontent.fmdl2-1.fna&oh=600219d816e675e680fce055e0fc99b8&oe=5EB0DB11",
            "subtitle":"Mbr-(2), Br-(3), land type-(slit),face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
             {
            "title":"RC, 2000 lakhs, 60*90 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91399493_148081813404285_4132688193013153792_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeE42tNkW6IjD7xuSoc4pKcvu3wVLCYN8EW7fBUsJg3wRa9MvNC92sgpU97iz6gK3h3Pp72U_YCXpYvUeiB9ljU4&_nc_ohc=WeoFtmSfSEUAX8s5Yxz&_nc_ht=scontent.fmdl2-1.fna&oh=6a03ed097e52a57a7f64df976ecb4a4b&oe=5EAE99A3",
            "subtitle":"Mbr-(4), Br-(1), land type-(grant), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}




         
  /**********************/



  // to buy house, RC, one floor, in zayathiri
  else if (received_message.payload === "onef_zayathi") {
    response = {
                  "text": "Do you want the house in which Mbr included or only Br included?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Mbr",
                          "payload": "onef_mb_zayathi",
                        },
                        {
                          "content_type": "text",
                          "title": "Only Br",
                          "payload": "onef_bed_zayathi",
                        }
                      ]
      }
  }
  /************/
 // to buy zayathiri, house, RC, one floor, master bed, area
  else if (received_message.payload === "onef_mb_zayathi") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "onlymbed60_zayathi",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "onlymbed100_zayathi",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "onlyother_zayathi",
                        }
                      ]
      }
  }
 
  // to buy zayathiri, Other Type
    else if (received_message.payload === 'nancat_zaya1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"Nancat, 270 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91792097_147994890079644_2733113919257182208_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeEJ6OQtxyqfb9GVE1jRRE0IYNvigKbAkipg2-KApsCSKv0wJFCW3y8zXzDxQmVDuBPbb5X8jPDyLDSPnHzvJgQP&_nc_ohc=XThyUU6dRbcAX8MJD2I&_nc_ht=scontent.fmdl2-1.fna&oh=b3a0b4731debcda532f508df3173f283&oe=5EAE5B05",
            "subtitle":"2BD, land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}




  // to buy , one floor(RC), in Zayarthiri, master bed room , 40* 60
    else if (received_message.payload === 'onlymbed60_zayathi') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 450 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91795685_147979493414517_3541170500845699072_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGDVXPDiTSc8vXaN7qDn0awga7GRrFvfoqBrsZGsW9-itxQ0gf9L-DyJuhhjkeXD9yhvEkuxAr9VDV_BCS5OT7c&_nc_ohc=p20XzokA4MoAX8MM8H2&_nc_ht=scontent.fmdl2-1.fna&oh=807cc2770c0d3e2edb4161709ae319e5&oe=5EB09908",
            "subtitle":"Mbr-(2), Br-(1), land type-(grant), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

 // to buy , one floor(RC), in Zayarthiri, master bed room , 60*80
    else if (received_message.payload === 'onlymbed100_zayathi') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 695 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91743058_147985173413949_5524857719812521984_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeGLGqRX5e59BXVCeCTQ4SkEu2-klAR4vAy7b6SUBHi8DL298NJeaU-lHazho9C-fTx5SW-D46NARrIYaVLzqTIM&_nc_ohc=qUTqS0FKrX8AX9n5GP3&_nc_ht=scontent.fmdl2-2.fna&oh=b176548c65794799b5ac5ca8541d04e9&oe=5EB0B328",
            "subtitle":"Mbr-(3), Br-(1), land type-(grant), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
 // to buy , one floor(RC), in Zayarthiri, master bed room , other area
    else if (received_message.payload === 'onlyother_zayathi') {
    response = {
                "text": "There is no property avaliable. Sorry for you. Thanks for contacting us."
  }
}

  /***************************/

 
 // to buy one floor(RC), only bed rooms , in Zayathiri for area
  else if (received_message.payload === "onef_bed_zayathi") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                          {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "bedaacc1_bedroom_i46n_zaya",  // not be
                        },
                         {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "bedroom88_in_zayathi2",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "wht100_mbedroom_in_zaya",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "onlybedother_zayathi11",  
                        }
                      ]
      }
  }

  // to buy , one floor(RC), in Zayarthiri, bed room, 40* 60
    else if (received_message.payload === 'bedaacc1_bedroom_i46n_zaya') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 430 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92411898_147990653413401_1525933800742191104_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeHBsVC7TLdFJm2fLgZ5UqX3q8KD7opYtsKrwoPuili2woW_93kuxylkFMVFz5DU5-BC0u6TafZAWv0AweUc0PfN&_nc_ohc=VleE8dz-FGMAX9p4286&_nc_ht=scontent.fmdl2-1.fna&oh=17f7467c5fbd8a2a945ab3e817eb758f&oe=5EAF513E",
            "subtitle":"3BD, land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}



   // to buy , one floor(RC), in Zayarthiri, bed room, 60* 60
    else if (received_message.payload === 'bedroom88_in_zayathi2') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 750 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91566102_147309916814808_3933244420186439680_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeGe2oH7A1JiUggWbdMpedaTuf90LosKVHe5_3QuiwpUd9XJAc2iTWERN-t1qRDIuwYPoXpw4DsDoNYeccAyPfLU&_nc_ohc=OfgBeO8iZQAAX8-YKe0&_nc_ht=scontent.fmdl2-2.fna&oh=b14c800be66697d2d87ca5b9950d5294&oe=5EAF6923",
            "subtitle":"3BD, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

   // to buy , one floor(RC), in Zayarthiri, bed room, 60*80
    else if (received_message.payload === 'wht100_mbedroom_in_zaya') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 675 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92588042_147988300080303_5214463371088232448_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGB2gX8DBfZCnr3mDKV62fwSNme3d8UdudI2Z7d3xR25yOIn8TsKwiAvR3U8M7ZCVzaqvFXgbc7YnyotdM4vVtF&_nc_ohc=K5GBbXAVOw0AX8EgTmU&_nc_ht=scontent.fmdl2-1.fna&oh=1dbd640db96801560c02478963b51321&oe=5EAFE58D",
            "subtitle":"3BD, land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
  // to buy , one floor(RC), in Zayarthiri, bed room, other area
    else if (received_message.payload === 'onlybedother_zayathi11') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 800 lakhs, 60*70 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91497803_148004706745329_4934947964616441856_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeFIDrTTnrVgW7Y-gZH5yJXvBKz1BMcNxG0ErPUExw3EbWo0JPNgeHM3z9Pnj8baoVJYA7bUKfi_ECnrWvCAWpZA&_nc_ohc=mkJ5iRQDAFAAX8lHcZK&_nc_ht=scontent.fmdl2-1.fna&oh=d786b325fbd83e26763bfbf03e52d9c1&oe=5EADF6FA",
            "subtitle":"3BD, land type-(slit), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
/**************************************************************************************************************/
/**************************************************************************************************************/
 

 // to rent house in Zayathiri
else if (received_message.payload === "tenanzay") {
      response = {
                    "text":'Are you finding RC or other type?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_onef_rzayathi1_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "Other Type",
                          "payload": "othertype_abc77_rzayathi1_tenant",
                        }
                      ]

      }
  }
  // to rent house, RC, floor, in Zayathiri 
  else if (received_message.payload === "rc_onef_rzayathi1_tenant") {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onefloor_abcd1122_rzayathi1_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twofloor_abcd1122_rzayathi1_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "Other floor",
                          "payload": "otherfloor_abcd1122_rzayathi1_tenant",
                        }
                      ]

      }
  }
  // to rent zayathiri, RC, other floor
    else if (received_message.payload === 'otherfloor_abcd1122_rzayathi1_tenant') {
    response = {
                "text": "There is no house avaliable. Sorry for you. Thanks for contacting us."
  }
}

/*****************/

  

  // to rent house, RC, two floor, in Zayathiri 
  else if (received_message.payload === "twofloor_abcd1122_rzayathi1_tenant") {
    response = {
                  "text": "Please choose the estimated price you want to use",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "twofloor_below3and3_rzayathi1_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "otherfloor_above3lakhs_rzayathi1_tenant",
                        }
                      ]

      }
  }

  // to rent zayathiri, RC, two floor, 3 lakhs & below it
    else if (received_message.payload === 'twofloor_below3and3_rzayathi1_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 3 lakhs per a month, 70*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91684696_148082903404176_4744287077787500544_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeGJrrl3pJoyH7bJsFh_A2zSY8El8xmJIX9jwSXzGYkhf7StKf4IQhKXk80QagK5ApXmLNQKOrd8a6bfq2o88g1g&_nc_ohc=h0vQlFNpx4MAX-hpFps&_nc_ht=scontent.fmdl2-1.fna&oh=600219d816e675e680fce055e0fc99b8&oe=5EB0DB11",
            "subtitle":"Mbr-(2), Br-(3), aircon-(3),face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to rent zayathiri, RC, two floor, above 3 lakhs
    else if (received_message.payload === 'otherfloor_above3lakhs_rzayathi1_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
            {
            "title":"RC, 5 lakhs per month, 60*90 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91399493_148081813404285_4132688193013153792_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeE42tNkW6IjD7xuSoc4pKcvu3wVLCYN8EW7fBUsJg3wRa9MvNC92sgpU97iz6gK3h3Pp72U_YCXpYvUeiB9ljU4&_nc_ohc=WeoFtmSfSEUAX8s5Yxz&_nc_ht=scontent.fmdl2-1.fna&oh=6a03ed097e52a57a7f64df976ecb4a4b&oe=5EAE99A3",
            "subtitle":"Mbr-(4), Br-(1), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
          {
            "title":"RC, 6 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92350854_148331046712695_1514855722876141568_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeG5ZcuXasEyLdDk5VORz6R7_wo-WeJtVEP_Cj5Z4m1UQ_fjxjYC9t60tCuxT33zIGTj0s3iAKlYy1cCYkZEEZ1V&_nc_ohc=VC0_cyIzoxYAX9X3E3n&_nc_ht=scontent.fmdl2-2.fna&oh=4fe0ab1656140cb226395cf14854b060&oe=5EB180E7",
            "subtitle":"Mbr-(2), Br-(2),face east and north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }


        ]
      }
    }
  }
}

/****************/



  // to rent house, RC, one floor, types of room, in zayathiri
  else if (received_message.payload === "onefloor_abcd1122_rzayathi1_tenant") {
    response = {
                  "text": "Do you want the house in which Mbr included or only Br included?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Mbr",
                          "payload": "bed3below_onef_rzayathi1_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "Only Br",
                          "payload": "bed3above_onef_rzayathi1_tenant",
                        }
                      ]
      }
  }
  /************/
 // to rent zayathiri, house, RC, one floor, master bed
  else if (received_message.payload === "bed3below_onef_rzayathi1_tenant") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "onlymbed60_zayathi_tenantaabbdd11",
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "onlymbed100_zayathi_tenantaabbdd11",
                        }
                      ]
      }
  }
 
  // to rent zayathiri, Other Type
    else if (received_message.payload === 'othertype_abc77_rzayathi1_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"Nancat, 1 lakh per a month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91792097_147994890079644_2733113919257182208_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeEJ6OQtxyqfb9GVE1jRRE0IYNvigKbAkipg2-KApsCSKv0wJFCW3y8zXzDxQmVDuBPbb5X8jPDyLDSPnHzvJgQP&_nc_ohc=XThyUU6dRbcAX8MJD2I&_nc_ht=scontent.fmdl2-1.fna&oh=b3a0b4731debcda532f508df3173f283&oe=5EAE5B05",
            "subtitle":"2BD, land type-(grant), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}




  // to rent , one floor(RC), in Zayarthiri, master bed room , 3 lakhs & below it
    else if (received_message.payload === 'onlymbed60_zayathi_tenantaabbdd11') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91795685_147979493414517_3541170500845699072_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGDVXPDiTSc8vXaN7qDn0awga7GRrFvfoqBrsZGsW9-itxQ0gf9L-DyJuhhjkeXD9yhvEkuxAr9VDV_BCS5OT7c&_nc_ohc=p20XzokA4MoAX8MM8H2&_nc_ht=scontent.fmdl2-1.fna&oh=807cc2770c0d3e2edb4161709ae319e5&oe=5EB09908",
            "subtitle":"Mbr-(2), Br-(1), land type-(grant)",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
             {
            "title":"RC, 3 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91743058_147985173413949_5524857719812521984_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeGLGqRX5e59BXVCeCTQ4SkEu2-klAR4vAy7b6SUBHi8DL298NJeaU-lHazho9C-fTx5SW-D46NARrIYaVLzqTIM&_nc_ohc=qUTqS0FKrX8AX9n5GP3&_nc_ht=scontent.fmdl2-2.fna&oh=b176548c65794799b5ac5ca8541d04e9&oe=5EB0B328",
            "subtitle":"Mbr-(3), Br-(1), land type-(grant)",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}


 // to rent , one floor(RC), in Zayarthiri, master bed room , above 3 lakhs
    else if (received_message.payload === 'onlymbed100_zayathi_tenantaabbdd11') {
    response = {
                "text": "There is no avaliable house. Sorry for you. Thanks for contacting us."
  }
}

  /***************************/

 
 // to rent one floor(RC), only bed rooms , in Zayathiri for area
  else if (received_message.payload === "bed3above_onef_rzayathi1_tenant") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                          {
                          "content_type": "text",
                          "title": "2 lakhs & below it",
                          "payload": "bedaacc1_bedroom_i46n_zaya_tenant",  
                        },
                        {
                          "content_type": "text",
                          "title": "above 2 lakhs",
                          "payload": "wht100_mbedroom_in_zaya_tenant",
                        }
                      ]
      }
  }

  // to rent , one floor(RC), in Zayarthiri, bed room, 2 lakhs & below it
    else if (received_message.payload === 'bedaacc1_bedroom_i46n_zaya_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 2 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92411898_147990653413401_1525933800742191104_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeHBsVC7TLdFJm2fLgZ5UqX3q8KD7opYtsKrwoPuili2woW_93kuxylkFMVFz5DU5-BC0u6TafZAWv0AweUc0PfN&_nc_ohc=VleE8dz-FGMAX9p4286&_nc_ht=scontent.fmdl2-1.fna&oh=17f7467c5fbd8a2a945ab3e817eb758f&oe=5EAF513E",
            "subtitle":"3BD, land type-(grant), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
              {
            "title":"RC, 2 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92588042_147988300080303_5214463371088232448_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGB2gX8DBfZCnr3mDKV62fwSNme3d8UdudI2Z7d3xR25yOIn8TsKwiAvR3U8M7ZCVzaqvFXgbc7YnyotdM4vVtF&_nc_ohc=K5GBbXAVOw0AX8EgTmU&_nc_ht=scontent.fmdl2-1.fna&oh=1dbd640db96801560c02478963b51321&oe=5EAFE58D",
            "subtitle":"3BD, land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
             {
            "title":"RC, 2 lakhs per month, 80*70 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91497803_148004706745329_4934947964616441856_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeFIDrTTnrVgW7Y-gZH5yJXvBKz1BMcNxG0ErPUExw3EbWo0JPNgeHM3z9Pnj8baoVJYA7bUKfi_ECnrWvCAWpZA&_nc_ohc=mkJ5iRQDAFAAX8lHcZK&_nc_ht=scontent.fmdl2-1.fna&oh=d786b325fbd83e26763bfbf03e52d9c1&oe=5EADF6FA",
            "subtitle":"3BD, land type-(slit), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

   // to rent , one floor(RC), in Zayarthiri, bed room, above 2 lakhs
    else if (received_message.payload === 'wht100_mbedroom_in_zaya_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
           
           {
            "title":"RC, 250000 for 1 month",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91566102_147309916814808_3933244420186439680_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeGe2oH7A1JiUggWbdMpedaTuf90LosKVHe5_3QuiwpUd9XJAc2iTWERN-t1qRDIuwYPoXpw4DsDoNYeccAyPfLU&_nc_ohc=OfgBeO8iZQAAX8-YKe0&_nc_ht=scontent.fmdl2-2.fna&oh=b14c800be66697d2d87ca5b9950d5294&oe=5EAF6923",
            "subtitle":"3BD, 60*60 ft",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}   

/**********************************************************************************************************************/
/**********************************************************************************************************************/





  /***********************************************************************/
    // to buy house in Zabu
else if (received_message.payload === "zabtwp") {
      response = {
                    "text":'Are you finding RC or other type?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_zabu111222",
                        },
                        {
                          "content_type": "text",
                          "title": "Other Type",
                          "payload": "nancat_zabu1",
                        }
                      ]

      }
  }
  // to buy a house in Zabuthiri, RC  
  else if (received_message.payload === "rc_zabu111222") {
    response = {
                  "text": "Please choose you want to buy the house in which",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_zabuthiri11aa",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_zabuthiri11aa",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "otherff1_zabuthiri11aa",
                        }
                      ]

      }
  }
// to buy zabu, a house, RC, one floor
  else if (received_message.payload === "onef_zabuthiri11aa") {
    response = {
                  "text": "Do you want the house in which Mbr included or only Br included?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Mbr",
                          "payload": "onef_mb_zabu22aa",
                        },
                        {
                          "content_type": "text",
                          "title": "Only Br",
                          "payload": "onef_bed_zabu22aa",
                        }
                      ]
      }
  }
  /************/
   // to buy zabu, house(RC), one floor,  master bed rooms
  else if (received_message.payload === "onef_mb_zabu22aa") {
    response = {
                  "text": "Please choosse the land area of house:",
                    "quick_replies": [
                            {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "onlymbed60_zabu7_tobuyz1",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "mbedroom60hou6_in_tobuyz1",
                        },
                          {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "mbedroom100hou100_in_tobuyz1",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "onlyother_zabu7_tobuyz1",
                        }
                      ]
      }
  }



  /***************************/

// to buy zabu, house (RC), other floor
    else if (received_message.payload === 'otherff1_zabuthiri11aa' ) {
    response = {
                "text": "There is no property avaliable. Sorry for you. Thanks for contacting us."
  }
}

  /***************************/

  // to buy zabu, house (RC), one floor, master bed, 40*60
    else if (received_message.payload === 'onlymbed60_zabu7_tobuyz1' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"RC, 1700 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/l/t1.0-9/92212800_148345030044630_2321483867061485568_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeEHgbOBvCaxgFusYDxKkOYHMB_654nCR_QwH_rnicJH9E8V6SJFaSZkjtld4kKflRJEff8RSLUIxQ7DS3zpZxVu&_nc_ohc=3NmgwHWZbCkAX9SSlwS&_nc_ht=scontent.fmdl2-2.fna&oh=07b83b65a8103169f0b5034d976c3f71&oe=5EAF5471",
            "subtitle":"Mbr-(1), Br-(2), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
  // to buy zabu, house (RC), one floor, master bed, 60*60
    else if (received_message.payload === 'mbedroom60hou6_in_tobuyz1' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"RC, 700 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92456400_148341980044935_5315513626461732864_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeHNN47ovsGuR5e8dsrxSj9d9B_aE_fP7zD0H9oT98_vMBGBCjuvS_C2XJDiCZGxnCnclC8uUrekgKK8VV5rboY8&_nc_ohc=oNufEKNmhzEAX9443tx&_nc_ht=scontent.fmdl2-1.fna&oh=eed956df5875f01944ca64ec1d4dd20a&oe=5EAFB3BC",
            "subtitle":"Mbr-(2), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy zabu, house (RC), one floor, master bed, 100*100
    else if (received_message.payload === 'mbedroom100hou100_in_tobuyz1' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"RC, 1000 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91955219_148335103378956_2829729028192075776_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeHYsY5ju_-UtnsMR-xcQDlg3NSNpodS4azc1I2mh1LhrMPrqOlTDU65CqHDQ8JVmDdP4O4QOQpjDSKLNTI4Y5Ys&_nc_ohc=hdrpmmN65d0AX_Ct4eh&_nc_ht=scontent.fmdl2-1.fna&oh=842a715790fdc40b511bdacabb0c63c9&oe=5EAF33DA",
            "subtitle":"Mbr-(2),Br-(2),face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy zabu, house (RC), one floor, master bed, other area
    else if (received_message.payload === 'onlyother_zabu7_tobuyz1' ) {
    response = {
                "text": "There is no property avaliable. Sorry for you. Thanks for contacting us."
  }
}
// to buy zabu, house (other type)
    else if (received_message.payload === 'nancat_zabu1' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"RC, 110 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92055239_148410403371426_3609555549953196032_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeEcxWyddvgH7C0Z2B2n6syBX7GQJ4Ddfc1fsZAngN19zZZV7BUT4-dAQhBpIFP153IJzNvhPOpKrB4lWAPsT5j7&_nc_ohc=xGj5wNgncCEAX-XowML&_nc_ht=scontent.fmdl2-2.fna&oh=5bcf3aac02a9537be165941d2cd58004&oe=5EB13DBA",
            "subtitle":"land type-(grant),face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

/**************************************************/


    // to buy Zabu, one floor(RC), only bed rooms , area
  else if (received_message.payload === "onef_bed_zabu22aa") {
    response = {
                   "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "onlybed60_zabuthi11",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "onlybedroom60hou_in_zabuu7",
                        },
                        {
                          "content_type": "text",
                          "title": "other area",
                          "payload": "onlybedother_zabuthi11",
                        }
                      ]           
      }
  }
  
   // to buy zabbuthiri, one floor(RC), bed room, 40* 60
    else if (received_message.payload === 'onlybed60_zabuthi11') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 395 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92576217_148333400045793_3715312904799518720_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeF1BrOLUKqeHmWQNb6jsq7oTvSeC72-wgdO9J4Lvb7CByIaS1cCmd5BQyrO5HBGXht-Xu7mDsWjUKEzUrSH3Vuc&_nc_ohc=Lwme8DQci5IAX8BCgcb&_nc_ht=scontent.fmdl2-2.fna&oh=c8f413c67152bc8a68af77cff5347623&oe=5EB17EB0",
            "subtitle":"3BD, land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
   // to buy zabbuthiri, one floor(RC), bed room, 60*60
    else if (received_message.payload === 'onlybedroom60hou_in_zabuu7') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 830 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91923017_148322666713533_5407944088630591488_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeFY2FZaTFShXIcTo19BYxaHwWpR-0-xBjjBalH7T7EGODKvmZrQI1gTfbvakeY4jbOtWyZeQgiDbdPyDeipWD2h&_nc_ohc=Zc0JR1VZL-8AX81QyTU&_nc_ht=scontent.fmdl2-1.fna&oh=328e035a9f9256c1510c1f0fd96b1c60&oe=5EB1B88B",
            "subtitle":"3BD, land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

   // to buy zabbuthiri, one floor(RC), bed room, other area
    else if (received_message.payload === 'onlybedother_zabuthi11') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC,  700 lakhs, 60*70ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92286133_148342503378216_8058588730224541696_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeGW9jsT3UUCPItS1rODRK9EqjIIL6S_Ya6qMggvpL9hrntDuQxVhp5423O7pzZ-QLsKl_y2RryQO5-634sWMyjF&_nc_ohc=UjaEQmobu1cAX9df-bm&_nc_ht=scontent.fmdl2-1.fna&oh=00176f4a33e5dabdbd4164e50de1fd24&oe=5EB1A6D0",
            "subtitle":"3BD, land type-(grant), face west, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}


/**************************/

/*****************************************************/

    // to buy a house in Zabuthiri, RC, two floor
  else if (received_message.payload === "twof_zabuthiri11aa") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "tobuy_onlymbed60_zabu7", 
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",               
                          "payload": "tobuy_mbedroom60hou6_in_zabuu7",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",        
                          "payload": "tobuy_onlymbed100_zabu7",
                        },
                        {
                          "content_type": "text",
                          "title": "other area",
                          "payload": "tobuy_onlyother_zabu7", 
                        }
                      ]
      }
  }


  /***************************/



// to buy a house Zabbuthiri, RC, two floor, 40*60
    else if (received_message.payload === 'tobuy_onlymbed60_zabu7') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC,  2500 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91774025_148348000044333_6815842511517384704_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeHzqDLnklGlQ1xWNu07MBlaHw1QFU91-UofDVAVT3X5SnGbhIDx7oZdYcEPqVUAalWsZknjEkUmzV8CvCGJRIrZ&_nc_ohc=zrefNImYLKcAX9YSeXG&_nc_ht=scontent.fmdl2-1.fna&oh=61bf79c95ef86a902df4a0fb2094cc82&oe=5EB0E892",
            "subtitle":"Mbr-(1), Br-(4), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy a house Zabbuthiri, RC, two floor, 60*60
    else if (received_message.payload === 'tobuy_mbedroom60hou6_in_zabuu7') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC,  2000 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92823131_148347106711089_610544418763571200_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeFxWgAema5g4i2xFW9AdQBsOcp_FQlFfAY5yn8VCUV8BiwqdlL46YDiBCxY8iBhHIlW_rKc_ZUMlBXBZC2V_exy&_nc_ohc=k-b3E7YKzeoAX_Ds2Ud&_nc_ht=scontent.fmdl2-2.fna&oh=935494d72848dfee0dbf8c36fb149734&oe=5EB0066C",
            "subtitle":"Mbr-(2), Br-(1), land type-(grant),face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy a house Zabbuthiri, RC, two floor, 100*100
    else if (received_message.payload === 'tobuy_onlymbed100_zabu7') {
    response = {
                  "text": "There is no property avaliable. Sorry for you. Thanks for contacting us."
  }
}
// to buy a house Zabbuthiri, RC, two floor, other area
    else if (received_message.payload === 'tobuy_onlyother_zabu7') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC,  900 lakhs, 60*70 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92465912_148351516710648_1751142708715454464_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeG4Y_29JTV2nR-S0e4T_3l2jyTiAxhjiyWPJOIDGGOLJeN4MvyOK5riu_STZt4-BtlbQ1z-Nj2JZLgPhK7gDSRH&_nc_ohc=NlIAL0Jz0p0AX9IjMKA&_nc_ht=scontent.fmdl2-1.fna&oh=a059ee4af2076260fe6fa851d60ead96&oe=5EB1FB14",
            "subtitle":"Mbr-(2), Br-(4), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}



/************************************************/



/***********************************************************************************************************************************/
/*
// buy land in pyinmana
  else if (received_message.payload === "pyi5") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "land_a1_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "60*72",
                          "payload": "land_a2_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "land_a3_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "other_a4_pyin",
                        }
                      ]
      }
  }
  // 40*60 to buy land in pyinmana
    else if (payload === 'land_a1_pyin') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy land:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 300",
                          "payload": "below3_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "below 600",
                          "payload": "below6_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "below 1000",
                          "payload": "below1000_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "above 1000",
                          "payload": "above1000_pyin",
                        }
                      ]
      }
  }
    // 60*72 to buy land in pyinmana
    else if (payload === 'land_a2_pyin') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy land:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "below 600",
                          "payload": "b67_p6_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "below 1000",
                          "payload": "b67_p1_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "above 1000",
                          "payload": "b67_ab1_pyin",
                        }
                      ]
      }
  }
    // 60*80 to buy land in pyinmana
    else if (payload === 'land_a3_pyin') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy land:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "below 600",
                          "payload": "b67_p6_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "below 1000",
                          "payload": "b67_p1_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "above 1000",
                          "payload": "b67_ab1_pyin",
                        }
                      ]
      }
  }
    // other area to buy land in pyinmana
    else if (payload === 'other_a4_pyin') {
    response = {
                  "text": "So sorry, there are no other lands not avaliable",
      }
  }
  */    
/************************************/

// to buy land in oattra
else if (received_message.payload === "otthi") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "land100_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "150*150",
                          "payload": "land150_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "land80_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "land_other_ott",
                        }
                      ]
      }
  }
  // 100*100 to buy land in Oattra
    else if (received_message.payload === 'land100_ott') {
    response = {
                  "text": "So sorry for my customer. There are not vacant land avaliable in Oattra to sell yet. Thanks for contacting us."
                    
      }
  }
    // 150*150 to buy land in Oattra
    else if (received_message.payload === 'land150_ott') {
    response = {
                  "text": "So sorry for my customer. There are not vacant land avaliable in Oattra to sell yet. Thanks for contacting us.",
           
      }
  }
    // 80*80 to buy land in Oattra
    else if (received_message.payload === 'land80_ott') {
    response = {
                  "text": "So sorry for my customer. There are not vacant land avaliable in Oattra to sell yet. Thanks for contacting us.",
                   
      }
  }
    // other area to buy land in pyinmana
    else if (received_message.payload === 'land_other_ott') {
    response = {
                  "text": "So sorry for my customer. There are not vacant land avaliable in Oattra to sell yet. Thanks for contacting us.",
      }
  }    

/*****************************************************/

// to buy land in Pobba
  else if (received_message.payload === "pobthi") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "land40_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "land60_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "land80_pobb",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "other_land_pobb",
                        }
                      ]
      }
  }
  // 40*60 to buy land in Pobba
    else if (received_message.payload === 'land40_pobb') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy land:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 300",
                          "payload": "below3_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "below 600",
                          "payload": "below6_pyin",
                        },
                        {
                          "content_type": "text",
                          "title": "below 1000",
                          "payload": "below1000_pyin",
                        }                      ]
      }
  }
    // 60*60 to buy land in pobba
    else if (received_message.payload === 'land60_pobb') {
    response = {
                  "text": "So sorry for my customer. There are not vacant land avaliable in Oattra to sell yet. Thanks for contacting us.",
      }
  }
    // 60*80 to buy land in Pobba
    else if (received_message.payload === 'land_a3_pyin') {
    response = {
                  "text": "So sorry for my customer. There are not vacant land avaliable in Oattra to sell yet. Thanks for contacting us.",
      }
  }
    // other area to buy land in pyinmana
    else if (received_message.payload === 'other_a4_pyin') {
    response = {
                  "text": "So sorry, there are no other lands not avaliable",
      }
  }    


// to buy land in Dekkhia
else if (received_message.payload === "dekthi") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "onlya60land_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "onlya660land_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "onlya100land_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "onlya80landin_dek",
                        },
                           {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "onlyaland100in_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "whatever",
                          "payload": "onlylanda1a1_whatever_dek",
                        }
                      ]
      }
  }
     else if (received_message.payload === 'onlya660land_dek') {
    response = {
                  "text": "Please choose the estimated amount that you are avaliable to buy land:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 700",
                          "payload": "below700land_dekkii99",
                        },
                        {
                          "content_type": "text",
                          "title": "above 700",
                          "payload": "above700land_dekkii99",
                        }                      ]
      }
  }

// to buy land in Dekkhina,  below 700
    else if (received_message.payload === 'below700land_dekkii99') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 140 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92024437_147513583461108_2759257849044402176_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeHsaWoVZrB9sdXELQGiSs7qKJVwS5P0JbUolXBLk_QltZsw_9qwTqbLVptop7MPD00Mhg0NyEUxJrQU7bzr_INm&_nc_ohc=0mmVGHV0_zsAX9bny9y&_nc_ht=scontent.fmdl2-1.fna&oh=6d6aedd2cb3e3174481663448ef86d58&oe=5EAFB9E5",
            "subtitle":"Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}





  
/************************************************************************/
  // to buy land in Zabuthiri, area
  else if (received_message.payload === "zabuthi") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "only46alandin_zabuu7",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "only60blandin_zabuu7",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "only68cclandin_zabuu7",
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "onlyother7dlandin_zabuu7",
                        }
                      ]
      }
  }

// to buy land in Zabuthiri,  60*60
    else if (received_message.payload === 'only60blandin_zabuu7') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 350 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92401981_148398946705905_1667673824658718720_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeGaL6IGTy20gFrY_-GIyeNJuwpVQ952uLu7ClVD3na4u21FAthxsnpldZlENVuE1St4BuxvhXlda1-KwZfSYc5U&_nc_ohc=kvy3nWUh4R8AX8_CBXm&_nc_ht=scontent.fmdl2-1.fna&oh=0fa5d2b84682b6977536695d3e6fe792&oe=5EAED27B",
            "subtitle":"face south, land type-(grant), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy land in Zabuthiri,  40*60
    else if (received_message.payload === 'only46alandin_zabuu7') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 430 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91613770_148401023372364_5350547653220368384_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGOUGv8X4g8aZ7KMUkbj143aMv2-XqcnNxoy_b5epyc3Cnk6PadZmgqlkRrzQ4wGGBVuJTGEsvDBWUtO4ljXG3F&_nc_ohc=R-2gfYEIeG8AX-DceKM&_nc_ht=scontent.fmdl2-1.fna&oh=94b59f25df3b4848c60e90d9cf646833&oe=5EB20BEC",
            "subtitle":"face west, land type-(permit),Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy land in Zabuthiri,  100*100
    else if (received_message.payload === 'only68cclandin_zabuu7') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 200 lakhs, 100*100 ft, face west,",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91810678_148403216705478_1277350765916061696_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeGssc_xyPyaeyFDkreQEylkRUbrTdet0OJFRutN163Q4mTLjEwCflsG5eofWpDqUaRGl647jk3Ph9AG_80NfmOy&_nc_ohc=IgL8saxP5bUAX_4kTPj&_nc_ht=scontent.fmdl2-1.fna&oh=b3f0f3b95ccef22e52f67856290eeef2&oe=5EB1A0F1",
            "subtitle":"land type-(village land),Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}




// to buy land in Zabuthiri,  Other area
    else if (received_message.payload === 'onlyother7dlandin_zabuu7' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 550 lakhs, 80*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92100656_148405230038610_4893887046474530816_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeFDDuLfnVZj-6Zb_dij7f9eN5WYIm8s5m83lZgibyzmbyyQrMoO7j7TGod3Si3a4sh3egQATLC7pmbmzTaNiReP&_nc_ohc=zE-iyX7f2hUAX9uZRd6&_nc_ht=scontent.fmdl2-2.fna&oh=5a864e5a88facb440ce6aeeae5788ad7&oe=5EB1BE62",
            "subtitle":"land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

/********************************************/
/********************************************/

    // to buy land in Zayathiri twonship, area
  else if (received_message.payload === "zayathi") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "tobuy_land_area_inzayad146",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",       
                          "payload": "tobuy_land_area_inzayad160",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobuy_land_area_inzayad168",  
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "tobuy_land_area_inzayad1other",
                        }
                      ]
      }
  }

// to buy land in Zayathiri, 40*60
    else if (received_message.payload === 'tobuy_land_area_inzayad146') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 150 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91513938_147997343412732_2184803353274351616_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeHbEG6AVbBgKfxV7lLu7SEPDZHJLkRvnegNkckuRG-d6LVbeXwvrTB7r60wxpuqzmmPtlRTf3-CFc9YBIBz-8y-&_nc_ohc=bxsIVu2L0ywAX__8G89&_nc_ht=scontent.fmdl2-2.fna&oh=e401bc6e5d23e23c48dde30e65432005&oe=5EAFA9B4",
            "subtitle":"land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy land in Zayathiri, 60*60
    else if (received_message.payload === 'tobuy_land_area_inzayad160') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 700 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91680436_148006486745151_4875582939536031744_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeGXoapM3L50BOyrZhvMyGHgpOOd7SlzHVGk453tKXMdUZhHMVY_SNV-jtIMIER77hIRIN7DD0yk7ybnIa7AZRj6&_nc_ohc=fWAFU4V_92QAX-Pyqhk&_nc_ht=scontent.fmdl2-2.fna&oh=04fbca9e0b7bd2c4086eb82062dfdf9b&oe=5EAE2F5A",
            "subtitle":"land type-(permit), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}


// to buy land in Zayathiri, 60*80
    else if (received_message.payload === 'tobuy_land_area_inzayad168') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 200 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92076615_147998313412635_430261903793586176_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeEVm_FWPjTJ2BufDDswKfkPFK-SCgwYCSYUr5IKDBgJJu5BnDZR4AHvnvwAnxyjlT9aGQZjA1mRTwhL9dwxDG9f&_nc_ohc=UQCbtGDcu14AX_cRlhb&_nc_ht=scontent.fmdl2-1.fna&oh=b8a6f31f69a2982e7fa3f50b97bfd7d8&oe=5EAED83E",
            "subtitle":"land type-(slit), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy land in Zayathiri, Other area
    else if (received_message.payload === 'tobuy_land_area_inzayad1other') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 250 lakhs, 4.32 arce",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91173485_147313630147770_7524269256431632384_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeHx7J_uE6K2gYtG3D2PPamXDrJ9p_115oQOsn2n_XXmhB0HVZ7f3lrYNBtzLgpB_vbEzwPaxQ6HungQm3Bqzy2q&_nc_ohc=DBqp7NaeREMAX_HivK2&_nc_ht=scontent.fmdl2-2.fna&oh=6b7e44248adb33bedc01617020c2509f&oe=5EAF7F6E",
            "subtitle":"land type-(permit), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
/************************************************/
/*************************************************/
  // to rent land in Zabuthiri, area
  else if (received_message.payload === "tezal") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "only46alandin_zabuu7_rent1",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "only60blandin_zabuu7_rent1",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "only68cclandin_zabuu7_rent1",
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "onlyother7dlandin_zabuu7_rent1",
                        }
                      ]
      }
  }

// to rent land in Zabuthiri,  60*60
    else if (received_message.payload === 'only60blandin_zabuu7_rent1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1.5 lakhs per month, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92401981_148398946705905_1667673824658718720_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeGaL6IGTy20gFrY_-GIyeNJuwpVQ952uLu7ClVD3na4u21FAthxsnpldZlENVuE1St4BuxvhXlda1-KwZfSYc5U&_nc_ohc=kvy3nWUh4R8AX8_CBXm&_nc_ht=scontent.fmdl2-1.fna&oh=0fa5d2b84682b6977536695d3e6fe792&oe=5EAED27B",
            "subtitle":"face south, land type-(grant), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy land in Zabuthiri,  40*60
    else if (received_message.payload === 'only46alandin_zabuu7_rent1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1 lakh per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91613770_148401023372364_5350547653220368384_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGOUGv8X4g8aZ7KMUkbj143aMv2-XqcnNxoy_b5epyc3Cnk6PadZmgqlkRrzQ4wGGBVuJTGEsvDBWUtO4ljXG3F&_nc_ohc=R-2gfYEIeG8AX-DceKM&_nc_ht=scontent.fmdl2-1.fna&oh=94b59f25df3b4848c60e90d9cf646833&oe=5EB20BEC",
            "subtitle":"face west, land type-(permit),Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy land in Zabuthiri,  100*100
    else if (received_message.payload === 'only68cclandin_zabuu7_rent1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 2 lakhs per month, 100*100 ft, face west,",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91810678_148403216705478_1277350765916061696_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeGssc_xyPyaeyFDkreQEylkRUbrTdet0OJFRutN163Q4mTLjEwCflsG5eofWpDqUaRGl647jk3Ph9AG_80NfmOy&_nc_ohc=IgL8saxP5bUAX_4kTPj&_nc_ht=scontent.fmdl2-1.fna&oh=b3f0f3b95ccef22e52f67856290eeef2&oe=5EB1A0F1",
            "subtitle":"land type-(village land),Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}




// to buy land in Zabuthiri,  Other area
    else if (received_message.payload === 'onlyother7dlandin_zabuu7_rent1' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1.5 lakhs per month, 80*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92100656_148405230038610_4893887046474530816_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeFDDuLfnVZj-6Zb_dij7f9eN5WYIm8s5m83lZgibyzmbyyQrMoO7j7TGod3Si3a4sh3egQATLC7pmbmzTaNiReP&_nc_ohc=zE-iyX7f2hUAX9uZRd6&_nc_ht=scontent.fmdl2-2.fna&oh=5a864e5a88facb440ce6aeeae5788ad7&oe=5EB1BE62",
            "subtitle":"land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

/*************************************************************************************************************/
/******************************************************************************************************************/


/************************************/

    // to rent land in Zayathiri twonship, area
  else if (received_message.payload === "tezayl") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "torentz_land_area_inzayad146",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",       
                          "payload": "torentz_land_area_inzayad160",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "torent_land_area_inzayad168",  
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "torent_land_area_inzayad1other",
                        }
                      ]
      }
  }

// to rent land in Zayathiri, 40*60
    else if (received_message.payload === 'torentz_land_area_inzayad146') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1 lakh for 1 month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91513938_147997343412732_2184803353274351616_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeHbEG6AVbBgKfxV7lLu7SEPDZHJLkRvnegNkckuRG-d6LVbeXwvrTB7r60wxpuqzmmPtlRTf3-CFc9YBIBz-8y-&_nc_ohc=bxsIVu2L0ywAX__8G89&_nc_ht=scontent.fmdl2-2.fna&oh=e401bc6e5d23e23c48dde30e65432005&oe=5EAFA9B4",
            "subtitle":"land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent land in Zayathiri, 60*60
    else if (received_message.payload === 'torentz_land_area_inzayad160') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1lakh for a month, 60*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91680436_148006486745151_4875582939536031744_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeGXoapM3L50BOyrZhvMyGHgpOOd7SlzHVGk453tKXMdUZhHMVY_SNV-jtIMIER77hIRIN7DD0yk7ybnIa7AZRj6&_nc_ohc=fWAFU4V_92QAX-Pyqhk&_nc_ht=scontent.fmdl2-2.fna&oh=04fbca9e0b7bd2c4086eb82062dfdf9b&oe=5EAE2F5A",
            "subtitle":"land type-(permit), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}


// to rent land in Zayathiri, 60*80
    else if (received_message.payload === 'torent_land_area_inzayad168') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1.5 lakh for a month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92076615_147998313412635_430261903793586176_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeEVm_FWPjTJ2BufDDswKfkPFK-SCgwYCSYUr5IKDBgJJu5BnDZR4AHvnvwAnxyjlT9aGQZjA1mRTwhL9dwxDG9f&_nc_ohc=UQCbtGDcu14AX_cRlhb&_nc_ht=scontent.fmdl2-1.fna&oh=b8a6f31f69a2982e7fa3f50b97bfd7d8&oe=5EAED83E",
            "subtitle":"land type-(slit), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent land in Zayathiri, Other area
    else if (received_message.payload === 'torent_land_area_inzayad1other') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1 lakh for a month, 4.32 arce",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91173485_147313630147770_7524269256431632384_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeHx7J_uE6K2gYtG3D2PPamXDrJ9p_115oQOsn2n_XXmhB0HVZ7f3lrYNBtzLgpB_vbEzwPaxQ6HungQm3Bqzy2q&_nc_ohc=DBqp7NaeREMAX_HivK2&_nc_ht=scontent.fmdl2-2.fna&oh=6b7e44248adb33bedc01617020c2509f&oe=5EAF7F6E",
            "subtitle":"land type-(permit), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}







/****************************************************************************************************************/
/***************************************************************************************************************/

    // to rent a house in Dekkhina
else if (received_message.payload === "tenandek") {
      response = {
                    "text":'Are you finding RC or Nancat?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_dekki1_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "Other type",
                          "payload": "ottype_dekki1_tenant",
                        }
                      ]

      }
  }
    // to rent a house (RC), in Dekkhina, what floor
  else if (received_message.payload === "rc_dekki1_tenant") {
    response = {
                  "text": "Please choose you want to buy the house in which",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_dekkii11_tenant1",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_dekkii11_tenant1",
                        },
                        {
                          "content_type": "text",
                          "title": " other",
                          "payload": "otherrrf_dekkii11_tenant1",
                        }
                      ]

      }
  }
      //  to rent (house)RC, onefloor, ask number of master bed in Dekkhina
  else if (received_message.payload === "onef_dekkii11_tenant1") {
    response = {
                  "text": "Please choose the house in which the number of master bed room has",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "below 3",
                          "payload": "numofmbed3below_mbra9_dekki_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "3 and above",
                          "payload": "numofmbed3above_mbraa9_dekki_tenant",
                        }
                      ]
      }
  }
 //  to rent (house)RC, one floor, master bed, below 3, in Dekkhina
    else if (received_message.payload === 'numofmbed3below_mbra9_dekki_tenant' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 3lakhs for 1month, 80*80ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91363682_147508756794924_5266172075797643264_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeHA6H63Lfk2n8MdoV6fvKAHQ1QLK-ETu2dDVAsr4RO7Z14RGYjL4TwfIEHEKw_aAoQ-pNJa1aobx9jRKA8XqEKL&_nc_ohc=7l9dplxRgIoAX8NLXI7&_nc_ht=scontent.fmdl2-2.fna&oh=e25ce0cd1af1007ac90094e640d1f32d&oe=5EADAF47",
            "subtitle":"Mbr-(1), Br-(2)",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
             {
            "title":"RC, 3.5 lakhs for 1month, 80*80ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91286836_147509506794849_5933917341455745024_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeHx1g6XyLyKkLOzsaRLy-u0VuG7Kym9I15W4bsrKb0jXldSbCCY1x4hJdY7_BvNatjaD9sx4_qGmjSee7rMUXQ6&_nc_ohc=tCNCHnDWmQIAX9slhQk&_nc_ht=scontent.fmdl2-1.fna&oh=a4e6326977b534d56c1c02852b995a93&oe=5EAF1C8B",
            "subtitle":"Mbr-(1), Br-(2), aircon-(1)",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
        {
            "title":"RC, 3 lakhs for 1month, 80*80ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91570352_147511090128024_4467115061306982400_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeE8PImDS4R0MgqGI1sFzyVzAsx2AeMe6uACzHYB4x7q4IE-8_emzDWyDeeSMGKBMQGRv1FsTI4N6QZGH_So2AZP&_nc_ohc=0FbsLYb1V40AX8pH3q_&_nc_ht=scontent.fmdl2-1.fna&oh=739c315ae114220d4e2e4ae8c7e836a1&oe=5EAE6852",
            "subtitle":"Mbr-(1), Br-(2), aircon-(2)",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1585891753790568&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}






/**************************************************************************/
    // to rent a house in Zabuthiri
else if (received_message.payload === "tenanzabu") {
      response = {
                    "text":'Are you finding RC or other type?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_zabu1_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "Other type",
                          "payload": "nancat_zabu1_tenant",
                        }
                      ]

      }
  }

  // to rent zabu, a house (RC), what floor
  else if (received_message.payload === "rc_zabu1_tenant") {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_zabuthiri11_tenant1",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_zabuthiri11_tenant1",
                        },
                        {
                          "content_type": "text",
                          "title": " Other floor",
                          "payload": "otherrrf_zabuthiri11_tenant1",  // not yet
                        }
                      ]

      }
  }
   // to rent zabu, a house (Rc), other floor, // for other floor
else if (received_message.payload === "otherrrf_zabuthiri11_tenant1") {
      response = {
                    "text":'There is no property avaliable. Sorry for you. Thanks for contacting us.'

      }
  }  
        // to rent zabu, a house (Rc), one floor, 
else if (received_message.payload === "onef_zabuthiri11_tenant1") {
      response = {
                    "text":'Do you want the house in which Mbr included or Br included?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Mbr",
                          "payload": "rcaabb1212_zabu1_tenant_mbr",
                        },
                        {
                          "content_type": "text",
                          "title": "Only Br",
                          "payload": "onlybedab1212_zabu1_tenant",
                        }
                      ]

      }
  }  

  // to rent zabu, house(RC), one floor,  master bed rooms
  else if (received_message.payload === "rcaabb1212_zabu1_tenant_mbr") {
    response = {
                   "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": " 3 lakhs & below it",
                          "payload": "masterbed60_zabuthi11_tenant3l",
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "masterbedother_zabuthi11_tenant_22",
                        }
                      ]           
      }
  }
  

  /***************************/

  // to rent zabu, house (RC), one floor, master bed, above 3 lakhs
    else if (received_message.payload === 'masterbedother_zabuthi11_tenant_22' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"RC, 4 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/l/t1.0-9/92212800_148345030044630_2321483867061485568_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeEHgbOBvCaxgFusYDxKkOYHMB_654nCR_QwH_rnicJH9E8V6SJFaSZkjtld4kKflRJEff8RSLUIxQ7DS3zpZxVu&_nc_ohc=3NmgwHWZbCkAX9SSlwS&_nc_ht=scontent.fmdl2-2.fna&oh=07b83b65a8103169f0b5034d976c3f71&oe=5EAF5471",
            "subtitle":"Mbr-(1), Br-(2)",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
  // to rent zabu, house (RC), one floor, master bed, 3 lakhs & below it
    else if (received_message.payload === 'masterbed60_zabuthi11_tenant3l' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"RC, 3 lakhs per month, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92456400_148341980044935_5315513626461732864_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeHNN47ovsGuR5e8dsrxSj9d9B_aE_fP7zD0H9oT98_vMBGBCjuvS_C2XJDiCZGxnCnclC8uUrekgKK8VV5rboY8&_nc_ohc=oNufEKNmhzEAX9443tx&_nc_ht=scontent.fmdl2-1.fna&oh=eed956df5875f01944ca64ec1d4dd20a&oe=5EAFB3BC",
            "subtitle":"Mbr-(2)",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
             {
            "title":"RC, 3 lakhs per month, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91955219_148335103378956_2829729028192075776_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeHYsY5ju_-UtnsMR-xcQDlg3NSNpodS4azc1I2mh1LhrMPrqOlTDU65CqHDQ8JVmDdP4O4QOQpjDSKLNTI4Y5Ys&_nc_ohc=hdrpmmN65d0AX_Ct4eh&_nc_ht=scontent.fmdl2-1.fna&oh=842a715790fdc40b511bdacabb0c63c9&oe=5EAF33DA",
            "subtitle":"Mbr-(2),Br-(2)",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}




/********************************************/

  
/**************************************************************************/
/**************************************************************************/

// to rent Zabu, one floor(RC), only bed rooms , area
  else if (received_message.payload === "onlybedab1212_zabu1_tenant") {
    response = {
                   "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "2 lakhs & below it",
                          "payload": "onlybed2belowit_zabuthi11_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "above 2 lakhs",
                          "payload": "onlybedroomabove2l_in_zabuu7_tenant",
                        }
                      ]           
      }
  }
  
   // to rent zabbuthiri, one floor(RC), bed room, 2 lakhs & below it
    else if (received_message.payload === 'onlybed2belowit_zabuthi11_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92576217_148333400045793_3715312904799518720_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeF1BrOLUKqeHmWQNb6jsq7oTvSeC72-wgdO9J4Lvb7CByIaS1cCmd5BQyrO5HBGXht-Xu7mDsWjUKEzUrSH3Vuc&_nc_ohc=Lwme8DQci5IAX8BCgcb&_nc_ht=scontent.fmdl2-2.fna&oh=c8f413c67152bc8a68af77cff5347623&oe=5EB17EB0",
            "subtitle":"3BD, face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
            {
            "title":"RC, 2 lakhs per month, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91923017_148322666713533_5407944088630591488_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeFY2FZaTFShXIcTo19BYxaHwWpR-0-xBjjBalH7T7EGODKvmZrQI1gTfbvakeY4jbOtWyZeQgiDbdPyDeipWD2h&_nc_ohc=Zc0JR1VZL-8AX81QyTU&_nc_ht=scontent.fmdl2-1.fna&oh=328e035a9f9256c1510c1f0fd96b1c60&oe=5EB1B88B",
            "subtitle":"3BD,  face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
 
 
   // to rent zabbuthiri, one floor(RC), bed room, above 2 lakhs
    else if (received_message.payload === 'onlybedroomabove2l_in_zabuu7_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC,  3 lakhs per month, 60*70ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92286133_148342503378216_8058588730224541696_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeGW9jsT3UUCPItS1rODRK9EqjIIL6S_Ya6qMggvpL9hrntDuQxVhp5423O7pzZ-QLsKl_y2RryQO5-634sWMyjF&_nc_ohc=UjaEQmobu1cAX9df-bm&_nc_ht=scontent.fmdl2-1.fna&oh=00176f4a33e5dabdbd4164e50de1fd24&oe=5EB1A6D0",
            "subtitle":"3BD, face west",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
/**********************/

// to rent zabu, house (other type)
    else if (received_message.payload === 'nancat_zabu1_tenant' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"RC, 1 lakh per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92055239_148410403371426_3609555549953196032_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeEcxWyddvgH7C0Z2B2n6syBX7GQJ4Ddfc1fsZAngN19zZZV7BUT4-dAQhBpIFP153IJzNvhPOpKrB4lWAPsT5j7&_nc_ohc=xGj5wNgncCEAX-XowML&_nc_ht=scontent.fmdl2-2.fna&oh=5bcf3aac02a9537be165941d2cd58004&oe=5EB13DBA",
            "subtitle":"land type-(grant),face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
/*****************************************************/

    // to rent a house in Zabuthiri, RC, two floor
  else if (received_message.payload === "twof_zabuthiri11_tenant1") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "torentbelow3_rctwofloorin_zabuu7_tenantac1", 
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",               
                          "payload": "torentabove3_rctwofloorin_zabuu7_tenantac1",
                        }
                      ]
      }
  }


  /***************************/



// to rent a house Zabbuthiri, RC, two floor, above 3 lakhs
    else if (received_message.payload === 'torentabove3_rctwofloorin_zabuu7_tenantac1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
          {
            "title":"RC,  4 lakhs per month, 60*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92823131_148347106711089_610544418763571200_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeFxWgAema5g4i2xFW9AdQBsOcp_FQlFfAY5yn8VCUV8BiwqdlL46YDiBCxY8iBhHIlW_rKc_ZUMlBXBZC2V_exy&_nc_ohc=k-b3E7YKzeoAX_Ds2Ud&_nc_ht=scontent.fmdl2-2.fna&oh=935494d72848dfee0dbf8c36fb149734&oe=5EB0066C",
            "subtitle":"Mbr-(2), Br-(1), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }


        ]
      }
    }
  }
}


// to rent a house Zabbuthiri, RC, two floor, 
    else if (received_message.payload === 'torentbelow3_rctwofloorin_zabuu7_tenantac1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 

             {
            "title":"RC,  3 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91774025_148348000044333_6815842511517384704_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeHzqDLnklGlQ1xWNu07MBlaHw1QFU91-UofDVAVT3X5SnGbhIDx7oZdYcEPqVUAalWsZknjEkUmzV8CvCGJRIrZ&_nc_ohc=zrefNImYLKcAX9YSeXG&_nc_ht=scontent.fmdl2-1.fna&oh=61bf79c95ef86a902df4a0fb2094cc82&oe=5EB0E892",
            "subtitle":"Mbr-(1), Br-(4), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          },
        {
            "title":"RC,  2.5 lakhs per month, 60*70 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92465912_148351516710648_1751142708715454464_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeG4Y_29JTV2nR-S0e4T_3l2jyTiAxhjiyWPJOIDGGOLJeN4MvyOK5riu_STZt4-BtlbQ1z-Nj2JZLgPhK7gDSRH&_nc_ohc=NlIAL0Jz0p0AX9IjMKA&_nc_ht=scontent.fmdl2-1.fna&oh=a059ee4af2076260fe6fa851d60ead96&oe=5EB1FB14",
            "subtitle":"Mbr-(2), Br-(4), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586068249490801&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }

        ]
      }
    }
  }
}
/*****************************************************************/
/*****************************************************************/










  /************************************************************************************************************************************/
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




// to sell house
 else if (received_message.payload === "tselott" || received_message.payload === "tselpob" || received_message.payload === "tseldek" || received_message.payload === "tselzaya" || received_message.payload === "tselzabu") {
         response = {
      "text":'Please tell the type of house that you want to sell like RC or Nancat'
    }
    received_message.payload = false;
    toselhou_byuser.to_sel_hou = true;
  }
 else if (received_message.text && toselhou_byuser.to_sel_hou === true) {
  userEntered_Hou_tosel.to_sel_hou = received_message.text;
         response = {
      "text":'How many floors is the house?'
    }
    toselhou_byuser.to_sel_hou = false;
    toselhou_byuser.howMuchRoom_hou = true;
  }
   else if (received_message.text &&  toselhou_byuser.howMuchRoom_hou === true) {
   userEntered_Hou_tosel.howMuchRoom_hou = received_message.text;
         response = {
       "text": "Do you have what types of room. Please tell me:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Master Bed",
                          "payload": "tosel_hou_tell_mb",
                        },
                       
                        {
                          "content_type": "text",
                          "title": "Bed room",
                          "payload": "tosel_hou_bedRoom",
                        },
                        {
                          "content_type": "text",
                          "title": "Both",
                          "payload": "tosel_hou_tell_both",
                        }
                      ]
    }
    toselhou_byuser.howMuchRoom_hou = false;
  }


// for master bed room
 else if (received_message.payload === "tosel_hou_tell_mb") {    
    response = {
      "text": "How many master bed rooms in your house?"
    }
    received_message.payload = false;
    toselhou_byuser.area_hou_inOtt = true;
  }

  // for bed room
   else if (received_message.payload === "tosel_hou_bedRoom") {    
    response = {
      "text": "How many bed rooms in your house?"
    }
    received_message.payload = false;
    toselhou_byuser.area_hou_inOtt = true;
  }


  // for both master bed room and bed room
 else if (received_message.payload === "tosel_hou_tell_both") {
   response  = { "text": "How many master bed rooms in your house?" 
  }
  received_message.payload = false;
  toselhou_byuser.forSell_both_room = true;
}
 else if (received_message.text && toselhou_byuser.forSell_both_room === true) {  
  userEntered_Hou_tosel.forSell_both_room = received_message.text; 
    response = {
      "text": "How many bed rooms in your house?"
    }
    toselhou_byuser.forSell_both_room = false;
    toselhou_byuser.area_hou_inOtt = true;
  } 


 else if (received_message.text && toselhou_byuser.area_hou_inOtt === true) { 
  userEntered_Hou_tosel.area_hou_inOtt = received_message.text;   
    response = {
      "text": "How much area is your yard?"
    }
    toselhou_byuser.area_hou_inOtt = false;
    toselhou_byuser.photos_ott = true;
  }
  else if (received_message.text && toselhou_byuser.photos_ott  === true) {
   userEntered_Hou_tosel.photos_ott = received_message.text;
         response = {
       "text": "Could you send me inside and outside photos with regard to your house?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "I will send now.",
                          "payload": "send_now_photos_hou_inAndOut",
                        },
                        {
                          "content_type": "text",
                          "title": "Later",
                          "payload": "tosel_hou_tell_both",
                        }
                      ]
    }
    toselhou_byuser.photos_ott = false;
  }


   else if (received_message.payload === "send_now_photos_hou_inAndOut") { 
    response = {
      "text": "OK, Send me."
    }
     received_message.payload = false;
     toselhou_byuser.attach_Hou = true;
  }
  else if (received_message.attachments && toselhou_byuser.attach_Hou == true) {
      userEntered_Hou_tosel.attach_Hou = received_message.attachments; 
    // Get the URL of the message attachment
    let attachment_url_photo = userEntered_Hou_tosel.attach_Hou[0,1].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "I received your photos. Do you want to send more?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url_photo,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes",
                "payload": "attach_yes111",
              },
              {
                "type": "postback",
                "title": "No",
                "payload": "attach_no_forSellingHouse",
              }
            ],
          }]
        }
      }
    }
    toselhou_byuser.attach_Hou = false;
  }




    else if (received_message.text && toselhou_byuser.estimated_price_forSell == true) {
    userEntered_Hou_tosel.estimated_price_forSell = received_message.text;
    response = {
      "text":"Please tell me the address of own house to be sold"
    }
    toselhou_byuser.estimated_price_forSell = false;
    toselhou_byuser.ph_num = true;
  } 

   else if (received_message.text && toselhou_byuser.ph_num == true) {
    userEntered_Hou_tosel.ph_num = received_message.text;
    response = {
      "text":"Please leave me your phone number and I will contact you later. Thanks for contacting us."
    }
    toselhou_byuser.ph_num = false;
  } 



   

// for land to be sold by customer
 else if (received_message.payload === "tselottlan" || received_message.payload === "tselpoblan" || received_message.payload === "tseldeklan" || received_message.payload === "tselzayalan" || received_message.payload === "tselzabulan") {
         response = {
      "text":'Please tell the area of land that you want to sell.'
    }
    received_message.payload = false;
    tosel_land_byuser.land_type_tosell = true;
  }
 else if (received_message.text && tosel_land_byuser.land_type_tosell === true) {
  userEntered_land_tosel.land_type_tosell = received_message.text;
         response = {
      "text":'Please tell the type of land that you want to sell.'
    }
    tosel_land_byuser.land_type_tosell = false;
    tosel_land_byuser.land_name_tosell = true;
  }
   else if (received_message.text &&  tosel_land_byuser.land_name_tosell === true) {
   userEntered_land_tosel.land_name_tosell = received_message.text;
         response = {
       "text": "Min yak land ka min a myie pauk lar?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": ".Yes.",
                          "payload": "tosel_land_yes",
                          "image_url":"http://example.com/img/green.png"
                        },
                        {
                          "content_type": "text",
                          "title": ".No.",
                          "payload": "tosel_hou_no",
                          "image_url":"http://example.com/img/red.png"
                        }
                      ]
    }
    tosel_land_byuser.land_name_tosell = false;
  }

 else if (received_message.payload === "tosel_land_yes" || received_message.payload === "tosel_hou_no") {
         response = {
       "text": "Could you send me photos with regard to your land?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "I will send now.",
                          "payload": "send_now_photos_land",
                        },
                        {
                          "content_type": "text",
                          "title": "Later",
                          "payload": "tosel_later_land",
                        }
                      ]
    }
//    toselhou_byuser.photos_ott = false;
  }


   else if (received_message.payload === "send_now_photos_land") { 
    response = {
      "text": "OK, Send me."
    }
     received_message.payload = false;
     tosel_land_byuser.attach_land_tosell = true;
  }
  else if (received_message.attachments && tosel_land_byuser.attach_land_tosell == true) {
      userEntered_land_tosel.attach_land_tosell = received_message.attachments; 
    // Get the URL of the message attachment
    let attachment_url_land = userEntered_land_tosel.attach_land_tosell[0,1].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "I received your photos. Do you want to send more?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url_land,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes",
                "payload": "attach_yes_sell_land",
              },
              {
                "type": "postback",
                "title": "No, it is enough",
                "payload": "attach_no_sell_land",
              }
            ],
          }]
        }
      }
    }
    tosel_land_byuser.attach_land_tosell = false;
  }

    else if (received_message.text && tosel_land_byuser.estimated_price_land == true) {
    userEntered_land_tosel.estimated_price_land = received_message.text;
    response = {
      "text":"Please tell me the address of own land to be sold"
    }
    tosel_land_byuser.estimated_price_land = false;
    tosel_land_byuser.address_land_tosell = true;
  } 
  else if (received_message.text && tosel_land_byuser.address_land_tosell == true) {
    userEntered_land_tosel.address_land_tosell = received_message.text;
    response = {
      "text":"Please leave me your phone number and I will contact you later. Thanks for contacting us."
    }
    tosel_land_byuser.address_land_tosell = false;
    tosel_land_byuser.ph_num_land = true;
  } 
   else if (received_message.text && tosel_land_byuser.ph_num_land == true) {
    userEntered_land_tosel.ph_num_land = received_message.text;
    response = {
      "text":"Please leave me your phone number and I will contact you later. Thanks for contacting us."
    }
    tosel_land_byuser.ph_num_land = false;
  } 



/*  if (received_message.text == "ahii") {    
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
  }
  // to rent in main menu
  else if (payload === 'tore') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                      "text": "Please choose below options:",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "Landlord",
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
  }
  // landlord in to rent in main menu
  else if (payload === 'ldld') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "button",
                      "text": "Please choose one of  the options to tell what you want to rent",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "House",
                          "payload": "hou_option",
                        },
                        {
                          "type": "postback",
                          "title": "Land",
                          "payload": "land_option",
                        }
                      ]
                  }
                }
              }
  }
  // house in landlord
  else if (payload === 'hou_option') {
    let response1 = { "text": "You have chose to rent out house as a Landlord." };
    let response2 = { "attachment":{

      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"In what township is your house located? Please choose:",
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
  // five thiri (house) in landlord
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
  // for land option
    else if (payload === 'land_option') {
    let response1 = { "text": "You have chose to rent out land as a Landlord." };
    let response2 = { "attachment":{

      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"In what township is your land located? Please choose:",
         "buttons":[
                    {
                    "type":"postback",
                    "title":" In Five Thiri Twp",
                    "payload": "ldld5_land"
                    },
                    {
                    "type":"postback",
                    "title":"Pyinmana Twp",
                    "payload":"ldld_pyin_land"
                    }                            
                  ]  
                }
        }
   };
   callSend(sender_psid, response1).then(()=>{
  return callSend(sender_psid, response2);
  });
  }
  else if (payload === 'ldld5_land') {
         response = {
                  "text": "Please choose the one name of townships in which you want to rent a land.",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "ld_ottwp_land",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "ld_potwp_land",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "ld_dektwp_land",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "ld_zaytwp_land",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "ld_zabtwp_land",
                        }
                      ]

      }
  }




  // for tenant
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



  // to buy house 
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


/*
  else if (payload === 'othft') {
    response = { "text": "Please write the area of  property that you want to buy!" }
  } 
  */
/*
// above 1000
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
*/
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
                    "text": "Please choose the place in which you want to buy land. If you want to buy land in any township, please choose Any Township",
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
    else if (payload === 'attach_no_forSellingHouse') {
        response = {
                  "text": "Please tell me the estimated price that you want to get"
      }
      toselhou_byuser.estimated_price_forSell = true;
  }
    else if (payload === 'attach_no_sell_land') {
        response = {
                  "text": "Please tell me the estimated price that you want to get"
      }
      tosel_land_byuser.estimated_price_land = true;
  }
   else if (payload === 'attach_no_ldld_land') {
        response = {
                  "text": "Please tell me the estimated price that you want to get"
      }
      ldld_land_sent.estimated_price_ldld = true;
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
