import type { FullAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateSugesstionDto {
  userId?: string;
  sugesstionText?: string;
}

export interface SugesstionDto extends FullAuditedEntityDto<string> {
  userId?: string;
  sugesstionText?: string;
}

export interface SugesstionGetListInput extends PagedAndSortedResultRequestDto {
  userId?: string;
  sugesstionText?: string;
}
