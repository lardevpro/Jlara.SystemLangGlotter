using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Identity;

namespace JLara.SistemLang.UserExercises
{
    public class UserExercise : FullAuditedAggregateRoot<Guid>
    {
        public Guid ExerciseId { get; set; }
        public Guid SugesstionId { get; set; }
        public string? UserPhrase { get; set; }

        protected UserExercise()
        {
        }

        public UserExercise(
            Guid id,
            string? userPhrase
        ) : base(id)
        {
            UserPhrase = userPhrase;
        }

    public UserExercise(
        Guid id,
        Guid exerciseId,
        Guid sugesstionId,
        string? userPhrase
    ) : base(id)
    {
        ExerciseId = exerciseId;
        SugesstionId = sugesstionId;
        UserPhrase = userPhrase;
    }
    }
}
