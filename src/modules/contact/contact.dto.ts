import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

// This DTO validates every incoming POST /api/contact request
// If any field fails, NestJS automatically returns a 400 with details
export class ContactDto {

    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters' })
    @MaxLength(60, { message: 'Name must be under 60 characters' })
    name: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Please enter a valid email address' })
    email: string;

    @IsNotEmpty({ message: 'Message is required' })
    @IsString()
    @MinLength(10, { message: 'Message must be at least 10 characters' })
    @MaxLength(1000, { message: 'Message must be under 1000 characters' })
    message: string;
}