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

            // Try to get the value using the model name (e.g., "CashIds")
            var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            
            // If not found, try to get indexed values (e.g., "CashIds[0]", "CashIds[1]", etc.)
            var values = new List<long>();
            
            if (value != ValueProviderResult.None && !string.IsNullOrEmpty(value.FirstValue))
            {
                // Handle comma-separated or JSON array format
                bindingContext.ModelState.SetModelValue(bindingContext.ModelName, value);
                var stringValue = value.FirstValue;

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
                    values = cleanValue.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(v => long.Parse(v.Trim(), CultureInfo.InvariantCulture))
                        .ToList();
                }
                catch (Exception ex)
                {
                    bindingContext.ModelState.TryAddModelError(bindingContext.ModelName, 
                        $"Invalid format for {bindingContext.ModelName}: {ex.Message}");
                    return Task.CompletedTask;
                }
            }
            else
            {
                // Try array notation: CashIds[0], CashIds[1], CashIds[2], etc.
                int index = 0;
                while (true)
                {
                    var indexedKey = $"{bindingContext.ModelName}[{index}]";
                    var indexedValue = bindingContext.ValueProvider.GetValue(indexedKey);
                    
                    if (indexedValue == ValueProviderResult.None || string.IsNullOrEmpty(indexedValue.FirstValue))
                        break;
                    
                    try
                    {
                        values.Add(long.Parse(indexedValue.FirstValue, CultureInfo.InvariantCulture));
                    }
                    catch (Exception ex)
                    {
                        bindingContext.ModelState.TryAddModelError(indexedKey, 
                            $"Invalid value for {indexedKey}: {ex.Message}");
                        return Task.CompletedTask;
                    }
                    
                    index++;
                }
            }

            bindingContext.Result = ModelBindingResult.Success(values.Any() ? values : null);
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
