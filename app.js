
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
  firebase = require('firebase-admin');

  const app = express();
  app.use(body_parser.json());
  app.use(body_parser.urlencoded());

  firebase.initializeApp({
  credential: firebase.credential.cert({
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "project_id": process.env.FIREBASE_PROJECT_ID,
  }),
  databaseURL: "https://duwon-56700.firebaseio.com"
  });
  let db = firebase.firestore();   




// let contactct = {
//   numberno:false,
// }
// let userEnteredPhonenum = {};


/**********************************************/

// to rent house as landlord 
let landlord_sent = {
  twp_name_torentHouse:false,
  house_type_torent:false,
  numOf_floor_torentHou:false,
  numOf_mbr_torentHou:false,
  numOf_br_torentHou:false,
  both1_numOf_mbr_torent:false,
  both2_numOf_br_torent:false,
  landArea_ofHouse_torent:false,
  images_ofHouse_torent:false,
  estimated_price_perMonth_torentHou:false,
  numOf_month_torentHouse:false,
  fullyAddress_byCu_torent:false,
  ph_numm_byCu_torentHou:false,
  sth_yes_toldbyCu_torent:false,
  sth_no_toldbyCu_torent:false,

}
let userEntered_landlord = {};

/********************************************/

// to rent land as a landlord
let ldld_land_sent = {
  twp_name_torent_land:false,
  land_area_torent_byCu:false,
  land_type_torent_byCu:false,
//  a_myie_pauk_byCu:false,
  images_ofLand_torentLand:false,
  estimatedPrice_perMonth_torentLand:false,
  numOf_month_torentLand:false,
  fullyAddress_ofLand_torent:false,
  phone_num_byCu_torentLand:false,
  yes_for_sthElse_byCuLand:false,
  no_for_sthElse_byCuLand:false,

}
let userEntered_ldld_land = {};



/**********************************************/

// to sell their house
let toselhou_byuser = {
  twp_name_tobeSold:false,
  house_type_ht:false,
  numOf_floor_toselHou:false,

  numOf_mbr_toselHou:false,
  numOf_br_toselHou:false,
  both1_numOf_mbr_tsel:false,
  both2_numOf_br_tsel:false,

  landArea_ofHouse_tosell:false,
  typeOf_land_ofHou_tsel:false,
  images_ofHouse_tsel:false,
  estimated_amount_toget:false,
  fullyAddress_byCu_tosel:false,
  ph_numm_byCu_tosellHou:false,
  sth_yes_toldbyCu:false,
  sth_no_toldbyCu:false,

}
let userEntered_Hou_tosel = {};



/*********************************************/


//  to sell land
let tosel_land_byuser = {


  twp_name_tosell_land:false,
  land_area_tosell_byCu:false,
  land_type_tosell_byCu:false,
  a_myie_pauk_byCu:false,
  images_ofLand_byCu:false,
  estimated_amount_byCus:false,
  fullyAddress_ofLand_tosell:false,
  phone_num_byCu_tosell_land:false,
  yes_for_sthElse_byCu:false,
  no_for_sthElse_byCu:false,

}
let userEntered_land_tosel = {};



/******************************************/

// to buy house in every
let tobuyhouse_told = {
  cuSay_yes_toSay_sthElse_se:false,
  cuSay_no_toSay_sthElse_se:false,
  phNumber_byCu_tobuyHouse:false,
}
let userEntered_info_toBuyHouse = {};


// to buy land in every
let tobuyLand_told = {
  cuSay_yes_forSthElse_tobuland:false,
  cuSay_no_forSthElse_tobuland:false,
  phNumber_byUser_tobuyLand:false,
}
let userEntered_things_tobuyLand = {};


/*************************************/


// to rent house in every // as tenant
let torenthouse_tenant = {
  userSay_yes_sthElse_te:false,
  userSay_no_sthElse_te:false,
  phNumber_byUser_torentHou_te:false,
}
let userEntered_info_torentHou_asTenant = {};



// to rent land in by user // as tenant
let torentland_tenant = {
  cu_say_yes_sthElse_tenant:false,
  cu_say_no_sthElse_tenant:false,
  phNumberByCu_torentHou_tenant:false,
}
let userEntered_info_torentland_te = {};


// admin to create property
let createPropertyAd = {
  dateByAdmin:false,
  propertyIdByCu:false,
}
let adminEnteredall_info = {};


let customData = {
  twpNameCustom: false,
  dataToldByUser: false,
  phoneNumberCustom: false,
}
let userEnteredCustom = {}; 


let movingHouseServiceData = {
  startTwonshipName: false,
  destinationTwonshipName: false,
  appointmentDate: false,
  customerPhoneNumberApp : false,
}
let userEnteredDataMoveHouseService: false = {};

/**********************************************************************/


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

  
  if (received_message.text == "hi" || received_message.text == "hello" || received_message.text == "Hello"  || received_message.text == "Hi") {
   greetUser(sender_psid);
  }

    
  else if (received_message.text == "hhhhlp") {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  }



/****************************************************************/



  
/**********************************************************************************************/
/**********************************************************************************************/
/**********************************************************************************************/



  // to rent house as landlord
  else if (received_message.payload === "ld_ottwp" || received_message.payload === "ld_potwp" || received_message.payload === "ld_dektwp" || received_message.payload === "ld_zaytwp" || received_message.payload === "ld_zaytwp" || received_message.payload === "ldld1_1pyin1") {    
    userEntered_landlord.twp_name_torentHouse =  received_message.payload; // for twonship name to be rented
    response = {
      "text": "Please tell the type of house you want to rent. I mean RC or Nancat etc."
    }
    received_message.payload = false;
    landlord_sent.house_type_torent = true; // for house type to be rented
  }
  else if (received_message.text && landlord_sent.house_type_torent === true) { // for house type to be rented
    userEntered_landlord.house_type_torent = received_message.text;   // for house type to be rented
          response = {
                      "text":'How many floors is the house?'
    }
    landlord_sent.house_type_torent = false;      // for house type to be rented
    landlord_sent.numOf_floor_torentHou = true; // for number of floor of house to be rented
  }
  else if (received_message.text && landlord_sent.numOf_floor_torentHou === true) {  // for number of floor of house to be rented
    userEntered_landlord.numOf_floor_torentHou = received_message.text;   // for number of floor of house to be rented
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
          landlord_sent.numOf_floor_torentHou = false;  // for number of floor of house to be rented
  }
  

  // for master bed room in landlord
 else if (received_message.payload === "hou_ldld_tell_mb") {    
    response = {
      "text": "How many master bed rooms are in your house?"
    }
    received_message.payload = false;
    landlord_sent.numOf_mbr_torentHou = true;  // number of master bed room to rent house as landlord
  }

  // for bed room in landlord
   else if (received_message.payload === "hou_ldld_br") {    
    response = {
      "text": "How many bed rooms are in your house?"
    }
    received_message.payload = false;
    landlord_sent.numOf_br_torentHou = true;   // number of bed room to rent house as landlord
  }


////////////////////////////////////////////////////

// for only number of master bed room to rent as landlord
 else if (received_message.text && landlord_sent.numOf_mbr_torentHou === true) {  // number of master bed room to rent house as landlord
  userEntered_landlord.numOf_mbr_torentHou = received_message.text;   // for number of master bed room to rent house as landlord
    response = {
      "text": "Please tell me land area of your house."
    }
    landlord_sent.numOf_mbr_torentHou = false; // for number of master bed room to rent as landlord
    landlord_sent.landArea_ofHouse_torent = true; // for land area of house to rent house as landlord
  }

  // for only number of master bed room and bed room
 else if (received_message.text && landlord_sent.numOf_br_torentHou === true) {  // number of bed room
  userEntered_landlord.numOf_br_torentHou = received_message.text;   // for number of bed room to rent house as landlord
    response = {
      "text": "Please tell me land area of your house."
    }
    landlord_sent.numOf_br_torentHou = false; // for number of bed room to rent house as landlord
    landlord_sent.landArea_ofHouse_torent = true; // for land area of house to rent house as landlord
  }  


///////////////////////////////////////////////////////////////////////////////////////
  // for both master bed room and bed room to rent as landlord
 else if (received_message.payload === "hou_ldld_both") {
   response  = { "text": "How many master bed rooms in your house?" 
  }
  received_message.payload = false;
  landlord_sent.both1_numOf_mbr_torent = true;  // for both, number of master bed room to rent house as landlord
}
 else if (received_message.text && landlord_sent.both1_numOf_mbr_torent === true) {  
  userEntered_landlord.both1_numOf_mbr_torent = received_message.text; 
    response = {
      "text": "How many bed rooms in your house?"
    }
    landlord_sent.both1_numOf_mbr_torent = false; // for  both, number of master bed room to rent house as landlord
    landlord_sent.both2_numOf_br_torent = true; // for both, number of bed room to rent as landlord
  } 


 else if (received_message.text && landlord_sent.both2_numOf_br_torent === true) { 
  userEntered_landlord.both2_numOf_br_torent = received_message.text;   // for both, number of bed room to rent house as landlord
    response = {
      "text": "Please tell me land area of your house."
    }
    landlord_sent.both2_numOf_br_torent = false;
    landlord_sent.landArea_ofHouse_torent = true; // for land area of house  to rent house  as landlord
  } 


/*********************************************************************/


  else if (received_message.text && landlord_sent.landArea_ofHouse_torent  === true) { // for land area of house  to rent house  as landlord
   userEntered_landlord.landArea_ofHouse_torent = received_message.text; // for land area of house  to rent house  as landlord
         response = {
       "text": "Could you send me inside and outside photos with regard to your house?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "I will send now.",
                          "payload": "send1_now1_photos1_hou_torent_asldld",
                        },
                        {
                          "content_type": "text",
                          "title": "Later",
                          "payload": "send2_later2photos2_hou_torent2_asldld", // not yet
                        }
                      ]
    }
    landlord_sent.landArea_ofHouse_torent = false;  // for land area of house  to rent house  as landlord
  }


   else if (received_message.payload === "send1_now1_photos1_hou_torent_asldld") { 
    response = {
      "text": "OK, please send me."
    }
      received_message.payload = false;
     landlord_sent.images_ofHouse_torent = true;
  }


  else if (received_message.attachments && landlord_sent.images_ofHouse_torent == true) {
      userEntered_landlord.images_ofHouse_torent = received_message.attachments; 
    // Get the URL of the message attachment
    let attachment_url_photo = userEntered_landlord.images_ofHouse_torent[0].payload.url;
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
                "payload": "torenthou2yesyes_asldld",
              },
              {
                "type": "postback",
                "title": "No",
                "payload": "torenthou2nono_asldld",
              }
            ],
          }]
        }
      }
    }
    landlord_sent.images_ofHouse_torent = false;
  }



  else if (received_message.text && landlord_sent.estimated_price_perMonth_torentHou == true) { // estimated price per month to rent house as landlord
    userEntered_landlord.estimated_price_perMonth_torentHou = received_message.text; // estimated price per month to rent house as landlord
    response = {
      "text":"How many months do you want to rent your house at least?"
    }
    landlord_sent.estimated_price_perMonth_torentHou = false; // estimated price per month to rent house as landlord
    landlord_sent.numOf_month_torentHouse = true; // number of moonth at least to rent house as landlord
  } 

 
  else if (received_message.text && landlord_sent.numOf_month_torentHouse == true) {  // number of moonth at least to rent house as landlord
    userEntered_landlord.numOf_month_torentHouse = received_message.text; // number of moonth at least to rent house as landlordd
    response = {
      "text":"Please tell me fully address of your house to be rented."
    }
    landlord_sent.numOf_month_torentHouse = false; // number of moonth at least to rent house as landlord
    landlord_sent.fullyAddress_byCu_torent = true;  // fully address house to be rented as landlord
  }  
  else if (received_message.text && landlord_sent.fullyAddress_byCu_torent == true) {  // fully address house to be rented as landlord
    userEntered_landlord.fullyAddress_byCu_torent = received_message.text; // fully address house to be rented as landlord
    response = {
      "text":"Please leave me your phone number."
    }
    landlord_sent.fullyAddress_byCu_torent = false; // fully address house to be rented as landlord
    landlord_sent.ph_numm_byCu_torentHou = true; // phone number of customer to rent house as landlord
  }



  else if (received_message.payload === "send2_later2photos2_hou_torent2_asldld") {
    response = {
      "text":"Do you want to rent how much per month?."
    }
  landlord_sent.estimated_price_perMonth_torentHou = true; // estimated price per month to rent house as landlord
  } 


  else if (received_message.text && landlord_sent.ph_numm_byCu_torentHou  === true) { // phone number of customer to rent house as landlord
   userEntered_landlord.ph_numm_byCu_torentHou = received_message.text; // phone number of customer to rent house as landlord
         response = {
       "text": "Do you want to tell something to us?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Yes",
                          "payload": "customer1a_useryes1_torenthou1a",
                        },
                        {
                          "content_type": "text",
                          "title": "No",
                          "payload": "customer2b_usernono1_torenthou2b",
                        }
                      ]
    }
    landlord_sent.ph_numm_byCu_torentHou = false;  // phone number of customer to rent house as landlord
  }


// customer say yes to tell something else  
else if (received_message.payload === "customer1a_useryes1_torenthou1a") {
    response = {
      "text":"Please tell me."
    }
  landlord_sent.sth_yes_toldbyCu_torent = true;  // customer say yes to tell something else 
} 


else if (received_message.text && landlord_sent.sth_yes_toldbyCu_torent === true ) { // for something else told by user to rent house as landlord
    userEntered_landlord.sth_yes_toldbyCu_torent = received_message.text;  
    saveData_torent_house_asLdLd(sender_psid)

    let response1 = {
      "text":"Thanks for contacting us. I will contact you within 24 hours. Have a nice day!"};
    let response2 = { 
            "text": "A user has made for property. \nPlease check the following document: 4qfqnZWxbrhuZGRGfsX."
   };
   callSend(sender_psid, response1).then(()=>{
   return callSend(sender_psid, response2);
   });   
  landlord_sent.sth_yes_toldbyCu_torent = false;
  }

// for user say no for something else to rent house as landlord
  else if (received_message.payload === "customer2b_usernono1_torenthou2b" ) { // for user says no
    userEntered_landlord.sth_no_toldbyCu_torent = received_message.payload;  // user says no for something else
    saveData_torent_house_asLdLd(sender_psid)

    let response1 = {
      "text":"Thanks for contacting us. I will contact you within 24 hours. Have a nice day!"};
    let response2 = { 
            "text": "A user has made for property. \nPlease check the following document: 4qfqnZWxbrhuZGRGfsX."
   };
   callSend(sender_psid, response1).then(()=>{
   return callSend(sender_psid, response2);
   });  
    received_message.payload = false;
  }




/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/



// to rent land as landlord
 else if (received_message.payload === "ld_ottwp_land" || received_message.payload === "ld_potwp_land" || received_message.payload === "ld_dektwp_land" || received_message.payload === "ld_zaytwp_land" || received_message.payload === "ld_zabtwp_land" || received_message.payload === "ldld_pyin_land") {
         userEntered_ldld_land.twp_name_torent_land = received_message.payload;
         response = {
      "text":'Please tell me the area of land that you want to rent out.'
    }
    received_message.payload = false;
    ldld_land_sent.land_area_torent_byCu = true;  // for land area to rent land as landlord
  }
 else if (received_message.text && ldld_land_sent.land_area_torent_byCu === true) {
  userEntered_ldld_land.land_area_torent_byCu = received_message.text; // for land area to rent land as landlord
         response = {
      "text":'Please tell me the type of land that you want to rent out.'
    }
    ldld_land_sent.land_area_torent_byCu = false; // for land area to rent land
    ldld_land_sent.land_type_torent_byCu = true; // land type to rent land
  }


  else if (received_message.text &&  ldld_land_sent.land_type_torent_byCu === true) { // land type to rent land
    userEntered_ldld_land.land_type_torent_byCu = received_message.text; // land type to rent land
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
    ldld_land_sent.land_type_torent_byCu = false;  // land type to rent land
  }


   else if (received_message.payload === "send_land_ph") { 
    response = {
      "text": "OK, please send me."
    }
     received_message.payload = false;
     ldld_land_sent.images_ofLand_torentLand = true; // to send images of land to rent land as landlord
  }
  else if (received_message.attachments && ldld_land_sent.images_ofLand_torentLand == true) { // to send images
      userEntered_ldld_land.images_ofLand_torentLand = received_message.attachments; // to send images
    // Get the URL of the message attachment
    let attachment_url_phph = userEntered_ldld_land.images_ofLand_torentLand[0].payload.url;
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
    ldld_land_sent.images_ofLand_torentLand = false;
  }



  else if (received_message.text && ldld_land_sent.estimatedPrice_perMonth_torentLand == true) { // for estimated price per month to rent land as landlord
    userEntered_ldld_land.estimatedPrice_perMonth_torentLand = received_message.text;
    response = {
      "text":"How many months do you want to rent your land at least?"
    }
    ldld_land_sent.estimatedPrice_perMonth_torentLand = false; // for estimated price per month to rent
    ldld_land_sent.numOf_month_torentLand = true; // number of month to rent land
  } 

  else if (received_message.text && ldld_land_sent.numOf_month_torentLand == true) {  // number of month to rent land
    userEntered_ldld_land.numOf_month_torentLand = received_message.text;   // number of month to rent land
    response = {
      "text":"Please tell me fully address of your house to be rented."
    }
    ldld_land_sent.numOf_month_torentLand = false;   // number of month to rent land
    ldld_land_sent.fullyAddress_ofLand_torent = true; // fully address of land to rent 
  }

    else if (received_message.text && ldld_land_sent.fullyAddress_ofLand_torent == true) {  // fully address of land to rent 
    userEntered_ldld_land.fullyAddress_ofLand_torent = received_message.text;   // fully address of land to rent 
    response = {
      "text":"Please leave me your phone number."
    }
    ldld_land_sent.fullyAddress_ofLand_torent = false;   // fully address of land to rent 
    ldld_land_sent.phone_num_byCu_torentLand = true; // phone number of customer to rent land as landlord 
  }  



// later to send photos
 else if (received_message.payload === 'later_ldld') {
        response = {
                  "text": "Do you want to rent your land how much per month?"
      }
      ldld_land_sent.estimatedPrice_perMonth_torentLand = true; // estimated price  per month to rent land
  }
   

  else if (received_message.text && ldld_land_sent.phone_num_byCu_torentLand  === true) {  // phone number of customer to rent land as landlord 
   userEntered_ldld_land.phone_num_byCu_torentLand = received_message.text;  // phone number of customer to rent land as landlord 
         response = {
       "text": "Do you want to tell me with regard to your property or something else to us?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Yes",
                          "payload": "cuSay_yes_tosay_sthElseLand",
                        },
                        {
                          "content_type": "text",
                          "title": "No",
                          "payload": "cuSay_no_tosay_sthElseLand",
                        }
                      ]
    }
    ldld_land_sent.phone_num_byCu_torentLand = false;  // phone number of customer to rent land as landlord 
  }

  else if (received_message.payload === "cuSay_yes_tosay_sthElseLand") { // user say yes to say sth else
    response = {
      "text":"Ok, please tell me." 
    }
    ldld_land_sent.yes_for_sthElse_byCuLand = true; // user say yes to say sth else
  }  
  else if (received_message.text && ldld_land_sent.yes_for_sthElse_byCuLand == true) { // user say yes to say sth else
    userEntered_ldld_land.yes_for_sthElse_byCuLand = received_message.text; // user say yes to say sth else
    saveData_torent_land_asLdLd(sender_psid);
    response = {
      "text":"Thanks for contacting us. I will contact you within 24 houra. Have a nice day!"
    }
    ldld_land_sent.yes_for_sthElse_byCuLand = false; // user say yes to say sth else
  }

    else if (received_message.payload === "cuSay_no_tosay_sthElseLand") { // user say no to say sth else
    userEntered_ldld_land.no_for_sthElse_byCuLand = received_message.payload; // user say no to say sth else
    saveData_torent_land_asLdLd(sender_psid);
    let response1 = {
      "text":"Thanks for contacting us. I will contact you within 24 houra. Have a nice day!"};
    let response2 = { 
            "text": "A user has made for property. \nPlease check the following document: 4qfqnZWxbrhuZGRGfsX."
   };
   callSend(sender_psid, response1).then(()=>{
  return callSend(sender_psid, response2);
  });
    received_message.payload = false;
  }   




/****************************************************************************************************************************/
/****************************************************************************************************************************/
/****************************************************************************************************************************/


// to buy house in every
   else if (received_message.payload === "cu_say_yes_toBuyHouse") { 
    response = {
              "text": "Ok, please tell me."
    }
     received_message.payload = false;
     tobuyhouse_told.cuSay_yes_toSay_sthElse_se = true; // user say yes to say sth else
  }

  else if (received_message.text &&  tobuyhouse_told.cuSay_yes_toSay_sthElse_se === true) {  // user say yes to say sth else
    userEntered_info_toBuyHouse.cuSay_yes_toSay_sthElse_se = received_message.text;  // user say yes to say sth else
    response = {
       "text": "Please leave your contact number."
                  
    }
    tobuyhouse_told.cuSay_yes_toSay_sthElse_se = false;  // user say yes to say sth else
    tobuyhouse_told.phNumber_byCu_tobuyHouse = true; // phone number by user to buy house
  }
    else if (received_message.text &&  tobuyhouse_told.phNumber_byCu_tobuyHouse === true) { // phone number by user to buy house
    userEntered_info_toBuyHouse.phNumber_byCu_tobuyHouse = received_message.text; // phone number by user to buy house
    saveData_tobuy_house(sender_psid);
    response = {
       "text": "Thanks for contacting us. I will contact you within 24 hours. Have a nice day!"
                  
    }
    tobuyhouse_told.phNumber_byCu_tobuyHouse = false; // phone number by user to buy house
  }

// user say no 
  else if (received_message.payload === "cu_say_no_toBuyHouse") {
    userEntered_info_toBuyHouse.cuSay_no_toSay_sthElse_se = received_message.payload;  
    response = {
      "text": "Please leave your contact number."
    }
  tobuyhouse_told.phNumber_byCu_tobuyHouse = true; // phone number of customer to buy house
  }


/**************************************************************/




// to rent house in every // as tenant
   else if (received_message.payload === "cu_say_yes_torentHouse") { 
    response = {
              "text": "Ok, please tell me."
    }
     received_message.payload = false;
     torenthouse_tenant.userSay_yes_sthElse_te = true;  // user say yes to say sth else
  }

  else if (received_message.text &&  torenthouse_tenant.userSay_yes_sthElse_te === true) {  // user say yes to say sth else
    userEntered_info_torentHou_asTenant.userSay_yes_sthElse_te = received_message.text;  // user say yes to say sth else
    response = {
       "text": "Please leave your phone number."
                  
    }
    torenthouse_tenant.userSay_yes_sthElse_te = false;  // user say yes to say sth else
    torenthouse_tenant.phNumber_byUser_torentHou_te = true;  // phone number by user to buy house
  }
    else if (received_message.text &&  torenthouse_tenant.phNumber_byUser_torentHou_te === true) {
    userEntered_info_torentHou_asTenant.phNumber_byUser_torentHou_te = received_message.text; // phone number by user to buy house
    saveData_torent_house_asTenant(sender_psid);
    response = {
       "text": "Thanks for contacting us. I will contact you within 24 hours. Have a nice day!"
                  
    }
    torenthouse_tenant.phNumber_byUser_torentHou_te = false;  // phone number by user to buy house
  }

// user say no 
  else if (received_message.payload === "cu_say_no_torentHouse") {
  userEntered_info_torentHou_asTenant.userSay_no_sthElse_te = received_message.payload;
    response = {
      "text": "Please leave your phone number."
    }
  torenthouse_tenant.phNumber_byUser_torentHou_te = true; // phone number by user to buy house
  }




/*************************************************************************/
/*************************************************************************/



// to buy land in every
   else if (received_message.payload === "cu_say_yes_tobuyLand") { 
    response = {
              "text": "Ok, please tell me."
    }
     received_message.payload = false;
     tobuyLand_told.cuSay_yes_forSthElse_tobuland = true;  // user say yes to say sth else
  }

  else if (received_message.text &&  tobuyLand_told.cuSay_yes_forSthElse_tobuland === true) {   // user say yes to say sth else
    userEntered_things_tobuyLand.cuSay_yes_forSthElse_tobuland = received_message.text;   // user say yes to say sth else
    response = {
       "text": "Please leave your phone number."
                  
    }
    tobuyLand_told.cuSay_yes_forSthElse_tobuland = false;  // user say yes to say sth else
    tobuyLand_told.phNumber_byUser_tobuyLand = true;  // phone number of customer to buy house
  }
    else if (received_message.text &&  tobuyLand_told.phNumber_byUser_tobuyLand === true) {  // phone number of customer to buy house
    userEntered_things_tobuyLand.phNumber_byUser_tobuyLand = received_message.text;  // phone number of customer to buy house
    saveData_tobuy_land(sender_psid);
    response = {
       "text": "Thanks for contacting us. We will contact you within 24 hours. Have a nice day!"
                  
    }
    tobuyLand_told.phNumber_byUser_tobuyLand = false;   // phone number of customer to buy house
  }

// user say no 
  else if (received_message.payload === "cu_say_no_tobuyLand") { 
    userEntered_things_tobuyLand.cuSay_no_forSthElse_tobuland = received_message.payload; // user says no for sth else 
    response = {
      "text": "Please leave your phone number."
    }
  tobuyLand_told.phNumber_byUser_tobuyLand = true;  // phone number of customer to buy house
  }




/********************************************************************/



// to rent land in every // as tenant
   else if (received_message.payload === "cuSay_yes_tosay_SthElse_te") { 
    response = {
              "text": "Ok, please tell me."
    }
     received_message.payload = false;
     torentland_tenant.cu_say_yes_sthElse_tenant = true;  // user say yes to say sth else
  }

  else if (received_message.text &&  torentland_tenant.cu_say_yes_sthElse_tenant === true) {  // user say yes to say sth else
    userEntered_info_torentland_te.cu_say_yes_sthElse_tenant = received_message.text;  // user say yes to say sth else
    response = {
       "text": "Please leave your contact number. We will contact you later."
                  
    }
    torentland_tenant.cu_say_yes_sthElse_tenant = false;  // user say yes to say sth else
    torentland_tenant.phNumberByCu_torentHou_tenant = true;  // phone number by user to buy house
  }
    else if (received_message.text &&  torentland_tenant.phNumberByCu_torentHou_tenant === true) {  // phone number by user to buy house
    userEntered_info_torentland_te.phNumberByCu_torentHou_tenant = received_message.text; // phone number by user to buy house
    saveData_torent_land_asTenant(sender_psid);
    response = {
       "text": "Thanks for contacting us. I will contact you within 24 hours. Have a nice day!"
                  
    }
    torentland_tenant.phNumberByCu_torentHou_tenant = false;  // phone number by user to buy house
  }

// user say no 
  else if (received_message.payload === "cuSay_no_tosay_SthElse_te") { 
    userEntered_info_torentland_te.cu_say_no_sthElse_tenant = received_message.payload;  
    response = {
      "text": "Please leave your contact number."
    }
  torentland_tenant.phNumberByCu_torentHou_tenant = true; // phone number by user to buy house
  }


/************************************************************************************************************/
/************************************************************************************************************/
/************************************************************************************************************/



/***********************************************************************************/


// to sell house
 else if (received_message.payload === "tselott" || received_message.payload === "tselpob" || received_message.payload === "tseldek" || received_message.payload === "tselzaya" || received_message.payload === "tselzabu" || received_message.payload === "toselhoupyin") {
    userEntered_Hou_tosel.twp_name_tobeSold = received_message.payload;
//    console.log('meta data',received_message);
//  userEntered_Hou_tosel.twp_name_tobeSold = received_message.text;
//  console.log('meta data',userEntered_Hou_tosel.twp_name_tobeSold);
          response = {
      "text":'Please tell the type of house that you want to sell like RC or Nancat'
    }
//    toselhou_byuser.twp_name_tobeSold = false;
    received_message.payload = false; 
    toselhou_byuser.house_type_ht = true; // for house type
  }

 else if (received_message.text && toselhou_byuser.house_type_ht == true) {
  userEntered_Hou_tosel.house_type_ht = received_message.text;
         response = {
      "text":'How many floors is the house?'
    }
    toselhou_byuser.house_type_ht = false; // for house type
    toselhou_byuser.numOf_floor_toselHou = true;
  }

   else if (received_message.text &&  toselhou_byuser.numOf_floor_toselHou === true) {
   userEntered_Hou_tosel.numOf_floor_toselHou = received_message.text;
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
    toselhou_byuser.numOf_floor_toselHou = false;
  }


// for master bed room
 else if (received_message.payload === "tosel_hou_tell_mb") {    
    response = {
      "text": "How many master bed rooms in your house?"
    }
    received_message.payload = false;
    toselhou_byuser.numOf_mbr_toselHou = true;  // for number of master bed room
  }

  // for bed room
   else if (received_message.payload === "tosel_hou_bedRoom") {    
    response = {
      "text": "How many bed rooms in your house?"
    }
    received_message.payload = false;
    toselhou_byuser.numOf_br_toselHou = true;   // for number of bed room
  }

////////////////////////////////////////////////////

// for only number of master bed room
 else if (received_message.text && toselhou_byuser.numOf_mbr_toselHou === true) {  // number of master bed room
  userEntered_Hou_tosel.numOf_mbr_toselHou = received_message.text;   // for number of master bed room
    response = {
      "text": "Please tell me land area of your house."
    }
    toselhou_byuser.numOf_mbr_toselHou = false; // for number of master bed room
    toselhou_byuser.landArea_ofHouse_tosell = true; // for land area of house to sell
  }

  // for only number of master bed room and bed room
 else if (received_message.text && toselhou_byuser.numOf_br_toselHou === true) {  // number of bed room
  userEntered_Hou_tosel.numOf_br_toselHou = received_message.text;   // for number of bed room
    response = {
      "text": "Please tell me land area of your house."
    }
    toselhou_byuser.numOf_br_toselHou = false; // for number of bed room
    toselhou_byuser.landArea_ofHouse_tosell = true; // for land area of house to sell
  }  


///////////////////////////////////////////////////////////////////////////////////////
  // for both master bed room and bed room
 else if (received_message.payload === "tosel_hou_tell_both") {
   response  = { "text": "How many master bed rooms in your house?" 
  }
  received_message.payload = false;
  toselhou_byuser.both1_numOf_mbr_tsel = true;  // for both, number of master bed room
}
 else if (received_message.text && toselhou_byuser.both1_numOf_mbr_tsel === true) {  
  userEntered_Hou_tosel.both1_numOf_mbr_tsel = received_message.text; 
    response = {
      "text": "How many bed rooms in your house?"
    }
    toselhou_byuser.both1_numOf_mbr_tsel = false; // for  both, number of master bed room
    toselhou_byuser.both2_numOf_br_tsel = true; // for both, number of bed room
  } 


 else if (received_message.text && toselhou_byuser.both2_numOf_br_tsel === true) { 
  userEntered_Hou_tosel.both2_numOf_br_tsel = received_message.text;   // for both, number of bed room
    response = {
      "text": "Please tell me land area of your house."
    }
    toselhou_byuser.both2_numOf_br_tsel = false;
  toselhou_byuser.landArea_ofHouse_tosell = true; // for land area of house 
  } 



////////////////////////////////////////////////////////////////////////////////

   else if (received_message.text && toselhou_byuser.landArea_ofHouse_tosell === true) { // for land area of house to sell
  userEntered_Hou_tosel.landArea_ofHouse_tosell = received_message.text;   // for land area of house to sell
    response = {
      "text": "Please tell me type of land on which your house that will be sold is bulit."
    }
    toselhou_byuser.landArea_ofHouse_tosell = false; // for land area of house to sell
    toselhou_byuser.typeOf_land_ofHou_tsel = true; // for type of land of house to sell
  } 

  else if (received_message.text && toselhou_byuser.typeOf_land_ofHou_tsel  === true) { // for type of land of house of house to sell
   userEntered_Hou_tosel.typeOf_land_ofHou_tsel = received_message.text;    // for type of land of house to sell
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
                          "payload": "tosel_hou_tell_later_byuser11",
                        }
                      ]
    }
    toselhou_byuser.typeOf_land_ofHou_tsel = false;   // for type of land of house to sell
  }


   else if (received_message.payload === "send_now_photos_hou_inAndOut") { 
    response = {
      "text": "OK, please send me."
    }
     received_message.payload = false;
     toselhou_byuser.images_ofHouse_tsel = true; // for images to be send by user
  }
  else if (received_message.attachments && toselhou_byuser.images_ofHouse_tsel == true) {
      userEntered_Hou_tosel.images_ofHouse_tsel = received_message.attachments; 
    // Get the URL of the message attachment
    let attachment_url_photo = userEntered_Hou_tosel.images_ofHouse_tsel[0].payload.url;
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
    toselhou_byuser.images_ofHouse_tsel = false;  // for images to be send by user
  }




    else if (received_message.text && toselhou_byuser.estimated_amount_toget == true) { // estimated amount to get
    userEntered_Hou_tosel.estimated_amount_toget = received_message.text; // estimated amount to get
    response = {
      "text":"Please tell me fully address of own house to be sold"
    }
    toselhou_byuser.estimated_amount_toget = false; // for estimated amount to get
    toselhou_byuser.fullyAddress_byCu_tosel = true; // for fully address by user
  } 

   else if (received_message.text && toselhou_byuser.fullyAddress_byCu_tosel == true) { // for fully address by user
    userEntered_Hou_tosel.fullyAddress_byCu_tosel = received_message.text;
    response = {
      "text":"Please leave me your phone number."
    }
    toselhou_byuser.fullyAddress_byCu_tosel = false;  // for fully address by user
    toselhou_byuser.ph_numm_byCu_tosellHou = true; // for ph number by user
  } 



// later
  else if (received_message.payload === "tosel_hou_tell_later_byuser11") {
    response = {
      "text":"Please tell me the estimated amount that you want to get."
    }
  toselhou_byuser.estimated_amount_toget = true;
  } 


  else if (received_message.text && toselhou_byuser.ph_numm_byCu_tosellHou  === true) { // for ph number by user
   userEntered_Hou_tosel.ph_numm_byCu_tosellHou = received_message.text;    // for ph number by user
         response = {
       "text": "Do you want to tell something to us?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Yes",
                          "payload": "customer_useryes_toldbyuser111da",
                        },
                        {
                          "content_type": "text",
                          "title": "No",
                          "payload": "customer_usernono_toldbyuser111da",
                        }
                      ]
    }
    toselhou_byuser.ph_numm_byCu_tosellHou = false; // for ph number by user
  }
// customer says yes to tell something else
else if (received_message.payload === "customer_useryes_toldbyuser111da") {
    response = {
      "text":"Please tell me."
    }
  toselhou_byuser.sth_yes_toldbyCu = true; // for something else told by user
  } 


else if (received_message.text && toselhou_byuser.sth_yes_toldbyCu === true ) { // for something else told by user
    userEntered_Hou_tosel.sth_yes_toldbyCu = received_message.text;  
    saveData_tosell_house(sender_psid);

    let response1 = {
      "text":"Thanks for contacting us. I will contact you within 24 hours. Have a nice day!"
    }
    let response2 = { 
            "text": "A user has made for property. \nPlease check the following document: 4qfqnZWxbrhuZGRGfsX."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });

  toselhou_byuser.sth_yes_toldbyCu = false;
  }

// for user say no for something else
  else if (received_message.payload === "customer_usernono_toldbyuser111da" ) { // for user says no
    userEntered_Hou_tosel.sth_no_toldbyCu = received_message.payload;  // user says no for something else
    saveData_tosell_house(sender_psid);

    let response1 = {
      "text":"Thanks for contacting us. I will contact you within 24 hours. Have a nice day!"};
    let response2 = { 
            "text": "A user has made for property. \nPlease check the following document: 4qfqnZWxbrhuZGRGfsX."
    };
    callSend(sender_psid, response1).then(()=>{
    return callSend(sender_psid, response2);
    });
    received_message.payload = false;
  }


/*******************/








/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/




// to sell land
 else if (received_message.payload === "tselottlan" || received_message.payload === "tselpoblan" || received_message.payload === "tseldeklan" || received_message.payload === "tselzayalan" || received_message.payload === "tselzabulan" || received_message.payload === "toselpyinlan") {
      userEntered_land_tosel.twp_name_tosell_land = received_message.payload;  // for twp name to sell 
         response = {
      "text":'Please tell me area of your land that you want to sell.'
    }
    received_message.payload = false; 
    tosel_land_byuser.land_area_tosell_byCu = true; // for land area
  }
 else if (received_message.text && tosel_land_byuser.land_area_tosell_byCu === true) { // for land area
  userEntered_land_tosel.land_area_tosell_byCu = received_message.text;   // for land area
         response = {
      "text":'Please tell me type of land that you want to sell.'
    }
    tosel_land_byuser.land_area_tosell_byCu = false;    // for land area
    tosel_land_byuser.land_type_tosell_byCu = true;     // for type of land
  }
   else if (received_message.text &&  tosel_land_byuser.land_type_tosell_byCu === true) {
   userEntered_land_tosel.land_type_tosell_byCu = received_message.text;  // for type of land
         response = {
       "text": "Is it a myie pauk or not?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Yes",
                          "payload": "ans_yes_for_a_myie_pauck",
 //                         "image_url":"http://example.com/img/green.png"
                        },
                        {
                          "content_type": "text",
                          "title": "No",
                          "payload": "ans_no_for_a_myie_pauck",
 //                         "image_url":"http://example.com/img/red.png"
                        }
                      ]
    }
    tosel_land_byuser.land_type_tosell_byCu = false; // for type of land
  }

 else if (received_message.payload === "ans_yes_for_a_myie_pauck" || received_message.payload === "ans_no_for_a_myie_pauck") {
      userEntered_land_tosel.a_myie_pauk_byCu = received_message.payload; // for a myie pauk
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
    received_message.payload = false; // for a myie pauck
  }


   else if (received_message.payload === "send_now_photos_land") { 
    response = {
      "text": "OK, please send me."
    }
     received_message.payload = false;
     tosel_land_byuser.images_ofLand_byCu = true; // for land images by user
  }
  else if (received_message.attachments && tosel_land_byuser.images_ofLand_byCu == true) { // for land images by user
      userEntered_land_tosel.images_ofLand_byCu = received_message.attachments; // for land images by user
    // Get the URL of the message attachment
    let attachment_url = userEntered_land_tosel.images_ofLand_byCu[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "I received your photo. Do you want to send more?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
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
    tosel_land_byuser.images_ofLand_byCu = false; // for land images by user
  }

    else if (received_message.text && tosel_land_byuser.estimated_amount_byCus == true) { // for estimated amount to get
    userEntered_land_tosel.estimated_amount_byCus = received_message.text;    // for estimated amount to get
    response = {
      "text":"Please tell me fully address of own land to be sold"
    }
    tosel_land_byuser.estimated_amount_byCus = false; // for estimated amount to get
    tosel_land_byuser.fullyAddress_ofLand_tosell = true;   // for fully address of land
  } 
  else if (received_message.text && tosel_land_byuser.fullyAddress_ofLand_tosell == true) {   // for fully address of land
    userEntered_land_tosel.fullyAddress_ofLand_tosell = received_message.text;    // for fully address of land
    response = {
      "text":"Please leave me your phone number"
    }
    tosel_land_byuser.fullyAddress_ofLand_tosell = false;   // for fully address of land
    tosel_land_byuser.phone_num_byCu_tosell_land = true;    // asking phone number of user
  } 
  

// for later to send photo
 else if (received_message.payload === "tosel_later_land") {
    response = {
      "text":"Please tell me estimated amount that you want to get."
    }
    tosel_land_byuser.estimated_amount_byCus = true; // for estimated amount to get
  } 

   else if (received_message.text && tosel_land_byuser.phone_num_byCu_tosell_land == true) {    // asking phone number of user
    userEntered_land_tosel.phone_num_byCu_tosell_land = received_message.text;
    response = {
       "text": "Do you want to tell something to tell us?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Yes",
                          "payload": "cu_say_yes_for_sthElse",
                        },
                        {
                          "content_type": "text",
                          "title": "No",
                          "payload": "cu_say_no_for_sthElse",
                        }
                      ]
    }
    tosel_land_byuser.phone_num_byCu_tosell_land = false;   // asking phone number of user
  }

else if (received_message.payload === "cu_say_yes_for_sthElse") {
    response = {
      "text":"Ok, please tell me."
    }
    tosel_land_byuser.yes_for_sthElse_byCu = true;  // for sth else told by user
  } 


   else if (received_message.text && tosel_land_byuser.yes_for_sthElse_byCu == true) {  // for sth else told by user
    userEntered_land_tosel.yes_for_sthElse_byCu = received_message.text;  // for sth else told by user
    saveData_tosell_land(sender_psid); 
    response = {
      "text":"Thanks for contacting us. I will contact you within 24 hours. Have a nice day!"
    }
    tosel_land_byuser.yes_for_sthElse_byCu = false; // for sth else told by user
  } 

// user says no for sth else
   else if (received_message.payload == "cu_say_no_for_sthElse") {
      userEntered_land_tosel.no_for_sthElse_byCu = received_message.payload; // user say no for sth else
      saveData_tosell_land(sender_psid);
      let  response1 = {
              "text":"Thanks for contacting us. I will contact you within 24 hours. Have a nice day!"};
      let response2 = { 
            "text": "A user has made for property. \nPlease check the following document: 4qfqnZWxbrhuZGRGfsX."
     };
     callSend(sender_psid, response1).then(()=>{
     return callSend(sender_psid, response2);
  });       
      received_message.payload = false;
  } 



/*************************************************************************************************/
/*************************************************************************************************/
/*************************************************************************************************/



 // to buy house in oattra, for types of house
  else if (received_message.payload === "ottwp" ) {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                          {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_ott",
                        },
                        {
                          "content_type": "text",
                          "title": "Other Type",
                          "payload": "otherType_ott",
                        }
                      ]

      }
  }

  // to buy house in oattra, RC
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
                          "title": "other floor",
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
                          "payload": "80_in_ott", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "100_in_ott", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "150*150",
                          "payload": "150_in_ott", // complete text
                        }
                      ]
      }
  }
// to buy house in oattra, RC, two floor
  else if (received_message.payload === "twof_ott") {
    response = {
                  "text": "Do you want how much wide area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "twof80_in_ott", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "twof100_in_ott", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "150*150",
                          "payload": "twof150_in_ott", // complete
                        }
                      ]
      }
  }

/*************************************************/

// to buy house in oattra, RC, one floor, 80*80 // complete
    else if (received_message.payload === '80_in_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 2500 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92351629_148794463333020_2221158640822255616_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeFm1wi0SGzyni_3NnxhV8Kj1lNwb3N4O3bWU3Bvc3g7dqEGpoxFQfLp2LSy7mRPgwj9ppl6UkkYIqzQC9mAFgW7&_nc_ohc=DvaeZzryCYUAX_S_qgT&_nc_ht=scontent.fmdl2-1.fna&oh=f69f9220fff2b8f1db623b5defefa594&oe=5EDFF245",
            "subtitle":"",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148795749999558/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148795749999558/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}


// to buy house in oattra, RC, one floor, 100*100 // complete
    else if (received_message.payload === '100_in_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 3000 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91912200_148783696667430_2449683035914764288_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeGtmRWzKn14WcOyBlHpkLA8U4OdKoYtcohTg50qhi1yiCt7wEw-ep9s_RQgz5V370kLzW9e5txrxVGQj_84K-09&_nc_ohc=ULbgxq5Vt6oAX_GXuqF&_nc_ht=scontent.fmdl2-1.fna&oh=0f158775833551b86621692016f0327d&oe=5EE1749D",
            "subtitle":"Mbr-(4), Br-(1), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148790940000039/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148790940000039/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy house in oattra, RC, one floor, 150*150 // complete text
    else if (received_message.payload === '150_in_ott') {
          response = {
      "text": "There is no property avaliable. Sorry for you. Have a nice day!"
    }
}



/**********************************/

// to buy house in oattra, RC, two floor, 80*80 // complete
    else if (received_message.payload === 'twof80_in_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 2000 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92243595_148808969998236_2207483370462511104_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeHszxekDwF7YUypu6w1O-DkdSzCbXL8J9d1LMJtcvwn154x57tv3s4IbYD7nFu1S0dUVp_ws3dUsXZkjbhpG3nb&_nc_ohc=so172qaRYL4AX-GKSG6&_nc_ht=scontent.fmdl2-1.fna&oh=337f9e1278e76a8fef5c691aafc3931b&oe=5EE16006",
            "subtitle":"Mbr-(3), Br-(3), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148810216664778/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148810216664778/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy house in oattra, RC, two floor, 100*100 // complete
    else if (received_message.payload === 'twof100_in_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 3500 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92577724_148801386665661_3656608166516359168_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeFt0-dDc-FGDdhKVueJlnJ7eVXqTKuoYJR5VepMq6hglO7w10RQQYRLvizT9e3NUsFd9Hq7Sv4Q9md3EZJSnycB&_nc_ohc=azaDkkF1THsAX9Z49x-&_nc_ht=scontent.fmdl2-1.fna&oh=de8e5d29948a6fe0464d7d38033dd8e1&oe=5EE113F0",
            "subtitle":"Mbr-(2), Br-(3), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148802449998888/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148802449998888/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy house in oattra, RC, two floor, 150*150 // complete
    else if (received_message.payload === 'twof150_in_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 5000 lakhs, 150*150 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91553411_148811056664694_2994737999507357696_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeEfP3OQyWSVC6Z-lY6HYqDWh_MT8b2h51aH8xPxvaHnVqPHPIBXsMgLEI-3fAuGNUnNKKIzHBw2Y-A6HGPqzGB3&_nc_ohc=oMf8b87ysjoAX8FtYGu&_nc_ht=scontent.fmdl2-1.fna&oh=70c56b3e2a89edfa544371ab617dc297&oe=5EE32265",
            "subtitle":"Mbr-(2), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148812259997907/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148812259997907/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
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
                          "payload": "otherType_pobb", // complete text
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
                          "payload": "onef_pobb", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_pobb", //complete text
                        },
                        {
                          "content_type": "text",
                          "title": "other floor",
                          "payload": "thirdf_pobb", // complete
                        }
                      ]

      }
  }


  // to buy house in pobba, RC, one floor,
  else if (received_message.payload === "onef_pobb") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "tobuyhoupobb_rconefmbr24inaa", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobuyhoupobb_rconefmbr68aaan", // complete text
                        },
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "tobuyhoupobb_rconefmbr88nnna", // complete
                        }
                      ]
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
                          "payload": "tobuyhoupobb_rctwof46pob", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobuyhoupobb_rctwof68aart",  // complete text
                        },
                         {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "tobuyhoupobb_rctwof88bbw", // complete
                        }
                      ]
  }
}

// to buy house in pobba, RC, one floor, 40*60 // complete text
 else if (received_message.payload === 'tobuyhoupobb_rconefmbr24inaa') {
    response = {
          "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}

// to buy house in pobba, RC, one floor,  60*80 // complete text
 else if (received_message.payload === 'tobuyhoupobb_rconefmbr68aaan') {
    response = {
            "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}

// to buy house in pobba, RC, one floor,  80*80 // complete
 else if (received_message.payload === 'tobuyhoupobb_rconefmbr88nnna') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"RC, 950 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92555021_148694693342997_4064605342099570688_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeHdSxG1IzD6iMZL01qEg0KzthAmkZBLAZK2ECaRkEsBklsHQStxScdsxZDKhJHFmGhjF-6yz9By88h_ESul1b2d&_nc_ohc=kZWapLUa1OMAX8q8OOo&_nc_ht=scontent.fmdl2-2.fna&oh=d0928d3d2908871fff222be5571f3a01&oe=5EE2C5B4",
            "subtitle":"MBr-(2), Br-(3), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148695696676230/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148695696676230/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
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
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}

/****************************************/

// to buy house in pobba, RC, two floor, 40*60 // complete
 else if (received_message.payload === 'tobuyhoupobb_rctwof46pob') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"2RC, 2500 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91606159_148757690003364_6476717670556237824_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeEwaNaIO6IktYPhZerxMcm7Qew2jPuaaEFB7DaM-5poQZvYiKqWGrH_lW38GzC0sEa2ozlem0muIfNfovwajN7B&_nc_ohc=hslf-WjVJoAAX-OP-p8&_nc_ht=scontent.fmdl2-1.fna&oh=f7d79bf5781b28d881c24f9d75635104&oe=5EE2EE41",
            "subtitle":"MBr-(2), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148761353336331/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148761353336331/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy house in pobba, RC, two floor, 60*80 // complete text
 else if (received_message.payload === 'tobuyhoupobb_rctwof68aart') {
    response = {
          "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}

// to buy house in pobba, other type // complete text
 else if (received_message.payload === 'otherType_pobb') {
    response = {
          "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}

// to buy house in pobba, RC, two floor, 80*80 // complete
 else if (received_message.payload === 'tobuyhoupobb_rctwof88bbw') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"2RC, 3500 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92463513_148754363337030_6063595422167859200_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeGEiOz1OhNnDp1HZmVLX-bLmqWuDQ1bDISapa4NDVsMhDw_xJfVd9Nb2PC9a3eG6ILKw0MuXJZGWA5_etoz-7jX&_nc_ohc=DvR8mZPr024AX-Xy5ZN&_nc_ht=scontent.fmdl2-1.fna&oh=f59b35f082eb15cfe9c55c0bd6c5f791&oe=5EE27801",
            "subtitle":"MBr-(3), Br-(2), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148755383336928/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148755383336928/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}
/*********************************/

// to buy house in pobba, RC, other floor // complete
 else if (received_message.payload === 'thirdf_pobb') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"3RC, 3600 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92138782_148707466675053_5918704202221092864_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeE_h3jBITkW7xkMqu3_I6ZSTbencPv31K1Nt6dw-_fUrRIBi2eMl4upeFefewulR61984TZbIxxpK-ya8_OLYqw&_nc_ohc=TEylSP0f8FoAX-lix3b&_nc_ht=scontent.fmdl2-1.fna&oh=2b4637f1a87dd8301fd51e2eeea0e88b&oe=5EE3726E",
            "subtitle":"MBr-(4), Br-(2), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148708120008321/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148708120008321/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
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
                          "payload": "otherType_dek", // complete
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
                          "payload": "twof_dek", // complete al
                        },
                        {
                          "content_type": "text",
                          "title": "Other floor",
                          "payload": "thirdf_dek", // complete text
                        }
                      ]

      }
  }

 // to buy house in dekkhina, one floor, 
  else if (received_message.payload === "onef_dek") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "onlymbed100_dek", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "onlymbed88in_dek", // complete
                        },
                           {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "onlymbed100in_dek", // complete
                        }
                      ]
      }
  }
 // to buy house in dekkhina, two floor, area
  else if (received_message.payload === "twof_dek") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "twof_aonlymbed68b_dek", // complete 
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "twof_aonlymbed88asin_dek",  // complete
                        }, 
                           {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "twof_aonlymbed100aabccdin_dek",  // complete text
                        }
                      ]
      }
  }

/****************************/
// to buy house in dekkhina, one floor,  60*80 // complete text
    else if (received_message.payload === 'onlymbed100_dek') {
    response = {
        "text": "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}
// to buy house in dekkhina, one floor, 80*80 // complete 
    else if (received_message.payload === 'onlymbed88in_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1000 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92321972_148491743363292_6429195652722327552_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeEqwI-uwIDFTBM3zt_CBLdLHGcnH8zhv6kcZycfzOG_qb2aCW33oMMXn-w2o_Arj_x0qh5QU5kHScL-MjgjWthi&_nc_ohc=pCaUJ7Cn9f4AX9phiLJ&_nc_ht=scontent.fmdl2-2.fna&oh=e0b91a18c93a0c561bff0b2412e42de0&oe=5EE00FBD",
            "subtitle":"Mbr-(1), Br-(2), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148492746696525/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148492746696525/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy house in dekkhina, one floor, 100*100 // complete
    else if (received_message.payload === 'onlymbed100in_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 1100 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91593153_148493440029789_5631341104520495104_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeEq7aWXMt8U_MKygjew-xF1UtEmafdlVwhS0SZp92VXCFYTP0kJq8MdtiJut7rstdV83f9duCsRuvtXIjPqRe77&_nc_ohc=Z8KW9q-Q8aAAX9yGyem&_nc_ht=scontent.fmdl2-1.fna&oh=2eda433138fb601859f34ac202c1a20c&oe=5EE1ED60",
            "subtitle":"Mbr-(2), Br-(2), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148494183363048/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148494183363048/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}

/********************************************/

// to buy house in dekkhina, Rc, two floor, 60*80 // complete 
    else if (received_message.payload === 'twof_aonlymbed68b_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 2000 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92244656_148661983346268_5412490990118240256_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeH7i1rOMS8eeDRAo6chNPk97R3saB8e7SztHexoHx7tLI80FOYBR4_5sP3UzCEmtsrIlOqG-g2UNFogclACx-h9&_nc_ohc=1zBViAiRz2EAX8TluO2&_nc_ht=scontent.fmdl2-1.fna&oh=b80abc451c313e1d0f9c12c6c8678df3&oe=5EE029E1",
            "subtitle":"Mbr-(3), Br-(1), land type-(grant), face west, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148662386679561/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148662386679561/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy house in dekkhina, Rc, two floor, 80*80 // complete
    else if (received_message.payload === 'twof_aonlymbed88asin_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 3500 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92460697_148661310013002_7562140512816201728_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGXPnWOsVIgxd191EVtq4QzAAmWNiurfdoACZY2K6t92sSwRjyS9-R7_Sb-5Pej0m04acQDvIDQ4SXSMQ0YxOoB&_nc_ohc=YIhzjpUwc0MAX_3NX0Y&_nc_ht=scontent.fmdl2-1.fna&oh=29f4fce7ee1b3f71d0452220e6465d60&oe=5EE0BD05",
            "subtitle":"Mbr-(2), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148661530012980/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148661530012980/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy house in dekkhina, Rc, two floor, 100*100 // complete text
    else if (received_message.payload === 'twof_aonlymbed100aabccdin_dek') {
    response = {
        "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}

/***************************/

// to buy house in dekkhina, Rc, other floor, // complete text
    else if (received_message.payload === 'thirdf_dek') {
    response = {
        "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}
/************************/

// to buy house in dekkhina, other type (not RC) // complete
    else if (received_message.payload === 'otherType_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"Nancat,  600 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/93101461_148684256677374_2200426120719892480_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeFye7mt4SB5HOSquEDbUdAioBRfEDs7j8KgFF8QOzuPwrNvkh5Pix0nh-XhaE6LM0qxdB2C4fDV7nJikI9tr3B7&_nc_ohc=wlOOvGY5mqIAX_8skfl&_nc_ht=scontent.fmdl2-1.fna&oh=cfb04858606baaf5b1fd1a60df24fb62&oe=5EE04993",
            "subtitle":"Br-(3), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148685033343963/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148685033343963/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
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
                          "payload": "rc_zaya1", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "Other Type",
                          "payload": "nancat_zaya1", // complete text
                        }
                      ]

      }
  }
  // to buy house in zayathi, RC, 
  else if (received_message.payload === "rc_zaya1") {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_zayathi", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_zayathi", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "other floor",
                          "payload": "whateverf_zayathi", // complete text
                        }
                      ]

      }
  }
/******************************/

 // to buy house in zayathiri, house, RC, one floor, area
  else if (received_message.payload === "onef_zayathi") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "onlymbed60_zayathi", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",               
                          "payload": "onlymbed100_zayathi",  // complete
                        },
                        {
                          "content_type": "text",
                          "title": "other area",
                          "payload": "onlyother_zayathi",  // complete text
                        }
                      ]
      }
  }

/*********************************/
  // to buy house in zayathi, RC, two floor, 
  else if (received_message.payload === "twof_zayathi") {
    response = {
                  "text": "Please choose the land area of house you want to buy:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",                
                          "payload": "twofloor_landarea46_tobuyt_zaya", // complete
                        },
                         {
                          "content_type": "text",
                          "title": "60*80",            
                          "payload": "twofloor_landarea68a2_tobuyt_zaya", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "other area",
                          "payload": "twofloor_landareaotherab11_tobuyt_zaya", // complete
                        }
                      ]

      }
  }
/****************************/


  // to buy house in zayathi, RC, one floor, 40* 60 // complete
    else if (received_message.payload === 'onlymbed60_zayathi') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"1RC, 430 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92411898_147990653413401_1525933800742191104_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeHBsVC7TLdFJm2fLgZ5UqX3q8KD7opYtsKrwoPuili2woW_93kuxylkFMVFz5DU5-BC0u6TafZAWv0AweUc0PfN&_nc_ohc=W9Q9gsod6gMAX_LPZs4&_nc_ht=scontent.fmdl2-1.fna&oh=51daee27369db88499448760c4bc83ea&oe=5EE2BBBE",
            "subtitle":"Br-(3), land type-(grant), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/147990940080039/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/147990940080039/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}

 // to buy house in zayathi, RC, one floor,, 60*80 // complete
    else if (received_message.payload === 'onlymbed100_zayathi') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 675 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92588042_147988300080303_5214463371088232448_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeGB2gX8DBfZCnr3mDKV62fwSNme3d8UdudI2Z7d3xR25yOIn8TsKwiAvR3U8M7ZCVzaqvFXgbc7YnyotdM4vVtF&_nc_ohc=8TTOdQrKcpMAX-EI4Q3&_nc_ht=scontent.fmdl2-1.fna&oh=e29c4cfba5b44f10c69c0237ebbfe3ae&oe=5EE3500D",
            "subtitle":"Br-(1), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/147988560080277/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/147988560080277/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}
 // to buy house in zayathi, RC, one floor, other area // complete text
    else if (received_message.payload === 'onlyother_zayathi') {
    response = {
                "text": "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}




/****************************/
    // to buy house in zayathiri, RC, two floor, 40*60 // complete 
  else if (received_message.payload === 'twofloor_landarea46_tobuyt_zaya') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 1550 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92350854_148331046712695_1514855722876141568_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeG5ZcuXasEyLdDk5VORz6R7_wo-WeJtVEP_Cj5Z4m1UQ_fjxjYC9t60tCuxT33zIGTj0s3iAKlYy1cCYkZEEZ1V&_nc_ohc=h4Lhj8glnl8AX92kL35&_nc_ht=scontent.fmdl2-2.fna&oh=03668d3c92a2613f7b346334e9d27677&oe=5EE0F6E7",
            "subtitle":"Mbr-(2), Br-(2), land type-(grant),face east and north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148331360045997/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148331360045997/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}
  // to buy house in zayathiri, RC, two floor, 60*80 // complete text
  else if (received_message.payload === 'twofloor_landarea68a2_tobuyt_zaya') {
    response = {
                "text": "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}

  // to buy house in zayathiri, RC, two floor, other area // complete
  else if (received_message.payload === 'twofloor_landareaotherab11_tobuyt_zaya') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 1500 lakhs, 70*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91684696_148082903404176_4744287077787500544_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeGJrrl3pJoyH7bJsFh_A2zSY8El8xmJIX9jwSXzGYkhf7StKf4IQhKXk80QagK5ApXmLNQKOrd8a6bfq2o88g1g&_nc_ohc=txPeBuB2GmQAX_sH6nN&_nc_ht=scontent.fmdl2-1.fna&oh=fcfd44fabb738cdfcb316741459c8dbe&oe=5EE05111",
            "subtitle":"Mbr-(2), Br-(3), land type-(slit),face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148085410070592/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148085410070592/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}
 // to buy house in zayathi, RC, other floor // complete text
    else if (received_message.payload === 'whateverf_zayathi') {
    response = {
                "text": "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}

/**************************/
 
  // to buy house in zayathiri, Other Type (not RC) // complete text
  else if (received_message.payload === 'nancat_zaya1') {
    response = {
       "text": "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}

/***************************************************/
/***************************************************/

// to buy house in Zabu
else if (received_message.payload === "zabtwp") {
      response = {
                    "text":'Are you finding RC or other type?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_zabu111222", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "Other Type",
                          "payload": "otherType_zabu1", // complete
                        }
                      ]

      }
  }
  // to buy house in Zabuthiri, RC  
  else if (received_message.payload === "rc_zabu111222") {
    response = {
                  "text": "Please choose you want to buy the house in which",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_zabuthiri11aa", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_zabuthiri11aa", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "other floor",
                          "payload": "otherff1_zabuthiri11aa", // complete text
                        }
                      ]

      }
  }

   // to buy house in zabu, RC, one floor, 
  else if (received_message.payload === "onef_zabuthiri11aa") {
    response = {
                  "text": "Please choosse the land area of house:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "mbedroom60hou6_in_tobuyz1", // complete 
                        },
                          {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "mbedroom100hou100_in_tobuyz1",  // complete
                        },
                        {
                          "content_type": "text",
                          "title": "other area",
                          "payload": "onlyother_zabu7_tobuyz1", // complete text
                        }
                      ]
      }
  }
    // to buy  house in Zabuthiri, RC, two floor
  else if (received_message.payload === "twof_zabuthiri11aa") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "60*60",               
                          "payload": "tobuy_mbedroom60hou6_in_zabuu7", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",        
                          "payload": "tobuy_onlymbed100_zabu7", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "other area",
                          "payload": "tobuy_onlyother_zabu7", // complete
                        }
                      ]
      }
  }

  /***************************/

  // to buy house in zabu, RC, one floor, 60*60 // complete
    else if (received_message.payload === 'mbedroom60hou6_in_tobuyz1' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"1RC, 700 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92456400_148341980044935_5315513626461732864_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeHNN47ovsGuR5e8dsrxSj9d9B_aE_fP7zD0H9oT98_vMBGBCjuvS_C2XJDiCZGxnCnclC8uUrekgKK8VV5rboY8&_nc_ohc=TMVkRzK4N0oAX9x62c5&_nc_ht=scontent.fmdl2-1.fna&oh=6c22823bd9061f4fe0db79fee8f7db10&oe=5EE31E3C",
            "subtitle":"Mbr-(2), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148343050044828/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148343050044828/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy house in zabu, RC, one floor, 100*100 // complete
    else if (received_message.payload === 'mbedroom100hou100_in_tobuyz1' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"RC, 1000 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91955219_148335103378956_2829729028192075776_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeHYsY5ju_-UtnsMR-xcQDlg3NSNpodS4azc1I2mh1LhrMPrqOlTDU65CqHDQ8JVmDdP4O4QOQpjDSKLNTI4Y5Ys&_nc_ohc=v9ORsf5MrlEAX9A4sEI&_nc_ht=scontent.fmdl2-1.fna&oh=271d74fed66d3391457ea847afdcdf32&oe=5EE29E5A",
            "subtitle":"Mbr-(2),Br-(2),face south, land-type(grant), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148335820045551/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148335820045551/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy house in zabu, RC, one floor, other area // commplete text
    else if (received_message.payload === 'onlyother_zabu7_tobuyz1' ) {
    response = {
                "text": "There is no property avaliable. Sorry for you. Thanks for contacting us."
  }
}
  /***************************/

// to buy a house Zabbuthiri, RC, two floor, 60*60 // complete
    else if (received_message.payload === 'tobuy_mbedroom60hou6_in_zabuu7') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC,  2500 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91774025_148348000044333_6815842511517384704_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeHzqDLnklGlQ1xWNu07MBlaHw1QFU91-UofDVAVT3X5SnGbhIDx7oZdYcEPqVUAalWsZknjEkUmzV8CvCGJRIrZ&_nc_ohc=sZgY1wi7ab4AX_VaJ_M&_nc_ht=scontent.fmdl2-1.fna&oh=0e2b2f422d4b2f2cc97e5195e881d403&oe=5EE05E92",
            "subtitle":"Mbr-(1), Br-(4), land type-(grant),face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148348703377596/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148348703377596/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy a house Zabbuthiri, RC, two floor, 100*100 // complete text
    else if (received_message.payload === 'tobuy_onlymbed100_zabu7') {
    response = {
                  "text": "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}
// to buy a house Zabbuthiri, RC, two floor, other area // complete
    else if (received_message.payload === 'tobuy_onlyother_zabu7') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC,  900 lakhs, 60*70 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92465912_148351516710648_1751142708715454464_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeG4Y_29JTV2nR-S0e4T_3l2jyTiAxhjiyWPJOIDGGOLJeN4MvyOK5riu_STZt4-BtlbQ1z-Nj2JZLgPhK7gDSRH&_nc_ohc=HGyAC9SuccAAX_7ZmU7&_nc_ht=scontent.fmdl2-1.fna&oh=08bb2f92148841f8b83f3b36e7ffcdf0&oe=5EE17114",
            "subtitle":"Mbr-(2), Br-(4), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148351976710602/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148351976710602/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}
/***************************/

// to buy house in zabu, RC, other floor // complete text
    else if (received_message.payload === 'otherff1_zabuthiri11aa' ) {
    response = {
                "text": "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}
/***************************/

// to buy house in zabu, other type (not RC) // complete 
    else if (received_message.payload === 'otherType_zabu1' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"RC, 110 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92055239_148410403371426_3609555549953196032_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeEcxWyddvgH7C0Z2B2n6syBX7GQJ4Ddfc1fsZAngN19zZZV7BUT4-dAQhBpIFP153IJzNvhPOpKrB4lWAPsT5j7&_nc_ohc=NhfZs2wTQlkAX9hp-vO&_nc_ht=scontent.fmdl2-2.fna&oh=6df3662e070f0f0f8928e165d61c7604&oe=5EE0B3BA",
            "subtitle":"land type-(grant),face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148411956704604/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148411956704604/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
  }
}

/**************************************/

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
                          "title": "other floor",
                          "payload": "otherf_pyinfloorbb11",
                        }
                      ]

      }
  }
/***********************/
// to buy house in pyinmana, RC, one floor, 
  else if (received_message.payload === "onef_pyinfloor11") {
    response = {
                  "text": "Do you want how much wide land area of house?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "tobuhourcpyin46_tobuaa7", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "60*72",
                          "payload": "tobuhourcpyin172_tobunn7", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobuhourcpyin68_tobumma1", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "tobuhourcpyinotherarea_tobummb",
                        }
                      ]
      }
  }
/************************/
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


// to buy house in pyinmana, RC, one floor, 40*60 // complete
  else if (received_message.payload === "tobuhourcpyin46_tobuaa7") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 800 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92514443_149027839976349_7811256810781802496_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeGtwC8RgNaOUNZPFO3REPuj31gLL-xUvrzfWAsv7FS-vEWluPM-NjSGYRQrhXGeU3JTON-qX0R_nX8m0tQCyVJW&_nc_ohc=DLHv077sdm8AX_3jdmi&_nc_ht=scontent.fmdl2-2.fna&oh=cbf82f9e5267546a6bc25d0fdc3ae19a&oe=5EDFC6C1",
            "subtitle":"Mbr-(1), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149028459976287/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149028459976287/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
    }
  }

// to buy house in pyinmana, RC, one floor, 60*72 // complete
  else if (received_message.payload === "tobuhourcpyin172_tobunn7") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 550 lakhs, 60*72 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92353603_149043869974746_8473619924072267776_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeGgvj4JXTB-BaKlrv6fCWkPD8Wz4sbkNI8PxbPixuQ0j4z4WFsuBeE4rDoXcka8l3DzzgHyop1A6jQY9BeyxOWv&_nc_ohc=8IkUGIiYAvoAX_fJFsa&_nc_ht=scontent.fmdl2-1.fna&oh=298d573636dd736f667b4b2a7c89f7cd&oe=5EE0FD3A",
            "subtitle":"Mbr-(1), Br-(2), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149043983308068?sfns=mo",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149043983308068?sfns=mo",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
    }
  }

// to buy house in pyinmana, RC, one floor, 60*80 // complete
  else if (received_message.payload === "tobuhourcpyin68_tobumma1") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"1RC, 850 lakhs, Width-(60*80)",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92345669_149033143309152_6933827548061106176_n.jpg?_nc_cat=105&_nc_sid=110474&_nc_eui2=AeEI4W8wxQk3tk9YgjJjQ_vGP1pHh5H1KD8_WkeHkfUoPxtx5_-T7IVd-7alAloGuyAZbuYPZOCOJab3je027jsy&_nc_ohc=Vd8IKmDaFRUAX_1X-V8&_nc_ht=scontent.fmdl2-2.fna&oh=89b1e11f2046f8e2e1d40adacad9db27&oe=5EE03255",
            "subtitle":"Mbr-(2), Br-(1), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149035373308929/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149035373308929/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
    }
  }

// to buy house in pyinmana, RC, one floor, Other area
  else if (received_message.payload === "tobuhourcpyinotherarea_tobummb") {
    response = {
            "text":"There is no property avaliable to sell. Sorry for you. Thanks for contacting us."
    }
  }


/**********************************/


// to buy house in pyinmana, RC, two floor, 40*60 // complete
  else if (received_message.payload === "tobuytwof_rcpyin_a46ab") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 2300 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91909041_149045459974587_3734464206922055680_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeFU2LcrrLbR-1h9foxAhqdQB74mqwENAW0HviarAQ0BbSVC1u_Z_umhu8d7qGBi4uix6EwDxD8Fe-cH_uN1RPuC&_nc_ohc=6usbHowxbBEAX9a6Lz2&_nc_ht=scontent.fmdl2-1.fna&oh=115579a0007409cf3364717917b1920b&oe=5EE2D669",
            "subtitle":"Mbr-(4), land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149046339974499?sfns=mo",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149046339974499?sfns=mo",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
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
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91663260_149049396640860_3878909622148399104_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeGHkGRYDmdeavjzqEgTafF6vGtLT4QsOYC8a0tPhCw5gGfUGkXLqAvDbcmS2kynpkc427C_nqwWJyVMHf6lzNw7&_nc_ohc=UksZn3kUd4UAX8VSjTk&_nc_ht=scontent.fmdl2-2.fna&oh=efa9c980227d38061aeac1892adf662e&oe=5EE2A4B3",
            "subtitle":"Mbr-(2), Br-(1), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149050303307436/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149050303307436/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
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
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91647057_149048646640935_1634770849003208704_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeF5T-k7A2rpdAenpQX7rnQypSsvlvO9AJ2lKy-W870AneezH0bEyn8dFfPyyEkjsM0EKd0vLicVlYL82SSzmRXI&_nc_ohc=fDjjU9KTTXsAX-H3pTg&_nc_ht=scontent.fmdl2-1.fna&oh=c2ab3c4acc55de5f1cf267a7e093b526&oe=5EE23AF0",
            "subtitle":"Mbr-(4), Br-(2), land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149048763307590/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149048763307590/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
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

/***********************************/

  // to buy house in pyinmana, other type 
  else if (received_message.payload === "tobuyothertypepyin_bb1") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"Nancat, 340 lakhs, 60*80ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92496573_149052573307209_598445470120935424_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeEv0aBCrhgl6MnOg0rq39sY3sK3gbVcIgHewreBtVwiAYQsfhi4vde5O0uoZ5B_v0U7nD5wWQKYfrsH3TmEqs0-&_nc_ohc=L7oj6Oeo_8YAX_kxCPf&_nc_ht=scontent.fmdl2-1.fna&oh=90f6d5f9c727036eb12ed4977cf39897&oe=5EE25091",
            "subtitle":"land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149053369973796/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149053369973796/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
    }
  }
/********************************/

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
            "image_url": "https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92002695_149054846640315_174881099674025984_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeFipDbtj82omdAFRjVUePhR8t4gVQzRikby3iBVDNGKRhhpoUiY7hZ-yagQdENBxp15GUm3LCX6mBY7NJ7gKwME&_nc_ohc=r_v6HHtyP-QAX_Jlw62&_nc_ht=scontent.fmdl2-2.fna&oh=1da23dd82f0a42333b48b95507d8490f&oe=5EE053D7",
            "subtitle":"Mbr-(3), Br-(2), land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149055396640260?sfns=mo",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149055396640260?sfns=mo",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"aaabbb11m_tobuya"
              }              
            ]      
          }

        ]
      }
    }
    }
  }





 
/****************************************************************************************************************************/
/****************************************************************************************************************************/
/****************************************************************************************************************************/
/****************************************************************************************************************************/
 

 // to rent house in Zayathiri
else if (received_message.payload === "tenanzay") {
      response = {
                    "text":'Are you finding RC or other type?',
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_onef_rzayathi1_tenant", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "Other Type",
                          "payload": "othertype_abc77_rzayathi1_tenant", // complete text
                        }
                      ]

      }
  }
  // to rent house in zayathi, RC, floor, 
  else if (received_message.payload === "rc_onef_rzayathi1_tenant") {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onefloor_abcd1122_rzayathi1_tenant", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twofloor_abcd1122_rzayathi1_tenant", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "Other floor",
                          "payload": "otherfloor_abcd1122_rzayathi1_tenant", // complete text
                        }
                      ]

      }
  }
  // to rent house in zayathi, RC, other floor // complete text
    else if (received_message.payload === 'otherfloor_abcd1122_rzayathi1_tenant') {
    response = {
                "text": "There is no house avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}

/*****************/

  

  // to rent house in zayathi, RC, two floor, 
  else if (received_message.payload === "twofloor_abcd1122_rzayathi1_tenant") {
    response = {
                  "text": "Please choose the estimated price you want to use",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "twofloor_below3and3_rzayathi1_tenant", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "otherfloor_above3lakhs_rzayathi1_tenant", // complete
                        }
                      ]

      }
  }

  // to rent house in zayathiri, RC, two floor, 3 lakhs & below it // complete text
    else if (received_message.payload === 'twofloor_below3and3_rzayathi1_tenant') {
    response = {
          "text" : "There is no avaliable property. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}
// to rent house in zayathiri, RC, two floor, above 3 lakhs // complete 
    else if (received_message.payload === 'otherfloor_above3lakhs_rzayathi1_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
          {
            "title":"RC, 6 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92350854_148331046712695_1514855722876141568_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeG5ZcuXasEyLdDk5VORz6R7_wo-WeJtVEP_Cj5Z4m1UQ_fjxjYC9t60tCuxT33zIGTj0s3iAKlYy1cCYkZEEZ1V&_nc_ohc=h4Lhj8glnl8AX92kL35&_nc_ht=scontent.fmdl2-2.fna&oh=03668d3c92a2613f7b346334e9d27677&oe=5EE0F6E7",
            "subtitle":"Mbr-(2), Br-(2),face east and north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148331360045997/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148331360045997/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }


        ]
      }
    }
  }
}

/****************/

  /************/
 // to rent house in zayathiri, RC, one floor, 
  else if (received_message.payload === "onefloor_abcd1122_rzayathi1_tenant") {
    response = {
                  "text": "Please choose the estimated price you want to use:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "onlymbed60_zayathi_tenantaabbdd11", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "onlymbed100_zayathi_tenantaabbdd11", // complete text
                        }
                      ]
      }
  }
 
  // to rent house in zayathiri, Other Type (not RC) // complete text
    else if (received_message.payload === 'othertype_abc77_rzayathi1_tenant') {
    response = {
        "text": "There is no avaliable house. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}




  // to rent house in zayathi, RC, one floor,  3 lakhs & below it // complete
    else if (received_message.payload === 'onlymbed60_zayathi_tenantaabbdd11') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"1RC, 2lakhs per month, 80*70 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91497803_148004706745329_4934947964616441856_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeFIDrTTnrVgW7Y-gZH5yJXvBKz1BMcNxG0ErPUExw3EbWo0JPNgeHM3z9Pnj8baoVJYA7bUKfi_ECnrWvCAWpZA&_nc_ohc=KteAmR_gcSkAX-YVZEk&_nc_ht=scontent.fmdl2-1.fna&oh=5244d3614979a1f895ed079b029cb85b&oe=5EE1617A",
            "subtitle":"Br-(3), land type-(slit)",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148004840078649/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148004840078649/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}


 // to rent house in zayathi, RC, one floor,  above 3 lakhs // complete text
    else if (received_message.payload === 'onlymbed100_zayathi_tenantaabbdd11') {
    response = {
                "text": "There is no avaliable house. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}




/**********************************************************************************************************************/
/**********************************************************************************************************************/
/********************************************************************************************************************/
/********************************************************************************************************************/


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
  
// to buy land in Oattra, 100*100 // complete
else if (received_message.payload === 'land100_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 950 lakhs, 100*100 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92118218_148823953330071_3039576972746293248_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeEASOyH_awPxMqqf3WBfuAMDljIlmhozUwOWMiWaGjNTBEVjf3bi0NPZ24yrVJsXBH-SvbX-EpPgeTTJ_D3QmCm&_nc_ohc=ba68Z7hCDR4AX8Jn1py&_nc_ht=scontent.fmdl2-2.fna&oh=cec24f1bba2529d58b04c903a58dadb4&oe=5EE2AD36",
            "subtitle":"land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148824429996690/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148824429996690/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy land in Oattra, 150*150 // complete
  else if (received_message.payload === 'land150_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 3000 lakhs, 150*150 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92948083_148822556663544_8094008114333876224_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeFW6Kprkk_AXSmExCWF7vGq6Crz--ac0-PoKvP75pzT40WH2K6wNDlEa-cAD7FhCQpEaIAuj-puVSaPCTJ6vPn4&_nc_ohc=mnAkfUFJeAYAX9TZRdV&_nc_ht=scontent.fmdl2-1.fna&oh=0f8b03ca68e91f6e963d66f127ab2284&oe=5EE032C6",
            "subtitle":"land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148823586663441/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148823586663441/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
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
                          "payload": "land40_pobbtobu2b", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "land80_pobbtobu26", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "land88_pobbtobu11", // complete
                        }
                      ]
      }
  }

// to buy land in Pobba,  40*60 // complete text
    else if (received_message.payload === 'land40_pobbtobu2b') {
    response = {
          "text" : "There is no property avaliable. So sorry for you. Have a nice day!"
  }
}

// to buy land in Pobba,  60*80 // complete
    else if (received_message.payload === 'land80_pobbtobu26') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 200 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91991273_148704343342032_3054495691972804608_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeH2wVSm5DsCLFesBvl46bpfPyPofjUfO_k_I-h-NR87-RcfEZJ_1P_ZadUUe5CAUmR5z69C4_9FqExGSFAOwEP3&_nc_ohc=E9jp3iu21zoAX-MIj1E&_nc_ht=scontent.fmdl2-2.fna&oh=5c6d8fec2040657af4c523e4973e4d06&oe=5EE268F3",
            "subtitle":"land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148704380008695/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148704380008695/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy land in Pobba,  80*80 // complete
    else if (received_message.payload === 'land88_pobbtobu11') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 250 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92230031_148704800008653_4090756521791586304_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeEO-jxiti1JQNFThle_S_jni90HSvupMk6L3QdK-6kyTlrw3uARvolzrmtRPvT-L59Z7xSh0ScJrnM0KZ6yt89i&_nc_ohc=Sbqd6U7yzukAX_VI6G0&_nc_ht=scontent.fmdl2-2.fna&oh=b0a9f00fdfd9de1b12370773beb2423c&oe=5EE26C69",
            "subtitle":"land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148705206675279/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148705206675279/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}


/*****************************************/
/****************************************/


// to buy land in Dekkhia, area
else if (received_message.payload === "dekthi") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobude_onlya100land_dek", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "tobude_onlya80landin_dek", // complete text
                        },
                           {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "tobude_onlyaland100in_dek", // complete
                        }
                      ]
      }
  }



// to buy land in Dekkhina,  60*80 // complete
    else if (received_message.payload === 'tobude_onlya100land_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 200 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92360334_148680736677726_5635709584476733440_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeHyQ1NLvMIClsn5S9QIthrSiiHWb8EfPkmKIdZvwR8-Sfo6ZfQDqr_NGT0QX3c8d_FzWTaqT6apxtC5-IO9-Vd6&_nc_ohc=Ira00GKLMD4AX_D5ojm&_nc_ht=scontent.fmdl2-1.fna&oh=c81e61d0b6e02fe604447ae0e0b78632&oe=5EE13312",
            "subtitle":"land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148680860011047/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148680860011047/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy land in Dekkhina,  80*80 // complete text
    else if (received_message.payload === 'tobude_onlya80landin_dek') {
    response = {
        "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}

// to buy land in Dekkhina,  100*100 // complete
    else if (received_message.payload === 'tobude_onlyaland100in_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 350 lakhs,100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92023227_148678763344590_6163162711233396736_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeG1Yh-bM7cBszY0E37bemDdBgP3e6fdm5QGA_d7p92blNuE8eGcUXHPcSs7BtZkfLvhlKHV_h0OQEL5jmxzFKk-&_nc_ohc=-XrLbF3EGtcAX9rjRi4&_nc_ht=scontent.fmdl2-1.fna&oh=452dfc7f2463cec35318626ac4f713e4&oe=5EE25A75",
            "subtitle":"land type-(permit), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148679283344538/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148679283344538/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
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
                          "payload": "tobuy_land_area_inzayad146", // complete 
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "tobuy_land_area_inzayad168",  // complete 
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "tobuy_land_area_inzayad1other", // complete text
                        }
                      ]
      }
  }

// to buy land in Zayathiri, 40*60 // complete 
    else if (received_message.payload === 'tobuy_land_area_inzayad146') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 150 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91513938_147997343412732_2184803353274351616_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeHbEG6AVbBgKfxV7lLu7SEPDZHJLkRvnegNkckuRG-d6LVbeXwvrTB7r60wxpuqzmmPtlRTf3-CFc9YBIBz-8y-&_nc_ohc=-leSOfci12cAX-ni-ZO&_nc_ht=scontent.fmdl2-2.fna&oh=3192369ae018228873a946e930142097&oe=5EE31434",
            "subtitle":"land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/147997423412724/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/147997423412724/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy land in Zayathiri, 60*80 // complete 
    else if (received_message.payload === 'tobuy_land_area_inzayad168') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 200 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92076615_147998313412635_430261903793586176_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeEVm_FWPjTJ2BufDDswKfkPFK-SCgwYCSYUr5IKDBgJJu5BnDZR4AHvnvwAnxyjlT9aGQZjA1mRTwhL9dwxDG9f&_nc_ohc=GoIKBx8yT1AAX_usYyx&_nc_ht=scontent.fmdl2-1.fna&oh=698b83790b8d6e8b70ea72aa61d326be&oe=5EE242BE",
            "subtitle":"land type-(slit), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148002090078924/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148002090078924/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy land in Zayathiri, Other area // complete text
    else if (received_message.payload === 'tobuy_land_area_inzayad1other') {
    response = {
        "text" : "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}

/******************************************************/
/*****************************************************/

  // to buy land in Zabuthiri, area
  else if (received_message.payload === "zabuthi") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "only60blandin_zabuu7", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "only68cclandin_zabuu7", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "onlyother7dlandin_zabuu7", // complete text
                        }
                      ]
      }
  }

// to buy land in Zabuthiri,  60*60 // complete
  else if (received_message.payload === 'only60blandin_zabuu7') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 350 lakhs, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92024001_148398896705910_1925425798618021888_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeGkGT-G1km0QEHChcndqjvVTdl6vz24PkFN2Xq_Pbg-Qdg6YZqVgGYsbDkWAPAJV6NcVcnQ4RfzMISzRkWWe3pm&_nc_ohc=eEaFvN9ifNMAX9XRH6-&_nc_ht=scontent.fmdl2-1.fna&oh=07eb7ad416c5fdcdbc9bc77d073cee67&oe=5EE09D9B",
            "subtitle":"face south, land type-(grant), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148399133372553/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148399133372553/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy land in Zabuthiri,  100*100 // complete
else if (received_message.payload === 'only68cclandin_zabuu7') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 200 lakhs, 100*100 ft, face east,",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92439576_148403136705486_7447542521841844224_n.jpg?_nc_cat=105&_nc_sid=110474&_nc_eui2=AeHz1uwG9QB2ohDvgqFba1n0_izibo1StVT-LOJujVK1VLJqkR3lrBxIXnGvYAGBqdXu2I6-3D6ysXR2oW9hNjiF&_nc_ohc=fSInt_c9CaQAX-n_IqT&_nc_ht=scontent.fmdl2-2.fna&oh=3c35e264eb5daf1ea814b093f7bdb2c4&oe=5EE32465",
            "subtitle":"land type-(village land),Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148404193372047/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148404193372047/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to buy land in Zabuthiri,  Other area // complete text
  else if (received_message.payload === 'onlyother7dlandin_zabuu7' ) {
    response = {
        "text" : "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}

/*********************************************/

// to buy land in pyinmana
  else if (received_message.payload === "pyi5") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "land_a1_pyintobu", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "60*72",
                          "payload": "land_a2_pyintobu", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "land_a3_pyintobu", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "other_a4_pyintobu",
                        }
                      ]
      }
  }


// to buy land in pyinmana,  40*60 // complete
    else if (received_message.payload === 'land_a1_pyintobu') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 320 lakhs, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92355353_149016376644162_8935573987816112128_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeFZldR4F_a8ZBf0sOYfCRgi8_Dga96tKk_z8OBr3q0qT6eWixeHmONTRbkYmpKOfUAc_WVrRsf73UpzPlWDJG1P&_nc_ohc=rW1FFc--3cgAX8v55YJ&_nc_ht=scontent.fmdl2-2.fna&oh=3122788edbccba2a855edd1fe8f18fd4&oe=5EE2B105",
            "subtitle":"land type-(grant), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149016949977438/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149016949977438/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy land in pyinmana,  60*72 //complete
    else if (received_message.payload === 'land_a2_pyintobu') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 550 lakhs, 60*72 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91944330_149019299977203_418187470824275968_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeGRf4pbtPI2yrR1hioqwmrqUx4Q1W7AGlFTHhDVbsAaUXOwMiR5jVBk-CTXwNfLnUKhzY79QvgkcsFLvNay3Yej&_nc_ohc=vJLMQKIRkKkAX98dmI1&_nc_ht=scontent.fmdl2-1.fna&oh=c8b66ef5edee8f04d9199762204a52c1&oe=5EE2354A",
            "subtitle":"land type-(permit), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149020983310368/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149020983310368/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to buy land in pyinmana,  60*80 // complete
    else if (received_message.payload === 'land_a3_pyintobu') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 670 lakhs, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92591960_149017693310697_3011678316890423296_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeHLXhGDIb79vxF8QYyJV052I8KibjVY7yMjwqJuNVjvI_gG7dKIt-lLRrYTFAGvOUi0JfcOwSTaAjn1mthgroN3&_nc_ohc=WpdQMWNvvdsAX8HGIhu&_nc_ht=scontent.fmdl2-2.fna&oh=07800bf2eca77e1a7503a6de24a6e262&oe=5EDFC54C",
            "subtitle":"land type-(permit), face west",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149018329977300/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149018329977300/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
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
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91634645_149058153306651_5105018245652414464_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeETCV-yHeBIhgg8uUL_ZxvAzDD0tWO6NdzMMPS1Y7o13HGNGOL8h_FwRpnThh5YEsMJDE9GPoRo4uHG1TIp1EbD&_nc_ohc=hfclQmkzTQoAX-nqrsn&_nc_ht=scontent.fmdl2-2.fna&oh=09c4717abfdcf23ebb9bbc09a23944c9&oe=5EE11A9C",
            "subtitle":"",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149058289973304/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149058289973304/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"tobuylandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}





/*********************************************************************************************************/
/*********************************************************************************************************/
/*********************************************************************************************************/



// to rent land as tenant
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
                          "payload": "torentland100_ott", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "150*150",
                          "payload": "torentland150_ott", // complete
                        },
                        
                      ]
      }
  }
// to rent land in Pobba
  else if (received_message.payload === "tepobl") {
    response = {
                  "text": "Lands' areas to be rented in Zayathiri Township:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "land40_pobbtobu2ba_tenant", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "land80_pobbtobu26a_tenant", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "land88_pobbtobu11a_tenant", // complete
                        }
                      ]
      }
  }
// to rent land in Dekkhia, area
else if (received_message.payload === "tedekl") {
    response = {
                  "text": "Lands' areas to be rented in Zayathiri Township:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "torede_onlya6868land_dek_tenant", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "80*80",
                          "payload": "torede_onlya88landin_dek_tenant", // complete text
                        },
                           {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "torede_onlyaland100in_dek_tenant", // complete
                        }
                      ]
      }
  }
      // to rent land in Zayathiri twonship, area
  else if (received_message.payload === "tezayl") {
    response = {
                  "text": "Lands' areas to be rented in Zayathiri Township:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "torentz_land_area_inzayad146", // complete 
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "torent_land_area_inzayad168",   // complete 
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "torent_land_area_inzayad1other", // complete text
                        }
                      ]
      }
  }
    // to rent land in Zabuthiri, area
  else if (received_message.payload === "tezal") {
    response = {
                  "text": "Lands' areas to be rented in Zabuthiri Township:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "60*60",
                          "payload": "only60blandin_zabuu7_rent1", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "100*100",
                          "payload": "only68cclandin_zabuu7_rent1", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "onlyother7dlandin_zabuu7_rent1", // complete text
                        }
                      ]
      }
  }
// to rent land in Pyinmana
  else if (received_message.payload === "tepyinlan") {
    response = {
                  "text": "Lands' areas to be rented in Pyinmana Township:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "40*60",
                          "payload": "torentlandpyin46_areab11", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "60*72",
                          "payload": "torentlandpyin672_areaaa1", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "60*80",
                          "payload": "torentlandpyin68_areacc11",  // complete
                        }, 
                         {
                          "content_type": "text",
                          "title": "Other area",
                          "payload": "torentlandpyinotherarea_areadd11",
                        }
                      ]
      }
  }




/***************************************************************/

    // to rent land in Oattra 80*80
    else if (received_message.payload === 'torentland80_ott') {
    response = {
                  "text": "So sorry for my customer. There are not vacant land avaliable in Oattra to rent yet. Thanks for contacting us.",
                   
      }
  }
  
// to rent land in Oattra, 100*100 // complete
    else if (received_message.payload === 'torentland100_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 3 lakhs per month, 100*100 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92118218_148823953330071_3039576972746293248_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeEASOyH_awPxMqqf3WBfuAMDljIlmhozUwOWMiWaGjNTBEVjf3bi0NPZ24yrVJsXBH-SvbX-EpPgeTTJ_D3QmCm&_nc_ohc=ba68Z7hCDR4AX8Jn1py&_nc_ht=scontent.fmdl2-2.fna&oh=cec24f1bba2529d58b04c903a58dadb4&oe=5EE2AD36",
            "subtitle":"land type-(grant), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148824429996690/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148824429996690/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent land in Oattra, 150*150 // complete
    else if (received_message.payload === 'torentland150_ott') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 5 lakhs per month, 150*150 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92948083_148822556663544_8094008114333876224_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeFW6Kprkk_AXSmExCWF7vGq6Crz--ac0-PoKvP75pzT40WH2K6wNDlEa-cAD7FhCQpEaIAuj-puVSaPCTJ6vPn4&_nc_ohc=mnAkfUFJeAYAX9TZRdV&_nc_ht=scontent.fmdl2-1.fna&oh=0f8b03ca68e91f6e963d66f127ab2284&oe=5EE032C6",
            "subtitle":"land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148823586663441/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148823586663441/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

/******************************************************************/

// to rent land in Pobba,  40*60 // complete text
    else if (received_message.payload === 'land40_pobbtobu2ba_tenant') {
    response = {
        "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}

// to rent land in Pobba,  60*80 // complete
    else if (received_message.payload === 'land80_pobbtobu26a_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1.5 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91991273_148704343342032_3054495691972804608_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeH2wVSm5DsCLFesBvl46bpfPyPofjUfO_k_I-h-NR87-RcfEZJ_1P_ZadUUe5CAUmR5z69C4_9FqExGSFAOwEP3&_nc_ohc=E9jp3iu21zoAX-MIj1E&_nc_ht=scontent.fmdl2-2.fna&oh=5c6d8fec2040657af4c523e4973e4d06&oe=5EE268F3",
            "subtitle":"land type-(grant), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148704380008695/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148704380008695/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent land in Pobba,  80*80 // complete
    else if (received_message.payload === 'land88_pobbtobu11a_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 2.5 lakhs per month, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92230031_148704800008653_4090756521791586304_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeEO-jxiti1JQNFThle_S_jni90HSvupMk6L3QdK-6kyTlrw3uARvolzrmtRPvT-L59Z7xSh0ScJrnM0KZ6yt89i&_nc_ohc=Sbqd6U7yzukAX_VI6G0&_nc_ht=scontent.fmdl2-2.fna&oh=b0a9f00fdfd9de1b12370773beb2423c&oe=5EE26C69",
            "subtitle":"land type-(grant), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148705206675279/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148705206675279/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}
/********************************************/

// to rent land in Dekkhina,  60*80 // complete
    else if (received_message.payload === 'torede_onlya6868land_dek_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 2 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92360334_148680736677726_5635709584476733440_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeHyQ1NLvMIClsn5S9QIthrSiiHWb8EfPkmKIdZvwR8-Sfo6ZfQDqr_NGT0QX3c8d_FzWTaqT6apxtC5-IO9-Vd6&_nc_ohc=Ira00GKLMD4AX_D5ojm&_nc_ht=scontent.fmdl2-1.fna&oh=c81e61d0b6e02fe604447ae0e0b78632&oe=5EE13312",
            "subtitle":"land type-(grant), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148680860011047/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148680860011047/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent land in Dekkhina,  80*80 // complete text
    else if (received_message.payload === 'torede_onlya88landin_dek_tenant') {
    response = {
          "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}

 
// to rent land in Dekkhina,  100*100 // complete
    else if (received_message.payload === 'torede_onlyaland100in_dek_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 3 lakhs per month, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92023227_148678763344590_6163162711233396736_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeG1Yh-bM7cBszY0E37bemDdBgP3e6fdm5QGA_d7p92blNuE8eGcUXHPcSs7BtZkfLvhlKHV_h0OQEL5jmxzFKk-&_nc_ohc=-XrLbF3EGtcAX9rjRi4&_nc_ht=scontent.fmdl2-1.fna&oh=452dfc7f2463cec35318626ac4f713e4&oe=5EE25A75",
            "subtitle":"land type-(permit), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148679283344538/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148679283344538/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}
/************************************/



// to rent land in Zayathiri, 40*60 // complete 
    else if (received_message.payload === 'torentz_land_area_inzayad146') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1 lakh for 1 month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91513938_147997343412732_2184803353274351616_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeHbEG6AVbBgKfxV7lLu7SEPDZHJLkRvnegNkckuRG-d6LVbeXwvrTB7r60wxpuqzmmPtlRTf3-CFc9YBIBz-8y-&_nc_ohc=-leSOfci12cAX-ni-ZO&_nc_ht=scontent.fmdl2-2.fna&oh=3192369ae018228873a946e930142097&oe=5EE31434",
            "subtitle":"land type-(grant), face east, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/147997423412724/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/147997423412724/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}


// to rent land in Zayathiri, 60*80 // complete 
    else if (received_message.payload === 'torent_land_area_inzayad168') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1.5 lakh for a month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92076615_147998313412635_430261903793586176_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeEVm_FWPjTJ2BufDDswKfkPFK-SCgwYCSYUr5IKDBgJJu5BnDZR4AHvnvwAnxyjlT9aGQZjA1mRTwhL9dwxDG9f&_nc_ohc=GoIKBx8yT1AAX_usYyx&_nc_ht=scontent.fmdl2-1.fna&oh=698b83790b8d6e8b70ea72aa61d326be&oe=5EE242BE",
            "subtitle":"land type-(slit), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148002090078924/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148002090078924/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent land in Zayathiri, Other area // complete text
    else if (received_message.payload === 'torent_land_area_inzayad1other') {
    response = {
          "text" : "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}
// to rent land in Zabuthiri,  60*60 // complete 
    else if (received_message.payload === 'only60blandin_zabuu7_rent1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1.5 lakhs per month, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92024001_148398896705910_1925425798618021888_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeGkGT-G1km0QEHChcndqjvVTdl6vz24PkFN2Xq_Pbg-Qdg6YZqVgGYsbDkWAPAJV6NcVcnQ4RfzMISzRkWWe3pm&_nc_ohc=eEaFvN9ifNMAX9XRH6-&_nc_ht=scontent.fmdl2-1.fna&oh=07eb7ad416c5fdcdbc9bc77d073cee67&oe=5EE09D9B",
            "subtitle":"face south, land type-(grant), Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148399133372553/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148399133372553/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent land in Zabuthiri,  100*100 // complete
    else if (received_message.payload === 'only68cclandin_zabuu7_rent1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 2 lakhs per month, 100*100 ft, face east,",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92439576_148403136705486_7447542521841844224_n.jpg?_nc_cat=105&_nc_sid=110474&_nc_eui2=AeHz1uwG9QB2ohDvgqFba1n0_izibo1StVT-LOJujVK1VLJqkR3lrBxIXnGvYAGBqdXu2I6-3D6ysXR2oW9hNjiF&_nc_ohc=fSInt_c9CaQAX-n_IqT&_nc_ht=scontent.fmdl2-2.fna&oh=3c35e264eb5daf1ea814b093f7bdb2c4&oe=5EE32465",
            "subtitle":"land type-(village land),Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148404193372047/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148404193372047/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent land in Zabuthiri,  Other area // complete text
    else if (received_message.payload === 'onlyother7dlandin_zabuu7_rent1' ) {
    response = {
          "text" : "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}
// to rent land in pyinmana,  40*60 // complete
    else if (received_message.payload === 'torentlandpyin46_areab11') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 1.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92355353_149016376644162_8935573987816112128_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeFZldR4F_a8ZBf0sOYfCRgi8_Dga96tKk_z8OBr3q0qT6eWixeHmONTRbkYmpKOfUAc_WVrRsf73UpzPlWDJG1P&_nc_ohc=rW1FFc--3cgAX8v55YJ&_nc_ht=scontent.fmdl2-2.fna&oh=3122788edbccba2a855edd1fe8f18fd4&oe=5EE2B105",
            "subtitle":"land type-(grant), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149016949977438/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149016949977438/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to rent land in pyinmana,  60*72 // complete
    else if (received_message.payload === 'torentlandpyin672_areaaa1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 3 lakhs per month, 60*72 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91944330_149019299977203_418187470824275968_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeGRf4pbtPI2yrR1hioqwmrqUx4Q1W7AGlFTHhDVbsAaUXOwMiR5jVBk-CTXwNfLnUKhzY79QvgkcsFLvNay3Yej&_nc_ohc=vJLMQKIRkKkAX98dmI1&_nc_ht=scontent.fmdl2-1.fna&oh=c8b66ef5edee8f04d9199762204a52c1&oe=5EE2354A",
            "subtitle":"land type-(permit), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149020983310368/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149020983310368/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}
// to rent land in pyinmana,  60*80 // complete
    else if (received_message.payload === 'torentlandpyin68_areacc11') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"land, 2.5 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92591960_149017693310697_3011678316890423296_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeHLXhGDIb79vxF8QYyJV052I8KibjVY7yMjwqJuNVjvI_gG7dKIt-lLRrYTFAGvOUi0JfcOwSTaAjn1mthgroN3&_nc_ohc=WpdQMWNvvdsAX8HGIhu&_nc_ht=scontent.fmdl2-2.fna&oh=07800bf2eca77e1a7503a6de24a6e262&oe=5EDFC54C",
            "subtitle":"land type-(permit), face west",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149018329977300/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149018329977300/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torentlandall_aabb1"
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
            "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
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
                "payload":"torentlandall_aabb1"
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
                  "text": "Please choose the estimated price you wanna spend:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3lakhs & below it",
                          "payload": "torenthourc_onefpyin1_tenantbelow4l",
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "torenthourc_onefpyina1_tenantabove4l", // complete
                        }
                      ]
      }
  }
// to rent house in pyinmana, RC, two floor
  else if (received_message.payload === "torenttwoff_pyinfloora11_tenant") {
    response = {
                  "text": "Please choose the estimated price you wanna spend:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3lakhs & below it",
                          "payload": "torenthou_pyinrctwof_below4lmm",
                        },
                        {
                          "content_type": "text",
                          "title": "above 3lakhs",
                          "payload": "torenthou_pyinrctwofn_above4ln", // complete
                        }
                      ]
      }
  }

/********************/

// to rent house in pyinmana, RC, one floor, 3 lakhs & below it
  else if (received_message.payload === "torenthourc_onefpyin1_tenantbelow4l") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 3 lakhs per month, 40*60 ft",
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
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }
        ]
      }
    }
    }
  }



// to rent house in pyinmana, RC, one floor, above 3 lakhs // complete
  else if (received_message.payload === "torenthourc_onefpyina1_tenantabove4l") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 350000 lakhs per month, Width-(60*72)",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92353603_149043869974746_8473619924072267776_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeGgvj4JXTB-BaKlrv6fCWkPD8Wz4sbkNI8PxbPixuQ0j4z4WFsuBeE4rDoXcka8l3DzzgHyop1A6jQY9BeyxOWv&_nc_ohc=8IkUGIiYAvoAX_fJFsa&_nc_ht=scontent.fmdl2-1.fna&oh=298d573636dd736f667b4b2a7c89f7cd&oe=5EE0FD3A",
            "subtitle":"Mbr-(1), Br-(2), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149043983308068?sfns=mo",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149043983308068?sfns=mo",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
    }
  }

// to rent house in pyinmana, RC, two floor, 3 lakhs & below it
  else if (received_message.payload === "torenthou_pyinrctwof_below4lmm") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 3 lakhs per month, 40*60 ft",
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
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
    }
  }

// to rent house in pyinmana, RC, two floor, above 3 lakhs // complete
  else if (received_message.payload === "torenthou_pyinrctwofn_above4ln") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 5 lakhs per month, 60*72 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/91663260_149049396640860_3878909622148399104_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeGHkGRYDmdeavjzqEgTafF6vGtLT4QsOYC8a0tPhCw5gGfUGkXLqAvDbcmS2kynpkc427C_nqwWJyVMHf6lzNw7&_nc_ohc=UksZn3kUd4UAX8VSjTk&_nc_ht=scontent.fmdl2-2.fna&oh=efa9c980227d38061aeac1892adf662e&oe=5EE2A4B3",
            "subtitle":"Mbr-(2), Br-(1), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149050303307436/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149050303307436/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
    }
  }

  // to rent house in pyinmana, other type (RC)
  else if (received_message.payload === "torentothertypepyin_tebb1") {
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"Nancat, 2 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92496573_149052573307209_598445470120935424_n.jpg?_nc_cat=100&_nc_sid=110474&_nc_eui2=AeEv0aBCrhgl6MnOg0rq39sY3sK3gbVcIgHewreBtVwiAYQsfhi4vde5O0uoZ5B_v0U7nD5wWQKYfrsH3TmEqs0-&_nc_ohc=L7oj6Oeo_8YAX_kxCPf&_nc_ht=scontent.fmdl2-1.fna&oh=90f6d5f9c727036eb12ed4977cf39897&oe=5EE25091",
            "subtitle":"face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149053369973796/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149053369973796/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
    }
  }


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
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92002695_149054846640315_174881099674025984_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeFipDbtj82omdAFRjVUePhR8t4gVQzRikby3iBVDNGKRhhpoUiY7hZ-yagQdENBxp15GUm3LCX6mBY7NJ7gKwME&_nc_ohc=r_v6HHtyP-QAX_Jlw62&_nc_ht=scontent.fmdl2-2.fna&oh=1da23dd82f0a42333b48b95507d8490f&oe=5EE053D7",
            "subtitle":"Mbr-(3), Br-(2), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/149055396640260?sfns=mo",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/149055396640260?sfns=mo",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
    }
  }



/*************************************************************************************************/
/**************************************************************************************************/


 // to rent house in oattra, house type
  else if (received_message.payload === "tenanott" ) {
    response = {
                  "text": "Please choose one of below options:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "RC",
                          "payload": "rc_torent_inOttt",
                        },
                        {
                          "content_type": "text",
                          "title": "Other type",
                          "payload": "otherType_torent_inOttt",
                        }
                      ]

      }
  }
 // to rent house in oattra, RC 
  else if (received_message.payload === "rc_torent_inOttt" ) {
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
                          "title": "other floor",
                          "payload": "otherf1_ott_tenant",
                        }
                      ]

      }
  }
// to rent house in oattra, RC, one floor
  else if (received_message.payload === "onef1_ott_tenant") {
    response = {
                  "text": "Please choose the estimated amount you wanna spend:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "6 lakhs & below it",
                          "payload": "onef6lakhsabove_in_ott_tenant", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "above 6 lakhs",
                          "payload": "onefabove6lakhs_in_ott_tenant", // complete
                        }
                      ]
      }
  }
// to rent house in oattra, RC, two floor
  else if (received_message.payload === "twof1_ott_tenant") {
    response = {
                  "text": "Please tell me the estimated amount you wanna spend:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "6lakhs & below it",
                          "payload": "torenthouott_below6lakhs",
                        },
                        {
                          "content_type": "text",
                          "title": "above 6lakhs",
                          "payload": "torenthouott_above6lakhs", // complete
                        }
                      ]
      }
  }


// to rent house in oattra, RC, one floor, 6 lakhs & below it // complete
    else if (received_message.payload === 'onef6lakhsabove_in_ott_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"RC, 4 lakhs per month, 80*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92351629_148794463333020_2221158640822255616_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeFm1wi0SGzyni_3NnxhV8Kj1lNwb3N4O3bWU3Bvc3g7dqEGpoxFQfLp2LSy7mRPgwj9ppl6UkkYIqzQC9mAFgW7&_nc_ohc=DvaeZzryCYUAX_S_qgT&_nc_ht=scontent.fmdl2-1.fna&oh=f69f9220fff2b8f1db623b5defefa594&oe=5EDFF245",
            "subtitle":"Mbr-(2), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148795749999558/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148795749999558/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }
        ]
      }
    }
  }
}


// to rent house in oattra, RC, one floor, above 6 lakhs // complete
    else if (received_message.payload === 'onefabove6lakhs_in_ott_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"1RC, 6.5 lakhs per month, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91912200_148783696667430_2449683035914764288_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeGtmRWzKn14WcOyBlHpkLA8U4OdKoYtcohTg50qhi1yiCt7wEw-ep9s_RQgz5V370kLzW9e5txrxVGQj_84K-09&_nc_ohc=ULbgxq5Vt6oAX_GXuqF&_nc_ht=scontent.fmdl2-1.fna&oh=0f158775833551b86621692016f0327d&oe=5EE1749D",
            "subtitle":"Mbr-(4), Br-(1), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148790940000039/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148790940000039/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
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
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent house in oattra, RC, two floor, above 6 lakhs // complete
    else if (received_message.payload === 'torenthouott_above6lakhs') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 12 lakhs per month, 150*150 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91553411_148811056664694_2994737999507357696_n.jpg?_nc_cat=109&_nc_sid=110474&_nc_eui2=AeEfP3OQyWSVC6Z-lY6HYqDWh_MT8b2h51aH8xPxvaHnVqPHPIBXsMgLEI-3fAuGNUnNKKIzHBw2Y-A6HGPqzGB3&_nc_ohc=oMf8b87ysjoAX8FtYGu&_nc_ht=scontent.fmdl2-1.fna&oh=70c56b3e2a89edfa544371ab617dc297&oe=5EE32265",
            "subtitle":"Mbr-(6), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148812259997907/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148812259997907/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
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

// to rent house in oattra, RC, other type
    else if (received_message.payload === 'otherType_torent_inOttt') {
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
                          "payload": "nancat_pobb1_tenant", // complete text
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
                          "payload": "onef_pobb1_tenant", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_pobb1_tenant", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "other floor",
                          "payload": "thirdf_pobb1_tenant", // complete
                        }
                      ]

      }
  }
 // to rent house in pobba, RC, one floor, price
  else if (received_message.payload === "onef_pobb1_tenant") {
    response = {
                  "text": "Please tell me the estimated amount you wanna spend:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "torenthoupob3lakhs_below11a", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "torenthoupob3lakhs_above3laa1", // complete
                        }
                      ]
  }
}
  // to rent house in pobba, RC, two floor, 
  else if (received_message.payload === "twof_pobb1_tenant") {
    response = {
                  "text": "Please choose the estimated price you wanna spend:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "torentpob_twof3lakhs_tenant", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "torentpob_twofabove3lakhs_tenant", // complete text
                        }
                      ]
  }
}

// to rent house in pobba, RC, one floor, // complete text
 else if (received_message.payload === 'torenthoupob3lakhs_below11a') {
    response = {
          "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}

// to rent house in pobba, RC, one floor, complete 
 else if (received_message.payload === 'torenthoupob3lakhs_above3laa1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
            {
            "title":"1RC, 4 lakhs, 80*80 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92555021_148694693342997_4064605342099570688_n.jpg?_nc_cat=111&_nc_sid=110474&_nc_eui2=AeHdSxG1IzD6iMZL01qEg0KzthAmkZBLAZK2ECaRkEsBklsHQStxScdsxZDKhJHFmGhjF-6yz9By88h_ESul1b2d&_nc_ohc=kZWapLUa1OMAX8q8OOo&_nc_ht=scontent.fmdl2-2.fna&oh=d0928d3d2908871fff222be5571f3a01&oe=5EE2C5B4",
            "subtitle":"MBr-(2), Br-(3), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148695696676230/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148695696676230/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent house in pobba, other type // complete text
 else if (received_message.payload === 'nancat_pobb1_tenant') {
    response = {
        "text" : "There is no property avaliable. So sorry for you. Have a nice day!"
  }
}

// to rent house in pobba, RC, two floor, 3 lakhs & below it // complete
 else if (received_message.payload === 'torentpob_twof3lakhs_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"2RC, 2.5 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91606159_148757690003364_6476717670556237824_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeEwaNaIO6IktYPhZerxMcm7Qew2jPuaaEFB7DaM-5poQZvYiKqWGrH_lW38GzC0sEa2ozlem0muIfNfovwajN7B&_nc_ohc=hslf-WjVJoAAX-OP-p8&_nc_ht=scontent.fmdl2-1.fna&oh=f7d79bf5781b28d881c24f9d75635104&oe=5EE2EE41",
            "subtitle":"MBr-(2), Br-(2), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148761353336331/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148761353336331/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent house in pobba, RC, two floor, above 3 lakhs // complete text
 else if (received_message.payload === 'torentpob_twofabove3lakhs_tenant') {
    response = {
      "text": "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}



// to rent house in pobba, RC, other floor // complete
 else if (received_message.payload === 'thirdf_pobb1_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
                    {
            "title":"3RC, 12 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92138782_148707466675053_5918704202221092864_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeE_h3jBITkW7xkMqu3_I6ZSTbencPv31K1Nt6dw-_fUrRIBi2eMl4upeFefewulR61984TZbIxxpK-ya8_OLYqw&_nc_ohc=TEylSP0f8FoAX-lix3b&_nc_ht=scontent.fmdl2-1.fna&oh=2b4637f1a87dd8301fd51e2eeea0e88b&oe=5EE3726E",
            "subtitle":"MBr-(4), Br-(2), face north, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148708120008321/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148708120008321/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
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
                          "payload": "ottype_dekki1_tenant", // complete
                        }
                      ]

      }
  }
  // to rent house in dekkhina, RC 
  else if (received_message.payload === "rc_dekki1_tenant") {
    response = {
                  "text": "Please choose you want to buy the house in which",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_dekkii11_tenant1", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_dekkii11_tenant1", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": " Other floor",
                          "payload": "otherrrf_dekkii11_tenant1", // complete
                        }
                      ]

      }
  }
 // to rent house in dekkhina, one floor, price
  else if (received_message.payload === "onef_dekkii11_tenant1") {
    response = {
                  "text": "Please tell me estimated price you wanna spend",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "torent_houindekk_mbbelow3lpp", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "torent_houindekk_mbabove3lpp", // complete
                        }
                      ]
      }
  }
// to rent house in dekkhina, two floor, price
  else if (received_message.payload === "twof_dekkii11_tenant1") {
    response = {
                  "text": "Do you want what area?",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "twof_price3lakhsbelowmm_dek", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "twof_priceabove3lakhsmm_dek", // complete
                        }
                      ]
      }
  }


// to rent house in dekkhina, one floor,  3 lakhs & below it // complete text
    else if (received_message.payload === 'torent_houindekk_mbbelow3lpp') {
    response = {
        "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}

// to rent house in dekkhina, one floor, above 3 lakhs // complete
    else if (received_message.payload === 'torent_houindekk_mbabove3lpp') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"1RC, 4.5 lakhs per month, 100*100 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/91593153_148493440029789_5631341104520495104_n.jpg?_nc_cat=107&_nc_sid=110474&_nc_eui2=AeEq7aWXMt8U_MKygjew-xF1UtEmafdlVwhS0SZp92VXCFYTP0kJq8MdtiJut7rstdV83f9duCsRuvtXIjPqRe77&_nc_ohc=Z8KW9q-Q8aAAX9yGyem&_nc_ht=scontent.fmdl2-1.fna&oh=2eda433138fb601859f34ac202c1a20c&oe=5EE1ED60",
            "subtitle":"Mbr-(2), Br-(2), face east",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148494183363048/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148494183363048/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }
        ]
      }
    }
  }
}

// to rent house in dekkhina, Rc, two floor, 3 lakhs & below it // complete text
    else if (received_message.payload === 'twof_price3lakhsbelowmm_dek') {
    response = {
        "text" : "There is no property avaliable. Sorry for you. Have a nice day!"
  }
}

// to rent house in dekkhina, Rc, two floor, above 3 lakhs // complete
    else if (received_message.payload === 'twof_priceabove3lakhsmm_dek') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"2RC, 3.5 lakhs per month, 60*80 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92244656_148661983346268_5412490990118240256_n.jpg?_nc_cat=101&_nc_sid=110474&_nc_eui2=AeH7i1rOMS8eeDRAo6chNPk97R3saB8e7SztHexoHx7tLI80FOYBR4_5sP3UzCEmtsrIlOqG-g2UNFogclACx-h9&_nc_ohc=1zBViAiRz2EAX8TluO2&_nc_ht=scontent.fmdl2-1.fna&oh=b80abc451c313e1d0f9c12c6c8678df3&oe=5EE029E1",
            "subtitle":"Mbr-(3), Br-(1), face west",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148662386679561/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148662386679561/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          },
             
        ]
      }
    }
  }
}

// to rent house in dekkhina, Rc, other floor, // complete
    else if (received_message.payload === 'otherrrf_dekkii11_tenant1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"3RC, 8 lakhs per month, 50*75 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92667938_148681606677639_6253805066847780864_n.jpg?_nc_cat=110&_nc_sid=110474&_nc_eui2=AeHNyDhSx0ovFtr7eWjPt3Raef0VwMYXhKh5_RXAxheEqDq_SNyzVRhmHguVKNiCzwNpYkdEkenidgHtp7xL2PtM&_nc_ohc=vaKBJTg1gqMAX9NVvje&_nc_ht=scontent.fmdl2-2.fna&oh=c90c703d98b8b08c02542904ada4fce0&oe=5EE34BD6",
            "subtitle":"Mbr-(3), face south, Negotiable",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148682710010862/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148682710010862/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent house in dekkhina, other type (not RC) // complete
    else if (received_message.payload === 'ottype_dekki1_tenant') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
           {
            "title":"Nancat,  2 lakhs per month, 60*60 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/93101461_148684256677374_2200426120719892480_n.jpg?_nc_cat=106&_nc_sid=110474&_nc_eui2=AeFye7mt4SB5HOSquEDbUdAioBRfEDs7j8KgFF8QOzuPwrNvkh5Pix0nh-XhaE6LM0qxdB2C4fDV7nJikI9tr3B7&_nc_ohc=wlOOvGY5mqIAX_8skfl&_nc_ht=scontent.fmdl2-1.fna&oh=cfb04858606baaf5b1fd1a60df24fb62&oe=5EE04993",
            "subtitle":"Br-(3), face north",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148685033343963/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148685033343963/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
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
/*******************************************************************************************/
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
                          "payload": "nancat_zabu1_tenant", // complete
                        }
                      ]

      }
  }

  // to rent house in zabu, RC, what floor
  else if (received_message.payload === "rc_zabu1_tenant") {
    response = {
                  "text": "Please choose the number of floor:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "one floor",
                          "payload": "onef_zabuthiri11_tenant1", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": "two floor",
                          "payload": "twof_zabuthiri11_tenant1", // complete all
                        },
                        {
                          "content_type": "text",
                          "title": " Other floor",
                          "payload": "otherrrf_zabuthiri11_tenant1",  // not yet
                        }
                      ]

      }
  }
  // to rent house in zabu, RC, one floor, 
  else if (received_message.payload === "onef_zabuthiri11_tenant1") {
    response = {
                   "text": "Please choose the estimated price you want to use:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": " 3 lakhs & below it",
                          "payload": "masterbed60_zabuthi11_tenant3l", // complete text
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",
                          "payload": "masterbedother_zabuthi11_tenant_22", // complete
                        }
                      ]           
      }
  }
    // to rent a house in Zabuthiri, RC, two floor
  else if (received_message.payload === "twof_zabuthiri11_tenant1") {
    response = {
                  "text": "Please choose the estimated price you want to use:",
                    "quick_replies": [
                         {
                          "content_type": "text",
                          "title": "3 lakhs & below it",
                          "payload": "torentbelow3_rctwofloorin_zabuu7_tenantac1", // complete
                        },
                        {
                          "content_type": "text",
                          "title": "above 3 lakhs",               
                          "payload": "torentabove3_rctwofloorin_zabuu7_tenantac1", // complete text
                        }
                      ]
      }
  }  
   // to rent house in zabu, Rc, other floor, // for other floor
else if (received_message.payload === "otherrrf_zabuthiri11_tenant1") {
      response = {
                    "text":'There is no property avaliable. Sorry for you. Thanks for contacting us.'

      }
}


  /***************************/

  // to rent house in zabuthiri, RC, one floor, above 3 lakhs // complete
    else if (received_message.payload === 'masterbedother_zabuthi11_tenant_22' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"RC, 4 lakhs per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/l/t1.0-9/92212800_148345030044630_2321483867061485568_n.jpg?_nc_cat=108&_nc_sid=110474&_nc_eui2=AeEHgbOBvCaxgFusYDxKkOYHMB_654nCR_QwH_rnicJH9E8V6SJFaSZkjtld4kKflRJEff8RSLUIxQ7DS3zpZxVu&_nc_ohc=BbZafgw-PQwAX836WCN&_nc_ht=scontent.fmdl2-2.fna&oh=14f71ffdc62af5a6b276a7d136415b65&oe=5EE2BEF1",
            "subtitle":"Mbr-(1), Br-(2)",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148345770044556/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148345770044556/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}
  // to rent house in zabu, RC, one floor, 3 lakhs & below it // complete text
    else if (received_message.payload === 'masterbed60_zabuthi11_tenant3l' ) {
    response = {
        "text" : "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}

// to rent house in zabu, other type (not Rc) // complete
    else if (received_message.payload === 'nancat_zabu1_tenant' ) {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
  
       
           {
            "title":"Nancat, 1 lakh per month, 40*60 ft",
            "image_url":"https://scontent.fmdl2-2.fna.fbcdn.net/v/t1.0-9/92055239_148410403371426_3609555549953196032_n.jpg?_nc_cat=102&_nc_sid=110474&_nc_eui2=AeEcxWyddvgH7C0Z2B2n6syBX7GQJ4Ddfc1fsZAngN19zZZV7BUT4-dAQhBpIFP153IJzNvhPOpKrB4lWAPsT5j7&_nc_ohc=NhfZs2wTQlkAX9hp-vO&_nc_ht=scontent.fmdl2-2.fna&oh=6df3662e070f0f0f8928e165d61c7604&oe=5EE0B3BA",
            "subtitle":"land type-(grant),face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148411956704604/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148411956704604/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }

        ]
      }
    }
  }
}

// to rent a house Zabbuthiri, RC, two floor, above 3 lakhs // complete text
    else if (received_message.payload === 'torentabove3_rctwofloorin_zabuu7_tenantac1') {
    response = {
        "text" : "There is no property avaliable. Sorry for you. Thanks for contacting us. Have a nice day!"
  }
}


// to rent a house Zabbuthiri, RC, two floor, 3 lakhs & below it // complete
    else if (received_message.payload === 'torentbelow3_rctwofloorin_zabuu7_tenantac1') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 

             {
            "title":"2C,  2.5 lakhs per month, 60*70 ft",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/92465912_148351516710648_1751142708715454464_n.jpg?_nc_cat=103&_nc_sid=110474&_nc_eui2=AeG4Y_29JTV2nR-S0e4T_3l2jyTiAxhjiyWPJOIDGGOLJeN4MvyOK5riu_STZt4-BtlbQ1z-Nj2JZLgPhK7gDSRH&_nc_ohc=HGyAC9SuccAAX_7ZmU7&_nc_ht=scontent.fmdl2-1.fna&oh=08bb2f92148841f8b83f3b36e7ffcdf0&oe=5EE17114",
            "subtitle":"Mbr-(2), Br-(4), face south",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/105772414301892/posts/148351976710602/?d=n",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.facebook.com/105772414301892/posts/148351976710602/?d=n",
                "title":"More Information"
              },
              {
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"torent_tenantaabb1"
              }              
            ]      
          }
        ]
      }
    }
  }
}
/**********************************************************************************************************************************/
/**********************************************************************************************************************************/
  else if (received_message.text == "admin1234" || received_message.text == "Admin1234") {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Welcome Admin! \nPlease choose one of options to create property:",
         "buttons":[
                    {
                    "type":"postback",
                    "title":"For selling",
                    "payload": "admins_selling"
                    },
                    {
                    "type":"postback",
                    "title":"For renting",
                    "payload": "adminr_renting"
                    }                            
                  ]  
                }
        }
    }
  }

// to create property in all
else if (received_message.text && createPropertyAd.dateByAdmin == true) {
    adminEnteredall_info.dateByAdmin = received_message.text;
    response  = {
        "text" : "Type verify/<property Id"
    }
    createPropertyAd.dateByAdmin = false;
    createPropertyAd.propertyIdByCu = true;
 }
else if (received_message.text && createPropertyAd.propertyIdByCu == true) {
    adminEnteredall_info.propertyIdByCu = received_message.text;
    saveData_foradmin(sender_psid);
    response  = {
        "text" : "Success!"
    }
    createPropertyAd.propertyIdByCu = false;
 }    



 // custom Serach  house or land in township name
  else if (received_message.payload ===  'customSeHouse' || received_message.payload ===  'customLand') {
        response = { "text": "Please choose township name:",
                            "quick_replies": [
                                              {
                                                "content_type": "text",
                                                "title": "Ottara",
                                                "payload": "customOtt" 
                                              },
                                              {
                                                "content_type": "text",
                                                "title": "Pobba",
                                                "payload": "customPobb"  
                                              },
                                              {
                                                "content_type": "text",
                                                "title": "Dekkhina",
                                                "payload": "customDekk"  
                                              },
                                              {
                                                "content_type": "text",
                                                "title": "Zaya Thiri",
                                                "payload": "customZaya"  
                                              },
                                              {
                                                "content_type": "text",
                                                "title": "Zabu Thiri",
                                                "payload": "customZabu"  
                                              },
                                              {
                                                "content_type": "text",
                                                "title": "Pyinmana",
                                                "payload": "customPyin",
                                              }

                      ]
      }
  }
   // custom Serach  house or land in township name
  else if (received_message.payload ===  'customOtt' || received_message.payload ===  'customPobb' || received_message.payload ===  'customDekk' || received_message.payload ===  'customZaya' || received_message.payload ===  'customZabu' || received_message.payload ===  'customPyin') {
      userEnteredCustom.twpNameCustom = received_message.payload;
        response = { 
          "text": "Please enter the type of house/land you are looking for"
      }
      received_message.payload = false;
      customData.dataToldByUser = true;
  }
 else if (received_message.text && customData.dataToldByUser == true) {
  userEnteredCustom.dataToldByUser = received_message.text;
         response = {
      "text":'Please leave your phone number to contact back.'
    }
    customData.dataToldByUser = false; 
    customData.phoneNumberCustom = true;
  }
   else if (received_message.text && customData.phoneNumberCustom == true) {
  userEnteredCustom.phoneNumberCustom = received_message.text;
  saveCustomData(sender_psid);
      response = {
      "text":'Thank you. Have a nice day!'
    }
    customData.phoneNumberCustom = false;
  }


/*******************************************************************************************************************************/
/*******************************************************************************************************************************/

else if (received_message.payload === 'startOttara' || received_message.payload === 'startPobba' || received_message.payload === 'startDekk' || received_message.payload === 'startZaya' || received_message.payload === 'startZabu' || received_message.payload === 'startPyin') {
        userEnteredDataMoveHouseService.startTwonshipName = received_message.payload;
        response = { 
                    "text": "Please choose destination township:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "destinationOtt",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "destinationPobb",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "destinationDekk",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "destinationZaya",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "destinationZabu",
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "destinationPyin",
                        }

                      ]
              }
            received_message.payload = false;

    }     
/*************************************************************/

 else if (received_message.payload === 'destinationOtt') {
        userEnteredDataMoveHouseService.destinationTwonshipName = received_message.payload;
        response = { 
                    "text": "The price of relocation is 6000MKK. \nPlease enter the date of relocation in DD/MM/YYYY format",
              }
        movingHouseServiceData.appointmentDate = true;
}
 else if (received_message.payload === 'destinationPobb') {
        userEnteredDataMoveHouseService.destinationTwonshipName = received_message.payload;
        response = { 
                    "text": "The price of relocation is 7000MKK. \nPlease enter the date of relocation in DD/MM/YYYY format",
              }
        movingHouseServiceData.appointmentDate = true;
}
 else if (received_message.payload === 'destinationDekk') {
        userEnteredDataMoveHouseService.destinationTwonshipName = received_message.payload;
        response = { 
                    "text": "The price of relocation is 5000MKK. \nPlease enter the date of relocation in DD/MM/YYYY format",
              }
        movingHouseServiceData.appointmentDate = true;
}      
 else if (received_message.payload === 'destinationZaya') {
        userEnteredDataMoveHouseService.destinationTwonshipName = received_message.payload;
        response = { 
                    "text": "The price of relocation is 6000MKK. \nPlease enter the date of relocation in DD/MM/YYYY format",
              }
        movingHouseServiceData.appointmentDate = true;
}  
 else if (received_message.payload === 'destinationZabu') {
        userEnteredDataMoveHouseService.destinationTwonshipName = received_message.payload;
        response = { 
                    "text": "The price of relocation is 7000MKK. \nPlease enter the date of relocation in DD/MM/YYYY format",
              }
        movingHouseServiceData.appointmentDate = true;
}  
 else if (received_message.payload === 'destinationPyin') {
        userEnteredDataMoveHouseService.destinationTwonshipName = received_message.payload;
        response = { 
                    "text": "The price of relocation is 9000MKK. \nPlease enter the date of relocation in DD/MM/YYYY format",
              }
        movingHouseServiceData.appointmentDate = true;
}

/****************************/
 else if (received_message.text && movingHouseServiceData.appointmentDate === true) {
        userEnteredDataMoveHouseService.appointmentDate = received_message.text;
        response = { 
                    "text": "Please leve us your phone number to contact you back.",
              }
        movingHouseServiceData.appointmentDate = false;
        movingHouseServiceData.customerPhoneNumberApp = false;

}
 else if (received_message.text && movingHouseServiceData.customerPhoneNumberApp === true) {
        userEnteredDataMoveHouseService.customerPhoneNumberApp = received_message.text;
        saveMoveHouseData(sender_psid);
        response = { 
                    "text": "We are processing your appointment. \nWe will get back to you soon. \nThank you for working with our service",
              }
        movingHouseServiceData.customerPhoneNumberApp = false;
}     





  /*******************************************************************************************************************************/
  /*******************************************************************************************************************************/
  // Send the response message
  callSendAPI(sender_psid, response);    
}

/************************************************************************************************************************************/
/************************************************************************************************************************************/
/************************************************************************************************************************************/
/************************************************************************************************************************************/
/************************************************************************************************************************************/
/************************************************************************************************************************************/
/************************************************************************************************************************************/
/************************************************************************************************************************************/
/************************************************************************************************************************************/


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
  greetUser(sender_psid);
 } 

// main menu
  else if (payload === 'mainmenu_me') {
     response = { 
            "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "How can we help you?",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "Purchase/Sell Property",
                      "payload": "purchaseSellPp"
                    },
                    {
                      "type": "postback",
                      "title": "Rental Services",
                      "payload": "rentalSer"
                    },
                    {
                      "type": "postback",
                      "title": "House Moving Services",
                      "payload": "move_hou_service"
                    }
                  ]
                }
              }
    }
  }

// to buy or sell 
  else if (payload === 'purchaseSellPp') {
    response = { 
            "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements":[
                      {
                        "title":"House",
                        "subtitle":"Purchase/Sell House",
                        "buttons":[{
                              "type": "postback",
                              "title": "Purchase",
                              "payload": "hou" // to buy house
                          },{
                            "type": "postback",
                            "title": "Sell",
                            "payload": "hoou2" // to sell house
                          }
                        ]      
                      },
                      {
                        "title":"Land",
                        "subtitle":"Purchase/Sell Land",
                        "buttons":[{
                              "type": "postback",
                              "title": "Purchase",
                              "payload": "lann" // to buy land
                          },{
                            "type": "postback",
                            "title": "Sell",
                            "payload": "laan2" // to sell land
                          }
                        ]      
                      }
                  ]
                }
              }
     }
  }

 // to rent
  else if (payload === 'rentalSer') {
    response = { 
            "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements":[
                        {
                          "title":"House",
                          "subtitle":"House Rental",
                          "buttons":[{
                                "type": "postback",
                                "title": "Rent House",
                                "payload": "tenanhou" // to rent house
                            },{
                              "type": "postback",
                              "title": "Rent your House",
                              "payload": "hou_option"  // to rent their house
                            }
                          ]      
                        },
                      {
                        "title":"Land",
                        "subtitle":"Land Rental",
                        "buttons":[{
                            "type": "postback",
                            "title": "Rent Land",
                            "payload": "tenanlan" // to rent land
                          },{
                            "type": "postback",
                            "title": "Rent your Land",
                            "payload": "land_option"// torent their land
                          }
                        ]      
                      }
                  ]
                }
              }
     }
  }




  // house in landlord // to rent their house
  else if (payload === 'hou_option') {
    let response1 = { "text": "You have chose to rent out house as a Landlord." };
    let response2 = { 
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
                        },
                        {
                          "content_type":"text",
                          "title":"Pyinmana",
                          "payload":"ldld1_1pyin1"
                        }    
                      ]
                  
   };
   callSend(sender_psid, response1).then(()=>{
  return callSend(sender_psid, response2);
  });
  }



  // for land option // to rent their land
    else if (payload === 'land_option') {
    let response1 = { "text": "You have chose to rent out land as a Landlord." };
    let response2 = { 
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
                        },
                        {
                          "content_type":"text",
                          "title":"Pyinmana",
                          "payload":"ldld_pyin_land"
                        }  

                      ]

   };
   callSend(sender_psid, response1).then(()=>{
  return callSend(sender_psid, response2);
  });
  }



// to buy house in every
 else if (payload === "aaabbb11m_tobuya") {
         response = {
                  "text": "Do you wanna talk about the property or something else?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Yes",
                          "payload": "cu_say_yes_toBuyHouse", 
                        },
                        {
                          "content_type": "text",
                          "title": "No",
                          "payload": "cu_say_no_toBuyHouse",
                        }
                      ]
  }
}
// to rent house in every // as tenant
 else if (payload === "torent_tenantaabb1") {
         response = {
                  "text": "Do you wanna talk about the property or something else?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Yes",
                          "payload": "cu_say_yes_torentHouse", 
                        },
                        {
                          "content_type": "text",
                          "title": "No",
                          "payload": "cu_say_no_torentHouse",
                        }
                      ]
  }
}
// to buy land in every
 else if (payload === "tobuylandall_aabb1") {
         response = {
                  "text": "Do you wanna talk about the property or something else?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Yes",
                          "payload": "cu_say_yes_tobuyLand", 
                        },
                        {
                          "content_type": "text",
                          "title": "No",
                          "payload": "cu_say_no_tobuyLand",
                        }
                      ]
  }
}
// to rent land in every // as tenant
 else if (payload === "torentlandall_aabb1") {
         response = {
                  "text": "Do you wanna talk about the property or something else?",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Yes",
                          "payload": "cuSay_yes_tosay_SthElse_te", 
                        },
                        {
                          "content_type": "text",
                          "title": "No",
                          "payload": "cuSay_no_tosay_SthElse_te",
                        }
                      ]
  }
}


  // to rent house as tenant
  else if (payload === 'tenanhou') {
    response = { 
                 "text": "Please choose the township in which you want to tenant house:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "tenanott"
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "tenanpob"
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "tenandek"
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "tenanzay"
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "tenanzabu"
                        }, 
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "tenanpyin"
                        }
                      ]
              }
  }
/****************************************************************************************/
/****************************************************************************************/



// to rent land as tenant
  else if (payload === 'tenanlan') {
    response = { 
                "text": "Please choose the township in which you want to tenant land:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "teottl"
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "tepobl"
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "tedekl"
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "tezayl"
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "tezal"
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "tepyinlan"
                        }
                      ]
              }
  }

/***************************************************************************/

    // to buy house
   else if (payload === 'hou') {
         response = {
                  "text": "Do you want to buy a house in what township?",
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
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "pyintwp",
                        }
                      ]

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

  // to buy land 
      else if (payload === "lann") {
      response = {
                  "text": "Do you want to buy land in what township?",
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
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "pyi5",
                        }
                      ]

      }
    }





    // for service charges
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
    response  = { "text": "3% service charge for the property that has value below 1000 lakhs.   \n2% service charge for the property that has value 1000 lakhs and above 1000 lakhs." };
 } else if (payload === 'ren3') {
    response  = { "text": "We take rent of a month from both sides whether the period is rented or not." };
 } 

// ways to contact us
else if (payload === 'contactUsToduwon') {
    response  = {"text":  "Duwon Real Estate Services \nPage : Duwon Real Estate Agent \nEmail : duwon119address@gmail.com \nOffice Address : No (1374), MyintZu Street, Paung Laung (3), Pyinmana township, Naypyitaw \nPhone : 09 970 870 203" };
 } 

// custom search
else if (payload === 'customSearchByCu') {
        response = { "text": "Please choose the township in which you want to sell house:",
                            "quick_replies": [
                                              {
                                                "content_type": "text",
                                                "title": "House",
                                                "payload": "customSeHouse"
                                              },
                                             
                                             
                                              {
                                                "content_type": "text",
                                                "title": "Land",
                                                "payload": "customLand",
                                              }

                      ]
      }
  }




/***********************************/
 // to sell house
  else if (payload === 'hoou2') {
        response = { "text": "Please choose the township in which you want to sell house:",
                            "quick_replies": [
                                              {
                                                "content_type": "text",
                                                "title": "Ottara",
                                                "payload": "tselott" //tselott
                                              },
                                              {
                                                "content_type": "text",
                                                "title": "Pobba",
                                                "payload": "tselpob"  //tselpob
                                              },
                                              {
                                                "content_type": "text",
                                                "title": "Dekkhina",
                                                "payload": "tseldek"  //tseldek
                                              },
                                              {
                                                "content_type": "text",
                                                "title": "Zaya Thiri",
                                                "payload": "tselzaya"  //tselzaya
                                              },
                                              {
                                                "content_type": "text",
                                                "title": "Zabu Thiri",
                                                "payload": "tselzabu"  //tselzabu
                                              },
                                              {
                                                "content_type": "text",
                                                "title": "Pyinmana",
                                                "payload": "toselhoupyin",
                                              }

                      ]
      }
  }



/**********************************/
  

  else if (payload === 'attach_no_forSellingHouse') {
        response = {
                  "text": "Please tell me the estimated amount that you want to get."
      }
      toselhou_byuser.estimated_amount_toget = true; // for estimated amount to get
  }
   else if (payload === "attach_yes111") { 
    response = {
      "text": "OK, please send me."
    }
    toselhou_byuser.images_ofHouse_tsel = true; // for images to be send by user
  }


/******************************************/

  
// to send again images
 else if (payload === "attach_yes_sell_land") { 
    response = {
      "text": "OK, please send me."
    }
     tosel_land_byuser.images_ofLand_byCu = true; // for land images by user
  }

    else if (payload === 'attach_no_sell_land') {
        response = {
                  "text": "Please tell me the estimated amount that you want to get."
      }
      tosel_land_byuser.estimated_amount_byCus = true; // for estimated amount to get
  }

/*****************************************/
/*****************************************/



// to rent house as a landlord
   else if (payload === "torenthou2yesyes_asldld") { 
    response = {
      "text": "OK, please send me."
    }
     landlord_sent.images_ofHouse_torent = true; // for images to be send by customer as landlord
  }

   else if (payload === 'torenthou2nono_asldld') {
        response = {
                  "text": "Do you want to rent how much per month?"
      }
      landlord_sent.estimated_price_perMonth_torentHou = true; // estimated price per month to rent house as landlord
  }




/*******************************************/
/*******************************************/



// to rent land as a landlord // no more photos
  else if (payload === "attach_yes_ldld_land") { 
    response = {
      "text": "OK, please send me."
    }
     ldld_land_sent.images_ofLand_torentLand = true; // for images to rent land as landlord
  }
  else if (payload === 'attach_no_ldld_land') {
        response = {
                  "text": "Do you want to rent your land how much per month?"
      }
      ldld_land_sent.estimatedPrice_perMonth_torentLand = true; // for estimated price per month to rent land as landlord
  }



/*********************************************************/

// to sell land
  else if (payload === 'laan2') {
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
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "toselpyinlan",
                        }
                      ]

      }
  }
/**********************************************************************************************************************/



// moving house service
  else if (payload === 'move_hou_service') { // mhs
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [ 
        
             {
            "title":"Light Truck",
            "image_url":"https://scontent.fmdl2-1.fna.fbcdn.net/v/t1.0-9/87529724_131104741768659_4560297288781529088_n.jpg?_nc_cat=103&_nc_sid=0be424&_nc_ohc=LLl2pFxuUMQAX9gxSpX&_nc_ht=scontent.fmdl2-1.fna&oh=94929c06c19eb4c27867db5fbec5656a&oe=5ECC9385",
            "subtitle":".",
            "default_action": {
              "type": "web_url",
              "url": "https://www.facebook.com/Du-Won-105772414301892/inbox/122710692609505/?source=diode&notif_id=1587913838063988&notif_t=page_message&ref=notif",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"postback",
                "title":"Choose",
                "payload":"move_hou_light_truck"
              }              
            ]      
          }


        ]
      }
    }
  }
}

 else if (payload === 'move_hou_light_truck') {
        response = { 
                    "text": "Please choose following township:",
                    "quick_replies": [
                        {
                          "content_type": "text",
                          "title": "Ottara",
                          "payload": "startOttara",
                        },
                         {
                          "content_type": "text",
                          "title": "Pobba",
                          "payload": "startPobba",
                        },
                        {
                          "content_type": "text",
                          "title": "Dekkhina",
                          "payload": "startDekk",
                        },
                        {
                          "content_type": "text",
                          "title": "Zaya Thiri",
                          "payload": "startZaya",
                        },
                        {
                          "content_type": "text",
                          "title": "Zabu Thiri",
                          "payload": "startZabu",
                        },
                        {
                          "content_type": "text",
                          "title": "Pyinmana",
                          "payload": "startPyin",
                        }

                      ]  
              }
    } 




/*************************************************************************************************/

// to create property in selling
else if (payload === 'admins_selling') {
    response  = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Please choose one of options to create property:",
         "buttons":[
                    {
                    "type":"postback",
                    "title":"House",
                    "payload": "createP_toselHouse"
                    },
                    {
                    "type":"postback",
                    "title":"Land",
                    "payload": "createPTosellLand"
                    }                            
                  ]  
                }
        }
    }
 }

// to create property in selling
else if (payload === 'createP_toselHouse' || payload === 'createPTosellLand') {
    response  = {
        "text" : "Firstly, Please enter the date in DD/MM/YYYY format"
    }
     createPropertyAd.dateByAdmin = true;
 }  

// to create property in renting
else if (payload === 'adminr_renting') {
    response  = {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Please choose one of options to create property:",
         "buttons":[
                    {
                    "type":"postback",
                    "title":"House",
                    "payload": "createHouse_torent"
                    },
                    {
                    "type":"postback",
                    "title":"Land",
                    "payload": "createLand_torent"
                    }                            
                  ]  
                }
        }
    }
 } 

// to create property in renting
else if (payload === 'createHouse_torent' || payload === 'createLand_torent') {
    response  = {
        "text" : "Firstly, Please enter the date in DD/MM/YYYY format"
    }
    createPropertyAd.dateByAdmin = true;
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
                              "title":"Custom Search",
                              "type":"postback",
                              "payload":"customSearchByCu"
                            },
                            {
                              "title":"Contact Us",
                              "type":"postback",
                              "payload":"contactUsToduwon"
                            }
                        ]
                      },
                        {
                        "title":"Main Menu ",
                        "type":"postback",
                        "payload":"mainmenu_me"
                    },
                       {
                        "title":"Service Charges",
                        "type":"postback",
                        "payload":"servch"
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


function getUserProfile(sender_psid) {
  return new Promise(resolve => {
    request({
      "uri": "https://graph.facebook.com/"+sender_psid+"?fields=first_name,last_name,profile_pic&access_token=EAAIqrjrVjpUBAHhoC1uJZARCzRuouIHABnnOx5sOQBH0ZAyb5IAZCXEs09fcKMRj0TeVvHR79VZCeNPZCNa2a4jDbKbweF6hYPG5aMwNH50NqXvZAOWjS68PZBCfuXZARAe9C60HJDfmRU7fsis1ySiIBiJxj4A2ZCZA3fqSaD3XbZAnAPhHOJY8MZCf58ZBI6aLTJ5MZD",
      "method": "GET"
      }, (err, res, body) => {
        if (!err) { 
          let data = JSON.parse(body);  
          resolve(data);                 
    } else {
      console.error("Error:" + err);
    }
    });
  });
}

/***********************
FUNCTION TO GREET USER 
************************/
async function greetUser(sender_psid){  
  let user = await getUserProfile(sender_psid);   
  let response = {      
            "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "Hi "+user.first_name+" "+user.last_name+", welcome to Du Won Real Estate Agent. How can we help you?",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "Purchase/Sell Property",
                      "payload": "purchaseSellPp"
                    },
                    {
                      "type": "postback",
                      "title": "Rental Services",
                      "payload": "rentalSer"
                    },
                    {
                      "type": "postback",
                      "title": "House Moving Services",
                      "payload": "move_hou_service"
                    }
                  ]
                }
              }
   }
     callSendAPI(sender_psid, response);
}



/*function function save data to firebase*/
// to sell house
function saveData_tosell_house(sender_psid) {
  const cu_info = {
    id : sender_psid,
    twonship_name : userEntered_Hou_tosel.twp_name_tobeSold,
    type_of_house : userEntered_Hou_tosel.house_type_ht,
    number_of_floor : userEntered_Hou_tosel.numOf_floor_toselHou,
    number_of_mbr : userEntered_Hou_tosel.numOf_mbr_toselHou,
    number_of_br : userEntered_Hou_tosel.numOf_br_toselHou,
    both_num_of_mbr : userEntered_Hou_tosel.both1_numOf_mbr_tsel,
    both_num_of_br : userEntered_Hou_tosel.both2_numOf_br_tsel,
    land_area_of_house : userEntered_Hou_tosel.landArea_ofHouse_tosell,
    land_type_of_house : userEntered_Hou_tosel.typeOf_land_ofHou_tsel,
    images_ofHouse : userEntered_Hou_tosel.images_ofHouse_tsel,
    estimated_amount : userEntered_Hou_tosel.estimated_amount_toget,
    fully_address : userEntered_Hou_tosel.fullyAddress_byCu_tosel,
    phone_number : userEntered_Hou_tosel.ph_numm_byCu_tosellHou,
    yes_toTell_sth_else : userEntered_Hou_tosel.sth_yes_toldbyCu,
    no_toTell_sth_else : userEntered_Hou_tosel.sth_no_toldbyCu,
  }
  db.collection('cu_info_tosell_house').add(userEntered_Hou_tosel);
}


/*function function save data to firebase*/

// for customers who want to sell land
function saveData_tosell_land(sender_psid) {
  const cu_inform = {
    id : sender_psid,
    twonship_name : userEntered_land_tosel.twp_name_tosell_land,
    land_area : userEntered_land_tosel.land_area_tosell_byCu,
    land_type : userEntered_land_tosel.land_type_tosell_byCu,
    a_myie_pauk : userEntered_land_tosel.a_myie_pauk_byCu,
    images_of_land : userEntered_land_tosel.images_ofLand_byCu,
    estimated_amount_forLand : userEntered_land_tosel.estimated_amount_byCus,
    fullyAddress_ofLand : userEntered_land_tosel.fullyAddress_ofLand_tosell,
    phone_number_ofCu : userEntered_land_tosel.phone_num_byCu_tosell_land,
    totell_yes_somethingElse : userEntered_land_tosel.yes_for_sthElse_byCu,
    totell_no_somethingElse : userEntered_land_tosel.no_for_sthElse_byCu,
   
  }
  db.collection('cu_info_tosell_land').add(userEntered_land_tosel);
}


/**************************************************************************/

// to rent house as landlord
function saveData_torent_house_asLdLd(sender_psid) {
  const cu_inform_torent_hou = {
    id : sender_psid,
    twonship_name : userEntered_landlord.twp_name_torentHouse,
    type_of_house : userEntered_landlord.house_type_torent,
    number_of_floor : userEntered_landlord.numOf_floor_torentHou,
    number_of_mbr : userEntered_landlord.numOf_mbr_torentHou,
    number_of_br : userEntered_landlord.numOf_br_torentHou,
    both_num_of_mbr : userEntered_landlord.both1_numOf_mbr_torent,
    both_num_of_br : userEntered_landlord.both2_numOf_br_torent,
    land_area_of_house : userEntered_landlord.landArea_ofHouse_torent,
    images_ofHouse_tsel : userEntered_landlord.images_ofHouse_torent,
    estimated_amount : userEntered_landlord.estimated_price_perMonth_torentHou,
    numOf_month_torentHou :userEntered_landlord.numOf_month_torentHouse,
    fully_address : userEntered_landlord.fullyAddress_byCu_torent,
    phone_number : userEntered_landlord.ph_numm_byCu_torentHou,
    yes_toTell_sth_else : userEntered_landlord.sth_yes_toldbyCu_torent,
    no_toTell_sth_else : userEntered_landlord.sth_no_toldbyCu_torent,
   
  }
  db.collection('cu_torent_house_asLandlord').add(userEntered_landlord);
}

// to rent land as landlord
function saveData_torent_land_asLdLd(sender_psid) {
  const cu_info_torentLand = {
    id : sender_psid,
    twonship_name : userEntered_ldld_land.twp_name_torent_land,
    land_area : userEntered_ldld_land.land_area_torent_byCu,
    land_type : userEntered_ldld_land.land_type_torent_byCu,
//    a_myie_pauk : userEntered_ldld_land.,
    images_of_land : userEntered_ldld_land.images_ofLand_torentLand,
    estimated_perMonth_torent : userEntered_ldld_land.estimatedPrice_perMonth_torentLand,
    numOf_torentLand : userEntered_ldld_land.numOf_month_torentLand,
    fullyAddress_ofLandToRent : userEntered_ldld_land.fullyAddress_ofLand_torent,
    phone_number_ofUser : userEntered_ldld_land.phone_num_byCu_torentLand,
    totell_yes_forSomethingElse : userEntered_ldld_land.yes_for_sthElse_byCuLand,
    totell_no_forSomethingElse : userEntered_ldld_land.no_for_sthElse_byCuLand,
   
  }
  db.collection('cu_torent_land_asLandlord').add(userEntered_ldld_land);
}

/************************************************************************************/

// to buy house in every
function saveData_tobuy_house(sender_psid) {
  const cu_info_toBuy_hou = {
    id : sender_psid,
    userSay_yes_forSthElse_tbh : userEntered_info_toBuyHouse.cuSay_yes_toSay_sthElse_se,
    userSay_no_forSthElse_tbh : userEntered_info_toBuyHouse.cuSay_no_toSay_sthElse_se,
    phNum_byUser_tbh : userEntered_info_toBuyHouse.phNumber_byCu_tobuyHouse,
  }
  db.collection('cu_info_toBuy_House').add(userEntered_info_toBuyHouse);
}


// to buy land in every
function saveData_tobuy_land(sender_psid) {
  const cu_info_toBuy_landInE = {
    id : sender_psid,
    cuSay_yes_forSthElse_tobuyland : userEntered_things_tobuyLand.cuSay_yes_forSthElse_tobuland,
    cuSay_no_forSthElse_tobuyland : userEntered_things_tobuyLand.cuSay_no_forSthElse_tobuland,
    phNum_byCu_tobuyLand : userEntered_things_tobuyLand.phNumber_byUser_tobuyLand,
  }
  db.collection('cu_info_toBuy_Land').add(userEntered_things_tobuyLand);
}


/****************************************************************************************/

// to rent house in every as tenant
function saveData_torent_house_asTenant(sender_psid) {
  const cu_info_torent_hou_te = {
    id : sender_psid,
    cu_yes_for_sthElse_te : userEntered_info_torentHou_asTenant.userSay_yes_sthElse_te,
    cu_no_for_sthElse_te : userEntered_info_torentHou_asTenant.userSay_no_sthElse_te,
    phoneNo_ofCu : userEntered_info_torentHou_asTenant.phNumber_byUser_torentHou_te,
  }
  db.collection('cu_torent_House_asTenant').add(userEntered_info_torentHou_asTenant);
}

// to rent land in every as tenant
function saveData_torent_land_asTenant(sender_psid) {
  const cu_info_torent_land_te = {
    id : sender_psid,
    cu_tell_yes_sthElse : userEntered_info_torentland_te.cu_say_yes_sthElse_tenant,
    cu_tell_no_sthElse : userEntered_info_torentland_te.cu_say_yes_sthElse_tenant,
    phoneNo_ofCu_asking : userEntered_info_torentland_te.phNumberByCu_torentHou_tenant,
  }
  db.collection('cu_torent_land_asTenant').add(userEntered_info_torentland_te);
}


// admin to create property
function saveData_foradmin(sender_psid) {
  const saveByAd = {
    id : sender_psid,
    dateByAdmin : adminEnteredall_info.dateByAdmin,
    propertyIdByCu : adminEnteredall_info.propertyIdByCu,
  }
  db.collection('savedata_byAdmin').add(adminEnteredall_info);
}


// for custom data
function saveCustomData(sender_psid) {
  const saveCuData = {
    id : sender_psid,
    twpNameCustom : userEnteredCustom.twpNameCustom,
    dataToldByUser : userEnteredCustom.dataToldByUser,
    phoneNumberCustom : userEnteredCustom.phoneNumberCustom,
  }
  db.collection('saveCustomAllData').add(userEnteredCustom);
}



// for moving house service
function saveMoveHouseData(sender_psid) {
  const saveDataMh = {
    id : sender_psid,
    startTwonshipName : userEnteredDataMoveHouseService.startTwonshipName,
    destinationTwonshipName : userEnteredDataMoveHouseService.destinationTwonshipName,
    appointmentDate : userEnteredDataMoveHouseService.appointmentDate,
    customerPhoneNumberApp : userEnteredDataMoveHouseService.customerPhoneNumberApp,
  }
  db.collection('saveMoveHouse').add(userEnteredDataMoveHouseService);
}
