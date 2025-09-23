import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateClassDto{


    @IsString()
    @IsNotEmpty()
    class_name: string;

    @IsString()
    @IsNotEmpty()
    class_code: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsNotEmpty()
    teacher_id: string;

    @IsDateString()
    @IsOptional()
    created_at: Date;
}