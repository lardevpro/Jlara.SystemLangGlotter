using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace JLaraSystemLeng.Progresses;

public static class ProgressEfCoreQueryableExtensions
{
    public static IQueryable<Progress> IncludeDetails(this IQueryable<Progress> queryable, bool include = true)
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
