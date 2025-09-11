function sendmail(fileNmme, name, email, mailSubject) {
  console.log(name, email);

  var transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAILID,
      pass: process.env.PASSWORD,
    },
  });

  const subject = mailSubject;
  const template = handlebars.compile(
    fs.readFileSync(path.join(__dirname, "templates/", fileNmme), "utf8")
  );
  const html = template({ name: name, email: email });
  const to = email;
  const from = process.env.EMAILID;

  const mailOptions = {
    from,
    to,
    subject,
    html,
  };

  // replace this url with the link to the email verification page of your front-end app

  //   await sendEmail(to, subject, html);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("sent");
    }
  });
}

module.exports = { sendmail };
