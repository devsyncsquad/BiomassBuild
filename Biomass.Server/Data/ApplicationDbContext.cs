using Microsoft.EntityFrameworkCore;
using Biomass.Server.Models;
using Biomass.Server.Models.Company;
using Biomass.Server.Models.Customer;
using Biomass.Server.Models.Banking;
using Biomass.Server.Models.UserManagement;
using Biomass.Server.Models.Lookup;
using Biomass.Server.Models.Vendor;
using Biomass.Server.Models.CostCenter;
using Biomass.Server.Models.Employee;
using Biomass.Server.Models.Cashbook;
using Biomass.Server.Models.Lookup;
using Biomass.Server.Models.MoneyAccount;

namespace Biomass.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Menus> Menus { get; set; }
        public DbSet<MenuRoles> MenuRoles { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<CustomerLocation> CustomerLocations { get; set; }
        public DbSet<MaterialRate> MaterialRates { get; set; }
        //public DbSet<UserCustomer> UserCustomers { get; set; }
        public DbSet<UserCompanies> UserCompanies { get; set; }
        public DbSet<MainMenus> MainMenus { get; set; }
        public DbSet<SubMenus> SubMenus { get; set; }
        public DbSet<SubMenuRoles> SubMenuRoles { get; set; }
        public DbSet<LoginLog> LoginLogs { get; set; }
        public DbSet<BankAccount> BankAccounts { get; set; }
        public DbSet<Lookup> Lookups { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<VendorDocument> VendorDocuments { get; set; }
        public DbSet<VendorReview> VendorReviews { get; set; }
        public DbSet<VendorHistory> VendorHistory { get; set; }
        public DbSet<VendorContact> VendorContacts { get; set; }
        public DbSet<CostCenter> CostCenters { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Cashbook> Cashbooks { get; set; }
        public DbSet<MoneyAccount> MoneyAccounts { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Company>(entity =>
            {
                entity.ToTable("companies");
                entity.HasKey(e => e.CompanyId);
                entity.Property(e => e.CompanyId).HasColumnName("companyid");
                entity.Property(e => e.CompanyName).HasColumnName("companyname").IsRequired().HasMaxLength(200);
                entity.Property(e => e.CompanyAddress).HasColumnName("companyaddress").HasMaxLength(500);
                entity.Property(e => e.NTN).HasColumnName("ntn").HasMaxLength(50);
                entity.Property(e => e.STRN).HasColumnName("strn").HasMaxLength(50);
                entity.Property(e => e.PRA).HasColumnName("pra").HasMaxLength(50);
                entity.Property(e => e.ContactPersonName).HasColumnName("contactpersonname").HasMaxLength(100);
                entity.Property(e => e.ContactPersonPhone).HasColumnName("contactpersonphone").HasMaxLength(20);
                entity.Property(e => e.CompanyDescription).HasColumnName("companydescription").HasMaxLength(200);
                entity.Property(e => e.Industry).HasColumnName("industry").HasMaxLength(100);
                entity.Property(e => e.CompanySize).HasColumnName("companysize").HasMaxLength(50);
                entity.Property(e => e.Location).HasColumnName("location").HasMaxLength(100);
                entity.Property(e => e.LogoPath).HasColumnName("logopath").HasMaxLength(500);
                entity.Property(e => e.CreatedDate).HasColumnName("createddate").IsRequired();
                entity.Property(e => e.LastUpdatedOn).HasColumnName("lastupdatedon");
                entity.Property(e => e.IsActive).HasColumnName("isactive").IsRequired();
                entity.Property(e => e.CreatedBy).HasColumnName("createdby");
                entity.Property(e => e.LastUpdatedBy).HasColumnName("lastupdatedby");
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).HasMaxLength(100);
                entity.Property(e => e.Username).HasMaxLength(100);
                entity.Property(e => e.PasswordHash).HasMaxLength(100);
                entity.Property(e => e.PhoneNumber).HasMaxLength(100);
                entity.Property(e => e.IsTeamLead).HasMaxLength(1);
                entity.Property(e => e.Enabled).HasMaxLength(1);
                entity.Property(e => e.Comments).HasColumnType("text");
                entity.HasIndex(e => e.Username).IsUnique();
            });

            modelBuilder.Entity<Roles>(entity =>
            {
                entity.ToTable("Roles");
                entity.HasKey(e => e.RoleId);
                entity.Property(e => e.RoleName).HasMaxLength(100);
                entity.Property(e => e.Enabled).HasMaxLength(1);
                entity.Property(e => e.Description).HasMaxLength(255);
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.ToTable("UserRoles");
                entity.HasKey(e => e.UserRoleId);
                entity.Property(e => e.IsMainRole).HasMaxLength(5);
                entity.Property(e => e.Enabled).HasMaxLength(5);

                entity.HasOne<Users>()
                      .WithMany()
                      .HasForeignKey(ur => ur.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<Roles>()
                      .WithMany()
                      .HasForeignKey(ur => ur.RoleId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Menus>(entity =>
            {
                entity.ToTable("Menus");
                entity.HasKey(e => e.MenuId);
                entity.Property(e => e.MenuName).HasMaxLength(100);
                entity.Property(e => e.IconUrl).HasMaxLength(255);
                entity.Property(e => e.IsEnabled).HasMaxLength(1);
                entity.Property(e => e.Link).HasMaxLength(200);
            });

            modelBuilder.Entity<MenuRoles>(entity =>
            {
                entity.ToTable("MenuRoles");
                entity.HasKey(e => e.MenuRoleId);

                entity.HasOne<Roles>()
                      .WithMany()
                      .HasForeignKey(mr => mr.RoleId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<Menus>()
                      .WithMany()
                      .HasForeignKey(mr => mr.MenuId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.CustomerId);
                entity.Property(e => e.FirstName).HasMaxLength(100);
                entity.Property(e => e.LastName).HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(150);
                entity.Property(e => e.Phone).HasMaxLength(30);
                entity.Property(e => e.CompanyName).HasMaxLength(150);
                entity.Property(e => e.Address).HasMaxLength(200);
                entity.Property(e => e.City).HasMaxLength(100);
                entity.Property(e => e.State).HasMaxLength(100);
                entity.Property(e => e.PostalCode).HasMaxLength(20);
                entity.Property(e => e.Country).HasMaxLength(100);
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.CreatedDate).IsRequired();
            });

            //modelBuilder.Entity<UserCustomer>(entity =>
            //{
            //    entity.HasKey(e => e.UcId);
            //    entity.Property(e => e.UserId).IsRequired();
            //    entity.Property(e => e.CustomerId).IsRequired();
            //    entity.Property(e => e.Enabled).IsRequired().HasDefaultValue(true);
            //    entity.Property(e => e.CreatedOn).IsRequired().HasDefaultValueSql("NOW()");
                
            //    // Foreign key relationships
            //    entity.HasOne(e => e.User)
            //          .WithMany()
            //          .HasForeignKey(e => e.UserId)
            //          .OnDelete(DeleteBehavior.Cascade);
                
            //    entity.HasOne(e => e.Customer)
            //          .WithMany()
            //          .HasForeignKey(e => e.CustomerId)
            //          .OnDelete(DeleteBehavior.Cascade);
            //});

            modelBuilder.Entity<CustomerLocation>(entity =>
            {
                entity.HasKey(e => e.LocationId);
                entity.Property(e => e.LocationName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LocationCode).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Address).HasMaxLength(250);
                entity.Property(e => e.DispatchChargeType).HasMaxLength(50);
                entity.Property(e => e.VariableChargeType).HasMaxLength(50);
                entity.Property(e => e.ReceivingChargeType).HasMaxLength(50);
                entity.Property(e => e.ReceivingVariableChargeType).HasMaxLength(50);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.CreatedOn).IsRequired();

                entity.HasOne(e => e.Customer)
                      .WithMany(e => e.Locations)
                      .HasForeignKey(e => e.CustomerId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<MaterialRate>(entity =>
            {
                entity.ToTable("material_rates");
                entity.HasKey(e => e.RateId);
                entity.Property(e => e.RateId).HasColumnName("rateid");
                entity.Property(e => e.CustomerId).HasColumnName("customerid");
                entity.Property(e => e.EffectiveDate).HasColumnName("effectivedate").IsRequired();
                entity.Property(e => e.CompanyRate).HasColumnName("company_rate").IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.TransporterRate).HasColumnName("transporter_rate").IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.Route).HasColumnName("route").HasMaxLength(100);
                entity.Property(e => e.MaterialType).HasColumnName("materialtype").HasMaxLength(100);
                entity.Property(e => e.DispatchWeight).HasColumnName("dispatchweight").HasColumnType("decimal(10,2)");
                entity.Property(e => e.ReceivingWeight).HasColumnName("receivingweight").HasColumnType("decimal(10,2)");
                entity.Property(e => e.Status).HasColumnName("status").IsRequired().HasMaxLength(20);
                entity.Property(e => e.CreatedBy).HasColumnName("createdby");
                entity.Property(e => e.CreatedOn).HasColumnName("createdon").IsRequired();
                entity.Property(e => e.LocationId).HasColumnName("location_id");

                // Foreign key relationships
                entity.HasOne(e => e.Customer)
                      .WithMany(e => e.MaterialRates)
                      .HasForeignKey(e => e.CustomerId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.CustomerLocation)
                      .WithMany()
                      .HasForeignKey(e => e.LocationId)
                      .OnDelete(DeleteBehavior.NoAction); // Using NoAction to avoid circular cascade
            });

            modelBuilder.Entity<MainMenus>(entity =>
            {
                entity.HasKey(mm => mm.MainMenuId);
                entity.Property(mm => mm.MainMenuDesc).HasMaxLength(50);
                entity.Property(mm => mm.Enabled).HasMaxLength(5);
                entity.Property(mm => mm.Icon).HasMaxLength(50);
            });

            modelBuilder.Entity<SubMenus>(entity =>
            {
                entity.HasKey(sm => sm.SubMenuId);
                entity.Property(sm => sm.SubMenuDesc).HasMaxLength(1000);
                entity.Property(sm => sm.Link).HasMaxLength(500);
                entity.Property(sm => sm.Icon).HasMaxLength(3000);
                entity.Property(sm => sm.Enabled).HasMaxLength(1);

                entity.HasOne<MainMenus>()
                      .WithMany()
                      .HasForeignKey(sm => sm.MainMenuId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<SubMenuRoles>(entity =>
            {
                entity.HasKey(smr => smr.SubMenuRoleId);

                entity.HasOne<Roles>()
                      .WithMany()
                      .HasForeignKey(smr => smr.RoleId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<SubMenus>()
                      .WithMany()
                      .HasForeignKey(smr => smr.SubMenuId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<LoginLog>(entity =>
            {
                entity.HasKey(ll => ll.LogID);

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(ll => ll.UserID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<BankAccount>(entity =>
            {
                entity.ToTable("bank_accounts");
                entity.HasKey(e => e.BankAccountId);
                entity.Property(e => e.BranchCode).HasMaxLength(100);
                entity.Property(e => e.BranchAddress).HasMaxLength(100);
                entity.Property(e => e.AccountName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.AccountNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.AccountIbanNo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.BankName).HasMaxLength(100);
                entity.Property(e => e.AccountType).HasMaxLength(50);
                entity.Property(e => e.OpeningBalance).HasColumnType("decimal(18,2)");
                entity.Property(e => e.CreatedAt).IsRequired();
            });

            modelBuilder.Entity<VUserCompany>(entity =>
            {
                entity.ToView("VUserCompany");
                entity.HasKey(e => e.CId);
            });

            modelBuilder.Entity<VUserSubMenu>(entity =>
            {
                entity.ToView("VUserSubMenu");
                entity.HasKey(e => e.SubMenuId);
            });

            modelBuilder.Entity<VUserMainMenu>(entity =>
            {
                entity.ToView("VUserMainMenu");
                entity.HasKey(e => e.MainMenuId);
            });

            modelBuilder.Entity<VLoginLog>(entity =>
            {
                entity.ToView("VLoginLog");
                entity.HasNoKey();
            });

            modelBuilder.Entity<UserCompanies>(entity =>
            {
                entity.ToTable("UserCompanies");
                entity.HasKey(e => e.UserCompanyId);
                entity.Property(e => e.Enabled).HasMaxLength(1);
            });

            // Cost Centers
            modelBuilder.Entity<CostCenter>(entity =>
            {
                entity.ToTable("cost_centers");
                entity.HasKey(e => e.CostCenterId);
                entity.Property(e => e.CostCenterId).HasColumnName("cost_center_id");
                entity.Property(e => e.Code).HasColumnName("code").IsRequired();
                entity.HasIndex(e => e.Code).IsUnique();
                entity.Property(e => e.Name).HasColumnName("name").IsRequired();
                entity.Property(e => e.IsActive).HasColumnName("is_active");
                entity.Property(e => e.ParentCostCenterId).HasColumnName("parent_cost_center_id");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.CompanyId).HasColumnName("company_id");

                entity.HasOne(e => e.Parent)
                      .WithMany(e => e.Children)
                      .HasForeignKey(e => e.ParentCostCenterId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Employees
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("employees");
                entity.HasKey(e => e.EmployeeId);
                entity.Property(e => e.EmployeeId).HasColumnName("employee_id");
                entity.Property(e => e.FullName).HasColumnName("full_name").IsRequired().HasMaxLength(100);
                entity.Property(e => e.Designation).HasColumnName("designation").HasMaxLength(100);
                entity.Property(e => e.Phone).HasColumnName("phone").HasMaxLength(20);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
            });

            // Lookups
            modelBuilder.Entity<Lookup>(entity =>
            {
                entity.ToTable("lookups");
                entity.HasKey(e => e.LookUpId);
                entity.Property(e => e.LookUpId).HasColumnName("lookup_id");
                entity.Property(e => e.LookUpName).HasColumnName("lookup_name").IsRequired().HasMaxLength(100);
                entity.Property(e => e.LookUpDomain).HasColumnName("lookup_domain").HasMaxLength(100);
                entity.Property(e => e.Enabled).HasColumnName("enabled").HasMaxLength(1);
                //entity.Property(e => e.CreatedBy).HasColumnName("createdby").HasMaxLength(100);
                entity.Property(e => e.CreatedOn).HasColumnName("created_on").IsRequired();
            });

            // MoneyAccounts
            modelBuilder.Entity<MoneyAccount>(entity =>
            {
                entity.ToTable("money_accounts");
                entity.HasKey(e => e.MoneyAccountId);
                entity.Property(e => e.MoneyAccountId).HasColumnName("money_account_id");
                entity.Property(e => e.AccountCode).HasColumnName("account_code").HasMaxLength(100);
                entity.Property(e => e.Name).HasColumnName("name").IsRequired().HasMaxLength(200);
                entity.Property(e => e.KindLookupId).HasColumnName("kind_lookup_id").IsRequired();
                entity.Property(e => e.AccountHolder).HasColumnName("account_holder").HasMaxLength(200);
                entity.Property(e => e.CompanyRegNo).HasColumnName("company_reg_no").HasMaxLength(100);
                entity.Property(e => e.BankName).HasColumnName("bank_name").HasMaxLength(200);
                entity.Property(e => e.BranchName).HasColumnName("branch_name").HasMaxLength(200);
                entity.Property(e => e.BranchCode).HasColumnName("branch_code").HasMaxLength(100);
                entity.Property(e => e.AccountNumber).HasColumnName("account_number").HasMaxLength(100);
                entity.Property(e => e.Iban).HasColumnName("iban").HasMaxLength(100);
                entity.Property(e => e.SwiftBic).HasColumnName("swift_bic").HasMaxLength(100);
                entity.Property(e => e.WalletProvider).HasColumnName("wallet_provider").HasMaxLength(200);
                entity.Property(e => e.WalletPhone).HasColumnName("wallet_phone").HasMaxLength(50);
                entity.Property(e => e.Currency).HasColumnName("currency").IsRequired().HasMaxLength(10);
                entity.Property(e => e.OpeningBalance).HasColumnName("opening_balance").IsRequired().HasColumnType("numeric(18,2)");
                entity.Property(e => e.OpeningBalanceAsOf).HasColumnName("opening_balance_as_of");
                entity.Property(e => e.IsDefault).HasColumnName("is_default").IsRequired();
                entity.Property(e => e.IsActive).HasColumnName("is_active").IsRequired();
                entity.Property(e => e.Notes).HasColumnName("notes");
                entity.Property(e => e.Meta).HasColumnName("meta").HasColumnType("jsonb");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").IsRequired();
                entity.Property(e => e.CreatedBy).HasColumnName("created_by").HasMaxLength(100);
                entity.Property(e => e.UpdatedBy).HasColumnName("updated_by").HasMaxLength(100);

                // Foreign key relationship with lookups
                entity.HasOne(e => e.KindLookup)
                      .WithMany()
                      .HasForeignKey(e => e.KindLookupId)
                      .OnDelete(DeleteBehavior.NoAction);
            });

            // Cashbook
            modelBuilder.Entity<Cashbook>(entity =>
            {
                entity.ToTable("cashbook");
                entity.HasKey(e => e.CashId);
                entity.Property(e => e.CashId).HasColumnName("cash_id");
                entity.Property(e => e.HappenedAt).HasColumnName("happened_at").IsRequired();
                entity.Property(e => e.CashKindId).HasColumnName("cash_kind_id").IsRequired();
                entity.Property(e => e.Amount).HasColumnName("amount").IsRequired().HasColumnType("numeric(18,2)");
                entity.Property(e => e.Currency).HasColumnName("currency").IsRequired().HasMaxLength(10);
                entity.Property(e => e.MoneyAccountId).HasColumnName("money_account_id");
                entity.Property(e => e.WalletEmployeeId).HasColumnName("wallet_employee_id");
                entity.Property(e => e.CategoryId).HasColumnName("category_id").IsRequired();
                entity.Property(e => e.CostCenterId).HasColumnName("cost_center_id");
                entity.Property(e => e.PaymentModeId).HasColumnName("payment_mode_id");
                entity.Property(e => e.ReferenceNo).HasColumnName("reference_no").HasMaxLength(100);
                entity.Property(e => e.CounterpartyName).HasColumnName("counterparty_name").HasMaxLength(200);
                entity.Property(e => e.Remarks).HasColumnName("remarks").HasMaxLength(500);
                entity.Property(e => e.Meta).HasColumnName("meta").HasColumnType("jsonb");
                entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20);
                entity.Property(e => e.ReceiptPath).HasColumnName("receipt_path").HasMaxLength(500);
            });
        }
    }
}