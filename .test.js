require('dotenv').config({ path: "./.env" });
const MJ_APIKEY_PUBLIC = process.env.MJ_APIKEY_PUBLIC || "958ce269cb616232310461cc1ca58f4f";
const MJ_APIKEY_PRIVATE = process.env.MJ_APIKEY_PRIVATE || "d84991decaecfd1a5c13d8d60abfc631";

const mailjet = require ('node-mailjet')
	.connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE)
const request = mailjet
	.post("send", {'version': 'v3.1'})
	.request({
		"Messages":[
			{
				"From": {
					"Email": "mail@thehouseinterior.com",
					"Name": "Future Furnitures"
				},
				"To": [
					{
						"Email": "mail@thehouseinterior.com",
					    "Name": "Future Furnitures"
					}
				],
				"TemplateID": 3515504,
				"TemplateLanguage": true,
				"Subject": "Welcome to Future Furniture, Get to build your furniture",
				"Variables": {
      "name": "Friend"
    }
			}
		]
	})
request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})