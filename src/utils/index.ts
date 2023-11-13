import { Address } from "@alchemy/aa-core";
export const shortAddress = (address: Address) => {
  if (!address) return;
  return `${address.substring(0, 5)}••••${address.substring(38)}`;
};
