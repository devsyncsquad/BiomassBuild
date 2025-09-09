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
using Biomass.Server.Models.Vehicle;
using Biomass.Server.Models.Driver;
using Biomass.Server.Models.Dispatch;

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
        public DbSet<UserCustomer> UserCustomers { get; set; }
        public DbSet<UserCompanies> UserCompanies { get; set; }
        public DbSet<MainMenus> MainMenus { get; set; }
        public DbSet<SubMenus> SubMenus { get; set; }
        public DbSet<SubMenuRoles> SubMenuRoles { get; set; }
        public DbSet<LoginLog> LoginLogs { get; set; }
        public DbSet<BankAccount> BankAccounts { get; set; }
        public DbSet<Lookup> Lookups { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Driver> Drivers { get; set; }

        public DbSet<CostCenter> CostCenters { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Cashbook> Cashbooks { get; set; }
        public DbSet<MoneyAccount> MoneyAccounts { get; set; }
        public DbSet<Dispatch> Dispatches { get; set; }
        public DbSet<ApLedger> ApLedgers { get; set; }
        public DbSet<VLocationDto> VLocations { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Define v_locations view
    modelBuilder.Entity<VLocationDto>(entity =>
    {
        entity.ToView("v_locations");
        entity.HasNoKey();
    });
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
                entity.ToTable("locations");
                entity.HasKey(e => e.LocationId);
                entity.Property(e => e.LocationId).HasColumnName("locationid");
                entity.Property(e => e.CustomerId).HasColumnName("customerid").IsRequired();
                entity.Property(e => e.LocationName).HasColumnName("locationname").IsRequired().HasMaxLength(100);
                entity.Property(e => e.LocationCode).HasColumnName("locationcode").IsRequired().HasMaxLength(50);
                entity.Property(e => e.Address).HasColumnName("address").HasMaxLength(250);
                entity.Property(e => e.Latitude).HasColumnName("latitude").HasColumnType("decimal(10,7)");
                entity.Property(e => e.Longitude).HasColumnName("longitude").HasColumnType("decimal(10,7)");
                entity.Property(e => e.CenterDispatchWeightLimit).HasColumnName("center_dispatch_weight_limit").HasColumnType("decimal(10,2)");
                entity.Property(e => e.AdvancePercentageAllowed).HasColumnName("advance_percentage_allowed").HasColumnType("decimal(5,2)");
                entity.Property(e => e.ToleranceLimitPercentage).HasColumnName("tolerance_limit_percentage").HasColumnType("decimal(5,2)");
                entity.Property(e => e.ToleranceLimitKg).HasColumnName("tolerance_limit_kg").HasColumnType("decimal(10,2)");
                entity.Property(e => e.MaterialPenaltyRatePerKg).HasColumnName("material_penalty_rateperkg").HasColumnType("decimal(10,2)");
                entity.Property(e => e.DispatchLoadingChargesEnabled).HasColumnName("dispatch_loading_charges_enabled");
                entity.Property(e => e.DispatchChargeType).HasColumnName("dispatch_charge_type").HasMaxLength(50);
                entity.Property(e => e.FixedLoaderCost).HasColumnName("fixed_loader_cost").HasColumnType("decimal(10,2)");
                entity.Property(e => e.VariableChargeType).HasColumnName("variable_charge_type").HasMaxLength(50);
                entity.Property(e => e.VariableChargeAmount).HasColumnName("variable_charge_amount").HasColumnType("decimal(10,2)");
                entity.Property(e => e.LaborChargesEnabled).HasColumnName("labor_charges_enabled");
                entity.Property(e => e.LaborChargeType).HasColumnName("labor_charge_type").HasMaxLength(50);
                entity.Property(e => e.LaborChargesCost).HasColumnName("labor_charges_cost").HasColumnType("decimal(10,2)");
                entity.Property(e => e.ReceivingUnloadingCostEnabled).HasColumnName("receiving_unloading_cost_enabled");
                entity.Property(e => e.ReceivingChargeType).HasColumnName("receiving_charge_type").HasMaxLength(50);
                entity.Property(e => e.FixedUnloadingCost).HasColumnName("fixed_unloading_cost").HasColumnType("decimal(10,2)");
                entity.Property(e => e.ReceivingVariableChargeType).HasColumnName("receiving_variable_charge_type").HasMaxLength(50);
                entity.Property(e => e.ReceivingVariableChargeAmount).HasColumnName("receiving_variable_charge_amount").HasColumnType("decimal(10,2)");
                entity.Property(e => e.Status).HasColumnName("status").IsRequired().HasMaxLength(20);
                entity.Property(e => e.CreatedBy).HasColumnName("createdby");
                entity.Property(e => e.CreatedOn).HasColumnName("createdon").IsRequired();
                entity.Property(e => e.LastUpdatedBy).HasColumnName("lastupdatedby");
                entity.Property(e => e.LastUpdatedOn).HasColumnName("lastupdatedon");

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
                entity.Property(e => e.EffectiveDate).HasColumnName("effectivedate");
                entity.Property(e => e.CompanyRate).HasColumnName("company_rate").IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.TransporterRate).HasColumnName("transporter_rate").IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.DieselRate).HasColumnName("diesel_rate").HasColumnType("decimal(18,2)");
               // entity.Property(e => e.DispatchWeight).HasColumnName("dispatchweight").HasColumnType("decimal(10,2)");
               // entity.Property(e => e.ReceivingWeight).HasColumnName("receivingweight").HasColumnType("decimal(10,2)");
                entity.Property(e => e.Route).HasColumnName("route").HasMaxLength(100);
                entity.Property(e => e.MaterialType).HasColumnName("materialtype").HasMaxLength(100);
                entity.Property(e => e.Status).HasColumnName("status").IsRequired().HasMaxLength(20);
                entity.Property(e => e.CreatedBy).HasColumnName("createdby");
                entity.Property(e => e.CreatedOn).HasColumnName("createdon").IsRequired();
                entity.Property(e => e.LocationId).HasColumnName("location_id");

                // Remove foreign key constraints to avoid database schema issues
                // These will be handled at the application level
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
                entity.HasKey(e => e.LookupId);
                entity.Property(e => e.LookupId).HasColumnName("lookup_id");
                entity.Property(e => e.LookupName).HasColumnName("lookup_name").IsRequired().HasMaxLength(100);
                entity.Property(e => e.LookupDomain).HasColumnName("lookup_domain").IsRequired().HasMaxLength(100);
                entity.Property(e => e.Enabled).HasColumnName("enabled").IsRequired();
                entity.Property(e => e.SortOrder).HasColumnName("sort_order").IsRequired();
                entity.Property(e => e.CreatedOn).HasColumnName("created_on").IsRequired();
                entity.Property(e => e.CreatedBy).HasColumnName("created_by");
                entity.Property(e => e.ShowInDispatch).HasColumnName("show_in_dispatch");
            });

            // MoneyAccounts
            // Configure Vehicle entity
            modelBuilder.Entity<Vehicle>(entity =>
            {
                entity.ToTable("vehicles");
                entity.HasKey(e => e.VehicleId);
                entity.Property(e => e.VehicleId).HasColumnName("vehicleid");
                entity.Property(e => e.VehicleNumber).HasColumnName("vehiclenumber").IsRequired().HasMaxLength(50);
                entity.Property(e => e.VehicleType).HasColumnName("vehicletype").IsRequired().HasMaxLength(50);
                entity.Property(e => e.Capacity).HasColumnName("capacity").HasColumnType("decimal(10,2)");
                entity.Property(e => e.FuelType).HasColumnName("fueltype").IsRequired().HasMaxLength(50);
                entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20);
                entity.Property(e => e.CreatedOn).HasColumnName("createdon");
                entity.Property(e => e.VehicleRegNumber).HasColumnName("vehicle_reg_number");
                entity.Property(e => e.VendorId).HasColumnName("vendorid");
                entity.Property(e => e.CostCenterId).HasColumnName("cost_center_id");

                // Configure one-to-one relationship with Driver
                entity.HasOne(v => v.Driver)
                      .WithOne(d => d.Vehicle)
                      .HasForeignKey<Driver>(d => d.VehicleId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure Driver entity
            modelBuilder.Entity<Driver>(entity =>
            {
                entity.ToTable("drivers");
                entity.HasKey(e => e.DriverId);
                entity.Property(e => e.DriverId).HasColumnName("driverid");
                entity.Property(e => e.FullName).HasColumnName("fullname").IsRequired().HasMaxLength(100);
                entity.Property(e => e.CNIC).HasColumnName("cnic").HasMaxLength(20);
                entity.Property(e => e.LicenseNumber).HasColumnName("licensenumber").IsRequired().HasMaxLength(50);
                entity.Property(e => e.PhoneNumber).HasColumnName("phonenumber").HasMaxLength(20);
                entity.Property(e => e.Address).HasColumnName("address").HasMaxLength(200);
                entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20);
                entity.Property(e => e.CreatedOn).HasColumnName("createdon");

                // Add VehicleId foreign key
                entity.Property<int?>("VehicleId").HasColumnName("vehicleid");
            });

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

            // Configure Dispatch entity
            modelBuilder.Entity<Dispatch>(entity =>
            {
                entity.ToTable("dispatches");
                entity.HasKey(e => e.DispatchId);
                entity.Property(e => e.DispatchId).HasColumnName("dispatchid");
                entity.Property(e => e.VehicleId).HasColumnName("vehicleid").IsRequired();
                entity.Property(e => e.LocationId).HasColumnName("locationid").IsRequired();
                entity.Property(e => e.MaterialType).HasColumnName("materialtype").HasMaxLength(100);
                entity.Property(e => e.MaterialRate).HasColumnName("materialrate").HasColumnType("numeric(18,2)");
                entity.Property(e => e.SlipNumber).HasColumnName("slipnumber").HasMaxLength(50);
                entity.Property(e => e.SlipPicture).HasColumnName("slippicture").HasMaxLength(255);
                entity.Property(e => e.FirstWeight).HasColumnName("firstweight").HasColumnType("numeric(18,2)");
                entity.Property(e => e.SecondWeight).HasColumnName("secondweight").HasColumnType("numeric(18,2)");
                entity.Property(e => e.NetWeight).HasColumnName("netweight").HasColumnType("numeric(18,2)");
                entity.Property(e => e.LoaderCharges).HasColumnName("loadercharges").HasColumnType("numeric(18,2)");
                entity.Property(e => e.LoaderChargesAuto).HasColumnName("loaderchargesauto");
                entity.Property(e => e.LoaderChargesType).HasColumnName("loaderchargestype").HasMaxLength(20);
                entity.Property(e => e.LaborCharges).HasColumnName("laborcharges").HasColumnType("numeric(18,2)");
                entity.Property(e => e.LaborChargesAuto).HasColumnName("laborchargesauto");
                entity.Property(e => e.LaborChargesType).HasColumnName("laborchargestype").HasMaxLength(20);
                entity.Property(e => e.TransporterRate).HasColumnName("transporterrate").HasColumnType("numeric(18,2)");
                entity.Property(e => e.TransporterRateAuto).HasColumnName("transporterrateauto");
                entity.Property(e => e.TransporterChargesType).HasColumnName("transporterchargestype").HasMaxLength(20);
                entity.Property(e => e.Amount).HasColumnName("amount").HasColumnType("numeric(18,2)");
                entity.Property(e => e.TotalDeduction).HasColumnName("totaldeduction").HasColumnType("numeric(18,2)");
                entity.Property(e => e.CreatedBy).HasColumnName("createdby");
                entity.Property(e => e.CreatedOn).HasColumnName("createdon");
                entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20);
                entity.Property(e => e.PayableWeight).HasColumnName("payable_weight");
                entity.Property(e => e.BucketVendorId).HasColumnName("bucket_vendor_id");
                entity.Property(e => e.LabourVendorId).HasColumnName("labour_vendor_id");
                entity.Property(e => e.MaterialId).HasColumnName("material_id");
                entity.Property(e => e.TransporterVendorId).HasColumnName("transporter_vendor_id");
                entity.Property(e => e.BucketRatePerMund).HasColumnName("bucket_rate_per_mund").HasColumnType("numeric(18,2)");
                entity.Property(e => e.LaborRatePerMund).HasColumnName("labor_rate_per_mund").HasColumnType("numeric(18,2)");
                entity.Property(e => e.TransporterRatePerMund).HasColumnName("transporter_rate_per_mund").HasColumnType("numeric(18,2)");

                // Configure foreign key relationships
                entity.HasOne(d => d.Vehicle)
                      .WithMany()
                      .HasForeignKey(d => d.VehicleId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.Location)
                      .WithMany()
                      .HasForeignKey(d => d.LocationId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.BucketVendor)
                      .WithMany()
                      .HasForeignKey(d => d.BucketVendorId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.LabourVendor)
                      .WithMany()
                      .HasForeignKey(d => d.LabourVendorId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.TransporterVendor)
                      .WithMany()
                      .HasForeignKey(d => d.TransporterVendorId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure ApLedger entity
            modelBuilder.Entity<ApLedger>(entity =>
            {
                entity.ToTable("ap_ledger");
                entity.HasKey(e => e.ApEntryId);
                entity.Property(e => e.ApEntryId).HasColumnName("ap_entry_id");
                entity.Property(e => e.VendorId).HasColumnName("vendor_id").IsRequired();
                entity.Property(e => e.HappenedAt).HasColumnName("happened_at").IsRequired();
                entity.Property(e => e.EntryKind).HasColumnName("entry_kind").IsRequired().HasMaxLength(50);
                entity.Property(e => e.Amount).HasColumnName("amount").IsRequired().HasColumnType("numeric(18,2)");
                entity.Property(e => e.Currency).HasColumnName("currency").IsRequired().HasMaxLength(10);
                entity.Property(e => e.DispatchId).HasColumnName("dispatchid");
                entity.Property(e => e.CashId).HasColumnName("cash_id");
                entity.Property(e => e.ReferenceNo).HasColumnName("reference_no").HasMaxLength(100);
                entity.Property(e => e.Remarks).HasColumnName("remarks");
                entity.Property(e => e.CreatedBy).HasColumnName("created_by");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();

                // Configure foreign key relationships
                entity.HasOne(a => a.Vendor)
                      .WithMany()
                      .HasForeignKey(a => a.VendorId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.Dispatch)
                      .WithMany()
                      .HasForeignKey(a => a.DispatchId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.Cashbook)
                      .WithMany()
                      .HasForeignKey(a => a.CashId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}