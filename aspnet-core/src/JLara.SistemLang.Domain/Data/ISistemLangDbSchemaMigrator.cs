using System.Threading.Tasks;

namespace JLara.SistemLang.Data;

public interface ISistemLangDbSchemaMigrator
{
    Task MigrateAsync();
}
