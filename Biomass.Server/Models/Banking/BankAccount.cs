using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Banking
{
    [Table("bank_accounts")]
    public class BankAccount
    {
        [Key]
        [Column("bank_account_id")]
        public int BankAccountId { get; set; }

        [StringLength(100)]
        [Column("branch_code")]
        public string? BranchCode { get; set; }

        [StringLength(100)]
        [Column("branch_address")]
        public string? BranchAddress { get; set; }

        [Required]
        [StringLength(100)]
        [Column("account_name")]
        public string AccountName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [Column("account_number")]
        public string AccountNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [Column("account_iban_no")]
        public string AccountIbanNo { get; set; } = string.Empty;

        [StringLength(100)]
        [Column("bank_name")]
        public string? BankName { get; set; }

        [StringLength(50)]
        [Column("account_type")]
        public string? AccountType { get; set; }

        [Column("employee_id")]
        public int? EmployeeId { get; set; }

        [Column("opening_balance", TypeName = "decimal(18,2)")]
        public decimal OpeningBalance { get; set; } = 0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property for Employee (if needed)
        // public virtual Employee? Employee { get; set; }
    }
}
