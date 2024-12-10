using System;
using System.Linq;
using System.Threading.Tasks;
using JLara.SistemLang.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace JLara.SistemLang.UserExercises;

public class UserExerciseRepository : EfCoreRepository<SistemLangDbContext, UserExercise, Guid>, IUserExerciseRepository
{
    public UserExerciseRepository(IDbContextProvider<SistemLangDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public override async Task<IQueryable<UserExercise>> WithDetailsAsync()
    {
        return (await GetQueryableAsync()).IncludeDetails();
    }
}