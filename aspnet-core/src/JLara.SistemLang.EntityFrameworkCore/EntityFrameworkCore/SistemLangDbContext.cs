using Microsoft.EntityFrameworkCore;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using JLaraSystemLeng.Exercise;
using Volo.Abp.EntityFrameworkCore.Modeling;
using JLaraSystemLeng.Progresses;
using JLaraSystemLeng.Sugesstions;
using JLara.SistemLang.UserExercises;

namespace JLara.SistemLang.EntityFrameworkCore;

[ReplaceDbContext(typeof(IIdentityDbContext))]
[ReplaceDbContext(typeof(ITenantManagementDbContext))]
[ConnectionStringName("Default")]
public class SistemLangDbContext :
    AbpDbContext<SistemLangDbContext>,
    IIdentityDbContext,
    ITenantManagementDbContext
{
    /* Add DbSet properties for your Aggregate Roots / Entities here. */

    #region Entities from the modules

    /* Notice: We only implemented IIdentityDbContext and ITenantManagementDbContext
     * and replaced them for this DbContext. This allows you to perform JOIN
     * queries for the entities of these modules over the repositories easily. You
     * typically don't need that for other modules. But, if you need, you can
     * implement the DbContext interface of the needed module and use ReplaceDbContext
     * attribute just like IIdentityDbContext and ITenantManagementDbContext.
     *
     * More info: Replacing a DbContext of a module ensures that the related module
     * uses this DbContext on runtime. Otherwise, it will use its own DbContext class.
     */

    //Identity
    public DbSet<IdentityUser> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<IdentityClaimType> ClaimTypes { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
    public DbSet<IdentityLinkUser> LinkUsers { get; set; }
    public DbSet<IdentityUserDelegation> UserDelegations { get; set; }
    public DbSet<IdentitySession> Sessions { get; set; }
    // Tenant Management
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

    #endregion
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<Progress> Progresses { get; set; }
    public DbSet<Sugesstion> Sugesstions { get; set; }
    public DbSet<UserExercise> UserExercises { get; set; }

    public SistemLangDbContext(DbContextOptions<SistemLangDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureFeatureManagement();
        builder.ConfigureTenantManagement();

        /* Configure your own tables/entities inside here */

        //builder.Entity<YourEntity>(b =>
        //{
        //    b.ToTable(SistemLangConsts.DbTablePrefix + "YourEntities", SistemLangConsts.DbSchema);
        //    b.ConfigureByConvention(); //auto configure for the base class props
        //    //...
        //});


        builder.Entity<Exercise>(b =>
        {
            b.ToTable(SistemLangConsts.DbTablePrefix + "Exercises", SistemLangConsts.DbSchema);
            b.ConfigureByConvention();

            /* Configure more properties here */
        });


        builder.Entity<Progress>(b =>
        {
            b.ToTable(SistemLangConsts.DbTablePrefix + "Progresses", SistemLangConsts.DbSchema);
            b.ConfigureByConvention();

            b.HasOne<IdentityUser>().WithMany().HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.NoAction);

            /* Configure more properties here */
        });


        builder.Entity<Sugesstion>(b =>
        {
            b.ToTable(SistemLangConsts.DbTablePrefix + "Sugesstions", SistemLangConsts.DbSchema);
            b.ConfigureByConvention();

            b.HasOne<IdentityUser>().WithMany().HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.NoAction);
            

            /* Configure more properties here */
        });


        builder.Entity<UserExercise>(b =>
        {
            b.ToTable(SistemLangConsts.DbTablePrefix + "UserExercises", SistemLangConsts.DbSchema);
            b.ConfigureByConvention();

            b.HasOne<Exercise>().WithMany().HasForeignKey(p => p.ExerciseId).OnDelete(DeleteBehavior.NoAction);
            b.HasOne<Sugesstion>().WithMany().HasForeignKey(p => p.SugesstionId).OnDelete(DeleteBehavior.NoAction);

            /* Configure more properties here */
        });

    }
}
