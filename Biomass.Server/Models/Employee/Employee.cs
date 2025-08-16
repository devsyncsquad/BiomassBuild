using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Employee
{
	[Table("employees")]
	public class Employee
	{
		[Key]
		[Column("employee_id")]
		public int EmployeeId { get; set; }

		[Required]
		[Column("full_name")]
		[StringLength(100)]
		public string FullName { get; set; } = string.Empty;

		[Column("designation")]
		[StringLength(100)]
		public string? Designation { get; set; }

		[Column("phone")]
		[StringLength(20)]
		public string? Phone { get; set; }

		[Column("created_at")]
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	}
}
