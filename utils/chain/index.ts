
export enum CHAINS_ENUMS {
    ETHEREUM = "Ethereum",
}

import { BaseGoerli } from "./baseGoerli";
import { Optimism } from "./optimism";
import { Arbitrum } from "./artbitrum";

export const SelectedChain = {
  ...BaseGoerli
};
