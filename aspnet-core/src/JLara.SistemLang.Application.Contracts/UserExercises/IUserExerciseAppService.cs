using System;
using JLara.SistemLang.UserExercises.Dtos;
using Volo.Abp.Application.Services;

namespace JLara.SistemLang.UserExercises;


public interface IUserExerciseAppService :
    ICrudAppService< 
        UserExerciseDto, 
        Guid, 
        UserExerciseGetListInput,
        CreateUpdateUserExerciseDto,
        CreateUpdateUserExerciseDto>
{

}