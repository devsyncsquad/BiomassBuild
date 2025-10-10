using Biomass.Api.Model;
using Biomass.Server.Data;
using Biomass.Server.Interfaces;
using Biomass.Server.Models.Cashbook;
using Microsoft.EntityFrameworkCore;

namespace Biomass.Server.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly ApplicationDbContext _db;

        public AnalyticsService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResponse<List<CashTransactionDetailed>>> GetAdvanceEntriesAsync()
        {
            var response = new ServiceResponse<List<CashTransactionDetailed>>();
            try
            {
                // Raw SQL query using v_cashbook_effects view
                var sql = @"
                    SELECT 
                        cash_id, happened_at, cash_kind, amount, currency,
                        money_account_id, money_account_name, wallet_employee_id, employee_wallet_name,
                        category_id, category_name, cost_center_id, costcenter_name, cost_center_sub_id, costcenter_sub_name,
                        payment_mode_id, payment_mode_name, reference_no, counterparty_name, remarks, meta,
                        bank_delta, wallet_delta, status, slipnumber
                    FROM v_cashbook_effects 
                    WHERE remarks = 'ADVANCE' 
                        AND dispatch_id IS NULL
                    ORDER BY happened_at DESC";

                // Execute query
                var items = await _db.Database.SqlQueryRaw<CashTransactionDetailed>(sql).ToListAsync();

                response.Result = items;
                response.Success = true;
                response.Message = $"Total records: {items.Count}";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<List<CashTransactionDetailed>>> GetAdvanceEntriesByCostCenterSubIdAsync(int costCenterSubId)
        {
            var response = new ServiceResponse<List<CashTransactionDetailed>>();
            try
            {
                // Raw SQL query using v_cashbook_effects view
                var sql = @"
                    SELECT 
                        cash_id, happened_at, cash_kind, amount, currency,
                        money_account_id, money_account_name, wallet_employee_id, employee_wallet_name,
                        category_id, category_name, cost_center_id, costcenter_name, cost_center_sub_id, costcenter_sub_name,
                        payment_mode_id, payment_mode_name, reference_no, counterparty_name, remarks, meta,
                        bank_delta, wallet_delta, status, slipnumber
                    FROM v_cashbook_effects 
                    WHERE cost_center_sub_id = {0}
                        AND remarks = 'ADVANCE' 
                        AND dispatch_id IS NULL
                    ORDER BY happened_at DESC";

                // Execute query
                var items = await _db.Database.SqlQueryRaw<CashTransactionDetailed>(sql, costCenterSubId).ToListAsync();

                response.Result = items;
                response.Success = true;
                response.Message = $"Found {items.Count} advance entries";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

        public async Task<ServiceResponse<List<CashTransactionDetailed>>> GetEntriesBySlipNumberAsync(string slipNumber)
        {
            var response = new ServiceResponse<List<CashTransactionDetailed>>();
            try
            {
                // Raw SQL query using v_cashbook_effects view
                var sql = @"
                    SELECT 
                        cash_id, happened_at, cash_kind, amount, currency,
                        money_account_id, money_account_name, wallet_employee_id, employee_wallet_name,
                        category_id, category_name, cost_center_id, costcenter_name, cost_center_sub_id, costcenter_sub_name,
                        payment_mode_id, payment_mode_name, reference_no, counterparty_name, remarks, meta,
                        bank_delta, wallet_delta, status, slipnumber
                    FROM v_cashbook_effects 
                    WHERE slipnumber = {0}
                    ORDER BY happened_at DESC";

                // Execute query
                var items = await _db.Database.SqlQueryRaw<CashTransactionDetailed>(sql, slipNumber).ToListAsync();

                response.Result = items;
                response.Success = true;
                response.Message = $"Total records: {items.Count}";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;
        }

     
    }
}
