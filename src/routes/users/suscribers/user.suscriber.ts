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
        <a href=\'${process.env.FRONTURL}\/verify/${user.activationToken}' target=
        '_blank\'>Verificar cuenta.</a>`,
      };
      await transporter.sendMail(mailData);
      logger.info('Email sent');
    } catch (err) {
      logger.error(err);
    }
  }

  async onForgotPassword(user: IUser) {
    try {
      logger.info(
        `Sending reset password email to ${user.name} <${user.email}>`
      );
      const mailData = {
        from: process.env.MAIL,
        to: user.email,
        subject: 'Recuperar contraseña',
        text: 'text',
        html: `<b>Dale click a este link para crear una nueva contraseña. (Un solo uso)</b>\
        <br/><br/>\
        <a href=\'${process.env.FRONTURL}\/reset/${user.recoveryToken}' target=
        '_blank\'>Recuperar contraseña.</a>`,
      };
      await transporter.sendMail(mailData);
      logger.info('Email sent');
    } catch (err) {
      logger.error(err);
    }
  }
}

export default new UserSuscriber();
