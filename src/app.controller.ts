import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('getHello')
export class AppController {
  constructor(private readonly appService: AppService) {}
}
