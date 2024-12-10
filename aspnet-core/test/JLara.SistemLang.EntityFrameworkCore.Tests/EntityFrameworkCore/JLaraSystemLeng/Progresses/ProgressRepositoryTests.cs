using System;
using System.Threading.Tasks;
using JLaraSystemLeng.Progresses;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace JLara.SistemLang.EntityFrameworkCore.JLaraSystemLeng.Progresses;

public class ProgressRepositoryTests : SistemLangEntityFrameworkCoreTestBase
{
    private readonly IProgressRepository _progressRepository;

    public ProgressRepositoryTests()
    {
        _progressRepository = GetRequiredService<IProgressRepository>();
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
