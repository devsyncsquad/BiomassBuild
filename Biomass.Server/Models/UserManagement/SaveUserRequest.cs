namespace Biomass.Server.Models.UserManagement
{
    public class SaveUserRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? PasswordHash { get; set; }
        public int? EmpNo { get; set; }
        public string? PhoneNumber { get; set; }
        public string? IsTeamLead { get; set; }
        public string? Enabled { get; set; }
        public string? Comments { get; set; }
        public int? ReportingTo { get; set; }
        public int? RoleId { get; set; }
        public List<int> CustomerIds { get; set; } = new List<int>();
        public int? CreatedBy { get; set; }
    }
}
