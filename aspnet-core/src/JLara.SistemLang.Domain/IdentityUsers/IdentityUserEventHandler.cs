using JLara.SistemLang.Progresses;
using JLaraSystemLeng.Progresses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Events.Distributed;
using Volo.Abp.Domain.Services;
using Volo.Abp.EventBus;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.Identity;

namespace JLara.SistemLang.IdentityUsers
{
    internal class IdentityUserEventHandler : DomainService, IDistributedEventHandler<EntityCreatedEto<IdentityUser>>
    {
        protected ProgressManager _progressManager => LazyServiceProvider.LazyGetRequiredService<ProgressManager>();
        public async Task HandleEventAsync(EntityCreatedEto<IdentityUser> eventData)
        {
            await _progressManager.CreateProgress(eventData.Entity.Id);
        }
    }
}
