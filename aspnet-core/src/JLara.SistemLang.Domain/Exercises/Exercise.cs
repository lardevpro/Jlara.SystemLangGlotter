using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Identity;

namespace JLaraSystemLeng.Exercise
{
    public class Exercise : FullAuditedAggregateRoot<Guid>
    {
        public string? Phrase { get; set; }
        public string? DifficultyLevel { get; set; }
        public string FocusArea { get; set; }

    protected Exercise()
    {
    }

    public Exercise(
        Guid id,
        string? phrase,
        string? difficultyLevel,
        string focusArea
    ) : base(id)
    {
        Phrase = phrase;
        DifficultyLevel = difficultyLevel;
        FocusArea = focusArea;
    }
    }
}
