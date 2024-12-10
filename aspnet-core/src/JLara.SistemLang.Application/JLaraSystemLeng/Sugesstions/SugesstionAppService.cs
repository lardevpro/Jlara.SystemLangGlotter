using System;
using System.Linq;
using System.Threading.Tasks;
using JLaraSystemLeng.Sugesstions.Dtos;
using Volo.Abp.Application.Services;

namespace JLaraSystemLeng.Sugesstions;


public class SugesstionAppService : CrudAppService<Sugesstion, SugesstionDto, Guid, SugesstionGetListInput, CreateUpdateSugesstionDto, CreateUpdateSugesstionDto>,
    ISugesstionAppService
{

    private readonly ISugesstionRepository _repository;

    public SugesstionAppService(ISugesstionRepository repository) : base(repository)
    {
        _repository = repository;
    }

    protected override async Task<IQueryable<Sugesstion>> CreateFilteredQueryAsync(SugesstionGetListInput input)
    {
        // TODO: AbpHelper generated
        return (await base.CreateFilteredQueryAsync(input))
            .WhereIf(input.UserId != null, x => x.UserId == input.UserId)
            .WhereIf(input.SugesstionText != null, x => x.SugesstionText == input.SugesstionText)
            ;
    }
}
