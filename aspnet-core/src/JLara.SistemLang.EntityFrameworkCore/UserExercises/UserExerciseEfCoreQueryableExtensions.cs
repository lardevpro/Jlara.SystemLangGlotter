using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace JLara.SistemLang.UserExercises;

public static class UserExerciseEfCoreQueryableExtensions
{
    public static IQueryable<UserExercise> IncludeDetails(this IQueryable<UserExercise> queryable, bool include = true)
    {
        if (!include)
        {
            return queryable;
        }

        return queryable
            // .Include(x => x.xxx) // TODO: AbpHelper generated
            ;
    }
}
