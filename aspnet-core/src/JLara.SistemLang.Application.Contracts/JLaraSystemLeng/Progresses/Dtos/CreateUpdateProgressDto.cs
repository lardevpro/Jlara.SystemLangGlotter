using System;
using System.ComponentModel;

namespace JLaraSystemLeng.Progresses.Dtos;

[Serializable]
public class CreateUpdateProgressDto
{
    [DisplayName("ProgressUserId")]
    public Guid? UserId { get; set; }

    [DisplayName("PronunciationAccuracy")]
    public decimal? PronunciationAccuracy { get; set; }

    [DisplayName("SecondsPractice")]
    public decimal? SecondsPractice { get; set; }

    [DisplayName("SuccessesPronunciation")]
    public decimal? SuccessesPronunciation { get; set; }

    [DisplayName("SuccessesWriting")]
    public decimal? SuccessesWriting { get; set; }

    [DisplayName("ProgressLevelCurrent")]
    public decimal? ProgressLevelCurrent { get; set; }

    [DisplayName("Level")]
    public string? Level { get; set; }

    [DisplayName("ErrorsPronunciation")]
    public decimal? ErrorsPronunciation { get; set; }

    [DisplayName("ErrorsWriting")]
    public decimal? ErrorsWriting { get; set; }

    [DisplayName("MotivationalPhrase")]
    public string? MotivationalPhrase { get; set; }
}