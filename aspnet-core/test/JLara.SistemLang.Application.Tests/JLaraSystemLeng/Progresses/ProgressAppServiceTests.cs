using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace JLaraSystemLeng.Progresses;

public class ProgressAppServiceTests : SistemLangApplicationTestBase
{
    private readonly IProgressAppService _progressAppService;

    public ProgressAppServiceTests()
    {
        _progressAppService = GetRequiredService<IProgressAppService>();
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

