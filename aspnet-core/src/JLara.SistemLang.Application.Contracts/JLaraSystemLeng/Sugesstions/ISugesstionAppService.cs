using System;
using JLaraSystemLeng.Sugesstions.Dtos;
using Volo.Abp.Application.Services;

namespace JLaraSystemLeng.Sugesstions;


public interface ISugesstionAppService :
    ICrudAppService< 
        SugesstionDto, 
        Guid, 
        SugesstionGetListInput,
        CreateUpdateSugesstionDto,
        CreateUpdateSugesstionDto>
{

}