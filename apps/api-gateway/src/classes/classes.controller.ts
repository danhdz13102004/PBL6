import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, throwError, timeout, TimeoutError } from 'rxjs';
import { CreateClassDto } from 'src/dto/class.dto';

@Controller('classes')
export class ClassesController {
  constructor(@Inject('CLASSES_SERVICE') private classesService: ClientProxy) {}

  @Get('hello')
  getHello(): Observable<string> {
    return this.classesService.send('classes.get_hello', {});
  }

  @Post('create')
  async create(@Body(ValidationPipe) createClassDto: CreateClassDto){
    try{
      return await this.classesService.send('classes.create_class', createClassDto)
      .pipe(
        timeout(5000),
        catchError(err => {
          if (err instanceof TimeoutError) {
            return throwError(new HttpException('Classes service timeout', HttpStatus.REQUEST_TIMEOUT));
          }
          return throwError(new HttpException('Failed to create class', HttpStatus.BAD_REQUEST));
        }),
      )
      .toPromise();
    } catch (error) {
      throw new HttpException('Failed to create class', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
