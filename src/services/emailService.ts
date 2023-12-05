import { EmailClient, type EmailMessage as AzureEmailMessage } from "@azure/communication-email";
import config from "../config";
let service: EmailService;

const defaults = {
  senderAddress: "do-not-reply@givebackcincinnati.org",
  replyTo: [
    {
      address: "operations-vp@givebackcincinnati.org",
      displayName: "Operations VP"
    }
  ],
}

interface EmailMessage extends Omit<AzureEmailMessage, "senderAddress"> {
  senderAddress?: string;
}

class EmailService {
  private client?;
  constructor() {
    if (config.email_connection_string) {
      this.client = new EmailClient(config.email_connection_string);
    }
  }

  async sendEmail(message: EmailMessage) {
    if (this.client) {
      const poller = await this.client.beginSend({
        ...defaults,
        ...message
      });
      // we don't necessarily care that the email was sent, just that it was queued
      await poller.pollUntilDone();
    }
  }
}

export function GetEmailService() {
  if (!service) {
    service = new EmailService();
  }
  return service;
}
