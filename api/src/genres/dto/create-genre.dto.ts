import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
export class CreateGenreDto {
 @IsString() @MinLength(1) @MaxLength(100) name:string;
 @IsString() @MaxLength(100) @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) slug:string;
}
