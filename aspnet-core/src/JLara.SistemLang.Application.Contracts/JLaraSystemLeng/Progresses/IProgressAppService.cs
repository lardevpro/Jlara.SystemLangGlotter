using System;
using JLaraSystemLeng.Progresses.Dtos;
using Volo.Abp.Application.Services;

namespace JLaraSystemLeng.Progresses;


public interface IProgressAppService :
    ICrudAppService< 
        ProgressDto, 
        Guid, 
        ProgressGetListInput,
        CreateUpdateProgressDto,
        CreateUpdateProgressDto>
{

}