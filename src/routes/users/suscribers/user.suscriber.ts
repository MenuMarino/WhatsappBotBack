import Logger from 'src/helpers/logger';
import { IUser } from '../models/user.model';
import nodemailer from 'nodemailer';

const logger = Logger.create('dashboard:events:user');

const transporter = nodemailer.createTransport({
  port: 465,
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAILPASSWORD,
  },
  secure: true,
});

class UserSuscriber {
  async onUserSignup(user: IUser) {
    try {
      logger.info(`Sending welcome email to ${user.name}<${user.email}>`);
      const mailData = {
        from: process.env.MAIL,
        to: user.email,
        subject: 'Verifica tu correo para tener acceso al dashboard.',
        text: 'text',
        html: `<b>Dale click a este link para verificar tu cuenta.</b>\
        <br/><br/>\
        <a href=\'${process.env.DASHBOARDURL}\/api/users/activate/${user.activationToken}'>Verificar cuenta.</a>`,
      };
      await transporter.sendMail(mailData);
      logger.info('Email sent');
    } catch (err) {
      logger.error(err);
    }
  }
}

export default new UserSuscriber();
