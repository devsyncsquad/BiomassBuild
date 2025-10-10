using Biomass.Api.Model;
using Biomass.Server.Models.Cashbook;
using System.Collections.Generic;

namespace Biomass.Server.Interfaces
{
    public interface IAnalyticsService
    {
        // Advance Entries Analytics
       
        
        // Report by Slip Number
        Task<ServiceResponse<List<CashTransactionDetailed>>> GetEntriesBySlipNumberAsync(string slipNumber);
    }
}
