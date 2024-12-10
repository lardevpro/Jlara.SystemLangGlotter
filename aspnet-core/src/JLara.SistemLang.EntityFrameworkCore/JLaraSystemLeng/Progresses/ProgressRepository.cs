using System;
using System.Linq;
using System.Threading.Tasks;
using JLara.SistemLang.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace JLaraSystemLeng.Progresses;

public class ProgressRepository : EfCoreRepository<SistemLangDbContext, Progress, Guid>, IProgressRepository
{
    public ProgressRepository(IDbContextProvider<SistemLangDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public override async Task<IQueryable<Progress>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
}