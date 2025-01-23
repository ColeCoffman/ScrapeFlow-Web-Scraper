export enum PackId {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export type CreditsPack = {
  id: PackId;
  name: string;
  label: string;
  credits: number;
  price: number;
  stripePriceId: string;
};

export const CreditsPacks: CreditsPack[] = [
  {
    id: PackId.SMALL,
    name: "Small",
    label: "1.000 credits",
    credits: 1000,
    price: 999,
    stripePriceId: process.env.STRIPE_SMALL_PRICE_ID!,
  },
  {
    id: PackId.MEDIUM,
    name: "Medium",
    label: "5,000 credits",
    credits: 5000,
    price: 3999,
    stripePriceId: process.env.STRIPE_MEDIUM_PRICE_ID!,
  },
  {
    id: PackId.LARGE,
    name: "Large",
    label: "10,000 credits",
    credits: 10000,
    price: 6999,
    stripePriceId: process.env.STRIPE_LARGE_PRICE_ID!,
  },
];

export const getCreditsPack = (id: PackId) => {
  return CreditsPacks.find((pack) => pack.id === id);
};
