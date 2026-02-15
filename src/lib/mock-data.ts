export interface Token {
  symbol: string;
  name: string;
  icon: string;
  price: number;
}

export interface LendingPool {
  id: string;
  token: Token;
  supplyAPY: number;
  borrowAPY: number;
  totalLiquidity: number;
  utilization: number;
  totalSupplied: number;
  totalBorrowed: number;
}

export interface Position {
  id: string;
  token: Token;
  amount: number;
  apy: number;
  value: number;
}

export interface HealthPosition {
  id: string;
  token: Token;
  supplied: number;
  borrowed: number;
  healthFactor: number;
  liquidationThreshold: number;
  ltv: number;
}

export interface Transaction {
  id: string;
  type: "supply" | "borrow" | "repay" | "withdraw" | "liquidation";
  token: Token;
  amount: number;
  timestamp: Date;
  hash: string;
}

export interface LiquidationEvent {
  id: string;
  collateralToken: Token;
  debtToken: Token;
  collateralAmount: number;
  debtAmount: number;
  timestamp: Date;
  healthFactorBefore: number;
  healthFactorAfter: number;
}

export const tokens: Token[] = [
  { symbol: "SOL", name: "Solana", icon: "◎", price: 178.42 },
  { symbol: "USDC", name: "USD Coin", icon: "$", price: 1.0 },
  { symbol: "mSOL", name: "Marinade SOL", icon: "🌊", price: 198.15 },
  { symbol: "jitoSOL", name: "Jito SOL", icon: "⚡", price: 195.83 },
  { symbol: "BONK", name: "Bonk", icon: "🐕", price: 0.0000234 },
  { symbol: "RAY", name: "Raydium", icon: "☀", price: 5.67 },
];

export const lendingPools: LendingPool[] = [
  { id: "1", token: tokens[0], supplyAPY: 5.42, borrowAPY: 8.31, totalLiquidity: 45_200_000, utilization: 72.3, totalSupplied: 163_000_000, totalBorrowed: 117_900_000 },
  { id: "2", token: tokens[1], supplyAPY: 3.18, borrowAPY: 5.67, totalLiquidity: 128_500_000, utilization: 64.1, totalSupplied: 358_000_000, totalBorrowed: 229_500_000 },
  { id: "3", token: tokens[2], supplyAPY: 6.21, borrowAPY: 9.45, totalLiquidity: 12_800_000, utilization: 78.5, totalSupplied: 59_500_000, totalBorrowed: 46_700_000 },
  { id: "4", token: tokens[3], supplyAPY: 7.03, borrowAPY: 10.12, totalLiquidity: 8_400_000, utilization: 81.2, totalSupplied: 44_700_000, totalBorrowed: 36_300_000 },
  { id: "5", token: tokens[4], supplyAPY: 12.45, borrowAPY: 18.92, totalLiquidity: 2_100_000, utilization: 89.3, totalSupplied: 19_600_000, totalBorrowed: 17_500_000 },
  { id: "6", token: tokens[5], supplyAPY: 8.76, borrowAPY: 13.21, totalLiquidity: 5_300_000, utilization: 74.8, totalSupplied: 21_000_000, totalBorrowed: 15_700_000 },
];

export const mySupplies: Position[] = [
  { id: "1", token: tokens[0], amount: 24.5, apy: 5.42, value: 4_371.29 },
  { id: "2", token: tokens[1], amount: 12_500, apy: 3.18, value: 12_500 },
  { id: "3", token: tokens[2], amount: 8.2, apy: 6.21, value: 1_624.83 },
];

export const myBorrows: Position[] = [
  { id: "1", token: tokens[1], amount: 5_000, apy: 5.67, value: 5_000 },
  { id: "2", token: tokens[0], amount: 3.1, apy: 8.31, value: 553.10 },
];

export const healthPositions: HealthPosition[] = [
  { id: "1", token: tokens[0], supplied: 24.5, borrowed: 3.1, healthFactor: 2.84, liquidationThreshold: 0.8, ltv: 0.65 },
  { id: "2", token: tokens[1], supplied: 12_500, borrowed: 5_000, healthFactor: 2.12, liquidationThreshold: 0.85, ltv: 0.75 },
  { id: "3", token: tokens[2], supplied: 8.2, borrowed: 0, healthFactor: 999, liquidationThreshold: 0.75, ltv: 0.6 },
];

export const recentTransactions: Transaction[] = [
  { id: "1", type: "supply", token: tokens[0], amount: 10.0, timestamp: new Date("2026-02-15T10:30:00"), hash: "5xK9...m3Fq" },
  { id: "2", type: "borrow", token: tokens[1], amount: 2_500, timestamp: new Date("2026-02-14T15:20:00"), hash: "8jR2...pL7w" },
  { id: "3", type: "repay", token: tokens[1], amount: 1_000, timestamp: new Date("2026-02-13T09:45:00"), hash: "3nT5...vH9x" },
  { id: "4", type: "supply", token: tokens[2], amount: 4.1, timestamp: new Date("2026-02-12T18:10:00"), hash: "7yM4...kQ2r" },
  { id: "5", type: "withdraw", token: tokens[0], amount: 2.0, timestamp: new Date("2026-02-11T14:55:00"), hash: "1bG8...dW6s" },
];

export const liquidationHistory: LiquidationEvent[] = [
  { id: "1", collateralToken: tokens[0], debtToken: tokens[1], collateralAmount: 15.3, debtAmount: 2_100, timestamp: new Date("2026-01-28T03:12:00"), healthFactorBefore: 0.98, healthFactorAfter: 1.52 },
  { id: "2", collateralToken: tokens[3], debtToken: tokens[1], collateralAmount: 22.1, debtAmount: 3_400, timestamp: new Date("2026-01-15T22:45:00"), healthFactorBefore: 0.95, healthFactorAfter: 1.41 },
];

export const earningsData = [
  { date: "Jan 1", earnings: 12.5 },
  { date: "Jan 8", earnings: 28.3 },
  { date: "Jan 15", earnings: 45.1 },
  { date: "Jan 22", earnings: 67.8 },
  { date: "Jan 29", earnings: 89.2 },
  { date: "Feb 5", earnings: 115.6 },
  { date: "Feb 12", earnings: 142.3 },
  { date: "Feb 15", earnings: 168.9 },
];

export const portfolioStats = {
  totalSupplied: 18_496.12,
  totalBorrowed: 5_553.10,
  netWorth: 12_943.02,
  netAPY: 4.28,
  overallHealthFactor: 2.45,
};

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toFixed(2);
}
