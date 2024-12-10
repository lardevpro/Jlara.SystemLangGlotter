using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Identity;

namespace JLaraSystemLeng.Progresses
{
    public class Progress : FullAuditedAggregateRoot<Guid>
    {
        public Guid UserId { get; set; }
        public decimal? SecondsPractice { get; set; }
        public decimal? SuccessesPronunciation { get; set; }
        public decimal? SuccessesWriting { get; set; }
        public decimal? ProgressLevelCurrent { get; set; }
        public string? Level { get; set; }
        public decimal? ErrorsPronunciation { get; set; }
        public decimal? ErrorsWriting { get; set; }
        public string? MotivationalPhrase { get; set; }

        protected Progress()
        {
        }

        public Progress(
            Guid id,
            Guid userId,
            decimal? secondsPractice,
            decimal? successesPronunciation,
            decimal? successesWriting,
            decimal? progressLevelCurrent,
            string? level,
            decimal? errorsPronunciation,
            decimal? errorsWriting,
            string? motivationalPhrase
        ) : base(id)
        {
            UserId = userId;
            secondsPractice = SecondsPractice;
            successesPronunciation = SuccessesPronunciation;
            successesWriting = SuccessesWriting;
            progressLevelCurrent = ProgressLevelCurrent;
            level = Level;
            errorsPronunciation = ErrorsPronunciation;
            errorsWriting = ErrorsWriting;
            motivationalPhrase = MotivationalPhrase;
        }
    }
}
