
export enum CHAINS_ENUMS {
    ETHEREUM = "Ethereum",
}

import { BaseGoerli } from "./baseGoerli";
import { Optimism } from "./optimism";
import { Arbitrum } from "./artbitrum";
import { OptimismGoerli } from "./optimismGoerli";

export const SelectedChain = {
  ...OptimismGoerli,
};
