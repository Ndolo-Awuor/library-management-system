import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
// Inventory cannot be edited directly: stock changes need their own audited workflow.
export class UpdateBookDto extends PartialType(OmitType(CreateBookDto,['totalCopies'] as const),{skipNullProperties:false}) {}
