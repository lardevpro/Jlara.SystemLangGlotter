using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace JLara.SistemLang.UserExercise;

public class UserExerciseAppServiceTests : SistemLangApplicationTestBase
{
    private readonly IUserExerciseAppService _userExerciseAppService;

    public UserExerciseAppServiceTests()
    {
        _userExerciseAppService = GetRequiredService<IUserExerciseAppService>();
    }

    /*
    [Fact]
    public async Task Test1()
    {
        // Arrange

        // Act

        // Assert
    }
    */
}

