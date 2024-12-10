using System;
using System.Linq;
using System.Threading.Tasks;
using JLara.SistemLang.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace JLaraSystemLeng.Exercise;

public class ExerciseRepository : EfCoreRepository<SistemLangDbContext, Exercise, Guid>, IExerciseRepository
{
    public ExerciseRepository(IDbContextProvider<SistemLangDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public override async Task<IQueryable<Exercise>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
}