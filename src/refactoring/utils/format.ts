export const formatCurrency = (price: number) => {
  return price.toLocaleString();
};

export const formatRateToPercent = (rate: number) => {
  return (rate * 100).toFixed(0);
};
