# Lookup Management System

## Overview

The Lookup Management System provides a comprehensive UI for managing lookup records in the BiomassPro application. It includes summary cards, advanced filtering, CRUD operations, and responsive design.

## Features

### 🎯 **Summary Cards**
- **Total Lookups**: Shows the total count of all lookup records
- **Enabled**: Count of active/enabled lookups
- **Disabled**: Count of inactive/disabled lookups  
- **Pending**: Count of lookups with sort order > 0 but not yet enabled

### 🔍 **Advanced Filtering**
- **Search**: Filter by Name, ID, or Domain (text search)
- **Domain**: Dropdown filter for specific domains
- **Status**: Filter by Enabled/Disabled/Pending status
- **Reset/Refresh**: Clear filters and refresh data

### 📊 **Data Table**
- **Columns**: ID, Name, Domain, Status, Sort Order, Created Date, Actions
- **Pagination**: Configurable page sizes (10, 25, 50)
- **Sorting**: By Sort Order, then by Name
- **Status Indicators**: Color-coded chips for different statuses

### ✏️ **CRUD Operations**
- **Create**: Add new lookups with validation
- **Read**: View and filter existing lookups
- **Update**: Edit lookup details
- **Delete**: Remove lookups with confirmation

## Backend Architecture

### Models

#### Lookup Entity
```csharp
public class Lookup
{
    public int LookupId { get; set; }           // Primary key
    public string LookupName { get; set; }      // Required, 2-100 chars
    public string LookupDomain { get; set; }    // Required, 100 chars max
    public bool Enabled { get; set; }           // Required, default true
    public int SortOrder { get; set; }          // Required, default 0
    public DateTime CreatedOn { get; set; }     // Required, auto-set
    public int? CreatedBy { get; set; }        // Optional user reference
}
```

#### DTOs
- `LookupDto`: Data transfer object for API responses
- `CreateLookupRequest`: Request model for creating lookups
- `UpdateLookupRequest`: Request model for updating lookups
- `LookupStatistics`: Statistics summary data

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lookups/GetAllLookups` | Get paginated lookups with filters |
| `GET` | `/api/lookups/GetLookupById/{id}` | Get lookup by ID |
| `POST` | `/api/lookups/CreateLookup` | Create new lookup |
| `PUT` | `/api/lookups/UpdateLookup/{id}` | Update existing lookup |
| `DELETE` | `/api/lookups/DeleteLookup/{id}` | Delete lookup |
| `GET` | `/api/lookups/GetStatistics` | Get summary statistics |
| `GET` | `/api/lookups/GetDomains` | Get all distinct domains |
| `GET` | `/api/lookups/GetLookupsByDomains` | Get lookups grouped by domain |

### Service Layer

The `LookupService` implements:
- **Data Retrieval**: Paginated queries with filtering
- **Business Logic**: Uniqueness validation, status management
- **Statistics**: Real-time counts for summary cards
- **Domain Management**: Distinct domain extraction

## Frontend Implementation

### Component Structure

```jsx
const Lookup = () => {
  // State Management
  const [lookups, setLookups] = useState([]);
  const [domains, setDomains] = useState([]);
  const [statistics, setStatistics] = useState({...});
  const [filters, setFilters] = useState({...});
  const [pagination, setPagination] = useState({...});
  
  // API Functions
  const fetchLookups = async () => {...};
  const fetchDomains = async () => {...};
  const fetchStatistics = async () => {...};
  
  // Event Handlers
  const handleFilterChange = (field, value) => {...};
  const handleSave = async () => {...};
  const handleDelete = async () => {...};
  
  return (
    // UI Components
  );
};
```

### Key UI Components

1. **Summary Cards**: Material-UI Cards with color-coded backgrounds
2. **Filter Panel**: Search, domain, and status filters with reset/refresh
3. **Data Table**: Responsive table with pagination and actions
4. **Modal Forms**: Add/Edit forms with validation
5. **Delete Confirmation**: Confirmation dialog for destructive actions

### Responsive Design

- **Mobile**: Single column layout, stacked filters
- **Tablet**: Two-column layout for summary cards
- **Desktop**: Full layout with optimal spacing

## Validation Rules

### Frontend Validation
- **Name**: Required, 2-100 characters
- **Domain**: Required, must be selected from dropdown
- **Status**: Required, boolean (Enabled/Disabled)
- **Sort Order**: Optional, integer ≥ 0

### Backend Validation
- **Uniqueness**: Name must be unique within the same domain
- **Data Integrity**: Foreign key constraints and referential integrity
- **Business Rules**: Status transitions and sort order logic

## Error Handling

### API Errors
- **400 Bad Request**: Validation errors, duplicate names
- **404 Not Found**: Lookup not found for update/delete
- **409 Conflict**: Uniqueness constraint violation

### User Experience
- **Inline Alerts**: Error messages displayed prominently
- **Form Validation**: Real-time validation feedback
- **Loading States**: Spinner indicators during API calls
- **Empty States**: Helpful messages when no data exists

## Security Considerations

### Authentication
- **User Context**: CreatedBy field tracks user actions
- **Session Management**: Secure API access control

### Authorization
- **Read Access**: Users with `Lookups.Read` permission
- **Write Access**: Users with `Lookups.Write` permission
- **Action Visibility**: UI elements hidden based on permissions

## Performance Features

### Backend Optimization
- **Pagination**: Server-side pagination for large datasets
- **Filtering**: Database-level filtering for efficiency
- **Caching**: Entity Framework query optimization

### Frontend Optimization
- **Debounced Search**: Prevents excessive API calls
- **State Management**: Efficient React state updates
- **Lazy Loading**: Data loaded on demand

## Database Schema

```sql
CREATE TABLE public.lookups (
    lookup_id BIGSERIAL PRIMARY KEY,
    lookup_name VARCHAR(100) NOT NULL,
    lookup_domain VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_on TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by INTEGER NULL
);

-- Indexes for performance
CREATE INDEX idx_lookups_domain ON lookups(lookup_domain);
CREATE INDEX idx_lookups_enabled ON lookups(enabled);
CREATE INDEX idx_lookups_sort_order ON lookups(sort_order);
CREATE UNIQUE INDEX idx_lookups_name_domain ON lookups(lookup_name, lookup_domain);
```

## Testing

### API Testing
Run the test script to verify all endpoints:
```bash
node test_lookup_api.js
```

### Manual Testing
1. **Create**: Add new lookups with various data
2. **Filter**: Test search, domain, and status filters
3. **Edit**: Modify existing lookup details
4. **Delete**: Remove lookups and verify cleanup
5. **Validation**: Test uniqueness constraints and required fields

## Future Enhancements

### Planned Features
- **Bulk Operations**: Select multiple lookups for batch actions
- **Export/Import**: CSV/Excel data exchange
- **Audit Trail**: Track all changes with timestamps
- **Advanced Search**: Full-text search with relevance scoring
- **Domain Management**: CRUD operations for domains

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live data
- **Offline Support**: Service worker for offline functionality
- **Advanced Filtering**: Date ranges, numeric ranges
- **Sorting**: Multi-column sorting with custom priorities

## Troubleshooting

### Common Issues

1. **404 Errors**: Check API endpoint URLs and routing
2. **Validation Errors**: Verify field requirements and constraints
3. **Performance Issues**: Check database indexes and query optimization
4. **UI Responsiveness**: Ensure proper breakpoint handling

### Debug Information
- **Console Logs**: Frontend debugging information
- **API Responses**: Backend error messages and status codes
- **Network Tab**: Monitor API calls and responses
- **Database Logs**: Check for constraint violations and errors

## Support

For technical support or feature requests:
- **Documentation**: Refer to this README and API documentation
- **Issues**: Report bugs through the project issue tracker
- **Enhancements**: Submit feature requests with detailed requirements
- **Questions**: Contact the development team for clarification
