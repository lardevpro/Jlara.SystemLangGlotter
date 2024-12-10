using System;
using System.ComponentModel;
using Volo.Abp.Application.Dtos;

namespace JLara.SistemLang.UserExercises.Dtos;

[Serializable]
public class UserExerciseGetListInput : PagedAndSortedResultRequestDto
{
    [DisplayName("UserExerciseExerciseId")]
    public Guid? ExerciseId { get; set; }

    [DisplayName("UserExerciseSugesstionId")]
    public Guid? SugesstionId { get; set; }

    [DisplayName("UserExerciseUserPhrase")]
    public string? UserPhrase { get; set; }
}