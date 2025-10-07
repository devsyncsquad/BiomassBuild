using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Globalization;

namespace Biomass.Server.ModelBinders
{
    public class CommaSeparatedListModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
                throw new ArgumentNullException(nameof(bindingContext));

            var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            if (value == ValueProviderResult.None)
            {
                return Task.CompletedTask;
            }

            bindingContext.ModelState.SetModelValue(bindingContext.ModelName, value);

            var stringValue = value.FirstValue;
            if (string.IsNullOrEmpty(stringValue))
            {
                return Task.CompletedTask;
            }

            try
            {
                // Handle different formats:
                // 1. "[144,143,162]" - JSON array format
                // 2. "144,143,162" - comma separated
                // 3. "144" - single value

                var cleanValue = stringValue.Trim();
                
                // Remove brackets if present (JSON array format)
                if (cleanValue.StartsWith("[") && cleanValue.EndsWith("]"))
                {
                    cleanValue = cleanValue.Substring(1, cleanValue.Length - 2);
                }

                // Split by comma and parse to long
                var values = cleanValue.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(v => long.Parse(v.Trim(), CultureInfo.InvariantCulture))
                    .ToList();

                bindingContext.Result = ModelBindingResult.Success(values);
            }
            catch (Exception ex)
            {
                bindingContext.ModelState.TryAddModelError(bindingContext.ModelName, 
                    $"Invalid format for {bindingContext.ModelName}: {ex.Message}");
            }

            return Task.CompletedTask;
        }
    }

    public class CommaSeparatedListModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder? GetBinder(ModelBinderProviderContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            // Only apply to List<long> properties
            if (context.Metadata.ModelType == typeof(List<long>))
            {
                return new CommaSeparatedListModelBinder();
            }

            return null;
        }
    }
}
