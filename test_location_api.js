// Test script to verify Location API functionality
const axios = require('axios');

const API_BASE = 'https://localhost:7084/api';

async function testLocationAPI() {
  try {
    console.log('🧪 Testing Location API...\n');

    // 1. Test GET all locations
    console.log('1. Testing GET /customerlocations');
    const getAllResponse = await axios.get(`${API_BASE}/customerlocations`);
    console.log('✅ GET all locations:', getAllResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Count:', getAllResponse.data.result?.length || 0);
    console.log('');

    // 2. Test GET locations by customer ID
    console.log('2. Testing GET /customerlocations/GetLocationsByCustomerId/1');
    const getByCustomerResponse = await axios.get(`${API_BASE}/customerlocations/GetLocationsByCustomerId/1`);
    console.log('✅ GET locations by customer:', getByCustomerResponse.data.success ? 'SUCCESS' : 'FAILED');
    console.log('   Count:', getByCustomerResponse.data.result?.length || 0);
    console.log('');

    // 3. Test POST create new location
    console.log('3. Testing POST /customerlocations (create new location)');
    const newLocation = {
      CustomerId: 1,
      LocationName: "Test Location API",
      LocationCode: "TEST.API.01",
      Address: "Test Address for API Testing",
      CenterDispatchWeightLimit: 25000,
      AdvancePercentageAllowed: 90,
      ToleranceLimitPercentage: 1.5,
      ToleranceLimitKg: 0,
      MaterialPenaltyRatePerKg: 5,
      DispatchLoadingChargesEnabled: true,
      DispatchChargeType: "Fixed",
      FixedLoaderCost: 6000,
      VariableChargeType: "LoaderPerMaan",
      VariableChargeAmount: 350,
      LaborChargesEnabled: true,
      LaborChargeType: "Variable",
      LaborChargesCost: 4000,
      ReceivingUnloadingCostEnabled: true,
      ReceivingChargeType: "Fixed",
      FixedUnloadingCost: 4500,
      ReceivingVariableChargeType: "UnloadingPerMaan",
      ReceivingVariableChargeAmount: 300
    };

    const createResponse = await axios.post(`${API_BASE}/customerlocations`, newLocation);
    console.log('✅ CREATE location:', createResponse.data.success ? 'SUCCESS' : 'FAILED');
    if (createResponse.data.success) {
      console.log('   New Location ID:', createResponse.data.result.locationId);
      console.log('   Customer ID saved:', createResponse.data.result.customerId);
    } else {
      console.log('   Error:', createResponse.data.message);
    }
    console.log('');

    // 4. Test GET location costs for dispatch
    if (createResponse.data.success) {
      const locationId = createResponse.data.result.locationId;
      console.log(`4. Testing GET /customerlocations/GetLocationCostsForDispatch/${locationId}`);
      const costsResponse = await axios.get(`${API_BASE}/customerlocations/GetLocationCostsForDispatch/${locationId}`);
      console.log('✅ GET location costs:', costsResponse.data.success ? 'SUCCESS' : 'FAILED');
      if (costsResponse.data.success) {
        console.log('   Location:', costsResponse.data.result.locationName);
        console.log('   Customer:', costsResponse.data.result.customerName);
        console.log('   Labour Charges Enabled:', costsResponse.data.result.labourChargesEnabled);
        console.log('   Labour Charge Type:', costsResponse.data.result.labourChargeType);
      }
      console.log('');

      // 5. Test DELETE the test location
      console.log(`5. Testing DELETE /customerlocations/${locationId}`);
      const deleteResponse = await axios.delete(`${API_BASE}/customerlocations/${locationId}`);
      console.log('✅ DELETE location:', deleteResponse.data.success ? 'SUCCESS' : 'FAILED');
      console.log('');
    }

    console.log('🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testLocationAPI();
