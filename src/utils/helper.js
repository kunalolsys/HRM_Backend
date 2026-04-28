export const getFinancialYear = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;

  return m >= 4
    ? `${y}-${(y + 1).toString().slice(2)}`
    : `${y - 1}-${y.toString().slice(2)}`;
};
