export const registrationEmailTemplate = `<!DOCTYPE html>
<html>

<head>
  <title>Give Back Cincinnati Event Registration</title>
  <style>
    a {
      color: #d03236;
    }

    body {
      font-family: Arial, sans-serif;
      margin: 0;
      background-color: #FFFFFF;
    }

    .header {
      background-color: #FFFFFF;
      text-align: center;
    }

    .header img {
      background-color: #FFFFFF;
    }

    .eventHeader {
      background-color: #d03236;
      background-image: url(https://givebackcincinnati.org/bank-note.svg);
      background-repeat: repeat;
      background-size: 50px 10px;
      background-position: bottom;
      text-align: center;
      color: #FFFFFF;
      padding: 15px;
    }

    .content {
      margin: 20px;
    }

    .footer {
      background-color: #333333;
      padding: 20px;
      text-align: center;
      color: #FFFFFF;
    }

    @media (prefers-color-scheme: dark) {
      .header {
        background-color: #FFFFFF;
      }

      .eventHeader {
        color: #FFFFFF;
      }

      .footer {
        background-color: #333333;
        padding: 20px;
        text-align: center;
        color: #FFFFFF;
      }
    }
  </style>
</head>

<body>
  <div class="header">
    <img src="https://givebackcincinnati.org/logos/half_circle.svg" />
  </div>
  <div class="eventHeader">
    <h2>{{ event_name }}</h2>
  </div>
  <div class="content">
    <p>Hi {{ name }},</p>
    <p>
      We're excited for you to join us at {{ event_name }}!
    </p>
    <p>
      As we finalize event details, please stay tuned for any updates and additional information. We'll keep you
      informed about the agenda on our website and you'll receive an email the shortly before with final details.
    </p>
    <p>
      If you have any immediate questions or concerns, feel free to reach out to us at <a
        href="mailto:operations-vp@givebackcincinnati.org">operations-vp@givebackcincinnati.org</a>. Thanks for being a
      part of our mission!
    </p>
  </div>
  <div class="footer">
    <h2>Give Back Cincinnati</h2>
  </div>
</body>

</html>
`
