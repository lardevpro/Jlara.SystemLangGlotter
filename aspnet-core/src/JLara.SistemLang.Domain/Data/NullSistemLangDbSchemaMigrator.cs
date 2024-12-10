using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace JLara.SistemLang.Data;

/* This is used if database provider does't define
 * ISistemLangDbSchemaMigrator implementation.
 */
public class NullSistemLangDbSchemaMigrator : ISistemLangDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
