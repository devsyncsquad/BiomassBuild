using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Repository;
using Biomass.Server.Services;
using Biomass.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p => p
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});




// Database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("BiomassCon")));

// Register services
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ICustomerLocationService, CustomerLocationService>();
builder.Services.AddScoped<IVendorService, VendorService>();
builder.Services.AddScoped<IMaterialRateService, MaterialRateService>();
builder.Services.AddScoped<IVendorService, VendorService>();
builder.Services.AddScoped<IBankingService, BankingService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IUserManagement, UserManagmentRepository>();
builder.Services.AddScoped<ILookupService, LookupService>();
builder.Services.AddScoped<ICostCenterService, CostCenterService>();
builder.Services.AddScoped<IUserCostCenterService, UserCostCenterService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<ICashbookService, CashbookService>();
builder.Services.AddScoped<IMoneyAccountService, MoneyAccountService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IDriverService, DriverService>();
builder.Services.AddScoped<IDispatchService, DispatchService>();
builder.Services.AddScoped<IDispatchReceiptService, DispatchReceiptService>();
//builder.Services.AddScoped<IUserService, Us>();
//builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();


app.Run();