import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength, MaxLength, IsByteLength } from 'class-validator';
export class CredentialsDto {
 @Transform(({value})=>typeof value==='string'?value.trim().toLowerCase():value) @IsEmail() @MaxLength(254) email:string;
 @IsString() @MinLength(12) @IsByteLength(12,72) password:string;
}
