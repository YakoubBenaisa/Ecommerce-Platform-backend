import { Request, Response } from "express";
import WebhookService from "../services/webhook.service";
import { injectable } from "tsyringe";

@injectable()
class WebhookController {
  // Set your verify token and app secret (ideally via environment variables)
private VERIFY_TOKEN = process.env.VERIFY_TOKEN || '1234';
private APP_SECRET = process.env.APP_SECRET || '8a8a47dd9f4a81d4a19957626c950f8d';
private PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "EAAPRfb1UNxMBOyuip5Q9MhKN2auZAhCxrZByWEhaVfvPSZA99RDqWPdH6kLvMpgdoywmp6PqKxdAUVu3uma61jGzSro7JVZAUu2tRYXs2MNbtTbwbnGEY2QuxHLXMaWdWXnO9ZADKjsGGYTrCIaaQe8vxHw4Mu0LiuLv1CVPzQcdonfEXhPDSp0l1uasZCsCEEhgZDZD";

  private webhookService: WebhookService;


  constructor() {
    this.webhookService = new WebhookService();
  }

  verifyWebhook(req: Request, res: Response) {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    }
  }

  handleWebhookEvent(req: Request, res: Response) {

    console.log("IS WOOOOOOOOOOOOOOOOORK")
    const body = req.body;

    if (body.object === "page") {
      body.entry.forEach((entry: any) => {
        entry.messaging.forEach((event: any) => {
          this.webhookService.processEvent(event);
        });
      });
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  }
}

export default WebhookController;
