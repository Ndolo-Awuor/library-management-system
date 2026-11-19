import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsOptional, IsString, MaxLength } from 'class-validator';
export class CatalogQueryDto {
 @IsOptional() @Type(()=>Number) @IsInt() @Min(1) genreId?: number;
 @IsOptional() @IsString() @MaxLength(200) search?: string;
 @Type(()=>Number) @IsInt() @Min(1) @Max(100000) page=1;
 @Type(()=>Number) @IsInt() @Min(1) @Max(100) limit=20;
}
