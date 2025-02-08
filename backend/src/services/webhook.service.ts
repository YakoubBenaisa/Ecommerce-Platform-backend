import axios from "axios";

class WebhookService {
  /**
   * Processes the incoming event and calls the appropriate handler.
   */
  async processEvent(event: any): Promise<void> {
    if (event.message) {
      this.handleMessage(event);
    } else if (event.postback) {
      this.handlePostback(event);
    }
  }

  /**
   * Handles a received message event by logging it and sending a "Hello World" reply.
   * @param event - The incoming message event
   */
  private handleMessage(event: any): void {
    const senderId = event.sender.id;
    const messageText = event.message.text;
    console.log(`Message from sender ${senderId}: ${messageText}`);
    this.sendTextMessage(senderId, "Hello World");
  }

  /**
   * Handles a postback event by logging it.
   * @param event - The incoming postback event
   */
  private handlePostback(event: any): void {
    const senderId = event.sender.id;
    const payload = event.postback.payload;
    console.log(`Postback from sender ${senderId}: ${payload}`);
  }

  /**
   * Sends a text message using the Facebook Send API.
   * It constructs the payload with the proper messaging type and endpoint.
   * @param senderId - The PSID of the recipient
   * @param message - The text message to send
   */
  private async sendTextMessage(
    senderId: string,
    message: string
  ): Promise<void> {
    try {
      const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;
      if (!pageAccessToken) {
        throw new Error(
          "PAGE_ACCESS_TOKEN is not defined in environment variables"
        );
      }
      const page_id = process.env.PAGE_ID;

      // Construct the URL using Graph API v22.0 (or update as needed)
      const url = `https://graph.facebook.com/v22.0/${page_id}/messages?access_token=${pageAccessToken}`;

      // Construct the payload, including messaging_type as per the cURL example
      const payload = {
        recipient: { id: senderId },
        messaging_type: "RESPONSE",
        message: { text: message },
      };

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Message sent successfully:", response.data);
    } catch (error: any) {
      console.error(
        "Error sending message:",
        error.response ? error.response.data : error.message
      );
    }
  }
}

export default WebhookService;
