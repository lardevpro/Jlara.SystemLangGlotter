using System;
using System.ComponentModel;

namespace JLaraSystemLeng.Exercise.Dtos;

[Serializable]
public class CreateUpdateExerciseDto
{
    [DisplayName("ExercisePhrase")]
    public string? Phrase { get; set; }

    [DisplayName("ExerciseDifficultyLevel")]
    public string? DifficultyLevel { get; set; }

    [DisplayName("ExerciseFocusArea")]
    public string FocusArea { get; set; }
}