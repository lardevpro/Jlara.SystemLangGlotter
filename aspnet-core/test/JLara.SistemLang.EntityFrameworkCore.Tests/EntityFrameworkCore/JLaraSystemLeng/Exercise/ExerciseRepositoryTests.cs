using System;
using System.Threading.Tasks;
using JLaraSystemLeng.Exercise;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace JLara.SistemLang.EntityFrameworkCore.JLaraSystemLeng.Exercise;

public class ExerciseRepositoryTests : SistemLangEntityFrameworkCoreTestBase
{
    private readonly IExerciseRepository _exerciseRepository;

    public ExerciseRepositoryTests()
    {
        _exerciseRepository = GetRequiredService<IExerciseRepository>();
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
