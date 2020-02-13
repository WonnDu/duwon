
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
  app = express().use(body_parser.json()); // creates express http server

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
        handleMessage(sender_psid, webhook_event.message);        
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
        "payload":"<POSTBACK_PAYLOAD>",
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
  else if (received_message.text == "hi", "hello" ) {
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

  else if (received_message.text == "ni hao") {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `Hao Xie Xie. Ni Hao Mah!`
    }
  }
   else if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 
  
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
  } else if (payload === 'onee') {
     response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "generic",
                    "elements": [{
                      "title": "k",
                      "subtitle": "To find the properties, please choose an option below:",
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
                      ],
                    }]
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
                    "template_type": "generic",
                    "elements": [{
                      "title": "F",
                      "subtitle": "Please choose below options:",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "Landlord",
                          "payload": "ldld",
                        },
                        {
                          "type": "postback",
                          "title": "Tenant",
                          "payload": "tnan",
                        }
                      ],
                    }]
                  }
                }
              }
  }else if (payload === 'ldld') {
    response = { "text": "You have chose to rent out the property as a Landlord." }
  }else if (payload === 'tobu') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "generic",
                    "elements": [{
                      "title": "F",
                      "subtitle": "Please choose below options:",
                      "buttons": [
                        {
                          "type": "postback",
                          "title": "House",
                          "payload": "hou",
                        },
                        {
                          "type": "postback",
                          "title": "Land",
                          "payload": "lan",
                        }
                      ],
                    }]
                  }
                }
              }
  }else if (payload === 'hou') {
    response = { "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "generic",
                    "elements": [{
                      "title": "F",
                      "subtitle": "Please choose the amount you are avaliable:",
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
                      ],
                    }]
                  }
                }
              }
  } else if (payload === 'un500') {
    response = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"2005 Toyota Harrier",
            "image_url":"https://scontent.fmdl4-2.fna.fbcdn.net/v/t1.0-9/84501492_102529838002288_7785866037869674496_n.jpg?_nc_cat=104&_nc_eui2=AeECr4wM5QRK-nr2Mg8DzpC9QMaPApvwDcI6Nz0Eo1B0qlgVeLCVCv7uOwtq96bIRaSXFLctzBDEjfQeEIvRf7qAEiUtGxqZCdp9K23qU24UFw&_nc_ohc=CuU9i3fo2fcAX-tcpL6&_nc_pt=1&_nc_ht=scontent.fmdl4-2.fna&oh=f019efe897280ba54aa900ca817d2e3c&oe=5ED40444",
            "subtitle":"MMK : 445 lkh",
            "default_action": {
              "type": "web_url",
              "url": "https://www.car-tana.com/detail/61e16398ab9e67ec5a55c8d8b4cda413",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.car-tana.com/detail/61e16398ab9e67ec5a55c8d8b4cda413",
                "title":"More Information"
              },{
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"sc6"
              }              
            ]      
          },
           {
            "title":"2010 Toyota Vanguard",
            "image_url":"https://scontent.fmdl4-2.fna.fbcdn.net/v/t1.0-9/85151776_102536018001670_8430566072385536000_n.jpg?_nc_cat=102&_nc_eui2=AeEa2PSUBVeS6OKvntVnjI-jpk7ztg8yac_S7hcAUFRxtkaZO8UkOZ2KZlZvuOkHcLbQIK5vjaFlsVPvrOwKBZPQ-AndlEbZtVUkmip5IrcgiQ&_nc_ohc=AyviV4GkHm8AX_9v63d&_nc_pt=1&_nc_ht=scontent.fmdl4-2.fna&oh=c9ecd7927c59414c32668a40fb9245e0&oe=5EC550CA",
            "subtitle":"MMK : 650 lkh",
            "default_action": {
              "type": "web_url",
              "url": "https://www.myanmarcarmarketplace.com/for-sale/toyota/toyota-vanguard_i9",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.myanmarcarmarketplace.com/for-sale/toyota/toyota-vanguard_i9",
                "title":"More Information"
              },{
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"sc7"
              }              
            ]      
          },
           {
            "title":"2006 Toyota Hilux Surf",
            "image_url":"https://scontent.fmdl4-2.fna.fbcdn.net/v/t1.0-9/84578833_102538674668071_5961625579936546816_n.jpg?_nc_cat=103&_nc_eui2=AeHhJKt_Bk7NvLN5EozksSS7TRezBc-Twpquzk1qOQlyQhmNWZzzEz9ftGa1bZAdIhTHcze5Ep_BGjgjr2aWPsEXgec0huZcjlsgxo0G4BXPkQ&_nc_ohc=nPUd2jBIga8AX-cxlL3&_nc_pt=1&_nc_ht=scontent.fmdl4-2.fna&oh=b72205fd050f96ec6c9965bb2bbcf1f9&oe=5EFFDABD",
            "subtitle":"MMK : 225kh",
            "default_action": {
              "type": "web_url",
              "url": "https://www.japanesevehicle-sy.com/2013/01/2001-toyota-hilux-surf-ssr-x-4wd-to.html",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.japanesevehicle-sy.com/2013/01/2001-toyota-hilux-surf-ssr-x-4wd-to.html",
                "title":"More Information"
              },{
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"sc8"
              }              
            ]      
          },
          {
            "title":"2006 Toyota Kluger",
            "image_url":"https://scontent.fmdl4-2.fna.fbcdn.net/v/t1.0-9/84611929_102540228001249_4904819134107222016_n.jpg?_nc_cat=103&_nc_eui2=AeFKoX9o1_6SY8J3rGLEU_TzFlZZblILEKVu1dGKl1kgbfF00GpbIfyVcuCIf4VwcFYdlWWeHwxq-ro5ZZhIPh5shzCnWsqaqPUjXHZWISIBKA&_nc_ohc=2akem8R6StYAX_oWYeJ&_nc_pt=1&_nc_ht=scontent.fmdl4-2.fna&oh=61d58855fab3a647b8cf2e46b5c79cb1&oe=5ED5BF5F",
            "subtitle":"MMK : 520 lkh",
            "default_action": {
              "type": "web_url",
              "url": "https://www.picknbuy24.com/detail/?refno=0120291271",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.picknbuy24.com/detail/?refno=0120291271",
                "title":"More Information"
              },{
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"sc9"
              }              
            ]      
          },
          {
            "title":"2013 Toyota Prado",
            "image_url":"https://scontent.fmdl4-2.fna.fbcdn.net/v/t1.0-9/86276762_102544041334201_5268035601977835520_n.jpg?_nc_cat=102&_nc_eui2=AeGUC2StGbli_AgXVC2ZQigqPXPTSdQ_Sr8M9GfALPthF8MHIE_n3ndIf8AAInRx92_BiP8226-vU1TyHShNWaEYWCshV1pVEFZfVlq6uGRPPQ&_nc_ohc=8GX1YfOAdAAAX9i3pSy&_nc_pt=1&_nc_ht=scontent.fmdl4-2.fna&oh=a8a5ed23a2a93ec94c898c125bf1f2a4&oe=5EBF17BE",
            "subtitle":"MMK : 660 lkh",
            "default_action": {
              "type": "web_url",
              "url": "https://www.mymyancar.com/en/vehicle_listings/ad-toyota-prado-ayeyarwady-import-dubai-1505",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.mymyancar.com/en/vehicle_listings/ad-toyota-prado-ayeyarwady-import-dubai-1505",
                "title":"More Information"
              },{
                "type":"postback",
                "title":"Yes, I'm interested",
                "payload":"sc10"
              }              
            ]      
          }
        ]
      }
    }
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
                              "title":"Help",
                              "type":"postback",
                              "payload":"HELP_PAYLOAD"
                            },
                            {
                              "title":"Contact Me",
                              "type":"postback",
                              "payload":"CONTACT_INFO_PAYLOAD"
                            }
                        ]
                      },
                      {
                        "type":"web_url",
                        "title":"Visit website ",
                        "url":"http://www.google.com",
                        "webview_height_ratio":"full"
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
