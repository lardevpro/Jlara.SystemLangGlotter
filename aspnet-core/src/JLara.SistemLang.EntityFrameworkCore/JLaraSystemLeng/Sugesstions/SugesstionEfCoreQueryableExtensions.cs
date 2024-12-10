using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace JLaraSystemLeng.Sugesstions;

public static class SugesstionEfCoreQueryableExtensions
{
    public static IQueryable<Sugesstion> IncludeDetails(this IQueryable<Sugesstion> queryable, bool include = true)
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
