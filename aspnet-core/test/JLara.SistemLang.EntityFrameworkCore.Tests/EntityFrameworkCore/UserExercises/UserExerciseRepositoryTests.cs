using System;
using System.Threading.Tasks;
using JLara.SistemLang.UserExercises;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace JLara.SistemLang.EntityFrameworkCore.UserExercises;

public class UserExerciseRepositoryTests : SistemLangEntityFrameworkCoreTestBase
{
    private readonly IUserExerciseRepository _userExerciseRepository;

    public UserExerciseRepositoryTests()
    {
        _userExerciseRepository = GetRequiredService<IUserExerciseRepository>();
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
