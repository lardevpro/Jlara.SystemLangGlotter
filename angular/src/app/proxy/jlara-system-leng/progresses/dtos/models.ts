import type { FullAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateProgressDto {
  userId?: string;
  pronunciationAccuracy?: number;
  secondsPractice?: number;
  successesPronunciation?: number;
  successesWriting?: number;
  progressLevelCurrent?: number;
  level?: string;
  errorsPronunciation?: number;
  errorsWriting?: number;
  motivationalPhrase?: string;
}

export interface ProgressDto extends FullAuditedEntityDto<string> {
  userId?: string;
  pronunciationAccuracy?: number;
  secondsPractice?: number;
  successesPronunciation?: number;
  successesWriting?: number;
  progressLevelCurrent?: number;
  level?: string;
  errorsPronunciation?: number;
  errorsWriting?: number;
  motivationalPhrase?: string;
}

export interface ProgressGetListInput extends PagedAndSortedResultRequestDto {
  userId?: string;
  pronunciationAccuracy?: number;
  secondsPractice?: number;
  successesPronunciation?: number;
  successesWriting?: number;
  progressLevelCurrent?: number;
  level?: string;
  errorsPronunciation?: number;
  errorsWriting?: number;
  motivationalPhrase?: string;
}
