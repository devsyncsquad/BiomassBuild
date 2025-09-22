using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Cashbook
{
	[Table("cashbook")]
	public class Cashbook
	{
		[Key]
		[Column("cash_id")]
		public long CashId { get; set; }

		[Required]
		[Column("happened_at")]
		public DateTime HappenedAt { get; set; } = DateTime.UtcNow;

		[Required]
		[Column("cash_kind_id")]
		public int? CashKindId { get; set; }

		[Required]
		[Column("amount")]
		[Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
		public decimal? Amount { get; set; }

		[Required]
		[Column("currency")]
		[StringLength(10)]
		public string Currency { get; set; } = "PKR";

		[Column("money_account_id")]
		public int? MoneyAccountId { get; set; }

		[Column("wallet_employee_id")]
		public int? WalletEmployeeId { get; set; }

		[Required]
		[Column("category_id")]
		public int? CategoryId { get; set; }

		[Column("cost_center_id")]
		public int? CostCenterId { get; set; }

        [Column("cost_center_sub_id")]
        public int? CostCenterSubId { get; set; }

        [Column("payment_mode_id")]
		public int? PaymentModeId { get; set; }

		[Column("reference_no")]
		[StringLength(100)]
		public string? ReferenceNo { get; set; }

		[Column("counterparty_name")]
		[StringLength(200)]
		public string? CounterpartyName { get; set; }

		[Column("remarks")]
		[StringLength(500)]
		public string? Remarks { get; set; }

		[Column("meta", TypeName = "jsonb")]
		public string? Meta { get; set; }

		[Column("status")]
		[StringLength(20)]
		public string Status { get; set; } = "Active";

		[Column("receipt_path")]
		[StringLength(500)]
		public string? ReceiptPath { get; set; }

		[Column("dispatch_id")]
		public long? DispatchId { get; set; }

        [Column("transfer_group_Id")]
        public string? TransferGroupId { get; set; }

        [Column("transfer_role")]
        public string? TransferRole { get; set; }
    }
}
