import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPriceAlert(token: string, percentageIncrease: number) {
    await this.mailerService.sendMail({
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `Price Alert: ${token} Increased by ${percentageIncrease.toFixed(2)}%`,
      text: `The price of ${token} has increased by ${percentageIncrease.toFixed(2)}% in the last hour.`,
    });
    console.log(`Price alert email sent for ${token}.`);
  }
}
