export const formatCount = (value: number): string => {
  return value.toLocaleString("en-US");
};

export const formatDecimal = (value: number): string => {
  return value.toFixed(1);
};

export const formatDays = (value: number, fractionDigits: number = 1): string => {
  return `${value.toFixed(fractionDigits)} d`;
};

export const formatKitCount = (count: number): string => {
  return `${formatCount(count)} ${count === 1 ? "kit" : "kits"}`;
};
