// Use the same order anywhere battery brands are presented.
export const batteryBrands = ["Vulcano", "Moura", "Willard", "Varta"];

export function compareBatteryBrands(a, b) {
  const rank = (brand) => {
    const index = batteryBrands.indexOf(brand);
    return index < 0 ? batteryBrands.length : index;
  };
  return rank(a) - rank(b);
}
