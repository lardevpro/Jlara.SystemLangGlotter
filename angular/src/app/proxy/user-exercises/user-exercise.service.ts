import type { CreateUpdateUserExerciseDto, UserExerciseDto, UserExerciseGetListInput } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserExerciseService {
  apiName = 'Default';
  

  create = (input: CreateUpdateUserExerciseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserExerciseDto>({
      method: 'POST',
      url: '/api/app/user-exercise',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/user-exercise/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserExerciseDto>({
      method: 'GET',
      url: `/api/app/user-exercise/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: UserExerciseGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<UserExerciseDto>>({
      method: 'GET',
      url: '/api/app/user-exercise',
      params: { exerciseId: input.exerciseId, sugesstionId: input.sugesstionId, userPhrase: input.userPhrase, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateUserExerciseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserExerciseDto>({
      method: 'PUT',
      url: `/api/app/user-exercise/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
