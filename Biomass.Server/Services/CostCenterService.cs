using Biomass.Api.Model;
using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.CostCenter;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Services
{
	public class CostCenterService : ICostCenterService
	{
		private readonly ApplicationDbContext _db;

		public CostCenterService(ApplicationDbContext db)
		{
			_db = db;
		}

        // Service
        public async Task<ServiceResponse<List<VCostCenter>>> GetAllViewAsync()
        {
            var resp = new ServiceResponse<List<VCostCenter>>();
            try
            {
                var query =
                    from c in _db.CostCenters.AsNoTracking()
                    join p in _db.CostCenters.AsNoTracking()
                        on c.ParentCostCenterId equals p.CostCenterId into gp
                    from p in gp.DefaultIfEmpty()
                    select new VCostCenter
                    {
                        CostCenterId = c.CostCenterId,
                        Code = c.Code,
                        Name = c.Name,
                        IsActive = c.IsActive,
                        ParentCostCenterId = c.ParentCostCenterId,
                        CreatedAt = c.CreatedAt,
                        IsChild = c.ParentCostCenterId != null,
                        ParentName = p != null ? p.Name : null
                    };

                var items = await query
                    .OrderBy(x => x.ParentName)   // parents grouped; nulls first
                    .ThenBy(x => x.Name)
                    .ToListAsync();
				resp.Result = items;
                resp.Success = true;
            }
            catch (Exception ex)
            {
                resp.Success = false;
                resp.Message = ex.Message;
            }
            return resp;
        }
        public async Task<ServiceResponse<List<CostCenterDto>>> GetTreeAsync(int? companyId = null)
		{
			var response = new ServiceResponse<List<CostCenterDto>>();
			try
			{
				var all = await _db.CostCenters.AsNoTracking()
					.Where(c => !companyId.HasValue || c.CompanyId == companyId)
					.OrderBy(c => c.Name)
					.ToListAsync();

				var lookup = all.ToDictionary(c => c.CostCenterId);
				var dtoLookup = all.ToDictionary(c => c.CostCenterId, c => Map(c));
				var roots = new List<CostCenterDto>();
				foreach (var c in all)
				{
					if (c.ParentCostCenterId == null)
					{
						roots.Add(dtoLookup[c.CostCenterId]);
					}
					else if (dtoLookup.ContainsKey(c.ParentCostCenterId.Value))
					{
						dtoLookup[c.ParentCostCenterId.Value].Children.Add(dtoLookup[c.CostCenterId]);
					}
				}
				response.Result = roots;
				response.Success = true;
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<CostCenterDto>> GetByIdAsync(int id)
		{
			var response = new ServiceResponse<CostCenterDto>();
			try
			{
				var entity = await _db.CostCenters.FindAsync(id);
				if (entity == null)
				{
					response.Success = false;
					response.Message = "Not found";
					return response;
				}
				response.Result = Map(entity);
				response.Success = true;
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<List<CostCenterDto>>> GetChildrenAsync(int parentId)
		{
			var response = new ServiceResponse<List<CostCenterDto>>();
			try
			{
				var entities = await _db.CostCenters.AsNoTracking()
					.Where(c => c.ParentCostCenterId == parentId)
					.OrderBy(c => c.Name)
					.ToListAsync();
				var items = entities.Select(Map).ToList();
				response.Result = items;
				response.Success = true;
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<List<CostCenterDto>>> GetActiveParentCostCentersAsync(int? companyId = null)
		{
			var response = new ServiceResponse<List<CostCenterDto>>();
			try
			{
				// Get all cost centers for the company (or all if no company specified)
				var allCostCenters = await _db.CostCenters.AsNoTracking()
					.Where(c => !companyId.HasValue || c.CompanyId == companyId)
					.OrderBy(c => c.Name)
					.ToListAsync();

				// Create lookup dictionaries for efficient processing
				var costCenterLookup = allCostCenters.ToDictionary(c => c.CostCenterId);
				var dtoLookup = allCostCenters.ToDictionary(c => c.CostCenterId, c => Map(c));

				// Build the hierarchy
				foreach (var costCenter in allCostCenters)
				{
					if (costCenter.ParentCostCenterId.HasValue && dtoLookup.ContainsKey(costCenter.ParentCostCenterId.Value))
					{
						dtoLookup[costCenter.ParentCostCenterId.Value].Children.Add(dtoLookup[costCenter.CostCenterId]);
					}
				}

				// Get only active parent cost centers (those without parents)
				var parentCostCenters = allCostCenters
					.Where(c => c.ParentCostCenterId == null && (c.IsActive ?? true) == true)
					.Select(c => dtoLookup[c.CostCenterId])
					.ToList();

				response.Result = parentCostCenters;
				response.Success = true;
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<List<CostCenterDto>>> GetActiveParentCostCentersOnlyAsync(int? companyId = null)
		{
			var response = new ServiceResponse<List<CostCenterDto>>();
			try
			{
				var entities = await _db.CostCenters.AsNoTracking()
					.Where(c => c.ParentCostCenterId == null && (c.IsActive ?? true) == true)
					.Where(c => !companyId.HasValue || c.CompanyId == companyId)
					.OrderBy(c => c.Name)
					.ToListAsync();
				
				var items = entities.Select(Map).ToList();
				response.Result = items;
				response.Success = true;
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<CostCenterDto>> CreateAsync(CreateCostCenterRequest request)
		{
			var response = new ServiceResponse<CostCenterDto>();
			try
			{
				if (string.IsNullOrWhiteSpace(request.Name))
				{
					response.Success = false;
					response.Message = "Name is required";
					return response;
				}

				// Enforce two-level hierarchy: parent cannot itself have a parent
				if (request.ParentCostCenterId.HasValue)
				{
					var parent = await _db.CostCenters.AsNoTracking().FirstOrDefaultAsync(c => c.CostCenterId == request.ParentCostCenterId.Value);
					if (parent == null)
					{
						response.Success = false;
						response.Message = "Parent not found";
						return response;
					}
					if (parent.ParentCostCenterId != null)
					{
						response.Success = false;
						response.Message = "Only two levels allowed";
						return response;
					}
				}

				var entity = new CostCenter
				{
					Name = request.Name.Trim(),
					IsActive = request.IsActive,
					ParentCostCenterId = request.ParentCostCenterId,
					CompanyId = request.CompanyId,
					CreatedAt = DateTime.UtcNow
				};

				entity.Code = await GenerateNextCodeAsync();

				_db.CostCenters.Add(entity);
				await _db.SaveChangesAsync();

				response.Result = Map(entity);
				response.Success = true;
				response.Message = "Created";
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<CostCenterDto>> UpdateAsync(int id, UpdateCostCenterRequest request)
		{
			var response = new ServiceResponse<CostCenterDto>();
			try
			{
				var entity = await _db.CostCenters.FirstOrDefaultAsync(c => c.CostCenterId == id);
				if (entity == null)
				{
					response.Success = false;
					response.Message = "Not found";
					return response;
				}

				if (string.IsNullOrWhiteSpace(request.Name))
				{
					response.Success = false;
					response.Message = "Name is required";
					return response;
				}

				// Enforce two-level hierarchy
				if (request.ParentCostCenterId.HasValue)
				{
					var parent = await _db.CostCenters.AsNoTracking().FirstOrDefaultAsync(c => c.CostCenterId == request.ParentCostCenterId.Value);
					if (parent == null)
					{
						response.Success = false;
						response.Message = "Parent not found";
						return response;
					}
					if (parent.ParentCostCenterId != null)
					{
						response.Success = false;
						response.Message = "Only two levels allowed";
						return response;
					}
				}

				entity.Name = request.Name.Trim();
				entity.IsActive = request.IsActive;
				entity.ParentCostCenterId = request.ParentCostCenterId;
				entity.CompanyId = request.CompanyId;

				await _db.SaveChangesAsync();

				response.Result = Map(entity);
				response.Success = true;
				response.Message = "Updated";
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<bool>> DeleteAsync(int id, bool cascade = true)
		{
			var response = new ServiceResponse<bool>();
			try
			{
				var entity = await _db.CostCenters.FirstOrDefaultAsync(c => c.CostCenterId == id);
				if (entity == null)
				{
					response.Success = false;
					response.Message = "Not found";
					return response;
				}

				// If not cascade, block deletion if has children
				if (!cascade)
				{
					var hasChildren = await _db.CostCenters.AnyAsync(c => c.ParentCostCenterId == id);
					if (hasChildren)
					{
						response.Success = false;
						response.Message = "Cannot delete a parent with sub-categories";
						return response;
					}
				}

				_db.CostCenters.Remove(entity);
				await _db.SaveChangesAsync();
				response.Result = true;
				response.Success = true;
				response.Message = "Deleted";
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		public async Task<ServiceResponse<bool>> ReparentAsync(int id, int? newParentId)
		{
			var response = new ServiceResponse<bool>();
			try
			{
				var entity = await _db.CostCenters.FirstOrDefaultAsync(c => c.CostCenterId == id);
				if (entity == null)
				{
					response.Success = false;
					response.Message = "Not found";
					return response;
				}

				if (newParentId.HasValue)
				{
					var parent = await _db.CostCenters.AsNoTracking().FirstOrDefaultAsync(c => c.CostCenterId == newParentId.Value);
					if (parent == null)
					{
						response.Success = false;
						response.Message = "Parent not found";
						return response;
					}
					if (parent.ParentCostCenterId != null)
					{
						response.Success = false;
						response.Message = "Only two levels allowed";
						return response;
					}
				}

				entity.ParentCostCenterId = newParentId;
				await _db.SaveChangesAsync();
				response.Result = true;
				response.Success = true;
				response.Message = "Reparented";
			}
			catch (Exception ex)
			{
				response.Success = false;
				response.Message = ex.Message;
			}
			return response;
		}

		private static CostCenterDto Map(CostCenter c) => new CostCenterDto
		{
			CostCenterId = c.CostCenterId,
			Code = c.Code,
			Name = c.Name,
			IsActive = c.IsActive ?? true,
			ParentCostCenterId = c.ParentCostCenterId,
			CompanyId = c.CompanyId,
			CreatedAt = c.CreatedAt
		};

		private async Task<string> GenerateNextCodeAsync()
		{
			// Find max numeric suffix and increment
			var lastCode = await _db.CostCenters
				.AsNoTracking()
				.Where(c => c.Code.StartsWith("CC-"))
				.OrderByDescending(c => c.Code)
				.Select(c => c.Code)
				.FirstOrDefaultAsync();

			int next = 1;
			if (!string.IsNullOrEmpty(lastCode) && lastCode.Length > 3)
			{
				var numPart = lastCode.Substring(3);
				if (int.TryParse(numPart, out var n)) next = n + 1;
			}
			return $"CC-{next.ToString("D4")}";
		}
	}
}
