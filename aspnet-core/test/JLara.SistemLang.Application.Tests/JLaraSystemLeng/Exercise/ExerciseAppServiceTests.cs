using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace JLaraSystemLeng.Exercise;

public class ExerciseAppServiceTests : SistemLangApplicationTestBase
{
    private readonly IExerciseAppService _exerciseAppService;

    public ExerciseAppServiceTests()
    {
        _exerciseAppService = GetRequiredService<IExerciseAppService>();
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

