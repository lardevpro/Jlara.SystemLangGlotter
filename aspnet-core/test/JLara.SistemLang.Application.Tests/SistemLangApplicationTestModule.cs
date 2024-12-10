using Volo.Abp.Modularity;

namespace JLara.SistemLang;

[DependsOn(
    typeof(SistemLangApplicationModule),
    typeof(SistemLangDomainTestModule)
)]
public class SistemLangApplicationTestModule : AbpModule
{

}
