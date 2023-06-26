export const formatNumber = (num: number | string | boolean, maximumFractionDigits = 2) => {
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maximumFractionDigits,
  });
};

export const formatAddress = (account: string, length?: number): string => {
  if (!length) return account;
  return `${account.substring(0, length)}...${account.substring(account.length - length, account.length)}`;
};
