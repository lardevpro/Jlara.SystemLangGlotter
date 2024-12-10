using JLara.SistemLang.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace JLara.SistemLang.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class SistemLangController : AbpControllerBase
{
    protected SistemLangController()
    {
        LocalizationResource = typeof(SistemLangResource);
    }
}
