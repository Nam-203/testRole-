import { ApiProperty } from '@nestjs/swagger';

import { PaginationResponseDto } from './pagination-response.dto';

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly items: T[];

  @ApiProperty()
  readonly pagination: PaginationResponseDto;

  constructor(items: T[], paginationResponseDto: PaginationResponseDto) {
    this.items = items;
    this.pagination = paginationResponseDto;
  }
}
