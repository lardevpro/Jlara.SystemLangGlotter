using System;
using Volo.Abp.Domain.Repositories;

namespace JLara.SistemLang.UserExercises;

public interface IUserExerciseRepository : IRepository<UserExercise, Guid>
{
}
