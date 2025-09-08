using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Biomass.Server.Models.Vendor
{
    [Table("vendors", Schema = "public")]
    public class Vendor
    {
        [Key]
        [Column("vendorid")]
        public int VendorId { get; set; }

        [Required]
        [Column("vendorname")]
        [StringLength(200)]
        public string VendorName { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        [Column("phone1")]
        [StringLength(20)]
        public string? Phone1 { get; set; }

        [Column("phone2")]
        [StringLength(20)]
        public string? Phone2 { get; set; }

        [Column("phone3")]
        [StringLength(20)]
        public string? Phone3 { get; set; }

        [Column("vendorcnicfrontpic")]
        public string? VendorCnicFrontPic { get; set; }

        [Column("vendorcnicbackpic")]
        public string? VendorCnicBackPic { get; set; }

        [Column("cnic")]
        public string? Cnic { get; set; }

        [Required]
        [Column("status")]
        [StringLength(10)]
        public string Status { get; set; } = "Active";

        [Column("is_vehicle_loader")]
        public bool? IsVehicleLoader { get; set; } = false;

        [Column("is_labour")]
        public bool? IsLabour { get; set; } = false;
    }
}