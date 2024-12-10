using System;
using System.Threading.Tasks;
using JLaraSystemLeng.Sugesstions;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace JLara.SistemLang.EntityFrameworkCore.JLaraSystemLeng.Sugesstions;

public class SugesstionRepositoryTests : SistemLangEntityFrameworkCoreTestBase
{
    private readonly ISugesstionRepository _sugesstionRepository;

    public SugesstionRepositoryTests()
    {
        _sugesstionRepository = GetRequiredService<ISugesstionRepository>();
    }

    /*
    [Fact]
    public async Task Test1()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            // Arrange

            // Act

            //Assert
        });
    }
    */
}
