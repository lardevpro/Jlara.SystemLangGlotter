using System;
using System.Linq;
using System.Threading.Tasks;
using JLaraSystemLeng.Progresses.Dtos;
using Volo.Abp.Application.Services;

namespace JLaraSystemLeng.Progresses;


public class ProgressAppService : CrudAppService<Progress, ProgressDto, Guid, ProgressGetListInput, CreateUpdateProgressDto, CreateUpdateProgressDto>,
    IProgressAppService
{

    private readonly IProgressRepository _repository;

    public ProgressAppService(IProgressRepository repository) : base(repository)
    {
        _repository = repository;
    }

    protected override async Task<IQueryable<Progress>> CreateFilteredQueryAsync(ProgressGetListInput input)
    {
        // TODO: AbpHelper generated
        return (await base.CreateFilteredQueryAsync(input))
            .WhereIf(input.UserId != null, x => x.UserId == input.UserId)
            .WhereIf(input.SecondsPractice != null, x => x.SecondsPractice == input.SecondsPractice)
            .WhereIf(input.SuccessesPronunciation != null, x => x.SuccessesPronunciation == input.SuccessesPronunciation)
            .WhereIf(input.SuccessesWriting != null, x => x.SuccessesWriting == input.SuccessesWriting)
            .WhereIf(input.ProgressLevelCurrent != null, x => x.ProgressLevelCurrent == input.ProgressLevelCurrent)
            .WhereIf(input.Level != null, x => x.Level == input.Level)
            .WhereIf(input.ErrorsPronunciation != null, x => x.ErrorsPronunciation == input.ErrorsPronunciation)
            .WhereIf(input.ErrorsWriting != null, x => x.ErrorsWriting == input.ErrorsWriting)
            .WhereIf(input.MotivationalPhrase != null, x => x.MotivationalPhrase == input.MotivationalPhrase);
    }
}
