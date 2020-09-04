'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const 
  requestify = require('requestify'),
  express = require('express'),
  body_parser = require('body-parser'),
  ejs = require('ejs'),
  firebase = require('firebase-admin');

  const app = express();
  app.use(body_parser.json());
  app.use(body_parser.urlencoded());
  app.set("view engine", "ejs");
  app.set("views", __dirname + "/views");
  app.use(express.static(__dirname + "/views"));

  firebase.initializeApp({
  credential: firebase.credential.cert({
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "project_id": process.env.FIREBASE_PROJECT_ID,
  }),
  databaseURL: "https://duwon-56700.firebaseio.com"
  });
  let db = firebase.firestore();

  var session = [];   
  var buyrentId = [];
  var movesession = [];
  var locations = [];
  var custom = [];
  var customId = [];
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

      var userInput = null;
      // Get the sender PSID
      let senderId = webhook_event.sender.id; 

      if(webhook_event.postback){
        userInput = webhook_event.postback.payload;
        var userButton = webhook_event.postback.title;
      }
      if(webhook_event.message){
        if(webhook_event.message.text){
            userInput = webhook_event.message.text;
        }
        if(webhook_event.message.quick_reply){
          userInput = webhook_event.message.quick_reply.payload;
        }
      }

      if(userInput != null){

        console.log(userInput);
        console.log(senderId);
        console.log(movesession);

        var resp = {
          "recipient": {
            "id": senderId
          },
          "message": {
            "text": "We couldn't catch what you said, please try again."
          }
        }
        if(custom.includes(senderId)){
          resp.message.text = null;
          db.collection('customerOrders').add({
            customer: senderId,
            order: userInput
          }).then(success=>{
            custom.splice(custom.indexOf(senderId),1);
            customId.push(`${senderId}/${success.id}`)
              var cusMess = {
                "recipient": {
                  "id": senderId
                },
                "message": {
                  "text": "Share us your phone number to contact back",
                  "quick_replies": [
                    {
                      "content_type": "user_phone_number"
                    }
                  ]
                }
              }
              sendMessage(cusMess);
          })
        }
        if(!isNaN(userInput)){
          if(session.includes(senderId)){
            resp.message.text = 'Processing...'
            var index = session.indexOf(`${senderId}`);
            var documentId = buyrentId[index];
            db.collection('order').doc(`${documentId}`).set({
              phone: userInput
            }, {merge: true}).then(success=>{
              var cusMess = {
                "recipient": {
                  "id": senderId
                },
                "message": {
                  "text": "We couldn't catch what you said, please try again."
                }
              }
              cusMess.message.text = 'Success! We will get back to you as soon as possible!'
              sendMessage(cusMess);
              session.splice(index, 1);
              buyrentId.splice(index,1);
              var adminMess = {
                "recipient": {
                  "id": "2369735496465987"
                },
                "message": {
                  "text": `A user has made a new purchase/rent order. \nplease check the following document in database: ${documentId}`
                }
              }
              sendMessage(adminMess)
            })
          }else if(movesession.includes(senderId)){
            resp.message.text = 'Processing...'
            var index = movesession.indexOf(`${senderId}`);
            var documentId = locations[index];
            db.collection('order').doc(`${documentId}`).set({
              phone: userInput
            }, {merge: true}).then(success=>{
              resp.message.text = 'Success! We will get back to you as soon as possible!'
              sendMessage(resp);
              movesession.splice(index, 1);
              locations.splice(index,1);
              resp = {
                "recipient": {
                  "id": "2369735496465987"
                },
                "message": {
                  "text": `A user has made a new house moving order. \nplease check the following document in database: ${documentId}`
                }
              }
              sendMessage(resp)
            })
          }else if(customId.length > 0){
            resp.message.text = "Processing..."
            for(var i = 0; i < customId.length; i++){
              if(customId[i].includes(senderId)){
                var docId = customId[i];
                docId = docId.split('/')
                docId = docId[1];
                custom.splice(custom.indexOf(senderId), 1);
                 customId.splice(i,1);
                db.collection('customerOrders').doc(docId).set({
                  Phone: userInput
                }, {merge: true}).then(added=>{
                  resp = {
                    "recipient": {
                      "id": "2369735496465987"
                    },
                    "message": {
                      "text": `A user has made a new custom order. \nplease check the following document in database: ${docId}`
                    }
                  }
                  sendMessage(resp)
                  resp = {
                    "recipient": {
                      "id": senderId
                    },
                    "message": {
                      "text": "Success! We will get back to you as soon as possible!"
                    }
                  }
                  sendMessage(resp);
                })
              }
            }
          }
        }
        if(userInput == 'admin' && senderId == "2369735496465987"){
          resp.message.text = "Welcome admin!"
          resp.message.quick_replies = [
            {
              content_type: "text",
              title: "Veirfy Property",
              payload: "verifyProp"
            }
          ]
        }
        if(userInput == 'verifyProp' && senderId == "2369735496465987"){
          resp.message.text = "Type verify/<property Id>"
        }
        if(userInput.includes('verify/') && senderId == '2369735496465987'){
          resp.message.text = "Processing.."
          userInput = userInput.split('/')
          var docId = userInput[1];
          db.collection('userListing').doc(docId).get().then(propDetails => {
            db.collection('property').get().then(properties => {
              var newId = properties.size;
              newId = '0000000000'+newId;
              newId = newId.slice(-10);
              var d = new Date();
              var today = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
              var newData = {
                Image: propDetails.data().Image,
                address: propDetails.data().address,
                area: propDetails.data().area,
                desc: propDetails.data().desc,
                title: propDetails.data().title,
                township: propDetails.data().township,
                purchase: propDetails.data().purchase,
                rent: propDetails.data().rent,
                verifiedDate: today
              }

              if(propDetails.data().purchase == 'Yes'){
                newData.sellPrice = propDetails.data().sellPrice;
              }else{
                newData.rentPrice = propDetails.data().rentPrice;
              }

              if(propDetails.data().houseType){
                newData.houseType = propDetails.data().houseType;
                newData.floor = propDetails.data().floor;
                newData.propertyType = 'house'
              }else{
                newData.propertyType = 'land'
              }


              db.collection('property').doc(newId).set(newData).then(success =>{
                resp = {
                  "recipient": {
                    "id": "2369735496465987"
                  },
                  "message": {
                    "text": `Success`
                  }
                }
                sendMessage(resp)
              })
            })
          })
        }
        //user entered text/ user clicked button
        //getStarted, Hi
        if(userInput == 'Hi' || userInput == 'Hello' || userInput == 'hi' || userInput == 'hello'){
          if(movesession.includes(senderId)){
            var delIndex = movesession.indexOf(senderId);
            movesession.splice(delIndex, 1);
            locations.splice(delIndex,1);
          }
            resp.message = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "Hi, welcome to Du Won Real Estate Agent. How can we help you?",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "Purchase/Sell Property",
                      "payload": "buySellMenu"
                    },{
                      "type": "postback",
                      "title": "Rental Services",
                      "payload": "rentMenu"
                    },{
                      "type": "postback",
                      "title": "House Moving Services",
                      "payload": "houseMovingMenu"
                    }
                  ]
                }
              }
            }
        }
        if(userInput == 'customOrder'){
          resp.message.text = "What type of property are you looking for?";
          resp.message.quick_replies = [
            {
              content_type: "text",
              title: "House",
              payload: userInput+"/house"
            }, {
              content_type: "text",
              title: "Land",
              payload: userInput+"/land"
            }
          ]
        }
        if(userInput.includes('customOrder/')){
          userInput = userInput.split('/')
          if(userInput.length == 2){
            userInput = userInput.join('/')
            resp.message.text = 'Please choose your township';
            resp.message.quick_replies = [
              {
                content_type: "text",
                title: "Oattarathiri",
                payload: userInput+"/ottara"
              },{
                content_type: "text",
                title: "Pobbathiri",
                payload: userInput+"/pobba"
              },{
                content_type: "text",
                title: "Dekkhina",
                payload: userInput+"/dekkhina"
              },{
                content_type: "text",
                title: "Zayathiri",
                payload: userInput+"/zaya"
              },{
                content_type: "text",
                title: "Zabuthiri",
                payload: userInput+"/zabu"
              },{
                content_type: "text",
                title: "Pyinmana",
                payload: userInput+"/pyinmana"
              }
            ]
          }
          if(userInput.length == 3){            
            custom.push(senderId);
            resp.message.text = 'Please enter the type of house/land you are looking for'; 
          }
        }
        //moving house
        if(userInput == 'houseMovingMenu'){
          resp.message.text = 'Please choose your township';
          resp.message.quick_replies = [
            {
              content_type: "text",
              title: "Oattarathiri",
              payload: "move/ottara"
            },{
              content_type: "text",
              title: "Pobbathiri",
              payload: "move/pobba"
            },{
              content_type: "text",
              title: "Dekkhina",
              payload: "move/dekkhina"
            },{
              content_type: "text",
              title: "Zayathiri",
              payload: "move/zaya"
            },{
              content_type: "text",
              title: "Zabuthiri",
              payload: "move/zabu"
            },{
              content_type: "text",
              title: "Pyinmana",
              payload: "move/pyinmana"
            }
          ]
        }
        if(userInput.includes('move/')){
          userInput = userInput.split('/');
          if(userInput.length == 2){
            userInput = userInput.join('/')
            resp.message.text = 'Please choose destination township';
            resp.message.quick_replies = [
              {
                content_type: "text",
                title: "Oattarathiri",
                payload: userInput+"/ottara"
              },{
                content_type: "text",
                title: "Pobbathiri",
                payload: userInput+"/pobba"
              },{
                content_type: "text",
                title: "Dekkhina",
                payload: userInput+"/dekkhina"
              },{
                content_type: "text",
                title: "Zayathiri",
                payload: userInput+"/zaya"
              },{
                content_type: "text",
                title: "Zabuthiri",
                payload: userInput+"/zabu"
              },{
                content_type: "text",
                title: "Pyinmana",
                payload: userInput+"/pyinmana"
              }
            ]
          }
          if(userInput.length == 3){
            userInput = userInput.join('/');
            resp.message = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements":[
                      {
                        "title":"Mini truck",
                        "image_url": "https://scontent.xx.fbcdn.net/v/t1.15752-9/97115233_3142615182467746_5571189258611326976_n.jpg?_nc_cat=103&_nc_sid=b96e70&_nc_eui2=AeGhoNf64_BPLqmevE7Oys5PBNY-R2MagEoE1j5HYxqAStvqIvPAXkIHC6CDhQSGUDcZCEN3aK8mqvnmf6a_DPQN&_nc_ohc=TInhb9H8JvgAX8hGCAo&_nc_ad=z-m&_nc_cid=0&_nc_zor=9&_nc_ht=scontent.xx&oh=d77b3878c00042f8fb3be3edb53a0de1&oe=5EDE5279",
                        "subtitle":"Purchase/Sell House",
                        "buttons":[{
                              "type": "postback",
                              "title": "Choose",
                              "payload": userInput+"/car1"
                          }
                        ]      
                      }
                    ]
                  }
                }
              }
          }
          if(userInput.length == 4){
            var price = null;
            if(userInput[1] == 'zaya'){
              if(userInput[2] == 'ottara'){
                price = 8000;
              }
              if(userInput[2] == 'pobba'){
                price = 5000;
              }
              if(userInput[2] == 'dekkhina'){
                price = 8000;
              }
              if(userInput[2] == 'zaya'){
                price = 3000;
              }
              if(userInput[2] == 'zabu'){
                price = 4000;
              }
              if(userInput[2] == 'pyinmana'){
                price = 4000;
              }
            }
            if(userInput[1] == 'zabu'){
              if(userInput[2] == 'ottara'){
                price = 8000;
              }
              if(userInput[2] == 'pobba'){
                price = 8000;
              }
              if(userInput[2] == 'dekkhina'){
                price = 10000;
              }
              if(userInput[2] == 'zaya'){
                price = 4000;
              }
              if(userInput[2] == 'zabu'){
                price = 3000;
              }
              if(userInput[2] == 'pyinmana'){
                price = 4000;
              }
            }
            if(userInput[1] == 'pobba'){
              if(userInput[2] == 'ottara'){
                price = 6000;
              }
              if(userInput[2] == 'pobba'){
                price = 3000;
              }
              if(userInput[2] == 'dekkhina'){
                price = 15000;
              }
              if(userInput[2] == 'zaya'){
                price = 5000;
              }
              if(userInput[2] == 'zabu'){
                price = 8000;
              }
              if(userInput[2] == 'pyinmana'){
                price = 9000;
              }
            }
            if(userInput[1] == 'dekkhina'){
              if(userInput[2] == 'ottara'){
                price = 12000;
              }
              if(userInput[2] == 'pobba'){
                price = 15000;
              }
              if(userInput[2] == 'dekkhina'){
                price = 3000
              }
              if(userInput[2] == 'zaya'){
                price = 8000;
              }
              if(userInput[2] == 'zabu'){
                price = 10000;
              }
              if(userInput[2] == 'pyinmana'){
                price = 8000;
              }
            }
            if(userInput[1] == 'ottara'){
              if(userInput[2] == 'ottara'){
                price = 3000;
              }
              if(userInput[2] == 'pobba'){
                price = 6000;
              }
              if(userInput[2] == 'dekkhina'){
                price = 12000;
              }
              if(userInput[2] == 'zaya'){
                price = 8000;
              }
              if(userInput[2] == 'zabu'){
                price = 8000;
              }
              if(userInput[2] == 'pyinmana'){
                price = 7000;
              }
            }
            if(userInput[1] == 'pyinmana'){
              if(userInput[2] == 'ottara'){
                price = 7000;
              }
              if(userInput[2] == 'pobba'){
                price = 9000;
              }
              if(userInput[2] == 'dekkhina'){
                price = 8000;
              }
              if(userInput[2] == 'zaya'){
                price = 4000;
              }
              if(userInput[2] == 'zabu'){
                price = 4000;
              }
              if(userInput[2] == 'pyinmana'){
                price = 3000;
              }
            }
            movesession.push(senderId);
            locations.push([`${userInput[1]}`,`${userInput[2]}`,`${userInput[3]}`]);
            resp.message.text = 'The price of relocation is: '+price+'MMK \nPlease enter the date of relocation in DD/MM/YYYY format';
            resp.message.quick_replies = [
              {
                content_type: "text",
                title: "Cancel",
                payload:"Hi"
              },{
                content_type: "text",
                title: "Edit Details",
                payload:"houseMovingMenu"
              }
            ]
          }
        }
        //Main Menus
        if(userInput == 'buySellMenu'){
          resp.message = {
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
                              "payload": "buyHouse"
                          },{
                            "type": "postback",
                            "title": "Sell",
                            "payload": "sellHouse"
                          }
                        ]      
                      },
                      {
                        "title":"Land",
                        "subtitle":"Purchase/Sell Land",
                        "buttons":[{
                              "type": "postback",
                              "title": "Purchase",
                              "payload": "buyLand"
                          },{
                            "type": "postback",
                            "title": "Sell",
                            "payload": "sellLand"
                          }
                        ]      
                      }
                  ]
                }
              }
          }
        }
        if(userInput == 'rentMenu'){
          resp.message = {
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
                                "payload": "getRentHouse"
                            },{
                              "type": "postback",
                              "title": "Rent your House",
                              "payload": "makeRentHouse"
                            }
                          ]      
                        },
                      {
                        "title":"Land",
                        "subtitle":"Land Rental",
                        "buttons":[{
                            "type": "postback",
                            "title": "Rent Land",
                            "payload": "getRentLand"
                          },{
                            "type": "postback",
                            "title": "Rent your Land",
                            "payload": "makeRentLand"
                          }
                        ]      
                      }
                  ]
                }
              }
          }
        }
        //Township
        if(userInput == 'buyHouse' || userInput == 'sellHouse' || userInput == 'buyLand' || userInput == 'sellLand' || userInput == 'getRentHouse' || userInput == 'makeRentHouse' || userInput == 'getRentLand' || userInput == 'makeRentLand'){
          var text = 'Please choose township';
          if(userInput.includes('buy') || userInput.includes('getRent')){
            text = text+" to browse for";
          }
          if(userInput.includes('sell') || userInput.includes('makeRent')){
            text = text+" for your";
          }
          if(userInput.includes('House')){
            text = text+" house";
          }
          if(userInput.includes('Land')){
            text = text+" land";
          }
          resp.message.text = 'Please choose township';
          resp.message.quick_replies = [
            {
              content_type: "text",
              title: "Oattarathiri",
              payload: userInput+"/ottara"
            },{
              content_type: "text",
              title: "Pobbathiri",
              payload: userInput+"/pobba"
            },{
              content_type: "text",
              title: "Dekkhina",
              payload: userInput+"/dekkhina"
            },{
              content_type: "text",
              title: "Zayathiri",
              payload: userInput+"/zaya"
            },{
              content_type: "text",
              title: "Zabuthiri",
              payload: userInput+"/zabu"
            },{
              content_type: "text",
              title: "Pyinmana",
              payload: userInput+"/pyinmana"
            }
          ]
        }

        //buy/RentFlow

        if(userInput.includes('buy-') || userInput.includes('rent-')){
          resp.message.text = 'Processing...'
          userInput = userInput.split('-');
          var type = userInput[0];
          var propertyId = userInput[1];
          var date = new Date;
          date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
          db.collection('order').add({
            customerId: senderId,
            date: date,
            type: type,
            propertyId: propertyId
          }).then(newdocument=>{
            buyrentId.push(newdocument.id);
            session.push(senderId);
            var responseMessage = {
              "recipient":{
                "id":senderId
              },
              "message":{
                "text": "Please share us your phone number",
                "quick_replies":[
                  {
                    "content_type":"user_phone_number"
                  }
                ]
              }
            }
            sendMessage(responseMessage);
          })
        }

        //searchFlow
        if(userInput.includes('/showProperty')){
          userInput = userInput.split('/');
          var type = userInput[0];
          if(type.includes('Land')){
            var propType = 'land';
          }else{
            var propType = 'house';
          }
          var township = userInput[1];
          resp.message.text = 'Searching...';
          var dbSearchQuery = db.collection('property')
          if(propType == 'house'){
            var area = userInput[4];
            var houseType = userInput[2];
            var floor = userInput[3];
            dbSearchQuery = dbSearchQuery.where('propertyType', '==', `${propType}`).where('township', '==', `${township}`).where('area', '==', `${area}`).where('houseType', '==', `${houseType}`).where('floor', '==', `${floor}`);
          }else{
            var area = userInput[2];
            dbSearchQuery = dbSearchQuery.where('propertyType', '==', `${propType}`).where('township', '==', `${township}`).where('area', '==', `${area}`);
          }
          if(type.includes('buy')){
            dbSearchQuery = dbSearchQuery.where('purchase', '==', 'Yes');
            var e = 'buy';
          }else{
            dbSearchQuery = dbSearchQuery.where('rent', '==', 'Yes');
            var e = 'rent';
          }
          var buttonTitle = e.charAt(0).toUpperCase() + e.slice(1)
          var num = 0;
          dbSearchQuery.get().then(relt => {
            if(relt.size > 0){
              var resultCarousel = {
                "recipient": {
                  "id": senderId
                },
                "message": {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "generic",
                      "elements":[ 
                      ]
                    }
                  }
                }
              }
              relt.forEach(propDetails => {
                if(e == 'buy'){
                  var propPrice = propDetails.data().sellPrice;
                }else{
                  var propPrice = propDetails.data().rentPrice;
                }
                var element = {
                  "title":`${propDetails.data().title}`,
                  "subtitle": `Price: ${propPrice}`,
                  "image_url": `${propDetails.data().Image}`,
                  "buttons":[{
                    "type":"web_url",
                    "url":`https://duwon.herokuapp.com/property?id=${propDetails.id}&e=${e}`,
                    "title":"View Details",
                    "webview_height_ratio": "full"
                  },{
                    "type":"postback",
                    "payload":`${e}-${propDetails.id}`,
                    "title": buttonTitle                   
                  }]      
                }
                resultCarousel.message.attachment.payload.elements.push(element);
                num = num+1;
                if(num == relt.size){
                  sendMessage(resultCarousel);
                }
              })
            }else{
              if(e == 'buy'){
                var payload = 'buySellMenu';
              }else{
                var payload = 'rentMenu';
              }
              var reltMessage = {
                "recipient": {
                  "id": senderId
                },
                "message": {
                  "text": "No properties are available with your preferences for now, Please check back later! Sorry for the inconvenience!",
                  "quick_replies":[
                    {
                      content_type: "text",
                      title: "Home",
                      payload: "Hi"
                    }, {
                      content_type: "text",
                      title: "Keep searching",
                      payload: payload
                    }
                  ]
                }
              }
              sendMessage(reltMessage);
            }
          }).catch(err => {
            console.log(err);
          })
        }

        //get/buy criteria
        if(userInput.includes('buyLand/') || userInput.includes('getRentLand/')){
          userInput = userInput.split('/');
          if(userInput.length == 2){
            resp.message = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "Please choose area of land",
                  "buttons": [
                    
                  ]
                }
              }
            }
            var button1 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            var button2 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            var button3 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            if(userInput[1] == "ottara"){
              userInput = userInput.join('/');
              button1.title = "80*80";
              button1.payload = `${userInput}/80x80/showProperty`;
              resp.message.attachment.payload.buttons.push(button1);
              button2.title = "100*100";
              button2.payload = `${userInput}/100x100/showProperty`;
              resp.message.attachment.payload.buttons.push(button2);
              button3.title = "150*150";
              button3.payload = `${userInput}/150x150/showProperty`;
              resp.message.attachment.payload.buttons.push(button3);           
            }
            if(userInput[1] == "pobba"){
              userInput = userInput.join('/');
              button1.title = "40*60";
              button1.payload = `${userInput}/40x60/showProperty`;
              resp.message.attachment.payload.buttons.push(button1);
              button2.title = "60*80";
              button2.payload = `${userInput}/60x80/showProperty`;
              resp.message.attachment.payload.buttons.push(button2);
              button3.title = "80*80";
              button3.payload = `${userInput}/80x80/showProperty`;
              resp.message.attachment.payload.buttons.push(button3);
            }
            if(userInput[1] == "dekkhina"){
              userInput = userInput.join('/');
              button1.title = "60*80";
              button1.payload = `${userInput}/60x80/showProperty`;
              resp.message.attachment.payload.buttons.push(button1);
              button2.title = "80*80";
              button2.payload = `${userInput}/80x80/showProperty`;
              resp.message.attachment.payload.buttons.push(button2);
              button3.title = "100*100";
              button3.payload = `${userInput}/100x100/showProperty`;
              resp.message.attachment.payload.buttons.push(button3);
            }
            if(userInput[1] == "zaya"){
              userInput = userInput.join('/');
              button1.title = "40*60";
              button1.payload = `${userInput}/40x60/showProperty`;
              resp.message.attachment.payload.buttons.push(button1);
              button2.title = "60*80";
              button2.payload = `${userInput}/60x80/showProperty`;
              resp.message.attachment.payload.buttons.push(button2);
              button3.title = "Ohter Areas";
              button3.payload = `${userInput}/other/showProperty`;
              resp.message.attachment.payload.buttons.push(button3);
            }
            if(userInput[1] == "zabu"){
              userInput = userInput.join('/');
              button1.title = "60*60";
              button1.payload = `${userInput}/60x60/showProperty`;
              resp.message.attachment.payload.buttons.push(button1);
              button2.title = "100*100";
              button2.payload = `${userInput}/100x100/showProperty`;
              resp.message.attachment.payload.buttons.push(button2);
              button3.title = "Ohter Areas";
              button3.payload = `${userInput}/other/showProperty`;
              resp.message.attachment.payload.buttons.push(button3);
            }
            if(userInput[1] == "pyinmana"){
              userInput = userInput.join('/');
              resp.message = {
                "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "generic",
                    "elements":[
                      {
                        "title":"Land Area",
                        "buttons":[{
                          "type": "postback",
                          "title": "40*60",
                          "payload": `${userInput}/40x60/showProperty`
                        },{
                          "type": "postback",
                          "title": "60*72",
                          "payload": `${userInput}/60x72/showProperty`
                        }]      
                      },{
                        "title":"Land Area",
                        "buttons":[{
                          "type": "postback",
                          "title": "60*80",
                          "payload": `${userInput}/60x80/showProperty`
                        },{
                          "type": "postback",
                          "title": "Other Areas",
                          "payload": `${userInput}/other/showProperty`
                        }]      
                      }
                    ]
                  }
                }
              }
            }
          }
        }
        if(userInput.includes('buyHouse/') || userInput.includes('getRentHouse/')){
          userInput = userInput.split('/')
          //Township
          if(userInput.length == 2){
            userInput = userInput.join('/');
            resp.message = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "Please choose type of house",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "RC Type",
                      "payload": `${userInput}/RC`
                    },{
                      "type": "postback",
                      "title": "Other Types",
                      "payload": `${userInput}/other`
                    }
                  ]
                }
              }
            }
          }
          //RC
          if(userInput.length == 3 && userInput[2] == 'RC'){
            userInput = userInput.join('/');
            resp.message = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "Please choose how many floors",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "One Floor",
                      "payload": `${userInput}/1`
                    },{
                      "type": "postback",
                      "title": "Two Floors",
                      "payload": `${userInput}/2`
                    },{
                      "type": "postback",
                      "title": "Three or More Floors",
                      "payload": `${userInput}/3+`
                    }
                  ]
                }
              }
            }
          }
          if(userInput.length == 4 && userInput[2] == 'RC'){
            resp.message = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "Please choose area of house",
                  "buttons": [
                    
                  ]
                }
              }
            }
            var button1 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            var button2 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            var button3 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            if(userInput[1] == "ottara"){
              if(userInput[3] != '3+'){
                userInput = userInput.join('/');
                button1.title = "80*80";
                button1.payload = `${userInput}/80x80/showProperty`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "100*100";
                button2.payload = `${userInput}/100x100/showProperty`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "150*150";
                button3.payload = `${userInput}/150x150/showProperty`;
                resp.message.attachment.payload.buttons.push(button3);
              }else{
                resp.message = {
                  text: "Searching..."
                }
                var type = userInput[0];
                var township = userInput[1];
                resp.message.text = 'Searching...';
                var dbSearchQuery = db.collection('property');
                dbSearchQuery = dbSearchQuery.where('propertyType', '==', `house`).where('township', '==', `${township}`).where('houseType', '==', `RC`).where('floor', '==', '3+')
                if(type.includes('buy')){
                  dbSearchQuery = dbSearchQuery.where('purchase', '==', 'Yes');
                  var e = 'buy';
                }else{
                  dbSearchQuery = dbSearchQuery.where('rent', '==', 'Yes');
                  var e = 'rent';
                }
                var buttonTitle = e.charAt(0).toUpperCase() + e.slice(1)
                var num = 0;
                dbSearchQuery.get().then(relt => {
                  if(relt.size > 0){
                    var resultCarousel = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "attachment": {
                          "type": "template",
                          "payload": {
                            "template_type": "generic",
                            "elements":[ 
                            ]
                          }
                        }
                      }
                    }
                    relt.forEach(propDetails => {
                      if(e == 'buy'){
                        var propPrice = propDetails.data().sellPrice;
                      }else{
                        var propPrice = propDetails.data().rentPrice;
                      }
                      var element = {
                        "title":`${propDetails.data().title}`,
                        "subtitle": `Price: ${propPrice}`,
                        "image_url": `${propDetails.data().Image}`,
                        "buttons":[{
                          "type":"web_url",
                          "url":`https://duwon.herokuapp.com/property?id=${propDetails.id}&e=${e}`,
                          "title":"View Details",
                          "webview_height_ratio": "full"
                        },{
                          "type":"postback",
                          "payload":`${e}-${propDetails.id}`,
                          "title": buttonTitle                   
                        }]      
                      }
                      resultCarousel.message.attachment.payload.elements.push(element);
                      num = num+1;
                      if(num == relt.size){
                        sendMessage(resultCarousel);
                      }
                    })
                  }else{
                    if(e == 'buy'){
                      var payload = 'buySellMenu';
                    }else{
                      var payload = 'rentMenu';
                    }
                    var reltMessage = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "text": "No properties are available with your preferences for now, Please check back later! Sorry for the inconvenience!",
                        "quick_replies":[
                          {
                            content_type: "text",
                            title: "Home",
                            payload: "Hi"
                          }, {
                            content_type: "text",
                            title: "Keep searching",
                            payload: payload
                          }
                        ]
                      }
                    }
                    sendMessage(reltMessage);
                  }
                }).catch(err => {
                  console.log(err);
                })
              }              
            }
            if(userInput[1] == "pobba"){
              if(userInput[3] != '3+'){
                userInput = userInput.join('/');
                button1.title = "40*60";
                button1.payload = `${userInput}/40x60/showProperty`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "60*80";
                button2.payload = `${userInput}/60x80/showProperty`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "80*80";
                button3.payload = `${userInput}/80x80/showProperty`;
                resp.message.attachment.payload.buttons.push(button3);
              }else{
                resp.message = {
                  text: "Searching..."
                }
                var type = userInput[0];
                var township = userInput[1];
                resp.message.text = 'Searching...';
                var dbSearchQuery = db.collection('property');
                dbSearchQuery = dbSearchQuery.where('propertyType', '==', `house`).where('township', '==', `${township}`).where('houseType', '==', `RC`).where('floor', '==', '3+')
                if(type.includes('buy')){
                  dbSearchQuery = dbSearchQuery.where('purchase', '==', 'Yes');
                  var e = 'buy';
                }else{
                  dbSearchQuery = dbSearchQuery.where('rent', '==', 'Yes');
                  var e = 'rent';
                }
                var buttonTitle = e.charAt(0).toUpperCase() + e.slice(1)
                var num = 0;
                dbSearchQuery.get().then(relt => {
                  if(relt.size > 0){
                    var resultCarousel = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "attachment": {
                          "type": "template",
                          "payload": {
                            "template_type": "generic",
                            "elements":[ 
                            ]
                          }
                        }
                      }
                    }
                    relt.forEach(propDetails => {
                      if(e == 'buy'){
                        var propPrice = propDetails.data().sellPrice;
                      }else{
                        var propPrice = propDetails.data().rentPrice;
                      }
                      var element = {
                        "title":`${propDetails.data().title}`,
                        "subtitle": `Price: ${propPrice}`,
                        "image_url": `${propDetails.data().Image}`,
                        "buttons":[{
                          "type":"web_url",
                          "url":`https://duwon.herokuapp.com/property?id=${propDetails.id}&e=${e}`,
                          "title":"View Details",
                          "webview_height_ratio": "full"
                        },{
                          "type":"postback",
                          "payload":`${e}-${propDetails.id}`,
                          "title": buttonTitle                   
                        }]      
                      }
                      resultCarousel.message.attachment.payload.elements.push(element);
                      num = num+1;
                      if(num == relt.size){
                        sendMessage(resultCarousel);
                      }
                    })
                  }else{
                    if(e == 'buy'){
                      var payload = 'buySellMenu';
                    }else{
                      var payload = 'rentMenu';
                    }
                    var reltMessage = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "text": "No properties are available with your preferences for now, Please check back later! Sorry for the inconvenience!",
                        "quick_replies":[
                          {
                            content_type: "text",
                            title: "Home",
                            payload: "Hi"
                          }, {
                            content_type: "text",
                            title: "Keep searching",
                            payload: payload
                          }
                        ]
                      }
                    }
                    sendMessage(reltMessage);
                  }
                }).catch(err => {
                  console.log(err);
                })
              }
            }
            if(userInput[1] == "dekkhina"){
              if(userInput[3] != '3+'){
                userInput = userInput.join('/');
                button1.title = "60*80";
                button1.payload = `${userInput}/60x80/showProperty`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "80*80";
                button2.payload = `${userInput}/80x80/showProperty`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "100*100";
                button3.payload = `${userInput}/100x100/showProperty`;
                resp.message.attachment.payload.buttons.push(button3);
              }else{
                resp.message = {
                  text: "Searching..."
                }
                var type = userInput[0];
                var township = userInput[1];
                resp.message.text = 'Searching...';
                var dbSearchQuery = db.collection('property');
                dbSearchQuery = dbSearchQuery.where('propertyType', '==', `house`).where('township', '==', `${township}`).where('houseType', '==', `RC`).where('floor', '==', '3+')
                if(type.includes('buy')){
                  dbSearchQuery = dbSearchQuery.where('purchase', '==', 'Yes');
                  var e = 'buy';
                }else{
                  dbSearchQuery = dbSearchQuery.where('rent', '==', 'Yes');
                  var e = 'rent';
                }
                var buttonTitle = e.charAt(0).toUpperCase() + e.slice(1)
                var num = 0;
                dbSearchQuery.get().then(relt => {
                  if(relt.size > 0){
                    var resultCarousel = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "attachment": {
                          "type": "template",
                          "payload": {
                            "template_type": "generic",
                            "elements":[ 
                            ]
                          }
                        }
                      }
                    }
                    relt.forEach(propDetails => {
                      if(e == 'buy'){
                        var propPrice = propDetails.data().sellPrice;
                      }else{
                        var propPrice = propDetails.data().rentPrice;
                      }
                      var element = {
                        "title":`${propDetails.data().title}`,
                        "subtitle": `Price: ${propPrice}`,
                        "image_url": `${propDetails.data().Image}`,
                        "buttons":[{
                          "type":"web_url",
                          "url":`https://duwon.herokuapp.com/property?id=${propDetails.id}&e=${e}`,
                          "title":"View Details",
                          "webview_height_ratio": "full"
                        },{
                          "type":"postback",
                          "payload":`${e}-${propDetails.id}`,
                          "title": buttonTitle                   
                        }]      
                      }
                      resultCarousel.message.attachment.payload.elements.push(element);
                      num = num+1;
                      if(num == relt.size){
                        sendMessage(resultCarousel);
                      }
                    })
                  }else{
                    if(e == 'buy'){
                      var payload = 'buySellMenu';
                    }else{
                      var payload = 'rentMenu';
                    }
                    var reltMessage = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "text": "No properties are available with your preferences for now, Please check back later! Sorry for the inconvenience!",
                        "quick_replies":[
                          {
                            content_type: "text",
                            title: "Home",
                            payload: "Hi"
                          }, {
                            content_type: "text",
                            title: "Keep searching",
                            payload: payload
                          }
                        ]
                      }
                    }
                    sendMessage(reltMessage);
                  }
                }).catch(err => {
                  console.log(err);
                })
              }
            }
            if(userInput[1] == "zaya"){
              if(userInput[3] != '3+'){
                userInput = userInput.join('/');
                button1.title = "40*60";
                button1.payload = `${userInput}/40x60/showProperty`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "60*80";
                button2.payload = `${userInput}/60x80/showProperty`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "Ohter Areas";
                button3.payload = `${userInput}/other/showProperty`;
                resp.message.attachment.payload.buttons.push(button3);
              }else{
                resp.message = {
                  text: "Searching..."
                }
                var type = userInput[0];
                var township = userInput[1];
                resp.message.text = 'Searching...';
                var dbSearchQuery = db.collection('property');
                dbSearchQuery = dbSearchQuery.where('propertyType', '==', `house`).where('township', '==', `${township}`).where('houseType', '==', `RC`).where('floor', '==', '3+')
                if(type.includes('buy')){
                  dbSearchQuery = dbSearchQuery.where('purchase', '==', 'Yes');
                  var e = 'buy';
                }else{
                  dbSearchQuery = dbSearchQuery.where('rent', '==', 'Yes');
                  var e = 'rent';
                }
                var buttonTitle = e.charAt(0).toUpperCase() + e.slice(1)
                var num = 0;
                dbSearchQuery.get().then(relt => {
                  if(relt.size > 0){
                    var resultCarousel = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "attachment": {
                          "type": "template",
                          "payload": {
                            "template_type": "generic",
                            "elements":[ 
                            ]
                          }
                        }
                      }
                    }
                    relt.forEach(propDetails => {
                      if(e == 'buy'){
                        var propPrice = propDetails.data().sellPrice;
                      }else{
                        var propPrice = propDetails.data().rentPrice;
                      }
                      var element = {
                        "title":`${propDetails.data().title}`,
                        "subtitle": `Price: ${propPrice}`,
                        "image_url": `${propDetails.data().Image}`,
                        "buttons":[{
                          "type":"web_url",
                          "url":`https://duwon.herokuapp.com/property?id=${propDetails.id}&e=${e}`,
                          "title":"View Details",
                          "webview_height_ratio": "full"
                        },{
                          "type":"postback",
                          "payload":`${e}-${propDetails.id}`,
                          "title": buttonTitle                   
                        }]      
                      }
                      resultCarousel.message.attachment.payload.elements.push(element);
                      num = num+1;
                      if(num == relt.size){
                        sendMessage(resultCarousel);
                      }
                    })
                  }else{
                    if(e == 'buy'){
                      var payload = 'buySellMenu';
                    }else{
                      var payload = 'rentMenu';
                    }
                    var reltMessage = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "text": "No properties are available with your preferences for now, Please check back later! Sorry for the inconvenience!",
                        "quick_replies":[
                          {
                            content_type: "text",
                            title: "Home",
                            payload: "Hi"
                          }, {
                            content_type: "text",
                            title: "Keep searching",
                            payload: payload
                          }
                        ]
                      }
                    }
                    sendMessage(reltMessage);
                  }
                }).catch(err => {
                  console.log(err);
                })
              }
            }
            if(userInput[1] == "zabu"){
              if(userInput[3] != '3+'){
                button1.title = "60*60";
                button1.payload = `${userInput}/60x60/showProperty`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "100*100";
                button2.payload = `${userInput}/100x100/showProperty`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "Ohter Areas";
                button3.payload = `${userInput}/other/showProperty`;
                resp.message.attachment.payload.buttons.push(button3);
              }else{
                resp.message = {
                  text: "Searching..."
                }
                userInput = userInput.split('/');
                var type = userInput[0];
                var township = userInput[1];
                resp.message.text = 'Searching...';
                var dbSearchQuery = db.collection('property');
                dbSearchQuery = dbSearchQuery.where('propertyType', '==', `house`).where('township', '==', `${township}`).where('houseType', '==', `RC`).where('floor', '==', '3+')
                if(type.includes('buy')){
                  dbSearchQuery = dbSearchQuery.where('purchase', '==', 'Yes');
                  var e = 'buy';
                }else{
                  dbSearchQuery = dbSearchQuery.where('rent', '==', 'Yes');
                  var e = 'rent';
                }
                var buttonTitle = e.charAt(0).toUpperCase() + e.slice(1)
                var num = 0;
                dbSearchQuery.get().then(relt => {
                  if(relt.size > 0){
                    var resultCarousel = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "attachment": {
                          "type": "template",
                          "payload": {
                            "template_type": "generic",
                            "elements":[ 
                            ]
                          }
                        }
                      }
                    }
                    relt.forEach(propDetails => {
                      if(e == 'buy'){
                        var propPrice = propDetails.data().sellPrice;
                      }else{
                        var propPrice = propDetails.data().rentPrice;
                      }
                      var element = {
                        "title":`${propDetails.data().title}`,
                        "subtitle": `Price: ${propPrice}`,
                        "image_url": `${propDetails.data().Image}`,
                        "buttons":[{
                          "type":"web_url",
                          "url":`https://duwon.herokuapp.com/property?id=${propDetails.id}&e=${e}`,
                          "title":"View Details",
                          "webview_height_ratio": "full"
                        },{
                          "type":"postback",
                          "payload":`${e}-${propDetails.id}`,
                          "title": buttonTitle                   
                        }]      
                      }
                      resultCarousel.message.attachment.payload.elements.push(element);
                      num = num+1;
                      if(num == relt.size){
                        sendMessage(resultCarousel);
                      }
                    })
                  }else{
                    if(e == 'buy'){
                      var payload = 'buySellMenu';
                    }else{
                      var payload = 'rentMenu';
                    }
                    var reltMessage = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "text": "No properties are available with your preferences for now, Please check back later! Sorry for the inconvenience!",
                        "quick_replies":[
                          {
                            content_type: "text",
                            title: "Home",
                            payload: "Hi"
                          }, {
                            content_type: "text",
                            title: "Keep searching",
                            payload: payload
                          }
                        ]
                      }
                    }
                    sendMessage(reltMessage);
                  }
                }).catch(err => {
                  console.log(err);
                })
              }
            }
            if(userInput[1] == "pyinmana"){
              if(userInput[3] != '3+'){
                userInput = userInput.join('/');
                resp.message = {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "generic",
                      "elements":[
                        {
                          "title":"House Area",
                          "buttons":[{
                            "type": "postback",
                            "title": "40*60",
                            "payload": `${userInput}/40x60/showProperty`
                          },{
                            "type": "postback",
                            "title": "60*72",
                            "payload": `${userInput}/60x72/showProperty`
                          }]      
                        },{
                          "title":"House Area",
                          "buttons":[{
                            "type": "postback",
                            "title": "60*80",
                            "payload": `${userInput}/60x80/showProperty`
                          },{
                            "type": "postback",
                            "title": "Other Areas",
                            "payload": `${userInput}/other/showProperty`
                          }]      
                        }
                      ]
                    }
                  }
                }
              }else{
                resp.message = {
                  text: "Searching..."
                }
                var type = userInput[0];
                var township = userInput[1];
                resp.message.text = 'Searching...';
                var dbSearchQuery = db.collection('property');
                dbSearchQuery = dbSearchQuery.where('propertyType', '==', `house`).where('township', '==', `${township}`).where('houseType', '==', `RC`).where('floor', '==', '3+')
                if(type.includes('buy')){
                  dbSearchQuery = dbSearchQuery.where('purchase', '==', 'Yes');
                  var e = 'buy';
                }else{
                  dbSearchQuery = dbSearchQuery.where('rent', '==', 'Yes');
                  var e = 'rent';
                }
                var buttonTitle = e.charAt(0).toUpperCase() + e.slice(1)
                var num = 0;
                dbSearchQuery.get().then(relt => {
                  if(relt.size > 0){
                    var resultCarousel = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "attachment": {
                          "type": "template",
                          "payload": {
                            "template_type": "generic",
                            "elements":[ 
                            ]
                          }
                        }
                      }
                    }
                    relt.forEach(propDetails => {
                      if(e == 'buy'){
                        var propPrice = propDetails.data().sellPrice;
                      }else{
                        var propPrice = propDetails.data().rentPrice;
                      }
                      var element = {
                        "title":`${propDetails.data().title}`,
                        "subtitle": `Price: ${propPrice}`,
                        "image_url": `${propDetails.data().Image}`,
                        "buttons":[{
                          "type":"web_url",
                          "url":`https://duwon.herokuapp.com/property?id=${propDetails.id}&e=${e}`,
                          "title":"View Details",
                          "webview_height_ratio": "full"
                        },{
                          "type":"postback",
                          "payload":`${e}-${propDetails.id}`,
                          "title": buttonTitle                   
                        }]      
                      }
                      resultCarousel.message.attachment.payload.elements.push(element);
                      num = num+1;
                      if(num == relt.size){
                        sendMessage(resultCarousel);
                      }
                    })
                  }else{
                    if(e == 'buy'){
                      var payload = 'buySellMenu';
                    }else{
                      var payload = 'rentMenu';
                    }
                    var reltMessage = {
                      "recipient": {
                        "id": senderId
                      },
                      "message": {
                        "text": "No properties are available with your preferences for now, Please check back later! Sorry for the inconvenience!",
                        "quick_replies":[
                          {
                            content_type: "text",
                            title: "Home",
                            payload: "Hi"
                          }, {
                            content_type: "text",
                            title: "Keep searching",
                            payload: payload
                          }
                        ]
                      }
                    }
                    sendMessage(reltMessage);
                  }
                }).catch(err => {
                  console.log(err);
                })
              }
            }
          }
          if(userInput.length == 3 && userInput[2] == 'other'){
            var type = userInput[0];
            var township = userInput[1];
            resp.message.text = 'Searching...';
            var dbSearchQuery = db.collection('property');
            dbSearchQuery = dbSearchQuery.where('propertyType', '==', `house`).where('township', '==', `${township}`).where('houseType', '==', `other`)
            if(type.includes('buy')){
              dbSearchQuery = dbSearchQuery.where('purchase', '==', 'Yes');
              var e = 'buy';
            }else{
              dbSearchQuery = dbSearchQuery.where('rent', '==', 'Yes');
              var e = 'rent';
            }
            var buttonTitle = e.charAt(0).toUpperCase() + e.slice(1)
            var num = 0;
            dbSearchQuery.get().then(relt => {
              if(relt.size > 0){
                var resultCarousel = {
                  "recipient": {
                    "id": senderId
                  },
                  "message": {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements":[ 
                        ]
                      }
                    }
                  }
                }
                relt.forEach(propDetails => {
                  if(e == 'buy'){
                    var propPrice = propDetails.data().sellPrice;
                  }else{
                    var propPrice = propDetails.data().rentPrice;
                  }
                  var element = {
                    "title":`${propDetails.data().title}`,
                    "subtitle": `Price: ${propPrice}`,
                    "image_url": `${propDetails.data().Image}`,
                    "buttons":[{
                      "type":"web_url",
                      "url":`https://duwon.herokuapp.com/property?id=${propDetails.id}&e=${e}`,
                      "title":"View Details",
                      "webview_height_ratio": "full"
                    },{
                      "type":"postback",
                      "payload":`${e}-${propDetails.id}`,
                      "title": buttonTitle                   
                    }]      
                  }
                  resultCarousel.message.attachment.payload.elements.push(element);
                  num = num+1;
                  if(num == relt.size){
                    sendMessage(resultCarousel);
                  }
                })
              }else{
                if(e == 'buy'){
                  var payload = 'buySellMenu';
                }else{
                  var payload = 'rentMenu';
                }
                var reltMessage = {
                  "recipient": {
                    "id": senderId
                  },
                  "message": {
                    "text": "No properties are available with your preferences for now, Please check back later! Sorry for the inconvenience!",
                    "quick_replies":[
                      {
                        content_type: "text",
                        title: "Home",
                        payload: "Hi"
                      }, {
                        content_type: "text",
                        title: "Keep searching",
                        payload: payload
                      }
                    ]
                  }
                }
                sendMessage(reltMessage);
              }
            }).catch(err => {
              console.log(err);
            })
          }
        }

        //sell rent house
        if(userInput.includes('sellHouse/') || userInput.includes('makeRentHouse/')){
          userInput = userInput.split('/');
          if(userInput.length == 2){
            userInput = userInput.join('/');
            resp.message = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "Please choose type of house",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "RC Type",
                      "payload": `${userInput}/RC`
                    },{
                      "type": "postback",
                      "title": "Other Types",
                      "payload": `${userInput}/other`
                    }
                  ]
                }
              }
            }
          }
          if(userInput.length == 3){
            resp.message = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "Please choose area of house",
                  "buttons": [
                    
                  ]
                }
              }
            }
            var button1 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            var button2 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            var button3 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            if(userInput[1] == "ottara"){
                userInput = userInput.join('/');
                button1.title = "80*80";
                button1.payload = `${userInput}/80x80`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "100*100";
                button2.payload = `${userInput}/100x100`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "150*150";
                button3.payload = `${userInput}/150x150`;
                resp.message.attachment.payload.buttons.push(button3);            
            }
            if(userInput[1] == "pobba"){
                userInput = userInput.join('/');
                button1.title = "40*60";
                button1.payload = `${userInput}/40x60`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "60*80";
                button2.payload = `${userInput}/60x80`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "80*80";
                button3.payload = `${userInput}/80x80`;
                resp.message.attachment.payload.buttons.push(button3);
            }
            if(userInput[1] == "dekkhina"){
                userInput = userInput.join('/');
                button1.title = "60*80";
                button1.payload = `${userInput}/60x80`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "80*80";
                button2.payload = `${userInput}/80x80`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "100*100";
                button3.payload = `${userInput}/100x100`;
                resp.message.attachment.payload.buttons.push(button3);
              
            }
            if(userInput[1] == "zaya"){
                userInput = userInput.join('/');
                button1.title = "40*60";
                button1.payload = `${userInput}/40x60`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "60*80";
                button2.payload = `${userInput}/60x80`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "Ohter Areas";
                button3.payload = `${userInput}/other`;
                resp.message.attachment.payload.buttons.push(button3);
            }
            if(userInput[1] == "zabu"){
                userInput = userInput.join('/');
                button1.title = "60*60";
                button1.payload = `${userInput}/60x60`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "100*100";
                button2.payload = `${userInput}/100x100`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "Ohter Areas";
                button3.payload = `${userInput}/other`;
                resp.message.attachment.payload.buttons.push(button3);
              
            }

            if(userInput[1] == "pyinmana"){
                userInput = userInput.join('/');
                resp.message = {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "generic",
                      "elements":[
                        {
                          "title":"House Area",
                          "buttons":[{
                            "type": "postback",
                            "title": "40*60",
                            "payload": `${userInput}/40x60`
                          },{
                            "type": "postback",
                            "title": "60*72",
                            "payload": `${userInput}/60x72`
                          }]      
                        },{
                          "title":"House Area",
                          "buttons":[{
                            "type": "postback",
                            "title": "60*80",
                            "payload": `${userInput}/60x80`
                          },{
                            "type": "postback",
                            "title": "Other Areas",
                            "payload": `${userInput}/other`
                          }]      
                        }
                      ]
                    }
                  }
                }
            }
          }
          if(userInput.length == 4){
            if(userInput[0].includes('sell')){
              var lt = 'sell'
            }else{
              var lt = 'rent'
            }
                resp.message = {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "button",
                      "text": `House Type: ${userInput[2]} \nTownship: ${userInput[1]} \nArea: ${userInput[3]} \nAre the following details correct?`,
                      "buttons":[{
                            "type": "web_url",
                            "url": `https://duwon.herokuapp.com/listing?token=${senderId}&town=${userInput[1]}&type=house&area=${userInput[3]}&bt=${userInput[2]}&lt=${lt}`,
                            "title": "Yes",
                          },{
                            "type": "postback",
                            "title": "Cancel",
                            "payload": `${userInput[0]}`
                          }
                      ]
                    }
                  }
                }
          }
        }

        if(userInput.includes('sellLand/') || userInput.includes('makeRentLand/')){
          userInput = userInput.split('/');
          if(userInput.length == 2){
            resp.message = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "Please choose area of land",
                  "buttons": [
                    
                  ]
                }
              }
            }
            var button1 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            var button2 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            var button3 = {
              "type": "postback",
              "title": "",
              "payload": ""
            }
            if(userInput[1] == "ottara"){
                userInput = userInput.join('/');
                button1.title = "80*80";
                button1.payload = `${userInput}/80x80`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "100*100";
                button2.payload = `${userInput}/100x100`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "150*150";
                button3.payload = `${userInput}/150x150`;
                resp.message.attachment.payload.buttons.push(button3);            
            }
            if(userInput[1] == "pobba"){
                userInput = userInput.join('/');
                button1.title = "40*60";
                button1.payload = `${userInput}/40x60`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "60*80";
                button2.payload = `${userInput}/60x80`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "80*80";
                button3.payload = `${userInput}/80x80`;
                resp.message.attachment.payload.buttons.push(button3);
            }
            if(userInput[1] == "dekkhina"){
                userInput = userInput.join('/');
                button1.title = "60*80";
                button1.payload = `${userInput}/60x80`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "80*80";
                button2.payload = `${userInput}/80x80`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "100*100";
                button3.payload = `${userInput}/100x100`;
                resp.message.attachment.payload.buttons.push(button3);
              
            }
            if(userInput[1] == "zaya"){
                userInput = userInput.join('/');
                button1.title = "40*60";
                button1.payload = `${userInput}/40x60`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "60*80";
                button2.payload = `${userInput}/60x80`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "Ohter Areas";
                button3.payload = `${userInput}/other`;
                resp.message.attachment.payload.buttons.push(button3);
            }
            if(userInput[1] == "zabu"){
                userInput = userInput.join('/');
                button1.title = "60*60";
                button1.payload = `${userInput}/60x60`;
                resp.message.attachment.payload.buttons.push(button1);
                button2.title = "100*100";
                button2.payload = `${userInput}/100x100`;
                resp.message.attachment.payload.buttons.push(button2);
                button3.title = "Ohter Areas";
                button3.payload = `${userInput}/other`;
                resp.message.attachment.payload.buttons.push(button3);
              
            }

            if(userInput[1] == "pyinmana"){
                userInput = userInput.join('/');
                resp.message = {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "generic",
                      "elements":[
                        {
                          "title":"House Area",
                          "buttons":[{
                            "type": "postback",
                            "title": "40*60",
                            "payload": `${userInput}/40x60`
                          },{
                            "type": "postback",
                            "title": "60*72",
                            "payload": `${userInput}/60x72`
                          }]      
                        },{
                          "title":"House Area",
                          "buttons":[{
                            "type": "postback",
                            "title": "60*80",
                            "payload": `${userInput}/60x80`
                          },{
                            "type": "postback",
                            "title": "Other Areas",
                            "payload": `${userInput}/other`
                          }]      
                        }
                      ]
                    }
                  }
                }
            }
          }
          if(userInput.length == 3){
            if(userInput[0].includes('sell')){
              var lt = 'sell'
            }else{
              var lt = 'rent'
            }
                resp.message = {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "button",
                      "text": `Township: ${userInput[1]} \nArea: ${userInput[2]} \nAre the following details correct?`,
                      "buttons":[{
                            "type": "web_url",
                            "url": `https://duwon.herokuapp.com/listing?token=${senderId}&town=${userInput[1]}&type=land&area=${userInput[2]}&lt=${lt}`,
                            "title": "Yes",
                          },{
                            "type": "postback",
                            "title": "Cancel",
                            "payload": `${userInput[0]}`
                          }
                      ]
                    }
                  }
                }
          }
        }
        if(userInput.includes('/') && movesession.includes(senderId)){
          console.log('within dates');
          userInput = userInput.split('/');
          if(!isNaN(userInput[0]) && !isNaN(userInput[1]) && !isNaN(userInput[2])){
            var delIndex = movesession.indexOf(senderId);
            
            resp.message.text = "We are processing your appointment. We will get back to you soon. Thank you for working with our service";
            db.collection('houseMovingOrder').add({
              customerId: senderId,
              start: locations[delIndex][0],
              end: locations[delIndex][1],
              car: locations[delIndex][2],
              date: userInput
            }).then(success=>{
              locations[delIndex] = success.id;
              resp.message.text = "Success! Please share us your phone number to give you a call";
              resp.message.quick_replies = [
                {
                  content_type: "user_phone_number"
                }
              ]
              sendMessage(resp);
            })
          }else{
            resp.message.text = "Invalid date format, Please try again";
            resp.message.quick_replies = [
              {
                content_type: "text",
                title: "Cancel",
                payload:"Hi"
              }
            ]
          }
        }
        sendMessage(resp);
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

app.get('/perstmenu', function(req,res){
  requestify.post('https://graph.facebook.com/v7.0/me/messenger_profile?access_token='+PAGE_ACCESS_TOKEN, {
    "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "Main Menu",
                    "payload": "Hi"
                }
            ]
        }
    ]
  }).then(function(success){
    res.send(JSON.stringify(success))
  }).fail(function(err){
    res.send(JSON.stringify(err));
  })
})

app.get('/perstmenuadmin', function(req,res){
  requestify.post('https://graph.facebook.com/v7.0/me/messenger_profile?access_token='+PAGE_ACCESS_TOKEN, {
    "psid": "2369735496465987",
    "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "Main Menu",
                    "payload": "Hi"
                }, {
                    "type": "postback",
                    "title": "Admin Menu",
                    "payload": "admin"
                }, {
                    "type": "postback",
                    "title": "Custom Search",
                    "payload": "customOrder"
                }
            ]
        }
    ]
  }).then(function(success){
    res.send(JSON.stringify(success))
  }).fail(function(err){
    res.send(JSON.stringify(err));
  })
})

app.get('/perstmenutest', function(req,res){
  requestify.post('https://graph.facebook.com/v7.0/me/messenger_profile?access_token='+PAGE_ACCESS_TOKEN, {
    "psid": "3036525836408205",
    "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "Main Menu",
                    "payload": "Hi"
                }, {
                    "type": "postback",
                    "title": "Test Menu",
                    "payload": "admin"
                }
            ]
        }
    ]
  }).then(function(success){
    res.send(JSON.stringify(success))
  }).fail(function(err){
    res.send(JSON.stringify(err));
  })
})

app.get('/listing', (req, res) => {
  var senderId = req.query.token;
  var town = req.query.town;
  var propType = req.query.type;
  var listType = req.query.lt;
  if(propType == 'house'){
    var houseType = req.query.bt;
  }else{
    var houseType = '';
  }
  var area = req.query.area;
  res.render('list', {senderId: senderId, town: town, propType: propType, area: area, houseType: houseType, listType: listType});
});

app.post('/notifyAdmin', function(req,res){
  var resp = {
    "recipient": {
      "id": "2369735496465987"
    },
    "message": {
      "text": `A user has made a new sell/rent listing. \nplease check the following document in database: ${req.body.databaseId}`
    }
  }
  sendMessage(resp)
  res.json({right: 'right'});
})

app.get('/property', (req, res) => {
  var id = req.query.id;
  var e = req.query.e;
  db.collection('property').doc(`${id}`).get().then(propDetails => {
    propDetails = propDetails.data();
    var floor = propDetails.floor || '-';
    var houseType = propDetails.houseType || '-';
    var area = propDetails.area || '-';
    var renderData = {Image: propDetails.Image, address: propDetails.address, area: area, desc: propDetails.desc, floor: floor, houseType: houseType, township: propDetails.township, title: propDetails.title}
    if(e == 'buy'){
      renderData.price = propDetails.sellPrice
    }else{
      renderData.price = propDetails.rentPrice
    }
    res.render('propertyProfile', renderData);
  }).catch(err => {
    console.log(err)
    res.send('Cannot find property!')
  })
})

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

function sendMessage(body){
  requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token='+PAGE_ACCESS_TOKEN, body).then(success=>{
    if(success.code !== 200){
      console.log(success.getBody());
    }
  })
}