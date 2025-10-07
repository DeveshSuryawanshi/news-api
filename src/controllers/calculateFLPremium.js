export function calculateFLPremium(
  sumInsured,
  occupancyType,
  constructionClass,
  regionalCatTrendIndex,
  sprinklerSystemPresence,
  fireProtectionRating,
  geopoliticalVolatilityScore,
  constructionInflationIndex
) {
  // --- 1. Hardcoded Base Rate (e.g., per 1000 of Sum Insured) ---
  const baseRate = 2.50; // $2.50 per $1000 of Sum Insured

  // --- 2. Hardcoded Factors (Multiplicative) ---

  // Factor 1: Occupancy Type
  const occupancyFactor = (() => {
    switch (occupancyType.toLowerCase()) {
      case "residential": return 1.0;
      case "commercial": return 1.5;
      case "industrial": return 2.2;
      default: return 1.8;
    }
  })();

  // Factor 2: Construction Class
  const constructionFactor = (() => {
    switch (constructionClass.toUpperCase()) {
      case "A": return 0.85; // Superior construction
      case "B": return 1.0;
      case "C": return 1.3; // Inferior construction
      default: return 1.0;
    }
  })();

  // Factor 3 (NEWS): Regional Catastrophe Trend Index
  // High index (1.5) means high recent catastrophe activity, increasing risk.
  const catTrendFactor = Math.max(1.0, regionalCatTrendIndex);

  // Factor 4: Sprinkler System (Discount)
  const sprinklerFactor = sprinklerSystemPresence ? 0.75 : 1.0;

  // Factor 5: Fire Protection Rating
  const protectionFactor = (() => {
    switch (fireProtectionRating.toLowerCase()) {
      case "excellent": return 0.8;
      case "good": return 1.0;
      case "poor": return 1.5;
      default: return 1.2;
    }
  })();

  // Factor 6 (NEWS): Geopolitical Volatility Score (1=Low, 2=Medium, 3=High)
  const geopoliticalFactor = (() => {
    switch (geopoliticalVolatilityScore) {
      case 1: return 1.0;
      case 2: return 1.2;
      case 3: return 1.5;
      default: return 1.0;
    }
  })();

  // Factor 7 (NEWS): Construction Inflation Index
  const inflationFactor = Math.max(1.0, constructionInflationIndex);

  // Factor 8: Fixed Loading for Policy Admin/Acquisition Cost
  const adminLoadingFactor = 1.05; // 5% fixed loading

  // --- 3. Premium Calculation ---
  const basePremium = (sumInsured / 1000) * baseRate;

  const finalPremium =
    basePremium *
    occupancyFactor *
    constructionFactor *
    catTrendFactor *
    sprinklerFactor *
    protectionFactor *
    geopoliticalFactor *
    inflationFactor *
    adminLoadingFactor;

  // Return the final estimated annual premium
  return Number(finalPremium.toFixed(2));
}
