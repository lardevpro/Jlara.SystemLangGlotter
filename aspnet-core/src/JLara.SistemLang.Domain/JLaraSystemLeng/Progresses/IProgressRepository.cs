using System;
using Volo.Abp.Domain.Repositories;

namespace JLaraSystemLeng.Progresses;

public interface IProgressRepository : IRepository<Progress, Guid>
{
}
