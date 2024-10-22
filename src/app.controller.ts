// src/app.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response): void {
    const htmlContent = this.appService.getHtml();
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent); // Send the HTML response
  }
}