using System;
using System.ComponentModel;
using Volo.Abp.Application.Dtos;

namespace JLaraSystemLeng.Sugesstions.Dtos;

[Serializable]
public class SugesstionGetListInput : PagedAndSortedResultRequestDto
{
    [DisplayName("SugesstionUserId")]
    public Guid? UserId { get; set; }

    [DisplayName("SugesstionSugesstionText")]
    public string? SugesstionText { get; set; }
}