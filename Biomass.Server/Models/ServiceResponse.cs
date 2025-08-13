namespace Biomass.Api.Model
{
    public class ServiceResponse<T>
    {
        public T? Result { get; set; }
        public string? Message { get; set; }
        public bool Success { get; set; }
    }
}
