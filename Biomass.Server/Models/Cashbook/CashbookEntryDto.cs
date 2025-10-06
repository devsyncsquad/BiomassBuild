namespace Biomass.Server.Models.Cashbook
{
    public class CashbookEntryDto
    {
        internal string TransferGroupId;

        public DateTime? HappenedAt { get; set; } = DateTime.UtcNow;
        public int? CashKindId { get; set; }
        public decimal? Amount { get; set; }
        public string? Currency { get; set; } = "PKR";
        public int? MoneyAccountId { get; set; }
        public int? WalletEmployeeId { get; set; }
        public int? CategoryId { get; set; }
        public int? CostCenterId { get; set; }
        public int? CostCenterSubId { get; set; }
        public int? PaymentModeId { get; set; }
        public string? ReferenceNo { get; set; }
        public string? CounterpartyName { get; set; }
        public string? Remarks { get; set; }
        public string? Status { get; set; }
        public string? MetaJson { get; set; } // Optional JSON string
        public IFormFile? ReceiptPath { get; set; } // PDF or JPG
        public int? DispatchId { get; set; }
        public int? VendorId { get; set; }
        public string? TransferRole { get; internal set; }
        public string? SlipNumber { get; set; }
    }

    public class CashbookTransferEntryDto
    {
        internal Guid? TransferGroupId;

        public DateTime? HappenedAt { get; set; } = DateTime.UtcNow;
        public int? CashKindId { get; set; }
        public decimal? Amount { get; set; }
        public string? Currency { get; set; } = "PKR";
        public int? MoneyAccountId { get; set; }
        public int? WalletEmployeeId { get; set; }
        public int? CategoryId { get; set; }
        public int? CostCenterId { get; set; }
        public int? CostCenterSubId { get; set; }
        public int? PaymentModeId { get; set; }
        public string? ReferenceNo { get; set; }
        public string? CounterpartyName { get; set; }
        public string? Remarks { get; set; }
        public string? Status { get; set; }
        public string? MetaJson { get; set; } // Optional JSON string
        public IFormFile? ReceiptPath { get; set; } // PDF or JPG
        public int? DispatchId { get; set; }
        public int? VendorId { get; set; }
        public string? TransferRole { get; internal set; }
        public string? SlipNumber { get; set; }

        // New transfer-related properties
        public int? MoneyAccountFrom { get; set; }
        public int? MoneyAccountTo { get; set; }
        public int? WalletEmployeeFrom { get; set; }
        public int? WalletEmployeeTo { get; set; }
    }
}
