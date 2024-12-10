using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace JLaraSystemLeng.Exercise;

public static class ExerciseEfCoreQueryableExtensions
{
    public static IQueryable<Exercise> IncludeDetails(this IQueryable<Exercise> queryable, bool include = true)
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
