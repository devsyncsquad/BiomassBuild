using Microsoft.EntityFrameworkCore.Migrations;

namespace Biomass.Server.Data.Migrations
{
    public partial class AddVLocationsView : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE OR REPLACE VIEW public.v_locations AS
                SELECT 
                    cus.firstname,
                    cus.lastname,
                    cus.status AS customerstatus,
                    loc.locationid,
                    loc.customerid,
                    loc.locationname,
                    loc.locationcode,
                    loc.address,
                    loc.center_dispatch_weight_limit,
                    loc.advance_percentage_allowed,
                    loc.tolerance_limit_percentage,
                    loc.tolerance_limit_kg,
                    loc.material_penalty_rateperkg,
                    loc.dispatch_loading_charges_enabled,
                    loc.dispatch_charge_type,
                    loc.fixed_loader_cost,
                    loc.variable_charge_type,
                    loc.variable_charge_amount,
                    loc.receiving_unloading_cost_enabled,
                    loc.receiving_charge_type,
                    loc.fixed_unloading_cost,
                    loc.receiving_variable_charge_type,
                    loc.receiving_variable_charge_amount,
                    loc.status,
                    loc.createdby,
                    loc.createdon,
                    loc.lastupdatedon,
                    loc.lastupdatedby,
                    loc.latitude,
                    loc.longitude,
                    loc.labor_charges_enabled,
                    loc.labor_charge_type,
                    loc.labor_charges_cost
                FROM locations loc
                INNER JOIN customers cus ON loc.customerid = cus.customerid;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP VIEW IF EXISTS public.v_locations;");
        }
    }
}
