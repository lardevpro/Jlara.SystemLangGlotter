using System;
using System.ComponentModel;
using Volo.Abp.Application.Dtos;

namespace JLaraSystemLeng.Exercise.Dtos;

[Serializable]
public class ExerciseGetListInput : PagedAndSortedResultRequestDto
{
    [DisplayName("ExercisePhrase")]
    public string? Phrase { get; set; }

    [DisplayName("ExerciseDifficultyLevel")]
    public string? DifficultyLevel { get; set; }

    [DisplayName("ExerciseFocusArea")]
    public string? FocusArea { get; set; }
}