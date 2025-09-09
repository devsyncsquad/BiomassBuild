using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Biomass.Server.Models.Vendor;
using Biomass.Server.Models.Dispatch;
using Biomass.Server.Models.Cashbook;

namespace Biomass.Server.Models
{
    public class ApLedger
    {
        [Key]
        [Column("ap_entry_id")]
        public long ApEntryId { get; set; }

        [Required]
        [Column("vendor_id")]
        public int VendorId { get; set; }

        [Required]
        [Column("happened_at")]
        public DateTime HappenedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("entry_kind")]
        [StringLength(50)]
        public string EntryKind { get; set; } = string.Empty;

        [Required]
        [Column("amount")]
        //[Column(TypeName = "numeric(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [Column("currency")]
        [StringLength(10)]
        public string Currency { get; set; } = "PKR";

        [Column("dispatchid")]
        public int? DispatchId { get; set; }

        [Column("cash_id")]
        public long? CashId { get; set; }

        [Column("reference_no")]
        [StringLength(100)]
        public string? ReferenceNo { get; set; }

        [Column("remarks")]
        public string? Remarks { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Vendor.Vendor? Vendor { get; set; }
        public virtual Dispatch.Dispatch? Dispatch { get; set; }
        public virtual Cashbook.Cashbook? Cashbook { get; set; }
    }
}
