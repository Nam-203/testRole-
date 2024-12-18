import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto {
  @ApiProperty()
  readonly totalItems: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly totalPages: number;

  @ApiProperty()
  readonly currentPage: number;

  constructor(totalItems: number, limit: number, currentPage: number) {
    this.totalItems = totalItems;
    this.limit = limit;
    this.currentPage = currentPage;
    this.totalPages = Math.ceil(totalItems / limit);
  }
}
