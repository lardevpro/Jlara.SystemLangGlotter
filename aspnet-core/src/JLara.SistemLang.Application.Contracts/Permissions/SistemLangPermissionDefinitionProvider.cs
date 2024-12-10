using JLara.SistemLang.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace JLara.SistemLang.Permissions;

public class SistemLangPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(SistemLangPermissions.GroupName);
        //Define your own permissions here. Example:
        //myGroup.AddPermission(SistemLangPermissions.MyPermission1, L("Permission:MyPermission1"));

        var exercisePermission = myGroup.AddPermission(SistemLangPermissions.Exercise.Default, L("Permission:Exercise"));
        exercisePermission.AddChild(SistemLangPermissions.Exercise.Create, L("Permission:Create"));
        exercisePermission.AddChild(SistemLangPermissions.Exercise.Update, L("Permission:Update"));
        exercisePermission.AddChild(SistemLangPermissions.Exercise.Delete, L("Permission:Delete"));

        var progressPermission = myGroup.AddPermission(SistemLangPermissions.Progress.Default, L("Permission:Progress"));
        progressPermission.AddChild(SistemLangPermissions.Progress.Create, L("Permission:Create"));
        progressPermission.AddChild(SistemLangPermissions.Progress.Update, L("Permission:Update"));
        progressPermission.AddChild(SistemLangPermissions.Progress.Delete, L("Permission:Delete"));

        var sugesstionPermission = myGroup.AddPermission(SistemLangPermissions.Sugesstion.Default, L("Permission:Sugesstion"));
        sugesstionPermission.AddChild(SistemLangPermissions.Sugesstion.Create, L("Permission:Create"));
        sugesstionPermission.AddChild(SistemLangPermissions.Sugesstion.Update, L("Permission:Update"));
        sugesstionPermission.AddChild(SistemLangPermissions.Sugesstion.Delete, L("Permission:Delete"));

        var userExercisePermission = myGroup.AddPermission(SistemLangPermissions.UserExercise.Default, L("Permission:UserExercise"));
        userExercisePermission.AddChild(SistemLangPermissions.UserExercise.Create, L("Permission:Create"));
        userExercisePermission.AddChild(SistemLangPermissions.UserExercise.Update, L("Permission:Update"));
        userExercisePermission.AddChild(SistemLangPermissions.UserExercise.Delete, L("Permission:Delete"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<SistemLangResource>(name);
    }
}
