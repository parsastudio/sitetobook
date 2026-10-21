import {
  PublicTenant,
  QuoteCalculationInput,
  QuoteCalculationResult,
  Tenant,
} from "@/entities/tenant/schema";

export function calculateCleaningQuote(
  tenant: Tenant | PublicTenant,
  input: QuoteCalculationInput
): QuoteCalculationResult {
  const { pricing } = tenant;
  const { bedrooms, bathrooms, serviceType, selectedAddOnIds } = input;

  const bedroomsCost = bedrooms * pricing.ratePerBedroom;
  const bathroomsCost = bathrooms * pricing.ratePerBathroom;
  const baseSubtotal = pricing.baseDispatchFee + bedroomsCost + bathroomsCost;

  const selectedService =
    pricing.services.find((s) => s.id === serviceType) ?? pricing.services[0];
  const serviceMultiplier = selectedService.multiplier;
  const serviceTotal = Math.round(baseSubtotal * serviceMultiplier);

  const addOnsTotal = selectedAddOnIds.reduce((sum, addOnId) => {
    const item = pricing.addOns.find(
      (a) => a.id === addOnId && a.enabled !== false
    );
    return sum + (item ? item.price : 0);
  }, 0);

  const finalEstimatedTotal = serviceTotal + addOnsTotal;

  const selectedAddOnNames = selectedAddOnIds
    .map((id) => pricing.addOns.find((a) => a.id === id)?.name)
    .filter(Boolean);

  const addOnsSummary =
    selectedAddOnNames.length > 0
      ? ` + Add-ons: ${selectedAddOnNames.join(", ")}`
      : "";

  const summaryText = `${selectedService.name} (${bedrooms} Bed, ${bathrooms} Bath)${addOnsSummary}`;

  return {
    baseSubtotal,
    serviceMultiplier,
    serviceTotal,
    addOnsTotal,
    finalEstimatedTotal,
    currencySymbol: pricing.currencySymbol,
    summaryText,
  };
}
