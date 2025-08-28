namespace Biomass.Server.Models.Cashbook
{
    public class CashbookEntryDto
    {
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
        public IFormFile? ReceiptFile { get; set; } // PDF or JPG

    }
}
