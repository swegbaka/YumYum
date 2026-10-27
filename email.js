const nodemailer = require("nodemailer");

const sendemail = async (options) => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //option: activate in gmail less secure app option resulting spammer detection
  });

  //define email options
  const mailOption = {
    from: "test sweg <hello@madi.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //send the email
  await transporter.sendMail(mailOption);
};

module.exports = sendemail;
