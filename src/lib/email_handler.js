const mailjet = require ('node-mailjet')
.connect('958ce269cb616232310461cc1ca58f4f', 'd84991decaecfd1a5c13d8d60abfc631')

exports.send = (options, callBack) => {
    
    mailjet
    .post("send", {'version': 'v3.1'})
    .request(options).then((result) => {
        console.log(result.body)
        return callBack(null, result);
    })
    .catch((err) => {
        console.log(err.statusCode)
        return callBack(err, null);
    })
}
