import type { FullAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateUserExerciseDto {
  exerciseId?: string;
  sugesstionId?: string;
  userPhrase?: string;
}

export interface UserExerciseDto extends FullAuditedEntityDto<string> {
  exerciseId?: string;
  sugesstionId?: string;
  userPhrase?: string;
}

export interface UserExerciseGetListInput extends PagedAndSortedResultRequestDto {
  exerciseId?: string;
  sugesstionId?: string;
  userPhrase?: string;
}
