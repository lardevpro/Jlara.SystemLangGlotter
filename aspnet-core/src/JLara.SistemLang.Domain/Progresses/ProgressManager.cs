using JLaraSystemLeng.Progresses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace JLara.SistemLang.Progresses
{
    public class ProgressManager : DomainService
    {
        protected IProgressRepository _progressRepository => LazyServiceProvider.LazyGetRequiredService<IProgressRepository>();

        public ProgressManager() { 
        
        }
        
        public async Task<Progress> CreateProgress(Guid UserId)
        {
            Progress progress = new(GuidGenerator.Create(), UserId, 0, 0, 0, 0, "", 0, 0,"");

            return await _progressRepository.InsertAsync(progress);
        }

    }
}
