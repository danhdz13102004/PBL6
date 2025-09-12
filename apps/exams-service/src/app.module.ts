import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExamsModule } from './modules/exams/exams.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { QuestionExamsModule } from './modules/question-exams/question-exams.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { SubmissionAnswersModule } from './modules/submission-answers/submission-answers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres123',
      database: process.env.DATABASE_NAME || 'exams_db',
      autoLoadEntities: true,
      synchronize: true, // Enable for development - auto-create tables
      logging: process.env.NODE_ENV !== 'production',
    }),
    ExamsModule,
    QuestionsModule,
    QuestionExamsModule,
    SubmissionsModule,
    SubmissionAnswersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
