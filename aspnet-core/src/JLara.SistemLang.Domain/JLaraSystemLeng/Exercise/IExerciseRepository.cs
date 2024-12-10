using System;
using Volo.Abp.Domain.Repositories;

namespace JLaraSystemLeng.Exercise;

public interface IExerciseRepository : IRepository<Exercise, Guid>
{
}
