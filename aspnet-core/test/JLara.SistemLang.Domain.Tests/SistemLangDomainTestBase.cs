using Volo.Abp.Modularity;

namespace JLara.SistemLang;

/* Inherit from this class for your domain layer tests. */
public abstract class SistemLangDomainTestBase<TStartupModule> : SistemLangTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
