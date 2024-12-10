import type { CreateUpdateProgressDto, ProgressDto, ProgressGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  apiName = 'Default';
  

  create = (input: CreateUpdateProgressDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProgressDto>({
      method: 'POST',
      url: '/api/app/progress',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/progress/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProgressDto>({
      method: 'GET',
      url: `/api/app/progress/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: ProgressGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ProgressDto>>({
      method: 'GET',
      url: '/api/app/progress',
      params: { userId: input.userId, pronunciationAccuracy: input.pronunciationAccuracy, secondsPractice: input.secondsPractice, successesPronunciation: input.successesPronunciation, successesWriting: input.successesWriting, progressLevelCurrent: input.progressLevelCurrent, level: input.level, errorsPronunciation: input.errorsPronunciation, errorsWriting: input.errorsWriting, motivationalPhrase: input.motivationalPhrase, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateProgressDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ProgressDto>({
      method: 'PUT',
      url: `/api/app/progress/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
