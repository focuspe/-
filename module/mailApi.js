var nodemailer = require('nodemailer');
var config = require('../config.json');
var smtpTransport = nodemailer.createTransport({
    host:"smtp.ym.163.com",
    auth:{
        user:config.mail.user,
        pass:config.mail.pass
    }
});

var sendMail = function (to,subject,html){
    var mailOptions ={
		from:config.mail.user,
		to:to,
		subject:subject,
		html:html
	};
    smtpTransport.sendMail(mailOptions,function (err,res) {
        if (err){
			console.log(err);
        }
        else {
			console.log('Message sent: ' + res.message);
        }
        smtpTransport.close();
    });
}

module.exports = sendMail;