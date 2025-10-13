using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Dispatch
{
    /// <summary>
    /// Model representing the dispatch_receipts_log table for tracking payment transactions
    /// </summary>
    public class DispatchReceiptsLog
    {
        [Key]
        [Column("receipt_log_id")]
        public long ReceiptLogId { get; set; }

        [Required]
        [Column("receipt_id")]
        public long ReceiptId { get; set; }

        [Column("amount", TypeName = "numeric(18,2)")]
        public decimal Amount { get; set; }


        [Column("createdby")]
        public int? CreatedBy { get; set; }

        [Required]
        [Column("createdon")]
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual DispatchReceipt Receipt { get; set; } = null!;
    }
}
