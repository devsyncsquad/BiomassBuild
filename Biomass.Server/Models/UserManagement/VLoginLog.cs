namespace Biomass.Server.Models.UserManagement
{
    public class VLoginLog
    {
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int UserID { get; set; }
        public DateTime LoginTime { get; set; }
        public string? IPAddress { get; set; }
        public string? RoleName { get; set; }  // ⬅️ Added for role

    }
}
