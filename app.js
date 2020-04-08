
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

  // to buy house in pyinmana,
  else if (received_message.payload === "pyintwp" ) {
    response = {
                  "text": "Please choose the below option:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "tobuyrcpyin_aa1",
                        },
                        {
                          "content_type": "text",
                          "title": "Other type",
                          "payload": "tobuyothertypepyin_bb1",
                        }
                      ]

      }
  }
 
// to buy house in pyinmana, RC
  else if (received_message.payload === "tobuyrcpyin_aa1" ) {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_pyinfloor11",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twoff_pyinfloora11",
                        },
                        {
                          "content_type": "text",
                          "title": "Other floor",
                          "payload": "otherf_pyinfloorbb11",
                        }
                      ]

      }
  }
 
// to buy house in pyinmana, RC, one floor, 
  else if (received_message.payload === "onef_pyinfloor11") {
    response = {
                  "text": "Do you want the house in which Mbr is included or only Br included?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Mbr",
                          "payload": "tobupyinrc_onefmbr_hh1",
                        },
                        {
                          "content_type": "text",
                          "title": "Only Br",
                          "payload": "tobupyinrc_onfonlybr_hhaa1",
                        }
                      ]
      }
  }

// to buy house in pyinmana, RC, one floor, Mbr
  else if (received_message.payload === "tobupyinrc_onefmbr_hh1") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "tobuhourcpyin46_tobuaa7",
                        },
                        {
                          "content_type": "text",
                          "title": "60*72",
                          "payload": "tobuhourcpyin172_tobunn7",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobuhourcpyin68_tobumma1",
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "tobuhourcpyinotherarea_tobummb",
                        }
                      ]
      }
  }



// to buy house in pyinmana, RC, one floor, Mbr, 40*60
  else if (received_message.payload === "tobuhourcpyin46_tobuaa7") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 800 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91664968_149027856643014_3018289688898174976_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeGRHIaeZKMyPNKfOeoww905B5sI3sATrD4HmwjewBOsPpGS3GqeitBU4k6asf5ijfHtiXTjJyQUo9u9DVzydHqd&_nc_ohc=kMOWTJMbEHIAX_qTSw1&_nc_ht=scontent.fmdl2-2.fna&oh=81eaeca5b4bd3145141aaeb803aa522b&oe=5EB1858C",
            "subtitle":"Mbr-(1), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in pyinmana, RC, one floor, Mbr, 60*72
  else if (received_message.payload === "tobuhourcpyin172_tobunn7") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 550 lakhs, 60*72 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92353603_149043869974746_8473619924072267776_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeGgvj4JXTB-BaKlrv6fCWkPD8Wz4sbkNI8PxbPixuQ0j4z4WFsuBeE4rDoXcka8l3DzzgHyop1A6jQY9BeyxOWv&_nc_ohc=UwLfnfMu-QQAX-lKiLp&_nc_ht=scontent.fmdl2-1.fna&oh=7c3a2dc9036f0c70cc5e9cb0eb33e15c&oe=5EB1873A",
            "subtitle":"Mbr-(1), Br-(2), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in pyinmana, RC, one floor, Mbr, 60*80
  else if (received_message.payload === "tobuhourcpyin68_tobumma1") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 850 lakhs, Width-(60*80)",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92345669_149033143309152_6933827548061106176_n.jpg?_nc_cat=105&_nc_sid=110474&_nc_eui2=AeEI4W8wxQk3tk9YgjJjQ_vGP1pHh5H1KD8_WkeHkfUoPxtx5_-T7IVd-7alAloGuyAZbuYPZOCOJab3je027jsy&_nc_ohc=sBvJQg8bkjYAX9G8Kpp&_nc_ht=scontent.fmdl2-2.fna&oh=382cf06a14c01e693485808b266b26d7&oe=5EB4B0D5",
            "subtitle":"Mbr-(2), Br-(1), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in pyinmana, RC, one floor, Mbr, Other area
  else if (received_message.payload === "tobuhourcpyinotherarea_tobummb") {
    response = {
            "text":"There is no property avaliable to sell. Sorry for you. Thanks for contacting us."
    }
  }


/**********************************/


// to buy house in pyinmana, RC, two floor
  else if (received_message.payload === "twoff_pyinfloora11") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "tobuytwof_rcpyin_a46ab",
                        },
                        {
                          "content_type": "text",
                          "title": "60*72",
                          "payload": "tobuytwof_rcpyin_a672cca",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobuytwof_rcpyin_a68dda",
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "tobuytwof_rcpyin_otherarea7c",
                        }
                      ]
      }
  }


// to buy house in pyinmana, RC, two floor, 40*60
  else if (received_message.payload === "tobuytwof_rcpyin_a46ab") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 2300 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91909041_149045459974587_3734464206922055680_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeFU2LcrrLbR-1h9foxAhqdQB74mqwENAW0HviarAQ0BbSVC1u_Z_umhu8d7qGBi4uix6EwDxD8Fe-cH_uN1RPuC&_nc_ohc=puXGjPNCVz4AX8fgEfL&_nc_ht=scontent.fmdl2-1.fna&oh=ea5563303495ed0876589d4e0ae7a747&oe=5EB36069",
            "subtitle":"Mbr-(4), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in pyinmana, RC, two floor, 60*72
  else if (received_message.payload === "tobuytwof_rcpyin_a672cca") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 1800 lakhs, 60*72 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91663260_149049396640860_3878909622148399104_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeGHkGRYDmdeavjzqEgTafF6vGtLT4QsOYC8a0tPhCw5gGfUGkXLqAvDbcmS2kynpkc427C_nqwWJyVMHf6lzNw7&_nc_ohc=aXbSPOJrDXwAX_7A_Ij&_nc_ht=scontent.fmdl2-2.fna&oh=d5558fa54bef9dc6a18a5cde99b328df&oe=5EB32EB3",
            "subtitle":"Mbr-(2), Br-(1), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

  // to buy house in pyinmana, RC, two floor, 60*80
  else if (received_message.payload === "tobuytwof_rcpyin_a68dda") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 2500 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91647057_149048646640935_1634770849003208704_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeF5T-k7A2rpdAenpQX7rnQypSsvlvO9AJ2lKy-W870AneezH0bEyn8dFfPyyEkjsM0EKd0vLicVlYL82SSzmRXI&_nc_ohc=vKqTcuhKlTkAX-qAIiB&_nc_ht=scontent.fmdl2-1.fna&oh=759375e2414be0c936669dd1904a9f24&oe=5EB2C4F0",
            "subtitle":"Mbr-(4), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in pyinmana, RC, two floor,  other area
  else if (received_message.payload === "tobuytwof_rcpyin_otherarea7c") {
    response = {
              "text":"There is no property avaliable. Sorry for you. Thanks for contacting us."
    }
  }


/********/
  // to buy house in pyinmana, other type 
  else if (received_message.payload === "tobuyothertypepyin_bb1") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"Hta yan, 390 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91623696_149051576640642_6569864859687583744_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeEi8PLXTZ7dbcj0r4LuXMSKGzY8vi0XI_wbNjy-LRcj_J-l8rj7nrr5RKGDKhXzF0bfZMCYV62C31nmSRcYYpAG&_nc_ohc=9vhkrWERlZ4AX-boxAQ&_nc_ht=scontent.fmdl2-1.fna&oh=dc6ab30e9ee13b2d3e7e37f6fbbbef72&oe=5EB4F884",
            "subtitle":"land type-(slit), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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




/*******************************************************************/

// to buy house in pyinmana, RC, one floor, only Br
  else if (received_message.payload === "tobupyinrc_onfonlybr_hhaa1") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 590 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/93006985_149029053309561_9111199899243773952_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeGN4AW6ko1xllvDTB1lMk_-xqdjdqz30iXGp2N2rPfSJcztXgS9CVS0gWOyOv6fpA6qL1F9oxqB8ExhpUyLK8Tj&_nc_ohc=98DZRtLQ7vgAX_QO6g-&_nc_ht=scontent.fmdl2-1.fna&oh=6f4d97ea113ef2ffc55e193a5b05eacb&oe=5EB13839",
            "subtitle":"Br-(2), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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



// to buy house in pyinmana, RC, other floor
  else if (received_message.payload === "otherf_pyinfloorbb11") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"3RC, 2900 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92246313_149054849973648_703440635775942656_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeGQUfxVnvZWijR4b8rEp1d3jNzI0_OEBaKM3MjT84QFopl4xHDm84RGqQl8E9qT_OpLskADmC5FYTxR1IVWWySf&_nc_ohc=PEniN76E7_gAX87FiHI&_nc_ht=scontent.fmdl2-1.fna&oh=51c68a01e618292c014e23cf4975744e&oe=5EB2E05D",
            "subtitle":"Mbr-(3), Br-(2), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

  // to buy house in oattra, RC
  else if (received_message.payload === "ottwp" ) {
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
 
// to buy house in oattra, RC, one floor
  else if (received_message.payload === "onef_ott") {
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
                        }
                      ]
      }
  }


// to buy house in oattra, RC, one floor, 80*80
    else if (received_message.payload === '80_in_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 2500 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92351629_148794463333020_2221158640822255616_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeFm1wi0SGzyni_3NnxhV8Kj1lNwb3N4O3bWU3Bvc3g7dqEGpoxFQfLp2LSy7mRPgwj9ppl6UkkYIqzQC9mAFgW7&_nc_ohc=l2RNd7uB4IgAX-owFfd&_nc_ht=scontent.fmdl2-1.fna&oh=75c5576355ba2da2eeccbc1905d08e25&oe=5EB07C45",
            "subtitle":"Mbr-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in oattra, RC, one floor, 100*100
    else if (received_message.payload === '100_in_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 3000 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91912200_148783696667430_2449683035914764288_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeGtmRWzKn14WcOyBlHpkLA8U4OdKoYtcohTg50qhi1yiCt7wEw-ep9s_RQgz5V370kLzW9e5txrxVGQj_84K-09&_nc_ohc=CcVp57UKpFIAX-DJiRB&_nc_ht=scontent.fmdl2-1.fna&oh=76724e70158faba1e3386ff9413e2251&oe=5EB1FE9D",
            "subtitle":"Mbr-(4), Br-(1), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in oattra, RC, one floor, 150*150
    else if (received_message.payload === '150_in_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 4000 lakhs, 150*150 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92455881_148780726667727_1440690996407959552_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGf9LydtrRy0Pv5ZMogA6x-iVE1BTJAoH6JUTUFMkCgfvVyire9NqORSOcCe7roMWslwom0L_MecnwPhfXdtz8B&_nc_ohc=c_ZjDikT9XUAX_auGhw&_nc_ht=scontent.fmdl2-1.fna&oh=f48d774f3ef4ed31d7c61775f042646d&oe=5EB1CDC2",
            "subtitle":"Mbr-(3), land type-(grant), face west, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

/**********************************/


// to buy house in oattra, RC, two floor
  else if (received_message.payload === "twof_ott") {
    response = {
                  "text": "Do you want how much wide area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "twof80_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "twof100_in_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "150*150",
                          "payload": "twof150_in_ott",
                        }
                      ]
      }
  }


// to buy house in oattra, RC, two floor, 80*80
    else if (received_message.payload === 'twof80_in_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 2000 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92243595_148808969998236_2207483370462511104_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeHszxekDwF7YUypu6w1O-DkdSzCbXL8J9d1LMJtcvwn154x57tv3s4IbYD7nFu1S0dUVp_ws3dUsXZkjbhpG3nb&_nc_ohc=35Ffa_2E5iEAX8p4DMu&_nc_ht=scontent.fmdl2-1.fna&oh=0f0e59f714a518ed5914f0f8caa3142a&oe=5EB1EA06",
            "subtitle":"Mbr-(1), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in oattra, RC, two floor, 100*100
    else if (received_message.payload === 'twof100_in_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 3000 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92577724_148801386665661_3656608166516359168_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeFt0-dDc-FGDdhKVueJlnJ7eVXqTKuoYJR5VepMq6hglO7w10RQQYRLvizT9e3NUsFd9Hq7Sv4Q9md3EZJSnycB&_nc_ohc=rhTJjCGelPwAX8IZTtf&_nc_ht=scontent.fmdl2-1.fna&oh=53d7c2e67a80d3219997f94554bdf57e&oe=5EB19DF0",
            "subtitle":"Mbr-(2), Br-(3), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in oattra, RC, two floor, 150*150
    else if (received_message.payload === 'twof150_in_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 5000 lakhs, 150*150 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91553411_148811056664694_2994737999507357696_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeEfP3OQyWSVC6Z-lY6HYqDWh_MT8b2h51aH8xPxvaHnVqPHPIBXsMgLEI-3fAuGNUnNKKIzHBw2Y-A6HGPqzGB3&_nc_ohc=gFqz7a__45AAX_2usbC&_nc_ht=scontent.fmdl2-1.fna&oh=5fe87bc5ad80fdbfdc83bf4ad011b8ca&oe=5EB3AC65",
            "subtitle":"Mbr-(2), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


// to buy house in oattra, RC, other floor
    else if (received_message.payload === 'otherf_ott') {
    response = {
            "text":"There is no property avaliable to sell. Sorry for you. Thanks for contacting us."
  }
}


/********************************************************************************/
/********************************************************************************/

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
  // to buy house in pobba, floor 
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
                          "title": "other floor",
                          "payload": "thirdf_pobb",
                        }
                      ]

      }
  }

  // to buy house in pobba, RC, one floor
  else if (received_message.payload === "onef_pobb") {
    response = {
                  "text": "Do you want the house in which Mbr is included or only Br included?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Mbr",
                          "payload": "tobuyhoupobb_rconefloor_mbr1122ab",
                        },
                        {
                          "content_type": "text",
                          "title": "Only Br",
                          "payload": "tobuyhoupobb_rconefloor_onlybr55ab",
                        }
                      ]
  }
}


  // to buy house in pobba, RC, one floor, Mbr
  else if (received_message.payload === "tobuyhoupobb_rconefloor_mbr1122ab") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "tobuyhoupobb_rconefmbr24inaa",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobuyhoupobb_rconefmbr68aaan",
                        },
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "tobuyhoupobb_rconefmbr88nnna",
                        }
                      ]
  }
}

// to buy house in pobba, RC, one floor, Mbr , 40*60
 else if (received_message.payload === 'tobuyhoupobb_rconefmbr24inaa') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"RC, 500 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92831429_148690140010119_457507630131183616_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeE9zcF8NnpLPKl62pX9HioMwM8Pb79goQXAzw9vv2ChBYUnC-ju8y6DZUIJF30zKiuGPVjBQrDDyMQP9wAMOxEJ&_nc_ohc=WduouaN1hjsAX8Uj_x2&_nc_ht=scontent.fmdl2-1.fna&oh=568c5bdef4e9ecc484fd7928f0c862e6&oe=5EB1E35A",
            "subtitle":"MBr-(1), Br-(2), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in pobba, RC, one floor, Mbr , 60*80
 else if (received_message.payload === 'tobuyhoupobb_rconefmbr68aaan') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"RC, 1300 lakhs, Negotiable, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92141671_148691213343345_4810507837039968256_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeFwzQz5Fa1a1b6rTxcMDxOf0Bja6JtczzLQGNrom1zPMqSLxn3HfxY3v96qaK0vlAQ0LhMVFdJUEFb6oQw1SSUu&_nc_ohc=cAMzawpv1dsAX-fiBFJ&_nc_ht=scontent.fmdl2-1.fna&oh=94b2d2e832e6a2d3e1929d3e019a22f5&oe=5EB20EC5",
            "subtitle":"MBr-(2), Br-(3), land type-(grant), face west and north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in pobba, RC, one floor, Mbr , 80*80
 else if (received_message.payload === 'tobuyhoupobb_rconefmbr88nnna') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"RC, 950 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92555021_148694693342997_4064605342099570688_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeHdSxG1IzD6iMZL01qEg0KzthAmkZBLAZK2ECaRkEsBklsHQStxScdsxZDKhJHFmGhjF-6yz9By88h_ESul1b2d&_nc_ohc=zrd5mQyTMQMAX_MAjMx&_nc_ht=scontent.fmdl2-2.fna&oh=a473039b886e5dc645e0483299e5c88a&oe=5EB34FB4",
            "subtitle":"MBr-(2), Br-(3), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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




/*****************************************/
  // to buy house in pobba, RC, one floor, only br
  else if (received_message.payload === "tobuyhoupobb_rconefloor_onlybr55ab") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "tobupob_rconef46_onlybrabk",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobupob_rconef68_onlybrccn",
                        }
                      ]
  }
}


// to buy house in pobba, RC, one floor, only br, 40*60
 else if (received_message.payload === 'tobupob_rconef46_onlybrabk') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"RC, 430 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91914495_148687560010377_1702487433695723520_n.jpg?_nc_cat=105&_nc_sid=110474&_nc_eui2=AeEOZdK9M-XbPElfW6-OzSBjbvX1hzyKvthu9fWHPIq-2IyUS6M1KZcr-ftHDgwK3b8LepAYlLLrEQLrbeKL1bxq&_nc_ohc=QNYEF48cQz0AX87rhGe&_nc_ht=scontent.fmdl2-2.fna&oh=e69a12e6ab242f0cb5ec60935ca32414&oe=5EB03155",
            "subtitle":"Br-(3), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in pobba, RC, one floor, only br, 60*80
 else if (received_message.payload === 'tobupob_rconef68_onlybrccn') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
          {
            "title":"RC, 770 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92218385_148692786676521_7587571937593786368_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeHw7G9pvs5W1UkZ7W2i9IEt4cZIyNWN-1fhxkjI1Y37V5ib-0Rln8vvNUgG0KIAlt7B1JzrM__9lFiO0dIDIpnZ&_nc_ohc=FygYy-47yrsAX8dEyVb&_nc_ht=scontent.fmdl2-1.fna&oh=e324701ad6206c5ea9c64763b885276e&oe=5EB37AF8",
            "subtitle":"Br-(3), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


// to buy house in pobba, other type(not RC)
 else if (received_message.payload === 'nancat_pobb') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
          {
            "title":"Nancat, 250 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91973807_148705810008552_1650041489260019712_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeG-bX8xeh_hI01ZsMR3FVTdwGLcxG1vk2DAYtzEbW-TYENQ6KNa30os6QZjpGd2-xDzuVslOpzjpqog2138-pNz&_nc_ohc=Fw9YqIe_wJUAX9bG4h0&_nc_ht=scontent.fmdl2-1.fna&oh=c891d7fd7a3d3e972d593b6075c5abc0&oe=5EB07818",
            "subtitle":"land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


  // to buy house in pobba, RC, two floor, area
  else if (received_message.payload === "twof_pobb") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "tobuyhoupobb_rctwof46pob",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobuyhoupobb_rctwof68aart",
                        },
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "tobuyhoupobb_rctwof88bbw",
                        }
                      ]
  }
}

// to buy house in pobba, RC, two floor, 40*60
 else if (received_message.payload === 'tobuyhoupobb_rctwof46pob') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"RC, 2500 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91606159_148757690003364_6476717670556237824_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeEwaNaIO6IktYPhZerxMcm7Qew2jPuaaEFB7DaM-5poQZvYiKqWGrH_lW38GzC0sEa2ozlem0muIfNfovwajN7B&_nc_ohc=xmULYHKmuWMAX8mWmY6&_nc_ht=scontent.fmdl2-1.fna&oh=896dcfb6903ac4aa391c915c34f871fc&oe=5EB37841",
            "subtitle":"MBr-(2), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in pobba, RC, two floor, 60*80
 else if (received_message.payload === 'tobuyhoupobb_rctwof68aart') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"RC, 900 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92517086_148751140004019_3914064358962888704_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeFoOvq0bRFW0r7Srwl3N0U6qLmh0okITviouaHSiQhO-AqAdJfPRZtbQ8jrzolCH2ITGEZeyM794Swu5gSj8kTf&_nc_ohc=PxwqZF2pwtAAX-4aXYH&_nc_ht=scontent.fmdl2-1.fna&oh=1754795b4c5cdf6738bdbfe5f46ea909&oe=5EB0B753",
            "subtitle":"MBr-(2), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


// to buy house in pobba, RC, two floor, 80*80
 else if (received_message.payload === 'tobuyhoupobb_rctwof88bbw') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"RC, 3500 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92463513_148754363337030_6063595422167859200_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeGEiOz1OhNnDp1HZmVLX-bLmqWuDQ1bDISapa4NDVsMhDw_xJfVd9Nb2PC9a3eG6ILKw0MuXJZGWA5_etoz-7jX&_nc_ohc=kMH-IN34uOYAX9JHqYO&_nc_ht=scontent.fmdl2-1.fna&oh=85e1416c08e94c83e9ef5265320950a4&oe=5EB30201",
            "subtitle":"MBr-(3), Br-(2), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


// to buy house in pobba, RC, other floor
 else if (received_message.payload === 'thirdf_pobb') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"3RC, 3600 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92138782_148707466675053_5918704202221092864_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeE_h3jBITkW7xkMqu3_I6ZSTbencPv31K1Nt6dw-_fUrRIBi2eMl4upeFefewulR61984TZbIxxpK-ya8_OLYqw&_nc_ohc=d7YY9JJ3fBsAX9uFLtw&_nc_ht=scontent.fmdl2-1.fna&oh=2328b837dd4e1233e2aa509045cc3207&oe=5EB3FC6E",
            "subtitle":"MBr-(4), Br-(2), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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





/******************************************************************/
/******************************************************************/

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
  // to buy house in dekkhina, RC 
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
                          "title": "Other floor",
                          "payload": "thirdf_dek",
                        }
                      ]

      }
  }

  /*************/
   // to buy house in dekkhina, one floor
  else if (received_message.payload === "onef_dek") {
    response = {
                  "text": "Do you want the house in Mbr is included or only Br is included?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Mbr",
                          "payload": "bed3below_onef_rcdek",
                        },
                        {
                          "content_type": "text",
                          "title": "Only Br",
                          "payload": "bed3above_onef_rcdek",
                        }
                      ]
      }
  }

 // to buy house in dekkhina, one floor, master bed rooms
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

// to buy house in dekkhina, one floor, master bed rooms, 40*60
    else if (received_message.payload === 'onlymbed60_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 500 lakhs, Negotiable, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92245880_148481666697633_6433120423902183424_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeEeGUe0TGLS1XEjX6nwNzcBNxTXZCW2Je43FNdkJbYl7tIqf-uNXDeKUlUi0pWUBOGIKtHd8JIBSLRkblglHHAP&_nc_ohc=mqbcuQ0ks-EAX9AWEzT&_nc_ht=scontent.fmdl2-2.fna&oh=d868b9ba495555422838bca22bf6303b&oe=5EB304F9",
            "subtitle":"Mbr-(1), Br-(2), land type-(grant), face north",
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
// to buy house in dekkhina, one floor, master bed rooms, 60*60
    else if (received_message.payload === 'onlymbed660_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 800 lakhs, Negotiable, 60*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91445925_148485046697295_1739358787334045696_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeGA59g1Eq2rzFxqTHPm8h5ssGJkZNEjmq6wYmRk0SOartKYjOWHG6IiKBAr6SKrIr9e6QmAOK-QGdIs5p0Y0mEU&_nc_ohc=8JFelcuNy_kAX_wuwkM&_nc_ht=scontent.fmdl2-2.fna&oh=8525134924d66c3695315772ac54e52e&oe=5EAF76D7",
            "subtitle":"Mbr-(2), Br-(2), land type-(grant), face south",
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
// to buy house in dekkhina, one floor, master bed rooms, 60*80
    else if (received_message.payload === 'onlymbed100_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 400 lakhs, Negotiable, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91949474_148491000030033_7105930383715205120_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeFscJl2_opzLdZiqdnm_oCGWd-1cNOO16tZ37Vw047XqxdZ5Qfc8SJ-NLZWL1Z_cd9VZ2MWZmWNJyEkyoDqzpnZ&_nc_ohc=iscyAtmF2M0AX-3drlf&_nc_ht=scontent.fmdl2-2.fna&oh=e5629cb9ebe58f455a966147752fd800&oe=5EAFEDAE",
            "subtitle":"Mbr-(1), Br-(2), land type-(grant), face north",
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
// to buy house in dekkhina, one floor, master bed rooms, 80*80
    else if (received_message.payload === 'onlymbed88in_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1000 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92321972_148491743363292_6429195652722327552_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeEqwI-uwIDFTBM3zt_CBLdLHGcnH8zhv6kcZycfzOG_qb2aCW33oMMXn-w2o_Arj_x0qh5QU5kHScL-MjgjWthi&_nc_ohc=KkkiuPGv2scAX-wB8ka&_nc_ht=scontent.fmdl2-2.fna&oh=e7d77cd379c1e46aa02ff6918ad1b4fc&oe=5EB099BD",
            "subtitle":"Mbr-(1), Br-(2), land type-(grant), face east, Negotiable",
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
// to buy house in dekkhina, one floor, master bed rooms, 100*100
    else if (received_message.payload === 'onlymbed100in_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1100 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92068119_148493423363124_2697475156808302592_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeE1QLiVH-Rb7yh21bwHI2eZZaKfYQqu9nZlop9hCq72dqIUX5kqBgEVI2S_QYt6TK1y0Y_0j4SALkTdMf50GrsH&_nc_ohc=nUmpMgOtFaMAX-BGYWW&_nc_ht=scontent.fmdl2-2.fna&oh=5e37b0599e61ff15ed2deed77f651314&oe=5EB1504A",
            "subtitle":"Mbr-(2), Br-(2), land type-(grant), face east, Negotiable",
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



/***************************************************/
  /**************************************************/
    // to buy house in dekkhina, one floor, only Br 
  else if (received_message.payload === "bed3above_onef_rcdek") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "tobuyhoutt1_onlybed46_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "tobuyhoutt1_onlybed66_dek",
                        }
                      ]
      }
  }



// to buy house in dekkhina, Rc, one floor, only bed room, 40*60
    else if (received_message.payload === 'tobuyhoutt1_onlybed46_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1600 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92230135_148477376698062_1564226552332288000_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeEZFBGf-MZFY-HQQT6oS8pmO89u87ddanY7z27zt11qdhxc_4UlJ2I4G8_DIhm9ZJ46w_KGePmKb2a2UtHGYbPN&_nc_ohc=9q5ZYbuYXb4AX8xMkbB&_nc_ht=scontent.fmdl2-1.fna&oh=a2879fe65108db605e44fc675cd3dacd&oe=5EB10535",
            "subtitle":"Br-(3), land type-(grant), face south, Negotiable",
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
// to buy house in dekkhina, Rc, one floor, only bed room, 60*60
    else if (received_message.payload === 'tobuyhoutt1_onlybed66_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 600 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92219891_148475833364883_1131803197657055232_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeHtU2QeVO9b4qfJE0XPMWpYrsg39WLRBKWuyDf1YtEEpdXXP2V1l_zqlic97MBMkayJmkRKcNMngu7v_6k1xrFe&_nc_ohc=xAUop79JbV0AX_LMFPB&_nc_ht=scontent.fmdl2-2.fna&oh=f3a4e613b2ddd6906b8c8fc14e62f731&oe=5EB08E82",
            "subtitle":"Br-(3), land type-(grant), face south, Negotiable",
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

 // to buy house in dekkhina, two floor, area
  else if (received_message.payload === "twof_dek") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "twof_aonlymbed46cc_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "twof_aonlymbed66ab_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "twof_aonlymbed68b_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "twof_aonlymbed88asin_dek",
                        },
                           {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "twof_aonlymbed100aabccdin_dek",
                        }
                      ]
      }
  }



// to buy house in dekkhina, Rc, two floor, 40*60
    else if (received_message.payload === 'twof_aonlymbed46cc_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1700 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91876881_148667190012414_7394498520390041600_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGuaoOd56cUfdGwui3Ch4l4sGU0IifrOl-wZTQiJ-s6Xx6MMoJkF3xvnBphVS2O_U5GlCuBHhd6H4S77b8PfSgq&_nc_ohc=6hUnCzBbpckAX9MCIC8&_nc_ht=scontent.fmdl2-1.fna&oh=ed5bd3759a0b22350acdc37a52866feb&oe=5EB18D68",
            "subtitle":"Mbr-(2), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


// to buy house in dekkhina, Rc, two floor, 60*60
    else if (received_message.payload === 'twof_aonlymbed66ab_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1900 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92583214_148663500012783_7353603237661900800_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeHLhaQy-lNjPoEct3xlK1U_GQY1Il0R_owZBjUiXRH-jIH7BrAfWbr-OQxrwCm-m6rKV9woFTMb-Nx0A-tXFq_t&_nc_ohc=sNpw-oCNFF4AX-hmd3q&_nc_ht=scontent.fmdl2-2.fna&oh=e726b585836f6d217c86d4ceeb13f5c2&oe=5EB109E4",
            "subtitle":"Mbr-(2), Br-(3), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in dekkhina, Rc, two floor, 60*80
    else if (received_message.payload === 'twof_aonlymbed68b_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 2000 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92244656_148661983346268_5412490990118240256_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeH7i1rOMS8eeDRAo6chNPk97R3saB8e7SztHexoHx7tLI80FOYBR4_5sP3UzCEmtsrIlOqG-g2UNFogclACx-h9&_nc_ohc=xGmu-HV_qU8AX-rAPLo&_nc_ht=scontent.fmdl2-1.fna&oh=7bb92d21c48c88bd788564994049ddd6&oe=5EB0B3E1",
            "subtitle":"Mbr-(3), Br-(1), land type-(grant), face west, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy house in dekkhina, Rc, two floor, 80*80
    else if (received_message.payload === 'twof_aonlymbed88asin_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 3500 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92460697_148661310013002_7562140512816201728_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGXPnWOsVIgxd191EVtq4QzAAmWNiurfdoACZY2K6t92sSwRjyS9-R7_Sb-5Pej0m04acQDvIDQ4SXSMQ0YxOoB&_nc_ohc=TuJg6KwfDIIAX867j8B&_nc_ht=scontent.fmdl2-1.fna&oh=0328354a18069d7a3a12fae8761f31b4&oe=5EB14705",
            "subtitle":"Mbr-(2), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
// to buy house in dekkhina, Rc, two floor, 100*100
    else if (received_message.payload === 'twof_aonlymbed100aabccdin_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 5500 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92177551_148650480014085_8591158172348055552_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeEMxLJE8yJWn12cjnsZ24IAXxiYUvJTRvdfGJhS8lNG9wGyTfx-GESmgXjRIL0gaQ64hSEgq1Hvx0in9dOMwglQ&_nc_ohc=x_SJl0kcdecAX-C0w-b&_nc_ht=scontent.fmdl2-1.fna&oh=e6d5a9d5b8271703d4c3c7177ca94266&oe=5EB33173",
            "subtitle":"Mbr-(5), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

/********************************/

// to buy house in dekkhina, Rc, other floor,
    else if (received_message.payload === 'thirdf_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 6500 lakhs, 50*75 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92667938_148681606677639_6253805066847780864_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeHNyDhSx0ovFtr7eWjPt3Raef0VwMYXhKh5_RXAxheEqDq_SNyzVRhmHguVKNiCzwNpYkdEkenidgHtp7xL2PtM&_nc_ohc=V5MmGn_sMAgAX8_t0wI&_nc_ht=scontent.fmdl2-2.fna&oh=d746a503f668daddb4760473f684da45&oe=5EB3D5D6",
            "subtitle":"Mbr-(3), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

/*****************/


// to buy house in dekkhina, other type (not RC)
    else if (received_message.payload === 'nancat_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"Nancat,  600 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/93101461_148684256677374_2200426120719892480_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeFye7mt4SB5HOSquEDbUdAioBRfEDs7j8KgFF8QOzuPwrNvkh5Pix0nh-XhaE6LM0qxdB2C4fDV7nJikI9tr3B7&_nc_ohc=ecor5tV1VtkAX-Tfk91&_nc_ht=scontent.fmdl2-1.fna&oh=0c28277c0ef5111f6a667a2725cdd824&oe=5EB0D393",
            "subtitle":"Brr-(3), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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



/*******************************************************************************************/
  /*********************************************************************************/

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

// to buy land in pyinmana
  else if (received_message.payload === "pyi5") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "land_a1_pyintobu",
                        },
                        {
                          "content_type": "text",
                          "title": "60*72",
                          "payload": "land_a2_pyintobu",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "land_a3_pyintobu",
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "other_a4_pyintobu",
                        }
                      ]
      }
  }



// to buy land in pyinmana,  40*60
    else if (received_message.payload === 'land_a1_pyintobu') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 320 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92273270_149016386644161_8370090244208328704_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeE52sRpZJEwHgD_qk7BsxhF8lo3ZWHm5gbyWjdlYebmBiXFhZUhkb9HDs_ZhoJzM2YdY7aQoSgc_HMPEWWmA_3v&_nc_ohc=epNjQ8-eoucAX-cBQFS&_nc_ht=scontent.fmdl2-2.fna&oh=02e1971e81f2d0ca73e007597207d5ba&oe=5EB4B1CD",
            "subtitle":"land type-(grant), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
// to buy land in pyinmana,  60*72
    else if (received_message.payload === 'land_a2_pyintobu') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 550 lakhs, 60*72 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91944330_149019299977203_418187470824275968_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeGRf4pbtPI2yrR1hioqwmrqUx4Q1W7AGlFTHhDVbsAaUXOwMiR5jVBk-CTXwNfLnUKhzY79QvgkcsFLvNay3Yej&_nc_ohc=ygPsk8r6Fj8AX_w1HYQ&_nc_ht=scontent.fmdl2-1.fna&oh=c53e99898e47b09c73ad6e09ae0e0a76&oe=5EB2BF4A",
            "subtitle":"land type-(permit), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
// to buy land in pyinmana,  60*80
    else if (received_message.payload === 'land_a3_pyintobu') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 670 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92591960_149017693310697_3011678316890423296_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeHLXhGDIb79vxF8QYyJV052I8KibjVY7yMjwqJuNVjvI_gG7dKIt-lLRrYTFAGvOUi0JfcOwSTaAjn1mthgroN3&_nc_ohc=A-hP-4EluUUAX_JCecN&_nc_ht=scontent.fmdl2-2.fna&oh=220f0279fed18da953714003aa959f3d&oe=5EB443CC",
            "subtitle":"land type-(permit), face west",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy land in pyinmana,  Other area
    else if (received_message.payload === 'other_a4_pyintobu') {
    response = {
            "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 200 lakhs, 80*70 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92700247_149058239973309_1026465551309864960_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeExfi6lyAGKnuAnGwzsqHIyb0fpY8_QSLBvR-ljz9BIsOBkiot-Xz6n2p0Os7XVh5PIEoLRp9oLcrpco0jAv7p1&_nc_ohc=3LoyEwb524wAX_eRpVY&_nc_ht=scontent.fmdl2-1.fna&oh=ab71d22ef0f26f9af995a94bdfd05633&oe=5EB2A610",
            "subtitle":"",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


/******************************************************/

// to buy land in oattra
else if (received_message.payload === "otthi") {
    response = {
                  "text": "Do you want how much wide area?",
                    "quick_replies": [
                          {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "land80_ott",
                        },
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
                        
                      ]
      }
  }

    // 80*80 to buy land in Oattra
    else if (received_message.payload === 'land80_ott') {
    response = {
                  "text": "So sorry for my customer. There are not vacant land avaliable in Oattra to sell yet. Thanks for contacting us.",
                   
      }
  }
  
// to buy land in Oattra, 100*100 
    else if (received_message.payload === 'land100_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 950 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92214064_148823976663402_9152721804815499264_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeE5sEj0zQN1gizaqKzK4jqfDRN3R7GAQNANE3dHsYBA0Dn3_dUa122xcWuru_HhUiwPHjAKpkq0y0c8JnBUYqO2&_nc_ohc=lSf1itb1gJgAX_y9iQG&_nc_ht=scontent.fmdl2-2.fna&oh=5358e63929940923de037ab8b2422941&oe=5EB24417",
            "subtitle":"land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy land in Oattra, 150*150
    else if (received_message.payload === 'land150_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 3000 lakhs, 150*150 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92236612_148822566663543_924747952507846656_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeHCzboYU7SdJuCwvLEkjxYqCX6qxvPEVK0JfqrG88RUrd8246mUsjl367MB4SnJkoGvu1o1SWZWx8yu1LY4_ow8&_nc_ohc=23dwXT1Le4kAX8PMZMY&_nc_ht=scontent.fmdl2-2.fna&oh=795d163e841c1d4e1f327d523c125170&oe=5EB1E800",
            "subtitle":"land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
/************************************************************************/


// to rent land in oattra
else if (received_message.payload === "teottl") {
    response = {
                  "text": "Do you want how much wide area?",
                    "quick_replies": [
                          {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "torentland80_ott",
                        },
                         {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "torentland100_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "150*150",
                          "payload": "torentland150_ott",
                        },
                        
                      ]
      }
  }

    // to rent land in Oattra 80*80
    else if (received_message.payload === 'torentland80_ott') {
    response = {
                  "text": "So sorry for my customer. There are not vacant land avaliable in Oattra to rent yet. Thanks for contacting us.",
                   
      }
  }
  
// to rent land in Oattra, 100*100 
    else if (received_message.payload === 'torentland100_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 3 lakhs per month, 100*100 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92214064_148823976663402_9152721804815499264_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeE5sEj0zQN1gizaqKzK4jqfDRN3R7GAQNANE3dHsYBA0Dn3_dUa122xcWuru_HhUiwPHjAKpkq0y0c8JnBUYqO2&_nc_ohc=lSf1itb1gJgAX_y9iQG&_nc_ht=scontent.fmdl2-2.fna&oh=5358e63929940923de037ab8b2422941&oe=5EB24417",
            "subtitle":"land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent land in Oattra, 150*150
    else if (received_message.payload === 'torentland150_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 5 lakhs per month, 150*150 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92236612_148822566663543_924747952507846656_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeHCzboYU7SdJuCwvLEkjxYqCX6qxvPEVK0JfqrG88RUrd8246mUsjl367MB4SnJkoGvu1o1SWZWx8yu1LY4_ow8&_nc_ohc=23dwXT1Le4kAX8PMZMY&_nc_ht=scontent.fmdl2-2.fna&oh=795d163e841c1d4e1f327d523c125170&oe=5EB1E800",
            "subtitle":"land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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





/*************************************************************************/


// to buy land in Pobba
  else if (received_message.payload === "pobthi") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "land40_pobbtobu2b",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "land80_pobbtobu26",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "land88_pobbtobu11",
                        }
                      ]
      }
  }

// to buy land in Pobba,  40*60
    else if (received_message.payload === 'land40_pobbtobu2b') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 150 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92167702_148702773342189_5409825490464669696_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeEti1pLlG7k25OTzKTQf04-pjbk1v9nX8GmNuTW_2dfwXsXNJoQeWmPOxUirjYllEYt5q9uZwa4S3u_0eTZck1A&_nc_ohc=kA-CJJG0XyUAX_ac-M1&_nc_ht=scontent.fmdl2-2.fna&oh=fc0291c46afed146bdc149f655125de9&oe=5EB17576",
            "subtitle":"land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy land in Pobba,  60*80
    else if (received_message.payload === 'land80_pobbtobu26') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 200 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91991273_148704343342032_3054495691972804608_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeH2wVSm5DsCLFesBvl46bpfPyPofjUfO_k_I-h-NR87-RcfEZJ_1P_ZadUUe5CAUmR5z69C4_9FqExGSFAOwEP3&_nc_ohc=_1KKYlteFSUAX_xCSrn&_nc_ht=scontent.fmdl2-2.fna&oh=5613774ed5b34ad38b6ae2dbd3e9b0ad&oe=5EB2F2F3",
            "subtitle":"land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy land in Pobba,  80*80
    else if (received_message.payload === 'land88_pobbtobu11') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 250 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92230031_148704800008653_4090756521791586304_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeEO-jxiti1JQNFThle_S_jni90HSvupMk6L3QdK-6kyTlrw3uARvolzrmtRPvT-L59Z7xSh0ScJrnM0KZ6yt89i&_nc_ohc=9-YiMcFx6PYAX-ioqAm&_nc_ht=scontent.fmdl2-2.fna&oh=6c479c912e372cff68cb16dae0b8a119&oe=5EB2F669",
            "subtitle":"land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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




/************************************************************************************/
/***********************************************************************************/


// to buy land in Dekkhia, area
else if (received_message.payload === "dekthi") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "tobude_onlya60land_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "tobude_onlya660land_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobude_onlya100land_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "tobude_onlya80landin_dek",
                        },
                           {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "tobude_onlyaland100in_dek",
                        }
                      ]
      }
  }

// to buy land in Dekkhina,  40*60
    else if (received_message.payload === 'tobude_onlya60land_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 330 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91505407_148674673344999_6438141773247152128_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeF4uScfWcHQXpzQBF9BpStZRNT1qYilTdNE1PWpiKVN0y7ChqSJLHs4ngoSb5pKvAVVipqp0GjVHMSjyivg1G0q&_nc_ohc=lVEN8hAPU54AX_xdhVc&_nc_ht=scontent.fmdl2-1.fna&oh=cf06386fb8b2c111e1a17b30067dffc6&oe=5EB13151",
            "subtitle":"land type-(permit), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy land in Dekkhina,  60*60
    else if (received_message.payload === 'tobude_onlya660land_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 150 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92573474_148671303345336_7972612929591705600_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeGesnpPNxDTxDFmi1AdqMus7LSNKmgELoPstI0qaAQugwvn0YmpYg4hao4tla6JxiL2ZjneVWReAHhUWWypHu8C&_nc_ohc=OXtbPECcRqQAX9j0Vek&_nc_ht=scontent.fmdl2-1.fna&oh=4807aa5ab7739151d174ccf1e1ce901e&oe=5EB0D709",
            "subtitle":"land type-(slit), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy land in Dekkhina,  60*80
    else if (received_message.payload === 'tobude_onlya100land_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 200 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92360334_148680736677726_5635709584476733440_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeHyQ1NLvMIClsn5S9QIthrSiiHWb8EfPkmKIdZvwR8-Sfo6ZfQDqr_NGT0QX3c8d_FzWTaqT6apxtC5-IO9-Vd6&_nc_ohc=5zDJC6ty8FUAX9oGqo0&_nc_ht=scontent.fmdl2-1.fna&oh=f5759657f5b871e2e7d77ef51f283966&oe=5EB1BD12",
            "subtitle":"land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy land in Dekkhina,  80*80
    else if (received_message.payload === 'tobude_onlya80landin_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 300 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92389436_148677910011342_4703647964088762368_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeFnxMTydi_PAoygFa_sT8N5uJO_gqWz6Ie4k7-CpbPoh8pkMLfxDCF6ftwhshOIPRxScJp-R0ziWNvAL4VPmjfp&_nc_ohc=JzfrZn2GFhEAX9P8dIL&_nc_ht=scontent.fmdl2-2.fna&oh=ff96c716d309c7663fcb68bc35e9c543&oe=5EB193A6",
            "subtitle":"land type-(permit), face east & north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy land in Dekkhina,  100*100
    else if (received_message.payload === 'tobude_onlyaland100in_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 350 lakhs,100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92023227_148678763344590_6163162711233396736_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeG1Yh-bM7cBszY0E37bemDdBgP3e6fdm5QGA_d7p92blNuE8eGcUXHPcSs7BtZkfLvhlKHV_h0OQEL5jmxzFKk-&_nc_ohc=YRk6tztDMhYAX-bzLfq&_nc_ht=scontent.fmdl2-1.fna&oh=f51d00030a755fd4a893773cf5e739a6&oe=5EB2E475",
            "subtitle":"land type-(permit), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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





/**************************************************************************************/
/**************************************************************************************/
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


/*****************************************************************/
/*****************************************************************/

// to rent land in Pyinmana
  else if (received_message.payload === "tepyinlan") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "torentlandpyin46_areab11",
                        },
                        {
                          "content_type": "text",
                          "title": "60*72",
                          "payload": "torentlandpyin672_areaaa1",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "torentlandpyin68_areacc11",
                        },
                         {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "torentlandpyinotherarea_areadd11",
                        }
                      ]
      }
  }

// to rent land in pyinmana,  40*60
    else if (received_message.payload === 'torentlandpyin46_areab11') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92273270_149016386644161_8370090244208328704_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeE52sRpZJEwHgD_qk7BsxhF8lo3ZWHm5gbyWjdlYebmBiXFhZUhkb9HDs_ZhoJzM2YdY7aQoSgc_HMPEWWmA_3v&_nc_ohc=epNjQ8-eoucAX-cBQFS&_nc_ht=scontent.fmdl2-2.fna&oh=02e1971e81f2d0ca73e007597207d5ba&oe=5EB4B1CD",
            "subtitle":"land type-(grant), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
// to rent land in pyinmana,  60*72
    else if (received_message.payload === 'torentlandpyin672_areaaa1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 3 lakhs per month, 60*72 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91944330_149019299977203_418187470824275968_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeGRf4pbtPI2yrR1hioqwmrqUx4Q1W7AGlFTHhDVbsAaUXOwMiR5jVBk-CTXwNfLnUKhzY79QvgkcsFLvNay3Yej&_nc_ohc=ygPsk8r6Fj8AX_w1HYQ&_nc_ht=scontent.fmdl2-1.fna&oh=c53e99898e47b09c73ad6e09ae0e0a76&oe=5EB2BF4A",
            "subtitle":"land type-(permit), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
// to rent land in pyinmana,  60*80
    else if (received_message.payload === 'torentlandpyin68_areacc11') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 2.5 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92591960_149017693310697_3011678316890423296_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeHLXhGDIb79vxF8QYyJV052I8KibjVY7yMjwqJuNVjvI_gG7dKIt-lLRrYTFAGvOUi0JfcOwSTaAjn1mthgroN3&_nc_ohc=A-hP-4EluUUAX_JCecN&_nc_ht=scontent.fmdl2-2.fna&oh=220f0279fed18da953714003aa959f3d&oe=5EB443CC",
            "subtitle":"land type-(permit), face west",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent land in pyinmana,  Other area
    else if (received_message.payload === 'torentlandpyinotherarea_areadd11') {
    response = {
            {
            "title":"land, 1.5 lakhs per month, 80*70 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92700247_149058239973309_1026465551309864960_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeExfi6lyAGKnuAnGwzsqHIyb0fpY8_QSLBvR-ljz9BIsOBkiot-Xz6n2p0Os7XVh5PIEoLRp9oLcrpco0jAv7p1&_nc_ohc=3LoyEwb524wAX_eRpVY&_nc_ht=scontent.fmdl2-1.fna&oh=ab71d22ef0f26f9af995a94bdfd05633&oe=5EB2A610",
            "subtitle":"land type-(permit), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaae"
              }              
            ]      
          }
  }
}



/******************************************************************/

// to rent land in Pobba
  else if (received_message.payload === "tepobl") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "land40_pobbtobu2ba_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "land80_pobbtobu26a_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "land88_pobbtobu11a_tenant",
                        }
                      ]
      }
  }

// to rent land in Pobba,  40*60
    else if (received_message.payload === 'land40_pobbtobu2ba_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1 lakh per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92167702_148702773342189_5409825490464669696_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeEti1pLlG7k25OTzKTQf04-pjbk1v9nX8GmNuTW_2dfwXsXNJoQeWmPOxUirjYllEYt5q9uZwa4S3u_0eTZck1A&_nc_ohc=kA-CJJG0XyUAX_ac-M1&_nc_ht=scontent.fmdl2-2.fna&oh=fc0291c46afed146bdc149f655125de9&oe=5EB17576",
            "subtitle":"land type-(grant), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent land in Pobba,  60*80
    else if (received_message.payload === 'land80_pobbtobu26a_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1.5 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91991273_148704343342032_3054495691972804608_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeH2wVSm5DsCLFesBvl46bpfPyPofjUfO_k_I-h-NR87-RcfEZJ_1P_ZadUUe5CAUmR5z69C4_9FqExGSFAOwEP3&_nc_ohc=_1KKYlteFSUAX_xCSrn&_nc_ht=scontent.fmdl2-2.fna&oh=5613774ed5b34ad38b6ae2dbd3e9b0ad&oe=5EB2F2F3",
            "subtitle":"land type-(grant), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent land in Pobba,  80*80
    else if (received_message.payload === 'land88_pobbtobu11a_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 2.5 lakhs per month, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92230031_148704800008653_4090756521791586304_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeEO-jxiti1JQNFThle_S_jni90HSvupMk6L3QdK-6kyTlrw3uARvolzrmtRPvT-L59Z7xSh0ScJrnM0KZ6yt89i&_nc_ohc=9-YiMcFx6PYAX-ioqAm&_nc_ht=scontent.fmdl2-2.fna&oh=6c479c912e372cff68cb16dae0b8a119&oe=5EB2F669",
            "subtitle":"land type-(grant), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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



/******************************************************************/


// to rent land in Dekkhia, area
else if (received_message.payload === "tedekl") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "torede_onlya4646land_dek_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "torede_onlya660land_dek_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "torede_onlya6868land_dek_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "torede_onlya88landin_dek_tenant",
                        },
                           {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "torede_onlyaland100in_dek_tenant",
                        }
                      ]
      }
  }

// to rent land in Dekkhina,  40*60
    else if (received_message.payload === 'torede_onlya4646land_dek_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1 lakh per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91505407_148674673344999_6438141773247152128_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeF4uScfWcHQXpzQBF9BpStZRNT1qYilTdNE1PWpiKVN0y7ChqSJLHs4ngoSb5pKvAVVipqp0GjVHMSjyivg1G0q&_nc_ohc=lVEN8hAPU54AX_xdhVc&_nc_ht=scontent.fmdl2-1.fna&oh=cf06386fb8b2c111e1a17b30067dffc6&oe=5EB13151",
            "subtitle":"land type-(permit), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent land in Dekkhina,  60*60
    else if (received_message.payload === 'torede_onlya660land_dek_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1.5 lakhs per month, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92573474_148671303345336_7972612929591705600_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeGesnpPNxDTxDFmi1AdqMus7LSNKmgELoPstI0qaAQugwvn0YmpYg4hao4tla6JxiL2ZjneVWReAHhUWWypHu8C&_nc_ohc=OXtbPECcRqQAX9j0Vek&_nc_ht=scontent.fmdl2-1.fna&oh=4807aa5ab7739151d174ccf1e1ce901e&oe=5EB0D709",
            "subtitle":"land type-(slit), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent land in Dekkhina,  60*80
    else if (received_message.payload === 'torede_onlya6868land_dek_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 2 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92360334_148680736677726_5635709584476733440_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeHyQ1NLvMIClsn5S9QIthrSiiHWb8EfPkmKIdZvwR8-Sfo6ZfQDqr_NGT0QX3c8d_FzWTaqT6apxtC5-IO9-Vd6&_nc_ohc=5zDJC6ty8FUAX9oGqo0&_nc_ht=scontent.fmdl2-1.fna&oh=f5759657f5b871e2e7d77ef51f283966&oe=5EB1BD12",
            "subtitle":"land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to buy land in Dekkhina,  80*80
    else if (received_message.payload === 'torede_onlya88landin_dek_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 2.5 lakhs per month, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92389436_148677910011342_4703647964088762368_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeFnxMTydi_PAoygFa_sT8N5uJO_gqWz6Ie4k7-CpbPoh8pkMLfxDCF6ftwhshOIPRxScJp-R0ziWNvAL4VPmjfp&_nc_ohc=JzfrZn2GFhEAX9P8dIL&_nc_ht=scontent.fmdl2-2.fna&oh=ff96c716d309c7663fcb68bc35e9c543&oe=5EB193A6",
            "subtitle":"land type-(permit), face east & north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


// to rent land in Dekkhina,  100*100
    else if (received_message.payload === 'torede_onlyaland100in_dek_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 3 lakhs per month, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92023227_148678763344590_6163162711233396736_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeG1Yh-bM7cBszY0E37bemDdBgP3e6fdm5QGA_d7p92blNuE8eGcUXHPcSs7BtZkfLvhlKHV_h0OQEL5jmxzFKk-&_nc_ohc=YRk6tztDMhYAX-bzLfq&_nc_ht=scontent.fmdl2-1.fna&oh=f51d00030a755fd4a893773cf5e739a6&oe=5EB2E475",
            "subtitle":"land type-(permit), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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



/****************************************************************/
/***************************************************************/
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

// to rent land in Zabuthiri,  40*60
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
// to rent land in Zabuthiri,  100*100
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




// to rent land in Zabuthiri,  Other area
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



  // to rent house in pyinmana,
  else if (received_message.payload === "tenanpyin" ) {
    response = {
                  "text": "Please choose the below option:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "torentrcpyin_teaa1",
                        },
                        {
                          "content_type": "text",
                          "title": "Other type",
                          "payload": "torentothertypepyin_tebb1",
                        }
                      ]

      }
  }
 
// to rent house in pyinmana, RC
  else if (received_message.payload === "torentrcpyin_teaa1" ) {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "torentonef_pyinfloor11_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "torenttwoff_pyinfloora11_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "Other floor",
                          "payload": "torentotherf_pyinfloorbb11_tenant",
                        }
                      ]

      }
  }
 
// to rent house in pyinmana, RC, one floor, 
  else if (received_message.payload === "torentonef_pyinfloor11_tenant") {
    response = {
                  "text": "Do you want the house in which Mbr is included or only Br included?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Mbr",
                          "payload": "torentpyinrc_onefmbr_hh1_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "Only Br",
                          "payload": "torentpyinrc_onfonlybr_hhaa1_tenant",
                        }
                      ]
      }
  }


// to rent house in pyinmana, RC, one floor, Mbr
  else if (received_message.payload === "torentpyinrc_onefmbr_hh1_tenant") {
    response = {
                  "text": "Please choose the estimated price you wanna spend:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "4 lakhs & below it",
                          "payload": "torenthourc_onefpyin1_tenantbelow4l",
                        },
                        {
                          "content_type": "text",
                          "title": "above 4 lakhs",
                          "payload": "torenthourc_onefpyina1_tenantabove4l",
                        }
                      ]
      }
  }


/********************/

// to rent house in pyinmana, RC, one floor, Mbr, 4 lakhs & below it
  else if (received_message.payload === "torenthourc_onefpyin1_tenantbelow4l") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 3.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91664968_149027856643014_3018289688898174976_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeGRHIaeZKMyPNKfOeoww905B5sI3sATrD4HmwjewBOsPpGS3GqeitBU4k6asf5ijfHtiXTjJyQUo9u9DVzydHqd&_nc_ohc=kMOWTJMbEHIAX_qTSw1&_nc_ht=scontent.fmdl2-2.fna&oh=81eaeca5b4bd3145141aaeb803aa522b&oe=5EB1858C",
            "subtitle":"Mbr-(1), Br-(2), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
            "title":"RC, 3.5 lakhs per month, 60*72 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92353603_149043869974746_8473619924072267776_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeGgvj4JXTB-BaKlrv6fCWkPD8Wz4sbkNI8PxbPixuQ0j4z4WFsuBeE4rDoXcka8l3DzzgHyop1A6jQY9BeyxOWv&_nc_ohc=UwLfnfMu-QQAX-lKiLp&_nc_ht=scontent.fmdl2-1.fna&oh=7c3a2dc9036f0c70cc5e9cb0eb33e15c&oe=5EB1873A",
            "subtitle":"Mbr-(1), Br-(2), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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



// to rent house in pyinmana, RC, one floor, Mbr, above 4 lakhs
  else if (received_message.payload === "torenthourc_onefpyina1_tenantabove4l") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 5 lakhs per month, Width-(60*80)",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92345669_149033143309152_6933827548061106176_n.jpg?_nc_cat=105&_nc_sid=110474&_nc_eui2=AeEI4W8wxQk3tk9YgjJjQ_vGP1pHh5H1KD8_WkeHkfUoPxtx5_-T7IVd-7alAloGuyAZbuYPZOCOJab3je027jsy&_nc_ohc=sBvJQg8bkjYAX9G8Kpp&_nc_ht=scontent.fmdl2-2.fna&oh=382cf06a14c01e693485808b266b26d7&oe=5EB4B0D5",
            "subtitle":"Mbr-(2), Br-(1), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


/**********************************************/


// to rent house in pyinmana, RC, two floor
  else if (received_message.payload === "torenttwoff_pyinfloora11_tenant") {
    response = {
                  "text": "Please choose the estimated price you wanna spend:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "4 lakhs & below it",
                          "payload": "torenthou_pyinrctwof_below4lmm",
                        },
                        {
                          "content_type": "text",
                          "title": "above 4 lakhs",
                          "payload": "torenthou_pyinrctwofn_above4ln",
                        }
                      ]
      }
  }


// to rent house in pyinmana, RC, two floor, 4 lakhs & below it
  else if (received_message.payload === "torenthou_pyinrctwof_below4lmm") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 3.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91909041_149045459974587_3734464206922055680_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeFU2LcrrLbR-1h9foxAhqdQB74mqwENAW0HviarAQ0BbSVC1u_Z_umhu8d7qGBi4uix6EwDxD8Fe-cH_uN1RPuC&_nc_ohc=puXGjPNCVz4AX8fgEfL&_nc_ht=scontent.fmdl2-1.fna&oh=ea5563303495ed0876589d4e0ae7a747&oe=5EB36069",
            "subtitle":"Mbr-(4), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent house in pyinmana, RC, two floor, above 4 lakhs
  else if (received_message.payload === "torenthou_pyinrctwofn_above4ln") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 5 lakhs per month, 60*72 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91663260_149049396640860_3878909622148399104_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeGHkGRYDmdeavjzqEgTafF6vGtLT4QsOYC8a0tPhCw5gGfUGkXLqAvDbcmS2kynpkc427C_nqwWJyVMHf6lzNw7&_nc_ohc=aXbSPOJrDXwAX_7A_Ij&_nc_ht=scontent.fmdl2-2.fna&oh=d5558fa54bef9dc6a18a5cde99b328df&oe=5EB32EB3",
            "subtitle":"Mbr-(2), Br-(1), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
            "title":"2RC, 10 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91647057_149048646640935_1634770849003208704_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeF5T-k7A2rpdAenpQX7rnQypSsvlvO9AJ2lKy-W870AneezH0bEyn8dFfPyyEkjsM0EKd0vLicVlYL82SSzmRXI&_nc_ohc=vKqTcuhKlTkAX-qAIiB&_nc_ht=scontent.fmdl2-1.fna&oh=759375e2414be0c936669dd1904a9f24&oe=5EB2C4F0",
            "subtitle":"Mbr-(4), Br-(2), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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




/*********************************************/


// to rent house in pyinmana, RC, one floor, only br
  else if (received_message.payload === "") {
    response = {
                  "text": "Please choose the estimated price you wanna spend:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "torenthourc_onefpyin1_onlybr3lakhs",
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "torenthourca_onefpyin1_onlbrabove3l",
                        }
                      ]
      }
  }


// to rent house in pyinmana, RC, one floor, only Br, 3 lakhs & below it
  else if (received_message.payload === "torenthourc_onefpyin1_onlybr3lakhs") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 2.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/93006985_149029053309561_9111199899243773952_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeGN4AW6ko1xllvDTB1lMk_-xqdjdqz30iXGp2N2rPfSJcztXgS9CVS0gWOyOv6fpA6qL1F9oxqB8ExhpUyLK8Tj&_nc_ohc=98DZRtLQ7vgAX_QO6g-&_nc_ht=scontent.fmdl2-1.fna&oh=6f4d97ea113ef2ffc55e193a5b05eacb&oe=5EB13839",
            "subtitle":"Br-(2), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent house in pyinmana, RC, one floor, only Br, above 3 lakhs
  else if (received_message.payload === "torenthourca_onefpyin1_onlbrabove3l") {
    response = {
              "text":"There is no property avaliable. Sorry for you. Thanks for contacting us."
    }
  }

/**************/


  // to rent house in pyinmana, other type (RC)
  else if (received_message.payload === "torentothertypepyin_tebb1") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"Hta yan, 1.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91623696_149051576640642_6569864859687583744_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeEi8PLXTZ7dbcj0r4LuXMSKGzY8vi0XI_wbNjy-LRcj_J-l8rj7nrr5RKGDKhXzF0bfZMCYV62C31nmSRcYYpAG&_nc_ohc=9vhkrWERlZ4AX-boxAQ&_nc_ht=scontent.fmdl2-1.fna&oh=dc6ab30e9ee13b2d3e7e37f6fbbbef72&oe=5EB4F884",
            "subtitle":"face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


// to rent house in pyinmana, RC, other floor
  else if (received_message.payload === "torentotherf_pyinfloorbb11_tenant") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"3RC, 9 lakhs per month, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92246313_149054849973648_703440635775942656_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeGQUfxVnvZWijR4b8rEp1d3jNzI0_OEBaKM3MjT84QFopl4xHDm84RGqQl8E9qT_OpLskADmC5FYTxR1IVWWySf&_nc_ohc=PEniN76E7_gAX87FiHI&_nc_ht=scontent.fmdl2-1.fna&oh=51c68a01e618292c014e23cf4975744e&oe=5EB2E05D",
            "subtitle":"Mbr-(3), Br-(2), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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



/********************************************************************/


  // to rent house in oattra, RC (there is no other type in oattra)
  else if (received_message.payload === "tenanott" ) {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef1_ott_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof1_ott_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "other",
                          "payload": "otherf1_ott_tenant",
                        }
                      ]

      }
  }
 
// to rent house in oattra, RC, one floor
  else if (received_message.payload === "onef1_ott_tenant") {
    response = {
                  "text": "Do you want how much wide area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "6 lakhs & below it",
                          "payload": "onef6lakhsabove_in_ott_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "above 6 lakhs",
                          "payload": "onefabove6lakhs_in_ott_tenant",
                        }
                      ]
      }
  }


// to rent house in oattra, RC, one floor, 6 lakhs & below it
    else if (received_message.payload === 'onef6lakhsabove_in_ott_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 4 lakhs per month, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92351629_148794463333020_2221158640822255616_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeFm1wi0SGzyni_3NnxhV8Kj1lNwb3N4O3bWU3Bvc3g7dqEGpoxFQfLp2LSy7mRPgwj9ppl6UkkYIqzQC9mAFgW7&_nc_ohc=l2RNd7uB4IgAX-owFfd&_nc_ht=scontent.fmdl2-1.fna&oh=75c5576355ba2da2eeccbc1905d08e25&oe=5EB07C45",
            "subtitle":"Mbr-(2), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
            "title":"RC, 6 lakhs per month, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91912200_148783696667430_2449683035914764288_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeGtmRWzKn14WcOyBlHpkLA8U4OdKoYtcohTg50qhi1yiCt7wEw-ep9s_RQgz5V370kLzW9e5txrxVGQj_84K-09&_nc_ohc=CcVp57UKpFIAX-DJiRB&_nc_ht=scontent.fmdl2-1.fna&oh=76724e70158faba1e3386ff9413e2251&oe=5EB1FE9D",
            "subtitle":"Mbr-(4), Br-(1), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


// to rent house in oattra, RC, one floor, above 6 lakhs
    else if (received_message.payload === 'onefabove6lakhs_in_ott_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 10 lakhs per month, 150*150 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92455881_148780726667727_1440690996407959552_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGf9LydtrRy0Pv5ZMogA6x-iVE1BTJAoH6JUTUFMkCgfvVyire9NqORSOcCe7roMWslwom0L_MecnwPhfXdtz8B&_nc_ohc=c_ZjDikT9XUAX_auGhw&_nc_ht=scontent.fmdl2-1.fna&oh=f48d774f3ef4ed31d7c61775f042646d&oe=5EB1CDC2",
            "subtitle":"Mbr-(3), face west, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


// to rent house in oattra, RC, two floor
  else if (received_message.payload === "twof1_ott_tenant") {
    response = {
                  "text": "Do you want how much wide area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "6 lakhs & below it",
                          "payload": "torenthouott_below6lakhs",
                        },
                        {
                          "content_type": "text",
                          "title": "above 6 lakhs",
                          "payload": "torenthouott_above6lakhs",
                        }
                      ]
      }
  }


// to rent house in oattra, RC, two floor, 6 lakhs & below it
    else if (received_message.payload === 'torenthouott_below6lakhs') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 5 lakhs per month, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92243595_148808969998236_2207483370462511104_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeHszxekDwF7YUypu6w1O-DkdSzCbXL8J9d1LMJtcvwn154x57tv3s4IbYD7nFu1S0dUVp_ws3dUsXZkjbhpG3nb&_nc_ohc=35Ffa_2E5iEAX8p4DMu&_nc_ht=scontent.fmdl2-1.fna&oh=0f0e59f714a518ed5914f0f8caa3142a&oe=5EB1EA06",
            "subtitle":"Mbr-(1), Br-(2), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent house in oattra, RC, two floor, above 6 lakhs
    else if (received_message.payload === 'torenthouott_above6lakhs') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 8 lakhs per month, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92577724_148801386665661_3656608166516359168_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeFt0-dDc-FGDdhKVueJlnJ7eVXqTKuoYJR5VepMq6hglO7w10RQQYRLvizT9e3NUsFd9Hq7Sv4Q9md3EZJSnycB&_nc_ohc=rhTJjCGelPwAX8IZTtf&_nc_ht=scontent.fmdl2-1.fna&oh=53d7c2e67a80d3219997f94554bdf57e&oe=5EB19DF0",
            "subtitle":"Mbr-(2), Br-(3), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
            "title":"2RC, 12 lakhs per month, 150*150 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91553411_148811056664694_2994737999507357696_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeEfP3OQyWSVC6Z-lY6HYqDWh_MT8b2h51aH8xPxvaHnVqPHPIBXsMgLEI-3fAuGNUnNKKIzHBw2Y-A6HGPqzGB3&_nc_ohc=gFqz7a__45AAX_2usbC&_nc_ht=scontent.fmdl2-1.fna&oh=5fe87bc5ad80fdbfdc83bf4ad011b8ca&oe=5EB3AC65",
            "subtitle":"Mbr-(2), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


// to rent house in oattra, RC, other floor
    else if (received_message.payload === 'otherf1_ott_tenant') {
    response = {
            "text": "There is no property avaliable. Sorry for you. Thanks for contacting us."
  }
}



/********************************************************************************/
/********************************************************************************/


// to rent house in pobba, types of house
else if (received_message.payload === "tenanpob") {
      response = {
                    "text":'Are you finding RC or other type?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_pobb1_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "Other Type",
                          "payload": "nancat_pobb1_tenant",
                        }
                      ]

      }
  }
  // to rent house in pobba, floor 
  else if (received_message.payload === "rc_pobb1_tenant") {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_pobb1_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_pobb1_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "other floor",
                          "payload": "thirdf_pobb1_tenant",
                        }
                      ]

      }
  }

  // to rent house in pobba, RC, one floor
  else if (received_message.payload === "onef_pobb1_tenant") {
    response = {
                  "text": "Do you want the house in which Mbr is included or only Br included?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Mbr",
                          "payload": "tobuyhoupobb_rconefloor_mbrtenant1",
                        },
                        {
                          "content_type": "text",
                          "title": "Only Br",
                          "payload": "tobuyhoupobb_rconefloor_onlybrtenant1",
                        }
                      ]
  }
}


  // to rent house in pobba, RC, one floor, Mbr
  else if (received_message.payload === "tobuyhoupobb_rconefloor_mbrtenant1") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "torenthoupob3lakhs_below11a",
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "torenthoupob3lakhs_above3laa1",
                        }
                      ]
  }
}

// to rent house in pobba, RC, one floor, Mbr , 3 lakhs & below it
 else if (received_message.payload === 'torenthoupob3lakhs_below11a') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"RC, 2.5 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92831429_148690140010119_457507630131183616_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeE9zcF8NnpLPKl62pX9HioMwM8Pb79goQXAzw9vv2ChBYUnC-ju8y6DZUIJF30zKiuGPVjBQrDDyMQP9wAMOxEJ&_nc_ohc=WduouaN1hjsAX8Uj_x2&_nc_ht=scontent.fmdl2-1.fna&oh=568c5bdef4e9ecc484fd7928f0c862e6&oe=5EB1E35A",
            "subtitle":"MBr-(1), Br-(2), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent house in pobba, RC, one floor, Mbr , above 3 lakhs
 else if (received_message.payload === 'torenthoupob3lakhs_above3laa1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
            {
            "title":"RC, 3.5 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92141671_148691213343345_4810507837039968256_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeFwzQz5Fa1a1b6rTxcMDxOf0Bja6JtczzLQGNrom1zPMqSLxn3HfxY3v96qaK0vlAQ0LhMVFdJUEFb6oQw1SSUu&_nc_ohc=cAMzawpv1dsAX-fiBFJ&_nc_ht=scontent.fmdl2-1.fna&oh=94b2d2e832e6a2d3e1929d3e019a22f5&oe=5EB20EC5",
            "subtitle":"MBr-(2), Br-(3), face west and north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
            "title":"RC, 950 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92555021_148694693342997_4064605342099570688_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeHdSxG1IzD6iMZL01qEg0KzthAmkZBLAZK2ECaRkEsBklsHQStxScdsxZDKhJHFmGhjF-6yz9By88h_ESul1b2d&_nc_ohc=zrd5mQyTMQMAX_MAjMx&_nc_ht=scontent.fmdl2-2.fna&oh=a473039b886e5dc645e0483299e5c88a&oe=5EB34FB4",
            "subtitle":"MBr-(2), Br-(3), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

  // to rent house in pobba, RC, one floor, only br
  else if (received_message.payload === "tobuyhoupobb_rconefloor_onlybrtenant1") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "2 lakhs & below it",
                          "payload": "torenthou_pobbonefonlybr2lakh",
                        },
                        {
                          "content_type": "text",
                          "title": "above 2 lakhs",
                          "payload": "torenthou_pobbonefonlybrabove2l",
                        }
                      ]
  }
}


// to rent house in pobba, RC, one floor, only br, 2 lakhs & below it
 else if (received_message.payload === 'torenthou_pobbonefonlybr2lakh') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"RC, 1.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91914495_148687560010377_1702487433695723520_n.jpg?_nc_cat=105&_nc_sid=110474&_nc_eui2=AeEOZdK9M-XbPElfW6-OzSBjbvX1hzyKvthu9fWHPIq-2IyUS6M1KZcr-ftHDgwK3b8LepAYlLLrEQLrbeKL1bxq&_nc_ohc=QNYEF48cQz0AX87rhGe&_nc_ht=scontent.fmdl2-2.fna&oh=e69a12e6ab242f0cb5ec60935ca32414&oe=5EB03155",
            "subtitle":"Br-(3), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent house in pobba, RC, one floor, only br, above 2 lakhs
 else if (received_message.payload === 'torenthou_pobbonefonlybrabove2l') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
          {
            "title":"RC, 2.5 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92218385_148692786676521_7587571937593786368_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeHw7G9pvs5W1UkZ7W2i9IEt4cZIyNWN-1fhxkjI1Y37V5ib-0Rln8vvNUgG0KIAlt7B1JzrM__9lFiO0dIDIpnZ&_nc_ohc=FygYy-47yrsAX8dEyVb&_nc_ht=scontent.fmdl2-1.fna&oh=e324701ad6206c5ea9c64763b885276e&oe=5EB37AF8",
            "subtitle":"Br-(3), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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


// to rent house in pobba, other type(not RC)
 else if (received_message.payload === 'nancat_pobb1_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
          {
            "title":"Nancat, 1.5 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91973807_148705810008552_1650041489260019712_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeG-bX8xeh_hI01ZsMR3FVTdwGLcxG1vk2DAYtzEbW-TYENQ6KNa30os6QZjpGd2-xDzuVslOpzjpqog2138-pNz&_nc_ohc=Fw9YqIe_wJUAX9bG4h0&_nc_ht=scontent.fmdl2-1.fna&oh=c891d7fd7a3d3e972d593b6075c5abc0&oe=5EB07818",
            "subtitle":"land type-(grant), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

/*******************************/



  // to rent house in pobba, RC, two floor, area
  else if (received_message.payload === "twof_pobb1_tenant") {
    response = {
                  "text": "Please choose the estimated price you wanna spend:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "torentpob_twof3lakhs_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "torentpob_twofabove3lakhs_tenant",
                        }
                      ]
  }
}

// to rent house in pobba, RC, two floor, 3 lakhs & below it
 else if (received_message.payload === 'torentpob_twof3lakhs_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"RC, 2.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91606159_148757690003364_6476717670556237824_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeEwaNaIO6IktYPhZerxMcm7Qew2jPuaaEFB7DaM-5poQZvYiKqWGrH_lW38GzC0sEa2ozlem0muIfNfovwajN7B&_nc_ohc=xmULYHKmuWMAX8mWmY6&_nc_ht=scontent.fmdl2-1.fna&oh=896dcfb6903ac4aa391c915c34f871fc&oe=5EB37841",
            "subtitle":"MBr-(2), Br-(2), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

// to rent house in pobba, RC, two floor, above 3 lakhs
 else if (received_message.payload === 'torentpob_twofabove3lakhs_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
            {
            "title":"RC, 3.5 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92517086_148751140004019_3914064358962888704_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeFoOvq0bRFW0r7Srwl3N0U6qLmh0okITviouaHSiQhO-AqAdJfPRZtbQ8jrzolCH2ITGEZeyM794Swu5gSj8kTf&_nc_ohc=PxwqZF2pwtAAX-4aXYH&_nc_ht=scontent.fmdl2-1.fna&oh=1754795b4c5cdf6738bdbfe5f46ea909&oe=5EB0B753",
            "subtitle":"MBr-(2), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
            "title":"RC, 5.5 lakhs per month, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92463513_148754363337030_6063595422167859200_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeGEiOz1OhNnDp1HZmVLX-bLmqWuDQ1bDISapa4NDVsMhDw_xJfVd9Nb2PC9a3eG6ILKw0MuXJZGWA5_etoz-7jX&_nc_ohc=kMH-IN34uOYAX9JHqYO&_nc_ht=scontent.fmdl2-1.fna&oh=85e1416c08e94c83e9ef5265320950a4&oe=5EB30201",
            "subtitle":"MBr-(3), Br-(2),  face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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



// to rent house in pobba, RC, other floor
 else if (received_message.payload === 'thirdf_pobb1_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"3RC, 13 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92138782_148707466675053_5918704202221092864_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeE_h3jBITkW7xkMqu3_I6ZSTbencPv31K1Nt6dw-_fUrRIBi2eMl4upeFefewulR61984TZbIxxpK-ya8_OLYqw&_nc_ohc=d7YY9JJ3fBsAX9uFLtw&_nc_ht=scontent.fmdl2-1.fna&oh=2328b837dd4e1233e2aa509045cc3207&oe=5EB3FC6E",
            "subtitle":"MBr-(4), Br-(2), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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






/**************************************************************/
/**************************************************************/


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
    // to rent dekkhina, a house (RC), 
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
                          "title": " Other floor",
                          "payload": "otherrrf_dekkii11_tenant1",
                        }
                      ]

      }
  }
      //  to rent dekkhina, (house)RC, onefloor,
  else if (received_message.payload === "onef_dekkii11_tenant1") {
    response = {
                  "text": "Do you want the house in which Mbr is included or only Br included?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "Mbr",
                          "payload": "numofmbedmbraa5_mbra9_dekki_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "only Br",
                          "payload": "numofonlybraa5_mbraa9_dekki_tenant",
                        }
                      ]
      }
  }

      //  to rent dekkhina, (house)RC, onefloor, only Br
  else if (received_message.payload === "numofonlybraa5_mbraa9_dekki_tenant") {
    response = {
                  "text": "Please tell me estimated price you wanna spend:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "2 lakhs & below it",
                          "payload": "torent_dekki_onefonlybr2below_tenant",
                        },
                        {
                          "content_type": "text",
                          "title": "above 2 lakhs",
                          "payload": "torent_dekki_onefonlybr_above2_tenant",
                        }
                      ]
      }
  }


  
 //  to rent dekkhina, (house)RC, onefloor, only Br, 2 lakhs & below it
    else if (received_message.payload === 'torent_dekki_onefonlybr2below_tenant' ) {
    response = {

        "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
                {
            "title":"RC, 1.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92230135_148477376698062_1564226552332288000_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeEZFBGf-MZFY-HQQT6oS8pmO89u87ddanY7z27zt11qdhxc_4UlJ2I4G8_DIhm9ZJ46w_KGePmKb2a2UtHGYbPN&_nc_ohc=9q5ZYbuYXb4AX8xMkbB&_nc_ht=scontent.fmdl2-1.fna&oh=a2879fe65108db605e44fc675cd3dacd&oe=5EB10535",
            "subtitle":"Br-(3), face south",
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


//  to rent dekkhina, (house)RC, onefloor, only Br, above 2 lakhs
    else if (received_message.payload === 'torent_dekki_onefonlybr_above2_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 2.5 lakhs per month, 60*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92219891_148475833364883_1131803197657055232_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeHtU2QeVO9b4qfJE0XPMWpYrsg39WLRBKWuyDf1YtEEpdXXP2V1l_zqlic97MBMkayJmkRKcNMngu7v_6k1xrFe&_nc_ohc=xAUop79JbV0AX_LMFPB&_nc_ht=scontent.fmdl2-2.fna&oh=f3a4e613b2ddd6906b8c8fc14e62f731&oe=5EB08E82",
            "subtitle":"Br-(3), Aircon-(1), face south",
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

/*********************************/
/**********************************/

 // to rent house in dekkhina, one floor, master bed rooms
  else if (received_message.payload === "numofmbedmbraa5_mbra9_dekki_tenant") {
    response = {
                  "text": "Please tell me estimated price you wanna spend",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "torent_houindekk_mbbelow3lpp",
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "torent_houindekk_mbabove3lpp",
                        }
                      ]
      }
  }

// to rent house in dekkhina, one floor, master bed rooms, 3 lakhs & below it
    else if (received_message.payload === 'torent_houindekk_mbbelow3lpp') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 2 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92245880_148481666697633_6433120423902183424_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeEeGUe0TGLS1XEjX6nwNzcBNxTXZCW2Je43FNdkJbYl7tIqf-uNXDeKUlUi0pWUBOGIKtHd8JIBSLRkblglHHAP&_nc_ohc=mqbcuQ0ks-EAX9AWEzT&_nc_ht=scontent.fmdl2-2.fna&oh=d868b9ba495555422838bca22bf6303b&oe=5EB304F9",
            "subtitle":"Mbr-(1), Br-(2), face north",
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
            "title":"RC, 2.5 lakhs per month, 60*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91445925_148485046697295_1739358787334045696_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeGA59g1Eq2rzFxqTHPm8h5ssGJkZNEjmq6wYmRk0SOartKYjOWHG6IiKBAr6SKrIr9e6QmAOK-QGdIs5p0Y0mEU&_nc_ohc=8JFelcuNy_kAX_wuwkM&_nc_ht=scontent.fmdl2-2.fna&oh=8525134924d66c3695315772ac54e52e&oe=5EAF76D7",
            "subtitle":"Mbr-(2), Br-(2), Aircon-(2), face south",
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

// to rent house in dekkhina, one floor, master bed rooms, above 3 lakhs
    else if (received_message.payload === 'torent_houindekk_mbabove3lpp') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 3.5 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91949474_148491000030033_7105930383715205120_n.jpg?_nc_cat=104&_nc_sid=110474&_nc_eui2=AeFscJl2_opzLdZiqdnm_oCGWd-1cNOO16tZ37Vw047XqxdZ5Qfc8SJ-NLZWL1Z_cd9VZ2MWZmWNJyEkyoDqzpnZ&_nc_ohc=iscyAtmF2M0AX-3drlf&_nc_ht=scontent.fmdl2-2.fna&oh=e5629cb9ebe58f455a966147752fd800&oe=5EAFEDAE",
            "subtitle":"Mbr-(1), Br-(2), face north",
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
            "title":"RC, 4 lakhs per month, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92321972_148491743363292_6429195652722327552_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeEqwI-uwIDFTBM3zt_CBLdLHGcnH8zhv6kcZycfzOG_qb2aCW33oMMXn-w2o_Arj_x0qh5QU5kHScL-MjgjWthi&_nc_ohc=KkkiuPGv2scAX-wB8ka&_nc_ht=scontent.fmdl2-2.fna&oh=e7d77cd379c1e46aa02ff6918ad1b4fc&oe=5EB099BD",
            "subtitle":"Mbr-(1), Br-(2), face east",
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
            "title":"RC, 4 lakhs per month, 100*100 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92068119_148493423363124_2697475156808302592_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeE1QLiVH-Rb7yh21bwHI2eZZaKfYQqu9nZlop9hCq72dqIUX5kqBgEVI2S_QYt6TK1y0Y_0j4SALkTdMf50GrsH&_nc_ohc=nUmpMgOtFaMAX-BGYWW&_nc_ht=scontent.fmdl2-2.fna&oh=5e37b0599e61ff15ed2deed77f651314&oe=5EB1504A",
            "subtitle":"Mbr-(2), Br-(2), land type-(grant), face east",
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

/*****************************/
/*****************************/

// to rent house in dekkhina, two floor, area
  else if (received_message.payload === "twof_dekkii11_tenant1") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "twof_price3lakhsbelowmm_dek",
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "twof_priceabove3lakhsmm_dek",
                        }
                      ]
      }
  }



// to rent house in dekkhina, Rc, two floor, 3 lakhs & below it
    else if (received_message.payload === 'twof_price3lakhsbelowmm_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91876881_148667190012414_7394498520390041600_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGuaoOd56cUfdGwui3Ch4l4sGU0IifrOl-wZTQiJ-s6Xx6MMoJkF3xvnBphVS2O_U5GlCuBHhd6H4S77b8PfSgq&_nc_ohc=6hUnCzBbpckAX9MCIC8&_nc_ht=scontent.fmdl2-1.fna&oh=ed5bd3759a0b22350acdc37a52866feb&oe=5EB18D68",
            "subtitle":"Mbr-(2), Br-(2), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92583214_148663500012783_7353603237661900800_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeHLhaQy-lNjPoEct3xlK1U_GQY1Il0R_owZBjUiXRH-jIH7BrAfWbr-OQxrwCm-m6rKV9woFTMb-Nx0A-tXFq_t&_nc_ohc=sNpw-oCNFF4AX-hmd3q&_nc_ht=scontent.fmdl2-2.fna&oh=e726b585836f6d217c86d4ceeb13f5c2&oe=5EB109E4",
            "subtitle":"Mbr-(2), Br-(3), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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



// to rent house in dekkhina, Rc, two floor, above 3 lakhs
    else if (received_message.payload === 'twof_priceabove3lakhsmm_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 3.5 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92244656_148661983346268_5412490990118240256_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeH7i1rOMS8eeDRAo6chNPk97R3saB8e7SztHexoHx7tLI80FOYBR4_5sP3UzCEmtsrIlOqG-g2UNFogclACx-h9&_nc_ohc=xGmu-HV_qU8AX-rAPLo&_nc_ht=scontent.fmdl2-1.fna&oh=7bb92d21c48c88bd788564994049ddd6&oe=5EB0B3E1",
            "subtitle":"Mbr-(3), Br-(1), face west",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
            "title":"RC, 7 lakhs per month, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92460697_148661310013002_7562140512816201728_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGXPnWOsVIgxd191EVtq4QzAAmWNiurfdoACZY2K6t92sSwRjyS9-R7_Sb-5Pej0m04acQDvIDQ4SXSMQ0YxOoB&_nc_ohc=TuJg6KwfDIIAX867j8B&_nc_ht=scontent.fmdl2-1.fna&oh=0328354a18069d7a3a12fae8761f31b4&oe=5EB14705",
            "subtitle":"Mbr-(2), Br-(2), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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
            "title":"RC, 9 lakhs per month, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92177551_148650480014085_8591158172348055552_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeEMxLJE8yJWn12cjnsZ24IAXxiYUvJTRvdfGJhS8lNG9wGyTfx-GESmgXjRIL0gaQ64hSEgq1Hvx0in9dOMwglQ&_nc_ohc=x_SJl0kcdecAX-C0w-b&_nc_ht=scontent.fmdl2-1.fna&oh=e6d5a9d5b8271703d4c3c7177ca94266&oe=5EB33173",
            "subtitle":"Mbr-(5), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

/*****************************************/
/*****************************************/

// to rent house in dekkhina, Rc, other floor,
    else if (received_message.payload === 'otherrrf_dekkii11_tenant1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 8 lakhs per month, 50*75 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92667938_148681606677639_6253805066847780864_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeHNyDhSx0ovFtr7eWjPt3Raef0VwMYXhKh5_RXAxheEqDq_SNyzVRhmHguVKNiCzwNpYkdEkenidgHtp7xL2PtM&_nc_ohc=V5MmGn_sMAgAX8_t0wI&_nc_ht=scontent.fmdl2-2.fna&oh=d746a503f668daddb4760473f684da45&oe=5EB3D5D6",
            "subtitle":"Mbr-(3), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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

/*********************/
/*********************/


// to rent house in dekkhina, other type (not RC)
    else if (received_message.payload === 'ottype_dekki1_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"Nancat,  2 lakhs per month, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/93101461_148684256677374_2200426120719892480_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeFye7mt4SB5HOSquEDbUdAioBRfEDs7j8KgFF8QOzuPwrNvkh5Pix0nh-XhaE6LM0qxdB2C4fDV7nJikI9tr3B7&_nc_ohc=ecor5tV1VtkAX-Tfk91&_nc_ht=scontent.fmdl2-1.fna&oh=0c28277c0ef5111f6a667a2725cdd824&oe=5EB0D393",
            "subtitle":"Brr-(3), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1586247006729232&notif_t=page_message&ref=notif",
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






/*******************************************************************************************/
/******************************************************************************************/
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
            "title":"Nancat, 1 lakh per month, 40*60 ft",
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
// to buy land
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
  // to buy land in oattra
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
