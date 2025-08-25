namespace Biomass.Server.Models.Vendor
{
    public class VendorDto
    {
        public int VendorId { get; set; }
        public string? VendorName { get; set; }
        public string? Address { get; set; }
        public string? Phone1 { get; set; }
        public string? Phone2 { get; set; }
        public string? Phone3 { get; set; }
        public string? VendorCnicFrontPic { get; set; }
        public string? VendorCnicBackPic { get; set; }
        public string? Cnic { get; set; }
        public string? Status { get; set; }
    }

    public class CreateVendorRequest
    {
        public string VendorName { get; set; }
        public string? Address { get; set; }
        public string? Phone1 { get; set; }
        public string? Phone2 { get; set; }
        public string? Phone3 { get; set; }
        public string? Cnic { get; set; }
    }

    public class UpdateVendorRequest
    {
        public string? VendorName { get; set; }
        public string? Address { get; set; }
        public string? Phone1 { get; set; }
        public string? Phone2 { get; set; }
        public string? Phone3 { get; set; }
        public string? Cnic { get; set; }
        public string? Status { get; set; }
    }
}