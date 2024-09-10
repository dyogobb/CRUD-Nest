import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('getHello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':id/:classe')
  parametro(@Param('id') id: any, @Param('classe') classe: string): string {
    return `Exibindo informações do id: ${id} de classe ${classe}`;
  }
}
