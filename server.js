var express = require('express');
var firebase = require('firebase');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()); //need to parse HTTP request body

var config = {
	databaseURL: "https://github-16af1.firebaseio.com/",
	type: "service_account",
	project_id: "github-16af1",
	private_key_id: "f7c7e20d89afa8ef64a19c5520d799b462e9047c",
	private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCts26YX0/UIgdj\nGVWZMy8QKQj7JCyzPEF8qZWhNz4kSE8+5KiIsQr3m3uejHFM6TpuU4RMAYJYrQJc\nrUtrjsUVsUcrgY27ZZAEUdfVlYLKV8ecKQkR/jprFyiLpBtQsMT6UprIVulzhsSr\nLDupt/DmI9qeI2VnDX+EQbQaOlXUZSUgZ5L0lXO0Z2qbm2Shtb0EjxNN3s3PoGCT\nP3J/YTCf62rBkjlDvIuv7dxPEugIhdialrT75OZNRNPukUF/7jSvfUb7Nuo+w3fO\nFFssNvWXG3c17+qBGjV3f8oIw9Xv4nBPeMKO76oEtiDDxIyb7tN9N/8iUz36BO2o\n+4U9zSy3AgMBAAECggEAHkONiOHOXFUDeXowBk27LPMhW/RtD1t3w3selWS1IIgy\nunAHhy1ljkeaTcEFepOGOTO28LEwnzehmjkdU2OgJgvprQRZB+YFpiMGWnG+xHdv\n0V769BYZ4o+54j6Y/cGWyFB9JFu0OAsql/JQgN0KDWcAz522LLLW3Vm/QfSZALTG\nh9e+bODuDNM5PZ1iJ6A8I/QNSkuydowbpQiLdHT5ChzZz4gF10RoJPRIGoOyN0v5\nTI4PrxtVcjsafD+KzTSxO578j16GZMyZlk4tz2SO0qqyyKqwpeE64vmjuq9cizkU\n5vU95AVwDmzxSP7VF5Kh5hfFWcp2xhfs3n6gynt3TQKBgQDyLcIpTR5TMknZUKJl\no8sVjV9W0KSL98nFGn9ojVmuaRxJgtlhJmUFLYRunuoxefLXNOvssef0Eod290tl\nT4Li+Iv6r0QyoLW0m7O6ySeKZcrSA4qrVCDvAEk305EQzP//i+0E2g6uRx57Bnyh\nDuQ/NGCq5c4pgC+Cl5i/pSh23QKBgQC3nTWiDF5jbO8UJj8NQCiD+ItN6Dnkhs/M\nccjZnp5FOB+EgtkkiX0/p6cXvD9uLMZmje+miEUO5EP9K2uuXmnaIb7Q3jC2lC2R\nRSXlNsi/LueICCKEvhxbMCoUKBpn5t0xAyt/FRA+EpAzB7NgRTQRUIE/6VjBMkmq\nXzRyPLSWowKBgQCssT6MDwb50plgkqRLECKICtiaYouDl71UhRGnb2ws950JOnpi\nUWul5pBSBZYAk/I7zewSS8aYgAIDLlKgOrOdwBipOQPLilgoIwNlxX0hrnaTjZz7\nkTEu3KhZW89NCLHf+1qXpBrl4ab1mWmTu7e87k+kbdy2MUcvu4Rb3JzfLQKBgASM\nESL1OXUu4nDWTaNvXlF+WzzPrndZW1YNz1KMWhEOxcELWINOIFruNPYihFOfKj6p\n7zBpmYQ35PMlGyKTVf2/7jDP/9bVrpc1Zi3aAHizmapFwU0WRC+B7tjW8Wh3UC0B\njhc0l1ViMk4BN9D/hb2UB89kYP1P2IEuoGbf1/0PAoGAWRPqNwbFdxJH+KEI4bwv\nW57e2+TcXoyfHi+2vlF2V9Bm/Lr9Tu/pZ/VV1sdcUCWziFEKFHaRqJdW1AVv7L91\n1zNTJ9l2Zg6x0jkdkNR/4gW/DXcfc8EXHywGf7Jw/4mYcXSuW9cwUvoBRkk6/OHO\neaT4Lz4beL2au2d0AIPDbgU=\n-----END PRIVATE KEY-----\n",
	client_email: "firebase-adminsdk-9uat0@github-16af1.iam.gserviceaccount.com",
	client_id: "111640328595533286807",
	auth_uri: "https://accounts.google.com/o/oauth2/auth",
	token_uri: "https://oauth2.googleapis.com/token",
	auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
	client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9uat0%40github-16af1.iam.gserviceaccount.com"
}
  
firebase.initializeApp(config);
  
//Fetch instances
app.get('/', function (req, res) {

	console.log("HTTP Get Request");
	var userReference = firebase.database().ref("/users/");

	//Attach an asynchronous callback to read the data
	userReference.once("value", 
			  function(snapshot) {
					console.log(snapshot.val());
					res.json(snapshot.val());
					userReference.off("value");
					}, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 });
});

//Create new instance
app.put('/', function (req, res) {

	console.log("HTTP Put Request");

	var userName = req.body.UserName;
	var name = req.body.Name;
	var age = req.body.Age;
	console.log(req.body);
	
	var referencePath = '/users/data/0/';
	var userReference = firebase.database().ref(referencePath);
	userReference.set({Name: name, Age: age}, 
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					} 
					else {
						res.send("Data saved successfully.");
					}
			});
});

//Update existing instance
app.post('/', function (req, res) {

	console.log("HTTP POST Request");

	var userName = req.body.UserName;
	var name = req.body.Name;
	var age = req.body.Age;

	var referencePath = '/Users/'+userName+'/';
	var userReference = firebase.database().ref(referencePath);
	userReference.update({Name: name, Age: age}, 
				 function(error) {
					if (error) {
						res.send("Data could not be updated." + error);
					} 
					else {
						res.send("Data updated successfully.");
					}
			    });
});

//Delete an instance
app.delete('/', function (req, res) {

   console.log("HTTP DELETE Request");
   var userName = req.body.UserName;
	var name = req.body.Name;
	var age = req.body.Age;

	var referencePath = '/Users/'+userName+'/';
	var userReference = firebase.database().ref(referencePath);
    userReference.remove()
    .then(function() {
        console.log("Remove succeeded.")
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message)
      });
   
});

var server = app.listen(8080, function () {
  
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});