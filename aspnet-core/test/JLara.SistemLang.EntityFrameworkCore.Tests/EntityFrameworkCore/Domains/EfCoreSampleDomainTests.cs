using JLara.SistemLang.Samples;
using Xunit;

namespace JLara.SistemLang.EntityFrameworkCore.Domains;

[Collection(SistemLangTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<SistemLangEntityFrameworkCoreTestModule>
{

}
