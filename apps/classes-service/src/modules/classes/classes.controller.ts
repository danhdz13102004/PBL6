import { Controller, Get } from '@nestjs/common';
import { ClassesService } from './classes.service';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get('classes.get_hello')
  getHello(): string {
    return 'Hello from Classes Controller!';
  }

  @Post('classes.create_class')
  createClass
}
