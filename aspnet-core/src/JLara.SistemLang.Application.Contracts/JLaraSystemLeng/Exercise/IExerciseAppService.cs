using System;
using JLaraSystemLeng.Exercise.Dtos;
using Volo.Abp.Application.Services;

namespace JLaraSystemLeng.Exercise;


public interface IExerciseAppService :
    ICrudAppService< 
        ExerciseDto, 
        Guid, 
        ExerciseGetListInput,
        CreateUpdateExerciseDto,
        CreateUpdateExerciseDto>
{

}