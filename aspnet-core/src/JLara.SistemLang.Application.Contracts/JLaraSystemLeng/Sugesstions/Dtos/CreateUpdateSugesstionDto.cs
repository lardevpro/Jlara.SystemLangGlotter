using System;
using System.ComponentModel;

namespace JLaraSystemLeng.Sugesstions.Dtos;

[Serializable]
public class CreateUpdateSugesstionDto
{
    [DisplayName("SugesstionUserId")]
    public Guid UserId { get; set; }

    [DisplayName("SugesstionSugesstionText")]
    public string? SugesstionText { get; set; }
}