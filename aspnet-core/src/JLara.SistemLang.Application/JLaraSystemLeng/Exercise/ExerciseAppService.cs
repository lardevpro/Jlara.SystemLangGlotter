using System;
using System.Linq;
using System.Threading.Tasks;
using JLaraSystemLeng.Exercise.Dtos;
using Volo.Abp.Application.Services;

namespace JLaraSystemLeng.Exercise;


public class ExerciseAppService : CrudAppService<Exercise, ExerciseDto, Guid, ExerciseGetListInput, CreateUpdateExerciseDto, CreateUpdateExerciseDto>,
    IExerciseAppService
{

    private readonly IExerciseRepository _repository;

    public ExerciseAppService(IExerciseRepository repository) : base(repository)
    {
        _repository = repository;
    }

    protected override async Task<IQueryable<Exercise>> CreateFilteredQueryAsync(ExerciseGetListInput input)
    {
        // TODO: AbpHelper generated
        return (await base.CreateFilteredQueryAsync(input))
            .WhereIf(input.Phrase != null, x => x.Phrase == input.Phrase)
            .WhereIf(input.DifficultyLevel != null, x => x.DifficultyLevel == input.DifficultyLevel)
            .WhereIf(!input.FocusArea.IsNullOrWhiteSpace(), x => x.FocusArea.Contains(input.FocusArea))
            ;
    }
}
