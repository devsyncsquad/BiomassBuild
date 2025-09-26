using Microsoft.EntityFrameworkCore.Migrations;

namespace Biomass.Server.Data.Migrations
{
    public partial class AddPayableWeightMundColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add payable_weight_mund column to dispatches table
            migrationBuilder.AddColumn<decimal>(
                name: "payable_weight_mund",
                table: "dispatches",
                type: "numeric(18,2)",
                nullable: true);

            // Create or replace v_dispatch view with payable_weight_mund column
            migrationBuilder.Sql(@"
                CREATE OR REPLACE VIEW public.v_dispatch AS
                SELECT 
                    d.dispatchid,
                    d.vehicleid,
                    d.locationid,
                    d.materialtype,
                    d.materialrate,
                    d.slipnumber,
                    d.slippicture,
                    d.firstweight,
                    d.secondweight,
                    d.netweight,
                    d.loadercharges,
                    d.loaderchargesauto,
                    d.loaderchargestype,
                    d.laborcharges,
                    d.laborchargesauto,
                    d.laborchargestype,
                    d.transporterrate,
                    d.transporterrateauto,
                    d.transporterchargestype,
                    d.amount,
                    d.totaldeduction,
                    d.createdby,
                    d.createdon,
                    d.status,
                    d.payable_weight,
                    d.payable_weight_mund,
                    d.bucket_vendor_id,
                    d.labour_vendor_id,
                    d.material_id,
                    d.transporter_vendor_id,
                    d.bucket_rate_per_mund,
                    d.labor_rate_per_mund,
                    d.transporter_rate_per_mund,
                    v.vehiclenumber,
                    v.cost_center_id,
                    vl.locationname,
                    vl.firstname,
                    vl.tolerance_limit_kg,
                    vl.tolerance_limit_percentage,
                    vl.advance_percentage_allowed,
                    vl.center_dispatch_weight_limit,
                    vl.material_penalty_rateperkg
                FROM dispatches d
                LEFT JOIN vehicles v ON d.vehicleid = v.vehicleid
                LEFT JOIN v_locations vl ON d.locationid = vl.locationid;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the view first
            migrationBuilder.Sql("DROP VIEW IF EXISTS public.v_dispatch;");
            
            // Remove the column
            migrationBuilder.DropColumn(
                name: "payable_weight_mund",
                table: "dispatches");
        }
    }
}

