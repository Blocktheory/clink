import { Wallet, ethers } from "ethers";
import { GelatoRelayPack } from "@safe-global/relay-kit";
import Safe, {
  EthersAdapter,
  SafeAccountConfig,
  SafeConfig,
  SafeFactory,
} from "@safe-global/protocol-kit";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
  SafeTransactionData,
  SafeTransactionDataPartial,
} from "@safe-global/safe-core-sdk-types";
import SafeApiKit from "@safe-global/api-kit";
import { POLYGON_ZKEVM } from "../constants";

const GELATO_RELAY_API_KEY = process.env.NEXT_PUBLIC_GELATO_RELAY_API_KEY;
console.log(GELATO_RELAY_API_KEY);
const chainId = 5;
const gasLimit = 100000;
const SAFE_API_SERVICE_URL = "https://safe-transaction-zkevm.safe.global/";

const APP_PRIVATE_KEY: string | undefined = process.env.NEXT_PUBLIC_PRIVATE_KEY;

if (!APP_PRIVATE_KEY) {
  console.log("Could not find priv Key in enviorment");
}

const AppProvider = new ethers.providers.JsonRpcProvider(POLYGON_ZKEVM);
const AppSigner = new Wallet(APP_PRIVATE_KEY, AppProvider);

const options = {
  gasLimit: ethers.BigNumber.from(gasLimit),
  isSponsored: true,
};

const optionsSyncFee = {
  gasLimit: ethers.BigNumber.from(gasLimit),
  isSponsored: false,
};

// initialise Safe SDK and relay Kit
export const intializeSDK = async (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  safeAddress: string,
  isPredicted: boolean,
  ownerAddress: string,
  nonce: string // auth Method Id
): Promise<{ safeSDK: Safe; relayKit: GelatoRelayPack }> => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signerOrProvider,
  });

  const owners = [ownerAddress];
  const threshold = 1;

  let config: SafeConfig;
  if (isPredicted) {
    config = {
      ethAdapter,
      predictedSafe: {
        safeAccountConfig: {
          owners,
          threshold,
        },
        safeDeploymentConfig: {
          saltNonce: nonce,
        },
      },
    };
  } else {
    config = {
      ethAdapter,
      safeAddress,
    };
  }

  const safeSDK = await Safe.create(config);

  const relayKit = new GelatoRelayPack(GELATO_RELAY_API_KEY);

  return { safeSDK, relayKit };
};

export const intializeSDKNormal = async (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  safeAddress: string
): Promise<{ safeSDK: Safe; relayKit: GelatoRelayPack }> => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signerOrProvider,
  });

  const safeSDK = await Safe.create({
    ethAdapter,
    safeAddress,
  });

  const relayKit = new GelatoRelayPack();

  return { safeSDK, relayKit };
};

// txData =  "0x" in case of Native
// prepare Native send tx
export const prepareSendNativeTransactionData = async (
  destinationAddress: string,
  withdrawAmount: string,
  safeSDK: Safe
): Promise<string | undefined> => {
  const safeTransactionData: SafeTransactionDataPartial = {
    to: destinationAddress,
    data: "0x", // leave blank for native token transfers
    value: withdrawAmount,
    operation: OperationType.Call,
  };

  const safeTransaction = await safeSDK.createTransaction({
    safeTransactionData,
  });

  // safeSDK.getContractManager().safeContract?.encode
  console.log(safeTransaction);
  const signedSafeTx = await safeSDK.signTransaction(safeTransaction);

  if (!safeSDK) return;
  const encodedTx = safeSDK
    .getContractManager()
    .safeContract?.encode("execTransaction", [
      signedSafeTx.data.to,
      signedSafeTx.data.value,
      signedSafeTx.data.data,
      signedSafeTx.data.operation,
      signedSafeTx.data.safeTxGas,
      signedSafeTx.data.baseGas,
      signedSafeTx.data.gasPrice,
      signedSafeTx.data.gasToken,
      signedSafeTx.data.refundReceiver,
      signedSafeTx.encodedSignatures(),
    ]);

  console.log(encodedTx);

  return encodedTx;
};

// prepare all type of transactions only to for safe
export const prepareSendTransactionData = async (
  destinationAddress: string,
  encodedData: string,
  safeSDK: Safe
) => {
  const safeTransactionData: SafeTransactionDataPartial = {
    to: destinationAddress,
    data: encodedData,
    value: "0",
    operation: OperationType.Call,
  };

  const safeTransaction = await safeSDK.createTransaction({
    safeTransactionData,
  });

  const signedSafeTx = await safeSDK.signTransaction(safeTransaction);
  if (!safeSDK) return;
  const encodedTx = safeSDK
    .getContractManager()
    .safeContract?.encode("execTransaction", [
      signedSafeTx.data.to,
      signedSafeTx.data.value,
      signedSafeTx.data.data,
      signedSafeTx.data.operation,
      signedSafeTx.data.safeTxGas,
      signedSafeTx.data.baseGas,
      signedSafeTx.data.gasPrice,
      signedSafeTx.data.gasToken,
      signedSafeTx.data.refundReceiver,
      signedSafeTx.encodedSignatures(),
    ]);

  return encodedTx;
};

// send any type of encoded Data vias Sync FEE , paid from the Safe
export const sendTransactionSyncFee = async (
  destinationAddress: string,
  safeSDK: Safe,
  relayKit: GelatoRelayPack,
  encodedData: string,
  value: string
) => {
  const safeTransactionData: MetaTransactionData[] = [
    {
      to: destinationAddress,
      data: encodedData, // leave blank for native token transfers
      operation: OperationType.Call,
      value: value,
    },
  ];
  console.log(safeTransactionData);

  //   const safeTransaction = await safeSDK.createTransaction({
  //     safeTransactionData,
  //   });

  const safeTransaction = await relayKit.createRelayedTransaction({
    safe: safeSDK,
    transactions: safeTransactionData,
  });

  console.log(safeTransaction);
  const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction);

  const response = await relayKit.executeRelayTransaction(
    signedSafeTransaction,
    safeSDK
  );
  console.log(response);

  console.log(
    `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
  );
};

// send any tx via 1 balance , Paid through the gas Tank
export const sendTransaction1Balance = async (
  destinationAddress: string,
  safeSDK: Safe,
  relayKit: GelatoRelayPack,
  encodedData: string,
  value: string
) => {
  const safeTransactionData: MetaTransactionData[] = [
    {
      to: destinationAddress,
      data: encodedData, // leave blank for native token transfers
      operation: OperationType.Call,
      value: value,
    },
  ];

  const options: MetaTransactionOptions = {
    isSponsored: true,
    gasLimit: "100000",
  };

  //   const safeTransaction = await safeSDK.createTransaction({
  //     safeTransactionData,
  //   });

  const safeTransaction = await relayKit.createRelayedTransaction({
    safe: safeSDK,
    transactions: safeTransactionData,
    options,
  });

  const signedSafeTransaction = await safeSDK.signTransaction(safeTransaction);

  const response = await relayKit.executeRelayTransaction(
    signedSafeTransaction,
    safeSDK,
    options
  );

  console.log(
    `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
  );
};

const intializeSafeAPI = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signerOrProvider,
  });

  const safeSAPIService = new SafeApiKit({
    txServiceUrl: SAFE_API_SERVICE_URL,
    ethAdapter,
  });

  return safeSAPIService;
};

export const getUserSafe = async (userAddress: string) => {
  const safeService = intializeSafeAPI(AppProvider);

  // console.log(userAddress)
  const safes = await safeService.getSafesByOwner(userAddress);
  console.log(safes);

  const safeAddress = safes.safes[0];
  console.log(safeAddress);
  return safeAddress;
};

export const enableModule = async (safeSdk: Safe, moduleAddress: string) => {
  const safeTransaction = await safeSdk.createEnableModuleTx(moduleAddress);
  const txResponse = await safeSdk.executeTransaction(safeTransaction);
  await txResponse.transactionResponse?.wait();

  console.log(txResponse);
  return txResponse;
};

export const createSafeWallet = async (
  userAddress: string,
  nonce: string // Auth Method Id
): Promise<string | undefined> => {
  try {
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: AppSigner,
    });

    const safeFactory = await SafeFactory.create({
      ethAdapter: ethAdapter,
    });

    const owners = [userAddress];
    const threshold = 1;

    const safeAddress = await getUserSafe(userAddress);
    console.log(safeAddress, "safeAddressssss");
    if (safeAddress) {
      const safeSDK = await Safe.create({ ethAdapter, safeAddress });
      return safeSDK;
    }

    console.log("Deploy required");

    // / Will it have gas fees to deploy this safe tx
    // const safeSdk = await safeFactory.deploySafe({
    //   safeAccountConfig,
    //   saltNonce: nonce,
    // });
    const safeAccountConfig: SafeAccountConfig = {
      owners: [userAddress],
      threshold: 1,
    };
    console.log("Creating and deploying the new safe");

    // / wait for the deployement to be completed
    const newSafeAddress = await safeFactory.predictSafeAddress(
      safeAccountConfig
    );

    console.log(newSafeAddress, "newSafeAddress");

    /// On Continue, direct to the home page
    return newSafeAddress;
  } catch (error) {
    console.log(error);
  }
};

export const predictSafeWalletAddress = async (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  ownerAddress: string,
  nonce: string // auth Method Id
): Promise<string | undefined> => {
  try {
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signerOrProvider,
    });

    const safeFactory = await SafeFactory.create({
      ethAdapter: ethAdapter,
    });

    const owners = [ownerAddress];
    const threshold = 1;

    const safeAccountConfig = {
      owners,
      threshold,
    };

    console.log(safeAccountConfig);
    // / Will it have gas fees to deploy this safe tx
    const predictedSafeAddress = await safeFactory.predictSafeAddress(
      safeAccountConfig,
      nonce
    );

    console.log("Predicted Safe Address", predictSafeWalletAddress);

    /// On Continue, direct to the home page
    return predictedSafeAddress;
  } catch (error) {
    console.log(error);
  }
};

// demo Acc Safe Address = 0xFa6Ed5f1B20857992cF3fFA7276d42d0a3C08D06
// demo 2 = 0x3BE69B4DC26d9a5c233FACac01667954Cf6f647c
