import { IsInt, IsString, IsOptional, Min, MaxLength, MinLength, IsUrl } from 'class-validator';
export class CreateBookDto {
 @IsString() @MinLength(1) @MaxLength(200) title: string;
 @IsString() @MinLength(1) @MaxLength(200) author: string;
 @IsString() @MinLength(1) @MaxLength(40) isbn: string;
 @IsString() @MaxLength(5000) description: string;
 @IsOptional() @IsUrl({protocols:['https'],require_protocol:true}) coverImage?: string;
 @IsInt() @Min(1) totalCopies: number;
 @IsInt() @Min(1) genreId: number;
}
