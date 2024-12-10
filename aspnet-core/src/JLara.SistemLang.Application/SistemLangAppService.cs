using System;
using System.Collections.Generic;
using System.Text;
using JLara.SistemLang.Localization;
using Volo.Abp.Application.Services;

namespace JLara.SistemLang;

/* Inherit your application services from this class.
 */
public abstract class SistemLangAppService : ApplicationService
{
    protected SistemLangAppService()
    {
        LocalizationResource = typeof(SistemLangResource);
    }
}
