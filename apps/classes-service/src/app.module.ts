import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassesModule } from './modules/classes/classes.module';
import { PostsModule } from './modules/posts/posts.module';
import { MaterialsModule } from './modules/materials/materials.module';

// Import all entities
import { Post } from './entities/post.entity';
import { Material } from './entities/material.entity';
import { ClassEnrollment } from './entities/class-enrollment.entity';
import { ClassTeacher } from './entities/class-teacher.entity';
import { Class } from './entities/class.entity';

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
      database: process.env.DATABASE_NAME || 'classes_db',
      entities: [Class, Post, Material, ClassEnrollment, ClassTeacher],
      synchronize: true, // Enable for development - auto-create tables
      logging: process.env.NODE_ENV !== 'production',
    }),
    ClassesModule,
    PostsModule,
    MaterialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
