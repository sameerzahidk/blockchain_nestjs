import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: '65859392aaeb4f',
          pass: '9d2aaa7168433c',
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],  // Make sure EmailService is exported
})
export class EmailModule {}
