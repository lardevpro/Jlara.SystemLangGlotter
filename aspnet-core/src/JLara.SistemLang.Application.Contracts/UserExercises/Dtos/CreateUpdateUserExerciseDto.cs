using System;
using System.ComponentModel;

namespace JLara.SistemLang.UserExercises.Dtos;

[Serializable]
public class CreateUpdateUserExerciseDto
{
    [DisplayName("UserExerciseExerciseId")]
    public Guid ExerciseId { get; set; }

    [DisplayName("UserExerciseSugesstionId")]
    public Guid SugesstionId { get; set; }

    [DisplayName("UserExerciseUserPhrase")]
    public string? UserPhrase { get; set; }
}