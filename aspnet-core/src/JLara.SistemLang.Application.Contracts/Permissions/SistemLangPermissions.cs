namespace JLara.SistemLang.Permissions;

public static class SistemLangPermissions
{
    public const string GroupName = "SistemLang";

    //Add your own permission names. Example:
    //public const string MyPermission1 = GroupName + ".MyPermission1";
    public class Exercise
    {
        public const string Default = GroupName + ".Exercise";
        public const string Update = Default + ".Update";
        public const string Create = Default + ".Create";
        public const string Delete = Default + ".Delete";
    }
    public class Progress
    {
        public const string Default = GroupName + ".Progress";
        public const string Update = Default + ".Update";
        public const string Create = Default + ".Create";
        public const string Delete = Default + ".Delete";
    }
    public class Sugesstion
    {
        public const string Default = GroupName + ".Sugesstion";
        public const string Update = Default + ".Update";
        public const string Create = Default + ".Create";
        public const string Delete = Default + ".Delete";
    }
    public class UserExercise
    {
        public const string Default = GroupName + ".UserExercise";
        public const string Update = Default + ".Update";
        public const string Create = Default + ".Create";
        public const string Delete = Default + ".Delete";
    }
}
