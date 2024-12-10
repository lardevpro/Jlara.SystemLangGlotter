using System;
using Volo.Abp.Application.Dtos;

namespace JLaraSystemLeng.Sugesstions.Dtos;

[Serializable]
public class SugesstionDto : FullAuditedEntityDto<Guid>
{
    public Guid UserId { get; set; }

    public string? SugesstionText { get; set; }
}