import type { CreateUpdateSugesstionDto, SugesstionDto, SugesstionGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SugesstionService {
  apiName = 'Default';
  

  create = (input: CreateUpdateSugesstionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SugesstionDto>({
      method: 'POST',
      url: '/api/app/sugesstion',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/sugesstion/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SugesstionDto>({
      method: 'GET',
      url: `/api/app/sugesstion/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: SugesstionGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SugesstionDto>>({
      method: 'GET',
      url: '/api/app/sugesstion',
      params: { userId: input.userId, sugesstionText: input.sugesstionText, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSugesstionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SugesstionDto>({
      method: 'PUT',
      url: `/api/app/sugesstion/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
