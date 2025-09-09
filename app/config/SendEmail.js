require("dotenv").config();

const nodemailer = require("nodemailer");

const sendMail = async (email, mailSubject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: mailSubject,
      html: content,
    };

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: " + info.response);
        }
    })

  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
