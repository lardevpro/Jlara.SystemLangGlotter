using Microsoft.Extensions.Localization;
using JLara.SistemLang.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace JLara.SistemLang;

[Dependency(ReplaceServices = true)]
public class SistemLangBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<SistemLangResource> _localizer;

    public SistemLangBrandingProvider(IStringLocalizer<SistemLangResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
