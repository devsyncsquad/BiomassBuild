using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.CostCenter
{
	[Table("cost_centers")]
	public class CostCenter
	{
		[Key]
		[Column("cost_center_id")]
		public int CostCenterId { get; set; }

		[Column("code")]
		public string? Code { get; set; } = string.Empty;

		[Column("name")]
		public string? Name { get; set; } = string.Empty;

		[Column("is_active")]
		public bool IsActive { get; set; } = true;

		[Column("parent_cost_center_id")]
		public int? ParentCostCenterId { get; set; }

		[Column("created_at", TypeName = "date")]
		public DateTime? CreatedAt { get; set; }

		[Column("company_id")]
		public int? CompanyId { get; set; }

		[ForeignKey(nameof(ParentCostCenterId))]
		public CostCenter? Parent { get; set; }

		public ICollection<CostCenter> Children { get; set; } = new List<CostCenter>();
	}
}


