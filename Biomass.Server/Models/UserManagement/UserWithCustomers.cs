using System.Collections.Generic;

namespace Biomass.Server.Models.UserManagement
{
    public class UserWithCustomers
    {
        public Users User { get; set; } = new Users();
        public List<int> CustomerIds { get; set; } = new List<int>();
    }
}
