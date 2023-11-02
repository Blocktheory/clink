export enum CHAINS_ENUMS {
  ETHEREUM = "Ethereum",
}

import { BaseGoerli } from "./baseGoerli";
import { Optimism } from "./optimism";
import { Arbitrum } from "./artbitrum";
import { OptimismGoerli } from "./optimismGoerli";
import { Polygon } from "./polygon";

export const SelectedChain = {
  // ...OptimismGoerli,
  ...BaseGoerli,
};
