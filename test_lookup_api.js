const axios = require('axios');

const API_BASE = 'http://100.42.177.77:88/api/lookups';

async function testLookupAPI() {
  console.log('🧪 Testing Lookup API Endpoints...\n');

  try {
    // Test 1: Get Statistics
    console.log('1. Testing GetStatistics...');
    const statsResponse = await axios.get(`${API_BASE}/GetStatistics`);
    console.log('✅ Statistics:', statsResponse.data.result);
    console.log('');

    // Test 2: Get Domains
    console.log('2. Testing GetDomains...');
    const domainsResponse = await axios.get(`${API_BASE}/GetDomains`);
    console.log('✅ Domains:', domainsResponse.data.result);
    console.log('');

    // Test 3: Get All Lookups
    console.log('3. Testing GetAllLookups...');
    const lookupsResponse = await axios.get(`${API_BASE}/GetAllLookups?page=1&pageSize=5`);
    console.log('✅ Lookups count:', lookupsResponse.data.result.totalCount);
    console.log('✅ First few lookups:', lookupsResponse.data.result.items.slice(0, 2));
    console.log('');

    // Test 4: Create a new lookup
    console.log('4. Testing CreateLookup...');
    const newLookup = {
      lookupName: 'Test Lookup',
      lookupDomain: 'Test Domain',
      enabled: true,
      sortOrder: 1
    };
    const createResponse = await axios.post(`${API_BASE}/CreateLookup`, newLookup);
    console.log('✅ Created lookup:', createResponse.data.result);
    const createdId = createResponse.data.result.lookupId;
    console.log('');

    // Test 5: Get Lookup by ID
    console.log('5. Testing GetLookupById...');
    const getByIdResponse = await axios.get(`${API_BASE}/GetLookupById/${createdId}`);
    console.log('✅ Retrieved lookup:', getByIdResponse.data.result);
    console.log('');

    // Test 6: Update Lookup
    console.log('6. Testing UpdateLookup...');
    const updateData = {
      lookupName: 'Updated Test Lookup',
      lookupDomain: 'Updated Test Domain',
      enabled: false,
      sortOrder: 2
    };
    const updateResponse = await axios.put(`${API_BASE}/UpdateLookup/${createdId}`, updateData);
    console.log('✅ Updated lookup:', updateResponse.data.result);
    console.log('');

    // Test 7: Test uniqueness constraint
    console.log('7. Testing uniqueness constraint...');
    try {
      const duplicateResponse = await axios.post(`${API_BASE}/CreateLookup`, newLookup);
      console.log('❌ Should have failed due to uniqueness constraint');
    } catch (error) {
      console.log('✅ Uniqueness constraint working:', error.response.data.message);
    }
    console.log('');

    // Test 8: Delete Lookup
    console.log('8. Testing DeleteLookup...');
    const deleteResponse = await axios.delete(`${API_BASE}/DeleteLookup/${createdId}`);
    console.log('✅ Delete response:', deleteResponse.data);
    console.log('');

    // Test 9: Verify deletion
    console.log('9. Verifying deletion...');
    try {
      await axios.get(`${API_BASE}/GetLookupById/${createdId}`);
      console.log('❌ Lookup should not exist');
    } catch (error) {
      console.log('✅ Lookup successfully deleted');
    }
    console.log('');

    // Test 10: Test filters
    console.log('10. Testing filters...');
    const filterResponse = await axios.get(`${API_BASE}/GetAllLookups?search=test&page=1&pageSize=10`);
    console.log('✅ Filtered results count:', filterResponse.data.result.totalCount);
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testLookupAPI();
