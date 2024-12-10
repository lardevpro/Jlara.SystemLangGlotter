using System;
using Volo.Abp.Application.Dtos;

namespace JLara.SistemLang.UserExercises.Dtos;

[Serializable]
public class UserExerciseDto : FullAuditedEntityDto<Guid>
{
    public Guid ExerciseId { get; set; }

    public Guid SugesstionId { get; set; }

    public string? UserPhrase { get; set; }
}