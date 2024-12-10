using Volo.Abp.Modularity;

namespace JLara.SistemLang;

public abstract class SistemLangApplicationTestBase<TStartupModule> : SistemLangTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
