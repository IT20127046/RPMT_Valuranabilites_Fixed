const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../models/users");
const DOMPurify = require("dompurify");
const notify = express.Router();
const he = require("he");

//send email to group students
notify.post("/submitiont/email", (req, res) => {
  let gId = req.body.groupId;

  User.find({ groupId: gId }, function (err, allUsers) {
    if (err) {
      console.log(err);
    }
    var mailList = [];
    allUsers.forEach(function (users) {
      mailList.push(users.email);
      return mailList;
    });
    // var smtpTransport = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //         user:"",
    //         pass:""
    //     }
    // });

    var smtpTransport = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      secureConnection: false,
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // var mailOptions = {
    //         to: [],
    //         bcc: mailList,
    //         from: process.env.MAIL_FROM,
    //         subject: req.body.subject,

    //   html: `
    //   <div style="padding:10px;border-style: ridge">
    //   <h1>SLIIT</h1>
    //   <h3>Research Team</h3>

    //      <p> <strong> ${req.body.subject} </strong></p>

    //       <p>${req.body.groupId} Students, your ${req.body.type} session will
    //        be held on ${req.body.date} from ${req.body.from} to ${req.body.to} with the ${req.body.panel}.
    //         Your participation is mandatory. You can connect via the link below.</p>

    //         <a href=${req.body.link}>Click Here</a>

    //   `

    //     };

    const escapeHtml = (unsafe) => {
      return he.encode(unsafe);
    };

    var mailOptions = {
      to: [],
      bcc: mailList,
      from: process.env.MAIL_FROM,
      subject: escapeHtml(req.body.subject), // Sanitize and escape subject
      html: `
          <div style="padding:10px;border-style: ridge">
            <h1>SLIIT</h1>
            <h3>Research Team</h3>
            
            <p> <strong> ${escapeHtml(
              req.body.subject
            )} </strong></p> <!-- Sanitize and escape subject -->
            
            <p>${escapeHtml(req.body.groupId)} Students, your ${escapeHtml(
        req.body.type
      )} session will
               be held on ${escapeHtml(req.body.date)} from ${escapeHtml(
        req.body.from
      )} to ${escapeHtml(req.body.to)} with the ${escapeHtml(req.body.panel)}.
               Your participation is mandatory. You can connect via the link below.</p>
            
            <a href="${escapeHtml(
              req.body.link
            )}">Click Here</a> <!-- Sanitize and escape link -->
          `,
    };

    smtpTransport.sendMail(mailOptions, function (err) {
      if (err) {
        console.log(err);
        res.json({ success: false, respMesg: "Email Sent is not Successful" });
      } else {
        console.log("mail sent to " + mailList);
        res.json({ status: true, respMesg: "Email Sent Successfully" });
      }
    });
  });
});

//send email to all students
notify.post("/submitiontype/email", (req, res) => {
  User.find({ type: "Student" }, function (err, allUsers) {
    if (err) {
      console.log(err);
    }
    var mailList = [];
    allUsers.forEach(function (users) {
      mailList.push(users.email);
      return mailList;
    });
    // var smtpTransport = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //         user:"",
    //         pass:""
    //     }
    // });

    var smtpTransport = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      secureConnection: false,
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // var mailOptions = {
    //         to: [],
    //         bcc: mailList,
    //         from: process.env.MAIL_FROM,
    //         subject: req.body.subject,

    //   html: `
    //   <div style="padding:10px;border-style: ridge">
    //   <h1>SLIIT</h1>
    //   <h3>Research Team</h3>

    //      <p> <strong> ${req.body.subject} </strong></p>

    //       <p>${req.body.text}</p>

    //   `

    //     };

    var mailOptions = {
      to: [],
      bcc: mailList,
      from: process.env.MAIL_FROM,
      subject: req.body.subject,
      html: `
      <div style="padding:10px;border-style: ridge">
          <h1>SLIIT</h1>
          <h3>Research Team</h3>
          <p><strong>${DOMPurify.sanitize(req.body.subject)}</strong></p>
          <p>${DOMPurify.sanitize(req.body.text)}</p>
      </div>
  `,
    };

    smtpTransport.sendMail(mailOptions, function (err) {
      if (err) {
        console.log(err);
        res.json({ success: false, respMesg: "Email Sent is not Successful" });
      } else {
        console.log("mail sent to " + mailList);
        res.json({ success: true, respMesg: "Email Sent Successfully" });
      }
    });
  });
});

module.exports = notify;
