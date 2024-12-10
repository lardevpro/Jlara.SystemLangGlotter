using JLara.SistemLang.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace JLara.SistemLang.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(SistemLangEntityFrameworkCoreModule),
    typeof(SistemLangApplicationContractsModule)
    )]
public class SistemLangDbMigratorModule : AbpModule
{
}
