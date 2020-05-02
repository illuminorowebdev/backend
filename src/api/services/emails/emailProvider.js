const nodemailer = require("nodemailer");
const Email = require("email-templates");

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "support@your-app.com",
    },
    // uncomment below to send emails in development/test env:
    send: true,
    //transport: transporter,
  });

  email
    .send({
      template: "passwordReset",
      message: {
        to: passwordResetObject.userEmail,
      },
      locals: {
        productName: "Test App",
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `https://your-app/new-password/view?resetToken=${passwordResetObject.resetToken}`,
      },
    })
    .catch(() => console.log("error sending password reset email"));
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "support@your-app.com",
    },
    // uncomment below to send emails in development/test env:
    send: true,
    //transport: transporter,
  });

  email
    .send({
      template: "passwordChange",
      message: {
        to: user.email,
      },
      locals: {
        productName: "Test App",
        name: user.name,
      },
    })
    .catch(() => console.log("error sending change password email"));
};
