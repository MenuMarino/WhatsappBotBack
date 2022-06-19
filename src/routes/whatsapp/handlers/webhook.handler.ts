import { Request } from 'express';
import { Method } from 'src/types/methods';
import Logger from 'src/helpers/logger';
import {
  checkBody,
  checkIfExists,
  sendMessage,
  saveInDb,
  sendInformation,
  State,
} from 'src/helpers/helpers';
import UserModel from '../models/user.model';

const logger = Logger.create('webhook:handler');

class Webhook {
  readonly method = Method.POST;
  readonly route = '/webhook';
  readonly middlewares = [];

  async on(req: Request, res: Response): Promise<any> {
    // Parse the request body from the POST
    let body = req.body;

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (req.body.object) {
      if (checkBody(body)) {
        logger.info('webhook triggered');
        let phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
        logger.info(`webhook triggered: phone (${from})`);
        const user = await checkIfExists(UserModel, from);

        if (!user) {
          sendMessage(
            phone_number_id,
            process.env.WHATSAPP_TOKEN,
            'Muchas gracias. Para continuar, bríndeme su nombre y correo electrónico, separado por 1 coma.',
            from
          );
          const user = await saveInDb(UserModel, from, State.PENDING);
        } else {
          if (user.state === State.VERIFIED) {
            return {};
          }
          sendInformation(
            user,
            msg_body,
            phone_number_id,
            process.env.WHATSAPP_TOKEN,
            from,
            process.env.URL
          );
        }
      }
    }
    return {};
  }
}

export default new Webhook();
