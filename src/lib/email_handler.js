const mailjet = require ('node-mailjet')
.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

exports.send = (options, callBack) => {
    
    mailjet
    .post("send", {'version': 'v3.1'})
    .request(options).then((result) => {
        console.log(result.body.Messages[0].To)
        return callBack(null, result);
    })
    .catch((err) => {
        console.log(err.statusCode)
        return callBack(err, null);
    })
}
