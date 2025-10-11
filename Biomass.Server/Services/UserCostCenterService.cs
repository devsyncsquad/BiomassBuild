using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.CostCenter;
using Biomass.Server.Models.UserManagement;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Services
{
    public class UserCostCenterService : IUserCostCenterService
    {
        private readonly ApplicationDbContext _context;

        public UserCostCenterService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserCostCenterAssignmentDto> GetUserCostCenterAssignmentAsync(int userId)
        {
            // Get user information
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new ArgumentException($"User with ID {userId} not found.");
            }

            // Get assigned cost centers for the user
            var assignedCostCenters = await _context.VUserCostCenters
                .Where(v => v.UserId == userId)
                .Select(v => new UserCostCenterDto
                {
                    UserId = v.UserId,
                    CostCenterId = v.CostCenterId,
                    CanPost = v.CanPost,
                    Username = v.Username,
                    CostCenterName = v.CostCenterName,
                    IsActive = v.IsActive
                })
                .ToListAsync();

            // Get all available cost centers
            var availableCostCenters = await _context.CostCenters
                .Where(cc => cc.IsActive)
                .Select(cc => new CostCenterDto
                {
                    CostCenterId = cc.CostCenterId,
                    Code = cc.Code,
                    Name = cc.Name,
                    IsActive = cc.IsActive,
                    ParentCostCenterId = cc.ParentCostCenterId,
                    CompanyId = cc.CompanyId,
                    CreatedAt = cc.CreatedAt
                })
                .ToListAsync();
            return new UserCostCenterAssignmentDto
            {
                UserId = userId,
                Username = user.Username,
                UserName = $"{user.FirstName} {user.LastName}",
                AssignedCostCenters = assignedCostCenters,
                AvailableCostCenters = availableCostCenters
            };
        }


        public async Task<List<UserCostCenterDto>> GetUserCostCentersAsync(int userId)
        {
            var userCostCenters = await _context.UserCostCenters
                .Include(ucc => ucc.User)
                .Include(ucc => ucc.CostCenter)
                .Where(ucc => ucc.UserId == userId)
                .OrderBy(ucc => ucc.CostCenter.Name)
                .ToListAsync();

            return userCostCenters.Select(MapToDto).ToList();
        }

        public async Task<UserCostCenterAssignmentDto> GetUserCostCenterAssignmentAsync(int userId)
        {
            // Fetch user by correct PK column (not FindAsync)
            var user = await _context.Users
                .AsNoTracking()
                .SingleOrDefaultAsync(u => u.UserId == userId);   //  use your mapped property
            if (user == null) throw new ArgumentException("User not found");

            var allCostCenters = await _context.CostCenters
                .AsNoTracking()
                .Where(cc => cc.IsActive)
                .OrderBy(cc => cc.Name)
                .ToListAsync();

            // bigint in user_cost_centers vs int in cost_centers cast to int
            var assignedCostCenterIds = await _context.UserCostCenters
                .AsNoTracking()
                .Where(ucc => ucc.UserId == userId)
                .Select(ucc => (int)ucc.CostCenterId)
                .ToListAsync();

            var assignedCostCenters = allCostCenters
                .Where(cc => assignedCostCenterIds.Contains(cc.CostCenterId))
                .Select(cc => new CostCenterAssignmentDto
                {
                    CostCenterId = cc.CostCenterId,
                    CostCenterName = cc.Name,
                    CostCenterCode = cc.Code,
                    IsAssigned = true,
                    // AssignedAt not present in schema leave null or remove from DTO
                })
                .ToList();

            var availableCostCenters = allCostCenters
                .Where(cc => !assignedCostCenterIds.Contains(cc.CostCenterId))
                .Select(cc => new CostCenterAssignmentDto
                {
                    CostCenterId = cc.CostCenterId,
                    CostCenterName = cc.Name,
                    CostCenterCode = cc.Code,
                    IsAssigned = false
                })
                .ToList();
        }

          

        public async Task<UserCostCenterDto> AssignCostCenterToUserAsync(AssignCostCenterRequest request)
        {

            // Check if user exists
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
            {
                throw new ArgumentException($"User with ID {request.UserId} not found.");
            }

            // Check if cost center exists
            var costCenter = await _context.CostCenters.FindAsync(request.CostCenterId);
            if (costCenter == null)
            {
                throw new ArgumentException($"Cost center with ID {request.CostCenterId} not found.");
            }

            // Check if assignment already exists
            var existingAssignment = await _context.UserCostCenters
                .FirstOrDefaultAsync(uc => uc.UserId == request.UserId && uc.CostCenterId == request.CostCenterId);

            if (existingAssignment != null)
            {
                // Update existing assignment
                existingAssignment.CanPost = request.CanPost;
            }
            else
            {
                // Create new assignment
                var newAssignment = new UserCostCenter
                {
                    UserId = request.UserId,
                    CostCenterId = request.CostCenterId,
                    CanPost = request.CanPost
                };
                _context.UserCostCenters.Add(newAssignment);
            }

            await _context.SaveChangesAsync();

            // Return the assigned cost center DTO
            return new UserCostCenterDto
            {
                UserId = request.UserId,
                CostCenterId = request.CostCenterId,
                CanPost = request.CanPost,
                Username = user.Username,
                CostCenterName = costCenter.Name,
                CostCenterCode = costCenter.Code,
                IsActive = costCenter.IsActive
            };
        }

        public async Task<List<UserCostCenterDto>> GetUserCostCentersAsync(int userId)
        {
            var userCostCenters = await _context.VUserCostCenters
                .Where(v => v.UserId == userId)
                .Select(v => new UserCostCenterDto
                {
                    UserId = v.UserId,
                    CostCenterId = v.CostCenterId,
                    CanPost = v.CanPost,
                    Username = v.Username,
                    CostCenterName = v.CostCenterName,
                    IsActive = v.IsActive
                })
                .ToListAsync();

            return userCostCenters;
        }

        public async Task<bool> RemoveCostCenterFromUserAsync(int userId, int costCenterId)
        {
            var assignment = await _context.UserCostCenters
                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CostCenterId == costCenterId);

            if (assignment == null)
            {
                return false;
            }

            _context.UserCostCenters.Remove(assignment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnassignCostCenterFromUserAsync(int userId, int costCenterId)
        {
            return await RemoveCostCenterFromUserAsync(userId, costCenterId);
            // Validate existence (don't use FindAsync)
            var userExists = await _context.Users
                .AsNoTracking()
                .AnyAsync(u => u.UserId == request.UserId); // <-- map to your PK property
            if (!userExists) throw new ArgumentException("User not found");

            var ccExists = await _context.CostCenters
                .AsNoTracking()
                .AnyAsync(cc => cc.CostCenterId == request.CostCenterId); // <-- map to your PK property
            if (!ccExists) throw new ArgumentException("Cost center not found");

            // Insert (align with table: user_id, cost_center_id, can_post)
            var entity = new UserCostCenter
            {
                // IMPORTANT: types should be long if columns are bigint
                UserId = request.UserId,
                CostCenterId = request.CostCenterId,
                //CanPost = request.CanPost // nullable bool? if you want; else set true/false or null
            };

            _context.UserCostCenters.Add(entity);
            await _context.SaveChangesAsync();

            return new UserCostCenterDto
            {
                UserId = (int)entity.UserId,                 // cast only if your DTO uses int
                CostCenterId = (int)entity.CostCenterId,     // ditto
                //CanPost = entity.CanPost
            };
        }

         public async Task<bool> UnassignCostCenterFromUserAsync(int userId, int costCenterId)
         {
             var userCostCenter = await _context.UserCostCenters
                 .FirstOrDefaultAsync(ucc => ucc.UserId == userId && 
                                           ucc.CostCenterId == costCenterId);

             if (userCostCenter == null)
                 return false;

             _context.UserCostCenters.Remove(userCostCenter);
             await _context.SaveChangesAsync();

             return true;
         }

        public async Task<List<UserCostCenterDto>> GetAllUserCostCentersAsync()
        {
            var userCostCenters = await _context.UserCostCenters
                .Include(ucc => ucc.CostCenter)
                .Include(ucc => ucc.User)
                .OrderBy(ucc => ucc.User.FirstName)
                .ThenBy(ucc => ucc.CostCenter.Name)
                .ToListAsync();

            return userCostCenters.Select(MapToDto).ToList();
        }

        public async Task<bool> IsCostCenterAssignedToUserAsync(int userId, int costCenterId)
        {
            return await _context.UserCostCenters
                .AnyAsync(ucc => ucc.UserId == userId && 
                               ucc.CostCenterId == costCenterId);
        }

        private static UserCostCenterDto MapToDto(UserCostCenter userCostCenter)
        {
            return new UserCostCenterDto
            {
                //Id = userCostCenter.Id,
                UserId = userCostCenter.UserId,
                CostCenterId = userCostCenter.CostCenterId,
                
                UserName = userCostCenter.User != null ? 
                    $"{userCostCenter.User.FirstName} {userCostCenter.User.LastName}" : null,
                CostCenterName = userCostCenter.CostCenter?.Name,
                CostCenterCode = userCostCenter.CostCenter?.Code
            };

        }
    }
}
