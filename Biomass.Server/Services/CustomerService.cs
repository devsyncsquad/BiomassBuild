using Microsoft.EntityFrameworkCore;
using Biomass.Server.Data;
using Biomass.Server.Models.Customer;
using Biomass.Server.Models;
using Biomass.Api.Model;

using Biomass.Server.Interfaces;

namespace Biomass.Server.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ApplicationDbContext _context;

        public CustomerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<List<CustomerDto>>> GetAllCustomersAsync()
        {
            var response = new ServiceResponse<List<CustomerDto>>();

            try
            {
                var customers = await _context.Customers
                    .Include(c => c.Locations)
                    .Select(c => new CustomerDto
                    {
                        CustomerId = c.CustomerId,
                        FirstName = c.FirstName,
                        LastName = c.LastName,
                        Email = c.Email,
                        Phone = c.Phone,
                        CompanyName = c.CompanyName,
                        Address = c.Address,
                        City = c.City,
                        State = c.State,
                        PostalCode = c.PostalCode,
                        Country = c.Country,
                        Status = c.Status,
                        CreatedDate = c.CreatedDate,
                        LocationCount = c.Locations.Count
                    })
                    .ToListAsync();

                response.Result = customers;
                response.Success = true;
                response.Message = "Customers retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving customers: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<CustomerDto>> GetCustomerByIdAsync(int customerId)
        {
            var response = new ServiceResponse<CustomerDto>();

            try
            {
                var customer = await _context.Customers
                    .Include(c => c.Locations)
                    .Where(c => c.CustomerId == customerId)
                    .Select(c => new CustomerDto
                    {
                        CustomerId = c.CustomerId,
                        FirstName = c.FirstName,
                        LastName = c.LastName,
                        Email = c.Email,
                        Phone = c.Phone,
                        CompanyName = c.CompanyName,
                        Address = c.Address,
                        City = c.City,
                        State = c.State,
                        PostalCode = c.PostalCode,
                        Country = c.Country,
                        Status = c.Status,
                        CreatedDate = c.CreatedDate,
                        LocationCount = c.Locations.Count
                    })
                    .FirstOrDefaultAsync();

                if (customer == null)
                {
                    response.Success = false;
                    response.Message = "Customer not found";
                    return response;
                }

                response.Result = customer;
                response.Success = true;
                response.Message = "Customer retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving customer: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<CustomerDto>> CreateCustomerAsync(CreateCustomerRequest request)
        {
            var response = new ServiceResponse<CustomerDto>();

            try
            {
                var customer = new Customer
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    Phone = request.Phone,
                    CompanyName = request.CompanyName,
                    Address = request.Address,
                    City = request.City,
                    State = request.State,
                    PostalCode = request.PostalCode,
                    Country = request.Country,
                    Status = request.Status,
                    CreatedDate = DateTime.UtcNow,
                    CreatedBy = 1 // TODO: Get from current user context
                };

                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                var customerDto = new CustomerDto
                {
                    CustomerId = customer.CustomerId,
                    FirstName = customer.FirstName,
                    LastName = customer.LastName,
                    Email = customer.Email,
                    Phone = customer.Phone,
                    CompanyName = customer.CompanyName,
                    Address = customer.Address,
                    City = customer.City,
                    State = customer.State,
                    PostalCode = customer.PostalCode,
                    Country = customer.Country,
                    Status = customer.Status,
                    CreatedDate = customer.CreatedDate,
                    LocationCount = 0
                };

                response.Result = customerDto;
                response.Success = true;
                response.Message = "Customer created successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error creating customer: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<CustomerDto>> UpdateCustomerAsync(int customerId, UpdateCustomerRequest request)
        {
            var response = new ServiceResponse<CustomerDto>();

            try
            {
                var customer = await _context.Customers
                    .Include(c => c.Locations)
                    .FirstOrDefaultAsync(c => c.CustomerId == customerId);

                if (customer == null)
                {
                    response.Success = false;
                    response.Message = "Customer not found";
                    return response;
                }

                customer.FirstName = request.FirstName;
                customer.LastName = request.LastName;
                customer.Email = request.Email;
                customer.Phone = request.Phone;
                customer.CompanyName = request.CompanyName;
                customer.Address = request.Address;
                customer.City = request.City;
                customer.State = request.State;
                customer.PostalCode = request.PostalCode;
                customer.Country = request.Country;
                customer.Status = request.Status;
                customer.LastUpdatedOn = DateTime.UtcNow;
                customer.LastUpdatedBy = 1; // TODO: Get from current user context

                await _context.SaveChangesAsync();

                var customerDto = new CustomerDto
                {
                    CustomerId = customer.CustomerId,
                    FirstName = customer.FirstName,
                    LastName = customer.LastName,
                    Email = customer.Email,
                    Phone = customer.Phone,
                    CompanyName = customer.CompanyName,
                    Address = customer.Address,
                    City = customer.City,
                    State = customer.State,
                    PostalCode = customer.PostalCode,
                    Country = customer.Country,
                    Status = customer.Status,
                    CreatedDate = customer.CreatedDate,
                    LocationCount = customer.Locations.Count
                };

                response.Result = customerDto;
                response.Success = true;
                response.Message = "Customer updated successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error updating customer: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<bool>> DeleteCustomerAsync(int customerId)
        {
            var response = new ServiceResponse<bool>();

            try
            {
                var customer = await _context.Customers
                    .Include(c => c.Locations)
                    .FirstOrDefaultAsync(c => c.CustomerId == customerId);

                if (customer == null)
                {
                    response.Success = false;
                    response.Message = "Customer not found";
                    return response;
                }

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                response.Result = true;
                response.Success = true;
                response.Message = "Customer deleted successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error deleting customer: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<List<CustomerDto>>> SearchCustomersAsync(string searchTerm, string status = "all")
        {
            var response = new ServiceResponse<List<CustomerDto>>();

            try
            {
                var query = _context.Customers
                    .Include(c => c.Locations)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    query = query.Where(c =>
                        c.FirstName.Contains(searchTerm) ||
                        c.LastName.Contains(searchTerm) ||
                        c.Email.Contains(searchTerm) ||
                        c.CompanyName.Contains(searchTerm));
                }

                if (status != "all")
                {
                    query = query.Where(c => c.Status == status);
                }

                var customers = await query
                    .Select(c => new CustomerDto
                    {
                        CustomerId = c.CustomerId,
                        FirstName = c.FirstName,
                        LastName = c.LastName,
                        Email = c.Email,
                        Phone = c.Phone,
                        CompanyName = c.CompanyName,
                        Address = c.Address,
                        City = c.City,
                        State = c.State,
                        PostalCode = c.PostalCode,
                        Country = c.Country,
                        Status = c.Status,
                        CreatedDate = c.CreatedDate,
                        LocationCount = c.Locations.Count
                    })
                    .ToListAsync();

                response.Result = customers;
                response.Success = true;
                response.Message = "Customers searched successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error searching customers: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<int>> GetCustomerCountAsync()
        {
            var response = new ServiceResponse<int>();

            try
            {
                var count = await _context.Customers.CountAsync();
                response.Result = count;
                response.Success = true;
                response.Message = "Customer count retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error getting customer count: {ex.Message}";
            }

            return response;
        }

        public async Task<ServiceResponse<List<VUserCustomer>>> GetCustomersByUserIdAsync(int userId)
        {
            var response = new ServiceResponse<List<VUserCustomer>>();

            try
            {
                var customers = await _context.VUserCustomers
                    .Where(v => v.UserId == userId && v.Status=="Active")
                    .ToListAsync();

                response.Result = customers;
                response.Success = true;
                response.Message = "Customers retrieved successfully";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error retrieving customers for user: {ex.Message}";
            }

            return response;
        }
    }
} 