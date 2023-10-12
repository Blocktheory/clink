import { getApiService, globalApiService } from "../utils/globalApiServices";
import axiosInstance from "../utils/httpInterceptor";

enum ETHEREUM_REQUESTS {
  ethBalance = "eth_getBalance",
  ethEstimatedGas = "eth_estimateGas",
  ethGasPrice = "eth_gasPrice",
  ethSendRawTransaction = "eth_sendRawTransaction",
  ethGetTransactionCount = "eth_getTransactionCount",
  ethTransactionStatus = "eth_getTransactionReceipt",
}

export const getBalance = async (address: string) => {
  return new Promise(function (resolve, reject) {
    globalApiService(ETHEREUM_REQUESTS.ethBalance, [address, "latest"])
      .then((response) => {
        resolve(response);
      })
      .catch((e) => reject(e));
  });
};

export const getEstimatedGas = async (params: {
  from: string;
  to: string;
  value: string;
}) => {
  const { from, to, value } = params;
  return new Promise(function (resolve, reject) {
    globalApiService(ETHEREUM_REQUESTS.ethEstimatedGas, [
      { from: from, to: to, value: value },
    ])
      .then((response) => {
        resolve(response);
      })
      .catch((e) => reject(e));
  });
};

export const getGasPrice = async () => {
  return new Promise(function (resolve, reject) {
    globalApiService(ETHEREUM_REQUESTS.ethGasPrice, [])
      .then((response) => {
        resolve(response);
      })
      .catch((e) => reject(e));
  });
};

export const getNonce = async (address: string) => {
  return new Promise(function (resolve, reject) {
    globalApiService(ETHEREUM_REQUESTS.ethGetTransactionCount, [
      address,
      "latest",
    ])
      .then((response) => {
        resolve(response);
      })
      .catch((e) => reject(e));
  });
};

export const getSendRawTransaction = async (tx: string) => {
  return new Promise(function (resolve, reject) {
    globalApiService(ETHEREUM_REQUESTS.ethSendRawTransaction, [tx])
      .then((response) => {
        resolve(response);
      })
      .catch((e) => reject(e));
  });
};

export const getSendTransactionStatus = async (hash: string) => {
  return new Promise(function (resolve, reject) {
    globalApiService(ETHEREUM_REQUESTS.ethTransactionStatus, [hash])
      .then((response) => {
        resolve(response);
      })
      .catch((e) => reject(e));
  });
};

export const getRelayTransactionStatus = async (taskId: string) => {
  return new Promise(function (resolve, reject) {
    getApiService({
      url: `https://relay.gelato.digital/tasks/status/${taskId}`,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((e) => reject(e));
  });
};

export const getUsdPrice = (): Promise<any[]> => {
  const config = {
    method: "get",
    url: "https://pro-api.coingecko.com/api/v3/simple/price?ids=neo&vs_currencies=usd&x_cg_pro_api_key=CG-3rZprwbEEjFtakNBS8mghn8H",
    headers: { "Content-Type": "application/json" },
  };
  return new Promise((resolve) => {
    axiosInstance(config)
      .then((res: any) => {
        if (res.status === 200) {
          resolve(res);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

export const getUnlimitConfiguration = (signature: string) => {
  return new Promise(function (resolve, reject) {
    const data = {
      url: `https://cors.codecrane.com/https://api-sandbox.gatefi.com/onramp/v1/configuration`,
      requestHeader: {
        "api-key": "PFaHPNtxehDZIPKhIwcKuBLZKRNuqIAW",
        signature: signature,
      },
    };
    getApiService(data)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => reject(e));
  });
};

export const getUnlimitQuotes = (signature: string, data?: any) => {
  return new Promise(function (resolve, reject) {
    const data = {
      url: `https://cors.codecrane.com/https://api-sandbox.gatefi.com/onramp/v1/quotes?crypto=ETH&fiat=USD&amount=100&partnerAccountId=86e450c1-b5ed-4956-8654-2ebaed2c0bd9&region=US&payment=BANKCARD`,
      requestHeader: {
        "api-key": "PFaHPNtxehDZIPKhIwcKuBLZKRNuqIAW",
        signature: signature,
      },
    };
    getApiService(data)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => reject(e));
  });
};

export const getUnlimitBuy = (signature: string, params?: any) => {
  return new Promise(function (resolve, reject) {
    const data = {
      url: `https://cors.codecrane.com/https://api-sandbox.gatefi.com/onramp/v1/buy?region=US&payment=BANKCARD&crypto=ETH&fiat=USD&redirectUrl=https://blocktheory.com&partnerAccountId=86e450c1-b5ed-4956-8654-2ebaed2c0bd9`,
      requestHeader: {
        "api-key": "PFaHPNtxehDZIPKhIwcKuBLZKRNuqIAW",
        signature: signature,
      },
      payload: params,
    };
    getApiService(data)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => reject(e));
  });
};
