using System;
using System.Linq;
using System.Threading.Tasks;
using JLara.SistemLang.UserExercises.Dtos;
using Volo.Abp.Application.Services;

namespace JLara.SistemLang.UserExercises;


public class UserExerciseAppService : CrudAppService<UserExercise, UserExerciseDto, Guid, UserExerciseGetListInput, CreateUpdateUserExerciseDto, CreateUpdateUserExerciseDto>,
    IUserExerciseAppService
{

    private readonly IUserExerciseRepository _repository;

    public UserExerciseAppService(IUserExerciseRepository repository) : base(repository)
    {
        _repository = repository;
    }

    protected override async Task<IQueryable<UserExercise>> CreateFilteredQueryAsync(UserExerciseGetListInput input)
    {
        // TODO: AbpHelper generated
        return (await base.CreateFilteredQueryAsync(input))
            .WhereIf(input.ExerciseId != null, x => x.ExerciseId == input.ExerciseId)
            .WhereIf(input.SugesstionId != null, x => x.SugesstionId == input.SugesstionId)
            .WhereIf(input.UserPhrase != null, x => x.UserPhrase == input.UserPhrase)
            ;
    }
}
