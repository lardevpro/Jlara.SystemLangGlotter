using Volo.Abp.Modularity;

namespace JLara.SistemLang;

[DependsOn(
    typeof(SistemLangDomainModule),
    typeof(SistemLangTestBaseModule)
)]
public class SistemLangDomainTestModule : AbpModule
{

}
