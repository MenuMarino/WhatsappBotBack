import { Request } from 'express';
import { Method } from 'src/types/methods';
import Logger from 'src/helpers/logger';

const logger = Logger.create('webhook:verifier');

class WebhookVerifier {
  readonly method = Method.GET;
  readonly route = '/webhook';
  readonly middlewares = [];

  async on(req: Request, res: Response): Promise<any> {
    /**
     * UPDATE YOUR VERIFY TOKEN
     *This will be the Verify Token value when you set up webhook
     **/
    const verify_token = 'wese';

    // Parse params from the webhook verification request
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === 'subscribe' && token === verify_token) {
        // Respond with 200 OK and challenge token from the request
        logger.info('WEBHOOK_VERIFIED');
      }
    }
    return { challenge };
  }
}

export default new WebhookVerifier();
