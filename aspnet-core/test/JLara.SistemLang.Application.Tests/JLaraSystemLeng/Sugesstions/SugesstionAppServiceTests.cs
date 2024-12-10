using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace JLaraSystemLeng.Sugesstions;

public class SugesstionAppServiceTests : SistemLangApplicationTestBase
{
    private readonly ISugesstionAppService _sugesstionAppService;

    public SugesstionAppServiceTests()
    {
        _sugesstionAppService = GetRequiredService<ISugesstionAppService>();
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

