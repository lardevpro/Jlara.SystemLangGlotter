using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using JLara.SistemLang.Data;
using Volo.Abp.DependencyInjection;

namespace JLara.SistemLang.EntityFrameworkCore;

public class EntityFrameworkCoreSistemLangDbSchemaMigrator
    : ISistemLangDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreSistemLangDbSchemaMigrator(
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolve the SistemLangDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<SistemLangDbContext>()
            .Database
            .MigrateAsync();
    }
}
