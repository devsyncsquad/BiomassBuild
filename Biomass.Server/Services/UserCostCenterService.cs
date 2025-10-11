using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.CostCenter;
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
                AssignedCostCenters = assignedCostCenters,
                AvailableCostCenters = availableCostCenters
            };
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
        }
    }
}
