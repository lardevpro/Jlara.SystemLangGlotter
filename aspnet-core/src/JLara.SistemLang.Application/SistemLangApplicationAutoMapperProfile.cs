using JLaraSystemLeng.Exercise;
using JLaraSystemLeng.Exercise.Dtos;
using JLaraSystemLeng.Progresses;
using JLaraSystemLeng.Progresses.Dtos;
using JLaraSystemLeng.Sugesstions;
using JLaraSystemLeng.Sugesstions.Dtos;
using JLara.SistemLang.UserExercises;
using JLara.SistemLang.UserExercises.Dtos;
using AutoMapper;

namespace JLara.SistemLang;

public class SistemLangApplicationAutoMapperProfile : Profile
{
    public SistemLangApplicationAutoMapperProfile()
    {
        /* You can configure your AutoMapper mapping configuration here.
         * Alternatively, you can split your mapping configurations
         * into multiple profile classes for a better organization. */
        CreateMap<Exercise, ExerciseDto>();
        CreateMap<CreateUpdateExerciseDto, Exercise>(MemberList.Source);
        CreateMap<Progress, ProgressDto>();
        CreateMap<CreateUpdateProgressDto, Progress>(MemberList.Source);
        CreateMap<Sugesstion, SugesstionDto>();
        CreateMap<CreateUpdateSugesstionDto, Sugesstion>(MemberList.Source);
        CreateMap<UserExercise, UserExerciseDto>();
        CreateMap<CreateUpdateUserExerciseDto, UserExercise>(MemberList.Source);
    }
}
