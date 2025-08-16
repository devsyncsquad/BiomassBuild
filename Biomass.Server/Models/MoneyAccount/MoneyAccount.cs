using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Biomass.Server.Models.MoneyAccount
{
    [Table("money_accounts")]
    public class MoneyAccount
    {
        [Key]
        [Column("money_account_id")]
        public int MoneyAccountId { get; set; }

        [Column("account_code")]
        [StringLength(100)]
        public string? AccountCode { get; set; }

        [Required]
        [Column("name")]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("kind_lookup_id")]
        public int KindLookupId { get; set; }

        [Column("account_holder")]
        [StringLength(200)]
        public string? AccountHolder { get; set; }

        [Column("company_reg_no")]
        [StringLength(100)]
        public string? CompanyRegNo { get; set; }

        [Column("bank_name")]
        [StringLength(200)]
        public string? BankName { get; set; }

        [Column("branch_name")]
        [StringLength(200)]
        public string? BranchName { get; set; }

        [Column("branch_code")]
        [StringLength(100)]
        public string? BranchCode { get; set; }

        [Column("account_number")]
        [StringLength(100)]
        public string? AccountNumber { get; set; }

        [Column("iban")]
        [StringLength(100)]
        public string? Iban { get; set; }

        [Column("swift_bic")]
        [StringLength(100)]
        public string? SwiftBic { get; set; }

        [Column("wallet_provider")]
        [StringLength(200)]
        public string? WalletProvider { get; set; }

        [Column("wallet_phone")]
        [StringLength(50)]
        public string? WalletPhone { get; set; }

        [Required]
        [Column("currency")]
        [StringLength(10)]
        public string Currency { get; set; } = "PKR";

        [Required]
        [Column("opening_balance")]
       public decimal OpeningBalance { get; set; } = 0;

        [Column("opening_balance_as_of")]
        public DateTime? OpeningBalanceAsOf { get; set; }

        [Required]
        [Column("is_default")]
        public bool IsDefault { get; set; } = false;

        [Required]
        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("meta", TypeName = "jsonb")]
        public JsonElement? Meta { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Column("created_by")]
        [StringLength(100)]
        public string? CreatedBy { get; set; }

        [Column("updated_by")]
        [StringLength(100)]
        public string? UpdatedBy { get; set; }

        // Navigation property for lookup
        [ForeignKey("KindLookupId")]
        public virtual Lookup.Lookup? KindLookup { get; set; }
    }
}
