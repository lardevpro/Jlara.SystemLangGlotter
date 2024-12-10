import type { FullAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateExerciseDto {
  phrase?: string;
  difficultyLevel?: string;
  focusArea?: string;
}

export interface ExerciseDto extends FullAuditedEntityDto<string> {
  phrase?: string;
  difficultyLevel?: string;
  focusArea?: string;
}

export interface ExerciseGetListInput extends PagedAndSortedResultRequestDto {
  phrase?: string;
  difficultyLevel?: string;
  focusArea?: string;
}
