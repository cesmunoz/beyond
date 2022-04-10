import { APIGatewayProxyResult } from 'aws-lambda';
import { SES } from 'aws-sdk';
import { ValidAny } from '@beyond/lib/types';
import { ApplicationResponse, created, success, error } from '../../../shared/util/HttpResponse';
import { ApplicationError } from '../../../shared/models/ApplicationError';

const ses = new SES({ apiVersion: '2010-12-01' });

const HtmlPart = `
<html>
<head>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Muli:wght@300;400;500;600;700;800&display=swap" />

  <style>
    @font-face {
      font-family: 'Muli';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/muli/v22/7Auwp_0qiz-afT3GLQjUwkQ1OQ.woff2) format('woff2');
    }
    
    body {
      font-family: 'Muli';
    }

    .header {
      width: 610px;
      height: 25px;
      box-shadow: 0 12px 20px 0 rgba(16, 132, 140, 0.2);
      background-color: #76d8ce;
      padding: 12px 15px 13px 15px
    }

    .title {
      height: 24px;
      font-family: Muli;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      letter-spacing: 1.56px;
      color: #ffffff;
      float: left;
    }

    .greetings {
      height: 24px;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      text-align: right;
      color: #ffffff;
    }

    .content {
      width: 640px;
      height: 697px;
      background: url("https://beyond-public-images.s3-us-west-2.amazonaws.com/clouds.png") no-repeat right 50px/90%, linear-gradient(to bottom, #53c5ba, #f9ffff);
      text-align: center;
    }


    .middle {
      padding-top: 34px;
      padding-bottom: 90px;
    }

    .icon {
      padding-bottom: 29px;
    }

    .content-msg {
      font-size: 34px;
      line-height: 0.88;
      color: #ffffff;
      padding-bottom: 38px;
    }

    .rectangle {
      color: #000000;
      height: 218px;
      border-radius: 10px;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
      background-color: #ffffff;
      margin: 0 84px 0 84px;
      padding: 0 48px 0 48px;
      text-align: center;
    }

    .message {
      width: 376px;
      height: 48px;
      font-size: 18px;
      font-weight: bold;
      line-height: 1.33;
      text-align: center;
      color: #333333;
      padding-top: 42px;
      padding-bottom: 32px;
    }

    .btn {
      width: 236px;
      height: 48px;
      border: 0px;
      border-radius: 10px;
      background-color: #30ddd6;
      font-size: 14px;
      font-weight: 800;
      line-height: 1.14;
      letter-spacing: 1.2px;
      text-align: center;
      color: #ffffff;
      cursor: pointer;
    }

    .footer {
      color: #000000;
      width: 640px;
      height: 172px;
      background-color: #ffffff;
      padding-top: 57px;
      margin-bottom: 62px;
    }

    .contact-us {
      width: 592px;
      height: 15px;
      font-size: 12px;
      text-align: center;
      color: #999999;
      padding-bottom: 23px;
    }

    .contact-link {
      font-weight: bold;
      color: #35bcc5;
    }

    .copyright {
      width: 592px;
      height: 15px;
      font-size: 12px;
      text-align: center;
      color: #999999;
    }
  </style>
</head>
<body>
  <div>
    <div class="header">
      <div class="title">BEYOND</div>
      <div class="greetings">¡Hola, nuevo coachee!</div>
    </div>
    <div class="content">
      <div class="middle">
        <div class="icon">
          <img src="https://beyond-public-images.s3-us-west-2.amazonaws.com/waiting.png" />
        </div>
        <div class="content-msg">¡Un paso más y listo!</div>
        <div class="rectangle">
          <div class="message">Sólo dale click al botón y comienza a usar Beyond</div>
          <div>
            <a href="{{url}}/confirm?email={{email}}&hash={{hash}}" target="_blank">
              <button class="btn">CONFIRMAR EMAIL</button>
            </a>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="contact-us">Si tenes un problema, <span class="contact-link">contáctanos</span></div>
        <div class="copyright">BEYOND Copyright 2020 - Todos los derechos reservados.</div>
      </div>
    </div>
  </div>
</body>

</html>
`;

const NewProcessHtml = `
<html>
<head>
  <meta charset="UTF-8" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Muli:wght@300;400;500;600;700;800&display=swap"
  />

  <style>
    
    @font-face {
      font-family: 'Muli';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/muli/v22/7Auwp_0qiz-afT3GLQjUwkQ1OQ.woff2) format('woff2');
    }
    
    body {
      font-family: 'Muli';
    }

    .header {
      width: 610px;
      height: 25px;
      box-shadow: 0 12px 20px 0 rgba(16, 132, 140, 0.2);
      background-color: #76d8ce;
      padding: 12px 15px 13px 15px;
    }

    .title {
      height: 24px;
      font-family: Muli;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      letter-spacing: 1.56px;
      color: #ffffff;
      float: left;
    }

    .greetings {
      height: 24px;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      text-align: right;
      color: #ffffff;
    }

    .content {
      width: 640px;
      height: 697px;
      background: url('https://beyond-public-images.s3-us-west-2.amazonaws.com/clouds.png')
          no-repeat right 50px/90%,
        linear-gradient(to bottom, #53c5ba, #f9ffff);
      text-align: center;
    }

    .middle {
      padding-top: 34px;
      padding-bottom: 20px;
    }

    .image {
      height: 112px;
      padding-bottom: 29px;
      width: 175px;
    }

    .content-msg {
      font-size: 34px;
      line-height: 0.88;
      color: #ffffff;
      padding-bottom: 38px;
    }

    .rectangle {
      color: #000000;
      height: 396px;
      border-radius: 10px;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
      background-color: #ffffff;
      margin: 0 84px 0 84px;
      padding: 0 48px 0 48px;
      text-align: center;
    }

    .message {
      width: 376px;
      height: 48px;
      font-size: 18px;
      font-weight: bold;
      line-height: 1.33;
      text-align: center;
      color: #333333;
      padding-top: 42px;
      padding-bottom: 32px;
    }

    .instructions {
      color: rgba(0, 0, 0, 0.45);
      margin-bottom: 17px;
      padding-left: 20px;
      padding-right: 10px;
      text-align: left;
    }

    .btn {
      width: 236px;
      height: 48px;
      border: 0px;
      border-radius: 10px;
      background-color: #30ddd6;
      font-size: 14px;
      font-weight: 800;
      line-height: 1.14;
      letter-spacing: 1.2px;
      text-align: center;
      color: #ffffff;
      cursor: pointer;
      margin-top: 16px;
    }

    .footer {
      color: #000000;
      width: 640px;
      height: 172px;
      background-color: #ffffff;
      padding-top: 57px;
      margin-bottom: 62px;
    }

    .contact-us {
      width: 592px;
      height: 15px;
      font-size: 12px;
      text-align: center;
      color: #999999;
      padding-bottom: 23px;
    }

    .contact-link {
      font-weight: bold;
      color: #35bcc5;
    }

    .copyright {
      width: 592px;
      height: 15px;
      font-size: 12px;
      text-align: center;
      color: #999999;
    }
  </style>
</head>

<body>
  <div>
    <div class="header">
      <div class="title">BEYOND</div>
      <div class="greetings">¡Hola, coachee!</div>
    </div>
    <div class="content">
      <div class="middle">
        <div>
          <img
            class="image"
            src="https://beyond-public-images.s3-us-west-2.amazonaws.com/done.png"
          />
        </div>
        <div class="content-msg">Completa tu proceso antes del {{dueDate}}</div>
        <div class="rectangle">
          <div class="message">Tienes hasta el {{dueDate}} para completarlo</div>
          <div class="instructions">
            <span>Antes de comenzar, lee atentamente: </span>
          </div>
          <div class="instructions">
            <span class="instructions-item">
              1. Ten a mano tu partida de nacimiento, te pediremos datos precisos de lugar y hora.
            </span>
          </div>
          <div class="instructions">
            <span class="instructions-item">
              2. {{text}}
            </span>
          </div>
          <div>
            <a href="{{url}}/questions?id={{process}}" target="_blank">
              <button class="btn">COMPLETAR PROCESO</button>
            </a>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="contact-us">
          Si tenes un problema, <span class="contact-link">contáctanos</span>
        </div>
        <div class="copyright">BEYOND Copyright 2020 - Todos los derechos reservados.</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

const FinishedAnswersHtml = `
<html>

<head>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Muli:wght@300;400;500;600;700;800&display=swap" />

  <style>
    @font-face {
      font-family: 'Muli';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/muli/v22/7Auwp_0qiz-afT3GLQjUwkQ1OQ.woff2) format('woff2');
    }
    
    body {
      font-family: 'Muli';
    }

    .header {
      width: 610px;
      height: 25px;
      box-shadow: 0 12px 20px 0 rgba(16, 132, 140, 0.2);
      background-color: #76d8ce;
      padding: 12px 15px 13px 15px
    }

    .title {
      height: 24px;
      font-family: Muli;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      letter-spacing: 1.56px;
      color: #ffffff;
      float: left;
    }

    .greetings {
      height: 24px;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      text-align: right;
      color: #ffffff;
    }

    .content {
      width: 640px;
      height: 697px;
      background: url("https://beyond-public-images.s3-us-west-2.amazonaws.com/clouds.png") no-repeat right 50px/90%, linear-gradient(to bottom, #53c5ba, #f9ffff);
      text-align: center;
    }


    .middle {
      padding-top: 34px;
      padding-bottom: 90px;
    }

    .icon {
      padding-bottom: 29px;
    }

    .content-msg {
      font-size: 34px;
      line-height: 0.88;
      color: #ffffff;
      padding-bottom: 38px;
    }

    .rectangle {
      color: #000000;
      height: 218px;
      border-radius: 10px;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
      background-color: #ffffff;
      margin: 0 84px 0 84px;
      padding: 0 48px 0 48px;
      text-align: center;
    }

    .message {
      width: 376px;
      height: 10px;
      font-size: 18px;
      font-weight: bold;
      line-height: 1.33;
      text-align: center;
      color: #333333;
      padding-top: 42px;
      padding-bottom: 32px;
    }

    .sub-message {
      width: 376px;
      height: 30px;
      font-family: Muli;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 6;
      letter-spacing: normal;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
    }

    .btn {
      width: 236px;
      height: 48px;
      border: 0px;
      border-radius: 10px;
      background-color: #30ddd6;
      font-size: 14px;
      font-weight: 800;
      line-height: 1.14;
      letter-spacing: 1.2px;
      text-align: center;
      color: #ffffff;
      cursor: pointer;
    }

    .footer {
      color: #000000;
      width: 640px;
      height: 172px;
      background-color: #ffffff;
      padding-top: 57px;
      margin-bottom: 62px;
    }

    .contact-us {
      width: 592px;
      height: 15px;
      font-size: 12px;
      text-align: center;
      color: #999999;
      padding-bottom: 23px;
    }

    .contact-link {
      font-weight: bold;
      color: #35bcc5;
    }

    .copyright {
      width: 592px;
      height: 15px;
      font-size: 12px;
      text-align: center;
      color: #999999;
    }
  </style>
</head>

<body>
  <div>
    <div class="header">
      <div class="title">BEYOND</div>
      <div class="greetings">¡Hola, coachee!</div>
    </div>
    <div class="content">
      <div class="middle">
        <div class="icon">
          <img src="https://beyond-public-images.s3-us-west-2.amazonaws.com/tick.png" />
        </div>
        <div class="content-msg">¡Completaste tu proceso!</div>
        <div class="rectangle">
          <div class="message">Tu coach tiene hasta el {{date}} para armar el informe</div>
          <div class="sub-message">Te enviaremos un nuevo mail cuando esté listo.</div>
        </div>
      </div>
      <div class="footer">
        <div class="contact-us">Si tenes un problema, <span class="contact-link">contáctanos</span></div>
        <div class="copyright">BEYOND Copyright 2020 - Todos los derechos reservados.</div>
      </div>
    </div>
  </div>
</body>

</html>
`;

const FinishedAnswersCoachHtml = `
<html>
  <head>
    <meta charset="UTF-8" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Muli:wght@300;400;500;600;700;800&display=swap"
    />

    <style>
      @font-face {
        font-family: 'Muli';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/muli/v22/7Auwp_0qiz-afT3GLQjUwkQ1OQ.woff2) format('woff2');
      }
      
      body {
        font-family: 'Muli';
      }

      .header {
        width: 610px;
        height: 25px;
        box-shadow: 0 12px 20px 0 rgba(16, 132, 140, 0.2);
        background-color: #76d8ce;
        padding: 12px 15px 13px 15px;
      }

      .title {
        height: 24px;
        font-family: Muli;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.71;
        letter-spacing: 1.56px;
        color: #ffffff;
        float: left;
      }

      .greetings {
        height: 24px;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.71;
        text-align: right;
        color: #ffffff;
      }

      .content {
        width: 640px;
        height: 697px;
        background: url('https://beyond-public-images.s3-us-west-2.amazonaws.com/clouds.png')
            no-repeat right 50px/90%,
          linear-gradient(to bottom, #53c5ba, #f9ffff);
        text-align: center;
      }

      .middle {
        padding-top: 34px;
        padding-bottom: 90px;
      }

      .image {
        height: 112px;
        padding-bottom: 29px;
        width: 175px;
      }

      .content-msg {
        font-size: 34px;
        line-height: 0.88;
        color: #ffffff;
        padding-bottom: 38px;
      }

      .rectangle {
        color: #000000;
        height: 250px;
        border-radius: 10px;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
        background-color: #ffffff;
        margin: 0 84px 0 84px;
        padding: 0 48px 0 48px;
        text-align: center;
      }

      .message {
        width: 376px;
        height: 48px;
        font-size: 18px;
        font-weight: bold;
        line-height: 1.33;
        text-align: center;
        color: #333333;
        padding-top: 42px;
        padding-bottom: 32px;
      }

      .instructions {
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 17px;
        padding-left: 20px;
        padding-right: 10px;
        text-align: left;
      }

      .btn {
        width: 236px;
        height: 48px;
        border: 0px;
        border-radius: 10px;
        background-color: #30ddd6;
        font-size: 14px;
        font-weight: 800;
        line-height: 1.14;
        letter-spacing: 1.2px;
        text-align: center;
        color: #ffffff;
        cursor: pointer;
        margin-top: 16px;
      }

      .footer {
        color: #000000;
        width: 640px;
        height: 172px;
        background-color: #ffffff;
        padding-top: 57px;
        margin-bottom: 62px;
      }

      .contact-us {
        width: 592px;
        height: 15px;
        font-size: 12px;
        text-align: center;
        color: #999999;
        padding-bottom: 23px;
      }

      .contact-link {
        font-weight: bold;
        color: #35bcc5;
      }

      .copyright {
        width: 592px;
        height: 15px;
        font-size: 12px;
        text-align: center;
        color: #999999;
      }
    </style>
  </head>

  <body>
    <div>
      <div class="header">
        <div class="title">BEYOND</div>
        <div class="greetings">¡Hola, coach!</div>
      </div>
      <div class="content">
        <div class="middle">
          <div>
            <img
              class="image"
              src="https://beyond-public-images.s3-us-west-2.amazonaws.com/done.png"
            />
          </div>
          <div class="content-msg">{{coachee}} terminó su proceso</div>
          <div class="rectangle">
            <div class="message">Tienes hasta el {{dueDate}} para armar el informe</div>            
            <div>
              <a href="{{url}}/processes?id={{processId}}" target="_blank">
                <button class="btn">IR AL PROCESO</button>
              </a>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="contact-us">
            Si tenes un problema, <span class="contact-link">contáctanos</span>
          </div>
          <div class="copyright">BEYOND Copyright 2020 - Todos los derechos reservados.</div>
        </div>
      </div>
    </div>
  </body>
</html>
`;

const ReminderProcessHtml = `
<html>
<head>
  <meta charset="UTF-8" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Muli:wght@300;400;500;600;700;800&display=swap"
  />

  <style>
    @font-face {
      font-family: 'Muli';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/muli/v22/7Auwp_0qiz-afT3GLQjUwkQ1OQ.woff2) format('woff2');
    }
    
    body {
      font-family: 'Muli';
    }

    .header {
      width: 610px;
      height: 25px;
      box-shadow: 0 12px 20px 0 rgba(16, 132, 140, 0.2);
      background-color: #76d8ce;
      padding: 12px 15px 13px 15px;
    }

    .title {
      height: 24px;
      font-family: Muli;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      letter-spacing: 1.56px;
      color: #ffffff;
      float: left;
    }

    .greetings {
      height: 24px;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      text-align: right;
      color: #ffffff;
    }

    .content {
      width: 640px;
      height: 800px;
      background: url('https://beyond-public-images.s3-us-west-2.amazonaws.com/clouds.png')
          no-repeat right 50px/90%,
        linear-gradient(to bottom, #53c5ba, #f9ffff);
      text-align: center;
    }

    .middle {
      padding-top: 34px;
      padding-bottom: 90px;
    }

    .image {
      height: 112px;
      padding-bottom: 29px;
      width: 175px;
    }

    .content-msg {
      font-size: 34px;
      line-height: 0.88;
      color: #ffffff;
      padding-bottom: 38px;
    }

    .rectangle {
      color: #000000;
      height: 396px;
      border-radius: 10px;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
      background-color: #ffffff;
      margin: 0 84px 0 84px;
      padding: 0 48px 0 48px;
      text-align: center;
    }

    .message {
      width: 376px;
      height: 48px;
      font-size: 18px;
      font-weight: bold;
      line-height: 1.33;
      text-align: center;
      color: #333333;
      padding-top: 42px;
      padding-bottom: 32px;
    }

    .instructions {
      color: rgba(0, 0, 0, 0.45);
      margin-bottom: 17px;
      padding-left: 20px;
      padding-right: 10px;
      text-align: left;
    }

    .btn {
      width: 236px;
      height: 48px;
      border: 0px;
      border-radius: 10px;
      background-color: #30ddd6;
      font-size: 14px;
      font-weight: 800;
      line-height: 1.14;
      letter-spacing: 1.2px;
      text-align: center;
      color: #ffffff;
      cursor: pointer;
      margin-top: 16px;
    }

    .footer {
      color: #000000;
      width: 640px;
      height: 172px;
      background-color: #ffffff;
      padding-top: 57px;
      margin-bottom: 62px;
    }

    .contact-us {
      width: 592px;
      height: 15px;
      font-size: 12px;
      text-align: center;
      color: #999999;
      padding-bottom: 23px;
    }

    .contact-link {
      font-weight: bold;
      color: #35bcc5;
    }

    .copyright {
      width: 592px;
      height: 15px;
      font-size: 12px;
      text-align: center;
      color: #999999;
    }
  </style>
</head>

<body>
  <div>
    <div class="header">
      <div class="title">BEYOND</div>
      <div class="greetings">¡Hola!</div>
    </div>
    <div class="content">
      <div class="middle">
        <div>
          <img
            class="image"
            src="https://beyond-public-images.s3-us-west-2.amazonaws.com/done.png"
          />
        </div>
        <div class="content-msg">Recorda de completar tu proceso</div>
        <div class="content-msg">antes del {{dueDate}}</div>
        <div class="rectangle">
          <div class="message">Tienes hasta el {{dueDate}} para completarlo</div>
          <div class="instructions">
            <span>Antes de comenzar, lee atentamente: </span>
          </div>
          <div class="instructions">
            <span class="instructions-item">
              1. Ten a mano tu partida de nacimiento, te pediremos datos precisos de lugar y hora.
            </span>
          </div>
          <div class="instructions">
            <span class="instructions-item">
              2. {{text}}
            </span>
          </div>
          <div>
            <a href="{{url}}/questions?id={{process}}" target="_blank">
              <button class="btn">COMPLETAR PROCESO</button>
            </a>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="contact-us">
          Si tenes un problema, <span class="contact-link">contáctanos</span>
        </div>
        <div class="copyright">BEYOND Copyright 2020 - Todos los derechos reservados.</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

const CollaboratorProcessHtml = `
<html>
  <head>
    <meta charset="UTF-8" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Muli:wght@300;400;500;600;700;800&display=swap"
    />

    <style>
      @font-face {
        font-family: 'Muli';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/muli/v22/7Auwp_0qiz-afT3GLQjUwkQ1OQ.woff2) format('woff2');
      }
      
      body {
        font-family: 'Muli';
      }

      .header {
        width: 610px;
        height: 25px;
        box-shadow: 0 12px 20px 0 rgba(16, 132, 140, 0.2);
        background-color: #76d8ce;
        padding: 12px 15px 13px 15px;
      }

      .title {
        height: 24px;
        font-family: Muli;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.71;
        letter-spacing: 1.56px;
        color: #ffffff;
        float: left;
      }

      .greetings {
        height: 24px;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.71;
        text-align: right;
        color: #ffffff;
      }

      .content {
        width: 640px;
        height: 697px;
        background: url('https://beyond-public-images.s3-us-west-2.amazonaws.com/clouds.png')
            no-repeat right 50px/90%,
          linear-gradient(to bottom, #53c5ba, #f9ffff);
        text-align: center;
      }

      .middle {
        padding-top: 34px;
        padding-bottom: 90px;
      }

      .image {
        height: 112px;
        padding-bottom: 29px;
        width: 175px;
      }

      .content-msg {
        font-size: 34px;
        line-height: 0.88;
        color: #ffffff;
        padding-bottom: 38px;
      }

      .rectangle {
        color: #000000;
        height: 290px;
        border-radius: 10px;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
        background-color: #ffffff;
        margin: 0 84px 0 84px;
        padding: 0 48px 0 48px;
        text-align: center;
      }

      .message {
        width: 376px;
        height: 48px;
        font-size: 18px;
        font-weight: bold;
        line-height: 1.33;
        text-align: center;
        color: #333333;
        padding-top: 42px;
        padding-bottom: 32px;
      }

      .instructions {
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 40px;
        padding-left: 50px;
        padding-right: 10px;
        text-align: left;
      }

      .btn {
        width: 236px;
        height: 48px;
        border: 0px;
        border-radius: 10px;
        background-color: #30ddd6;
        font-size: 14px;
        font-weight: 800;
        line-height: 1.14;
        letter-spacing: 1.2px;
        text-align: center;
        color: #ffffff;
        cursor: pointer;
        margin-top: 16px;
      }

      .footer {
        color: #000000;
        width: 640px;
        height: 100px;
        background-color: #ffffff;
        padding-top: 57px;
        margin-bottom: 62px;
      }

      .contact-us {
        width: 592px;
        height: 15px;
        font-size: 12px;
        text-align: center;
        color: #999999;
        padding-bottom: 23px;
      }

      .contact-link {
        font-weight: bold;
        color: #35bcc5;
      }

      .copyright {
        width: 592px;
        height: 15px;
        font-size: 12px;
        text-align: center;
        color: #999999;
      }
    </style>
  </head>

  <body>
    <div>
      <div class="header">
        <div class="title">BEYOND</div>
        <div class="greetings">¡Hola!</div>
      </div>
      <div class="content">
        <div class="middle">
          <div>
            <img
              class="image"
              src="https://beyond-public-images.s3-us-west-2.amazonaws.com/done.png"
            />
          </div>
          <div class="content-msg">Ayuda a {{coachee}}</div>
          <div class="content-msg">con su proceso</div>
          <div class="rectangle">
            <div class="message">Tienes hasta el {{dueDate}} para completarlo</div>
            <div class="instructions">
              <span>Ayudanos a responder las siguientes preguntas:</span>
            </div>
            <div>
              <a href="{{url}}/questions?id={{process}}&email={{email}}" target="_blank">
                <button class="btn">COMPLETAR PROCESO</button>
              </a>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="contact-us">
            Si tenes un problema, <span class="contact-link">contáctanos</span>
          </div>
          <div class="copyright">BEYOND Copyright 2020 - Todos los derechos reservados.</div>
        </div>
      </div>
    </div>
  </body>
</html>
`;

const SetPasswordCoacheeHtml = `
<html>

<head>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Muli:wght@300;400;500;600;700;800&display=swap" />

  <style>
    @font-face {
      font-family: 'Muli';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/muli/v22/7Auwp_0qiz-afT3GLQjUwkQ1OQ.woff2) format('woff2');
    }
    
    body {
      font-family: 'Muli';
    }

    .header {
      width: 610px;
      height: 25px;
      box-shadow: 0 12px 20px 0 rgba(16, 132, 140, 0.2);
      background-color: #76d8ce;
      padding: 12px 15px 13px 15px
    }

    .title {
      height: 24px;
      font-family: Muli;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      letter-spacing: 1.56px;
      color: #ffffff;
      float: left;
    }

    .greetings {
      height: 24px;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
      text-align: right;
      color: #ffffff;
    }

    .content {
      width: 640px;
      height: 697px;
      background: url("https://beyond-public-images.s3-us-west-2.amazonaws.com/clouds.png") no-repeat right 50px/90%, linear-gradient(to bottom, #53c5ba, #f9ffff);
      text-align: center;
    }


    .middle {
      padding-top: 34px;
      padding-bottom: 90px;
    }

    .icon {
      padding-bottom: 29px;
    }

    .content-msg {
      font-size: 34px;
      line-height: 0.88;
      color: #ffffff;
      padding-bottom: 38px;
    }

    .rectangle {
      color: #000000;
      height: 230px;
      border-radius: 10px;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.15);
      background-color: #ffffff;
      margin: 0 84px 0 84px;
      padding: 0 48px 0 48px;
      text-align: center;
    }

    .message {
      width: 376px;
      height: 10px;
      font-size: 18px;
      font-weight: bold;
      line-height: 1.33;
      text-align: center;
      color: #333333;
      padding-top: 60px;
      padding-bottom: 60px;
    }

    .sub-message {
      width: 400px;
      height: 30px;
      font-family: Muli;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 6;
      letter-spacing: normal;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
    }

    .btn {
      width: 236px;
      height: 48px;
      border: 0px;
      border-radius: 10px;
      background-color: #30ddd6;
      font-size: 14px;
      font-weight: 800;
      line-height: 1.14;
      letter-spacing: 1.2px;
      text-align: center;
      color: #ffffff;
      cursor: pointer;
    }

    .footer {
      color: #000000;
      width: 640px;
      height: 172px;
      background-color: #ffffff;
      padding-top: 57px;
      margin-bottom: 62px;
    }

    .contact-us {
      width: 592px;
      height: 15px;
      font-size: 12px;
      text-align: center;
      color: #999999;
      padding-bottom: 23px;
    }

    .contact-link {
      font-weight: bold;
      color: #35bcc5;
    }

    .copyright {
      width: 592px;
      height: 15px;
      font-size: 12px;
      text-align: center;
      color: #999999;
    }
  </style>
</head>

<body>
  <div>
    <div class="header">
      <div class="title">BEYOND</div>
      <div class="greetings">¡Hola, coachee!</div>
    </div>
    <div class="content">
      <div class="middle">
        <div class="icon">
          <img src="https://beyond-public-images.s3-us-west-2.amazonaws.com/tick.png" />
        </div>
        <div class="content-msg">¡Completaste correctamente la registracion!</div>
        <div class="rectangle">
          <div class="message">Ahora puedes comenzar a utilizar la aplicación</div> 
          <div>
            <a href="{{url}}" target="_blank">
              <button class="btn">IR A BEYOND</button>
            </a>
          </div>         
        </div>
      </div>
      <div class="footer">
        <div class="contact-us">Si tenes un problema, <span class="contact-link">contáctanos</span></div>
        <div class="copyright">BEYOND Copyright 2020 - Todos los derechos reservados.</div>
      </div>
    </div>
  </div>
</body>

</html>
`;

const subjects: Record<string, ValidAny> = {
  NewCoacheeEmailTemplate: {
    subject: 'Beyond - Verifica tu cuenta',
    template: HtmlPart,
  },
  NewProcessTemplate: {
    subject: 'Beyond - Completa tu proceso {{processType}}',
    template: NewProcessHtml,
  },
  FinishedAnswers: {
    subject: 'Beyond - Completaste tu proceso {{processType}}',
    template: FinishedAnswersHtml,
  },
  FinishedAnswersCoach: {
    subject: 'Beyond - Se ha finalizado un proceso {{processType}}',
    template: FinishedAnswersCoachHtml,
  },
  ReminderProcess: {
    subject: 'Beyond - Recorda de completar tu proceso {{processType}}',
    template: ReminderProcessHtml,
  },
  CollaboratorProcess: {
    subject: 'Beyond - Ayudanos a tu compañer@ en su proceso',
    template: CollaboratorProcessHtml,
  },
  SetPasswordCoachee: {
    subject: 'Beyond - Registración exitosa!',
    template: SetPasswordCoacheeHtml,
  },
};

const process = async (event: ValidAny): Promise<ApplicationResponse | ApplicationError> => {
  const { template } = event;
  const params = {
    Template: {
      TemplateName: template,
      SubjectPart: subjects[template].subject,
      HtmlPart: subjects[template].template,
    },
  };

  const paramList = {
    MaxItems: 10,
  };

  const templates = await ses.listTemplates(paramList).promise();

  if (templates.TemplatesMetadata && templates.TemplatesMetadata.find(x => x.Name === template)) {
    console.log('UPDATE TEMPLATE:', template);
    const result = await ses.updateTemplate(params).promise();
    console.log(result);
  } else {
    console.log('CREATING TEMPLATE:', template);
    const result = await ses.createTemplate(params).promise();
    console.log(result);
  }

  return created({
    message: 'Operation Successful',
  });
};

export const handler = async (event: ValidAny): Promise<APIGatewayProxyResult> =>
  process(event).then(success).catch(error);
