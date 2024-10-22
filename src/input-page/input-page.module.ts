// src/input-page/input-page.module.ts

import { Module } from '@nestjs/common';
import { InputPageController } from './input-page.controller';

@Module({
  controllers: [InputPageController]
})
export class InputPageModule {}