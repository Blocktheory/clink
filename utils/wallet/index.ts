import * as bs58 from "bs58";
import { TW, WalletCore } from "@trustwallet/wallet-core";
import { ISigningInput, TTranx } from "./types";
export class Wallet {
    CoinType: WalletCore["CoinType"];
    HexCoding: WalletCore["HexCoding"];
    AnySigner: WalletCore["AnySigner"];
    HDWallet: WalletCore["HDWallet"];
    PublicKey: WalletCore["PublicKey"];
    AnyAddress: WalletCore["AnyAddress"];
    PrivateKey: WalletCore["PrivateKey"];
    Mnemonic: WalletCore["Mnemonic"];
    Curve: WalletCore["Curve"];
    TW: typeof TW;
    SolanaAddress: WalletCore["SolanaAddress"];
    StoredKey: WalletCore["StoredKey"];

    constructor(_walletCore: WalletCore, _tw = TW) {
        const {
            HDWallet,
            CoinType,
            AnySigner,
            HexCoding,
            PublicKey,
            PrivateKey,
            Mnemonic,
            Curve,
            AnyAddress,
            SolanaAddress,
            StoredKey,
        } = _walletCore;
        this.CoinType = CoinType;
        this.AnySigner = AnySigner;
        this.HexCoding = HexCoding;
        this.HDWallet = HDWallet;
        this.PublicKey = PublicKey;
        this.PrivateKey = PrivateKey;
        this.Mnemonic = Mnemonic;
        this.Curve = Curve;
        this.TW = _tw;
        this.AnyAddress = AnyAddress;
        this.SolanaAddress = SolanaAddress;
        this.StoredKey = StoredKey;
    }

    importWithPrvKey = async (
        privatekey: string,
        chainId = "ethereum",
        curve = "secp256k1",
    ) => {
        const _privateKey = this.trimZeroHex(privatekey);
        const _curve = this.getCurve(curve);
        const coinType = this.getCoinType(chainId);
        let prvKey = this.PrivateKey.create();
        try {
            prvKey = this.PrivateKey.createWithData(this.HexCoding.decode(_privateKey));
        } catch (e) {
            console.log(e);
        }
        let pubKey = prvKey?.getPublicKeyCurve25519();
        switch (_curve) {
            case this.Curve.secp256k1:
                pubKey = prvKey.getPublicKeySecp256k1(false);
                break;
            case this.Curve.ed25519:
                pubKey = prvKey.getPublicKeyEd25519();
                break;
            case this.Curve.ed25519Blake2bNano:
                pubKey = prvKey.getPublicKeyEd25519Blake2b();
                break;
            case this.Curve.curve25519:
                pubKey = prvKey.getPublicKeyCurve25519();
                break;
            case this.Curve.nist256p1:
                pubKey = prvKey.getPublicKeyNist256p1();
                break;
            case this.Curve.ed25519ExtendedCardano:
                pubKey = prvKey.getPublicKeyEd25519Cardano();
                break;
            default:
                break;
        }
        let generatedAddress = this.AnyAddress.createWithPublicKey(
            pubKey,
            coinType,
        ).description();
        return generatedAddress;
    };

    createPayLink = () => {
        const account = this.HDWallet.create(128, "");
        const entropy = account.entropy();
        const hash = bs58.encode(entropy);
        return "i/" + hash;
    };

    getAccountFromPayLink = (url: string) => {
        const urlHash = this.formatUrlHash(url);
        try {
            const bs58Decoded = bs58.decode(urlHash);
            const account = this.HDWallet.createWithEntropy(bs58Decoded, "");
            return account.getAddressForCoin(this.CoinType.ethereum);
        } catch {
            return "";
        }
    };

    // Not required to use this
    getKeyFromPayLink = (url: string) => {
        const urlHash = this.formatUrlHash(url);
        try {
            const bs58Decoded = bs58.decode(urlHash);
            const account = this.HDWallet.createWithEntropy(bs58Decoded, "");
            return this.bufferToHex(account.getKeyForCoin(this.CoinType.ethereum).data());
        } catch {
            return "";
        }
    };

    formatUrlHash = (url: string) => {
        let urlHash = url ?? "";
        if (!urlHash && urlHash == "") {
            return "";
        }
        if (urlHash.includes("/")) {
            urlHash = url.split("/").pop() ?? "";
        }
        return urlHash.replace("i/", "");
    };

    trimZeroHex = (zeroHex: string) => {
        if (zeroHex.startsWith("0x")) {
            return zeroHex.slice(2, zeroHex.length);
        }
        return zeroHex;
    };

    getCurve = (curve: string) => {
        switch (curve) {
            case "secp256k1":
                return this.Curve.secp256k1;
            case "ed25519Blake2bNano":
                return this.Curve.ed25519Blake2bNano;
            case "curve25519":
                return this.Curve.curve25519;
            case "nist256p1":
                return this.Curve.nist256p1;
            case "ed25519ExtendedCardano":
                return this.Curve.ed25519ExtendedCardano;
            case "ed25519":
                return this.Curve.ed25519;
            default:
                return this.Curve.secp256k1;
        }
    };

    getCoinType = (chainId: string) => {
        const coinType = this.CoinType;
        switch (chainId) {
            case "ethereum":
                return coinType.ethereum;
            case "bsc":
                return coinType.smartChain;
            case "polygon":
                return coinType.polygon;
            case "solana":
                return coinType.solana;
            case "zkevm":
                return coinType.polygonzkEVM;
            case "zksync":
                return coinType.zksync;
            default:
                return coinType.ethereum;
        }
    };

    bufferToHex = (unitArray: Uint8Array) => {
        return Buffer.from(unitArray).toString("hex");
    };

    createWithMnemonic(mnemonic: string, passphrase: string) {
        return this.HDWallet.createWithMnemonic(mnemonic, passphrase);
    }

    signEthTx = async (tx: TTranx, prvKey: string) => {
        const signingInput = this.getEthSigningInput(tx, prvKey);
        const input = TW.Ethereum.Proto.SigningInput.create(signingInput);
        const encoded = TW.Ethereum.Proto.SigningInput.encode(input).finish();
        const outputData = this.AnySigner.sign(encoded, this.CoinType.ethereum);
        const output = TW.Ethereum.Proto.SigningOutput.decode(outputData);
        return this.HexCoding.encode(output.encoded);
    };

    getEthSigningInput = (tx: TTranx, prvKey: string): ISigningInput => {
        this.txLogger(tx);
        const txDataInput = TW.Ethereum.Proto.Transaction.create();
        let txSignInputData: ISigningInput = {
            toAddress: tx.toAddress,
            chainId: Buffer.from(this.trimZeroHex(tx.chainIdHex ?? ""), "hex"),
            nonce: Buffer.from(this.trimZeroHex(tx.nonceHex ?? ""), "hex"),
            gasPrice: Buffer.from(this.trimZeroHex("0x5F5E132"), "hex"),
            gasLimit: Buffer.from(this.trimZeroHex(tx.gasLimitHex ?? ""), "hex"),
            privateKey: this.PrivateKey.createWithData(
                this.HexCoding.decode(
                    "0xab4d1b6e1cad9fc5c30d775b0b1bc636af2595a0fc0024d99be62384da43dc2b",
                ),
            ).data(),
        };
        if (!tx.isNative) {
            txDataInput.erc20Transfer =
                TW.Ethereum.Proto.Transaction.ERC20Transfer.create({
                    to: tx.toAddress,
                    amount: Buffer.from(tx.amountHex ?? "", "hex"),
                });
            txSignInputData = {
                ...txSignInputData,
                toAddress: tx.contractAddress,
            };
        } else {
            txDataInput.transfer = TW.Ethereum.Proto.Transaction.Transfer.create({
                amount: Buffer.from("2386F26FC10000", "hex"),
            });
        }
        txSignInputData = {
            ...txSignInputData,
            transaction: txDataInput,
        };
        return txSignInputData;
    };

    txLogger = (tx: TTranx) => {
        console.log("gasprice", tx.gasPrice);
        console.log("gasLimit", tx.gasLimit);
        console.log("amount", tx.amount);
        console.log("amountValue", tx.amountValue);
        console.log("contractDecimals", tx.contractDecimals);
        console.log("contractAddress", tx.contractAddress);
        console.log("nonce", tx.nonce);
        console.log("gaspriceHex", tx.gasPriceHex);
        console.log("gaspriceValue", tx.gasPriceValue);
        console.log("gasLimitHex", tx.gasLimitHex);
        console.log("amountHex", tx.amountHex);
        console.log("nonceHex", tx.nonceHex);
        console.log("chainId", tx.chainId);
        console.log("chainIdHex", tx.chainIdHex);
        console.log("toAddress", tx.toAddress);
        console.log("fromAddress", tx.fromAddress);
        console.log("symbol", tx.symbol);
        console.log("blockchain", tx.blockchain);
        console.log("isNative", tx.isNative);
        console.log("transactionType", tx.transactionType);
        console.log("data", tx.data);
        console.log("dataList", tx.dataList);
        console.log("value", tx.value);
        console.log("valueHex", tx.valueHex);
        console.log("denom", tx.denom);
        console.log("blockHash", tx.blockHash);
        console.log("splTokenRegistered", tx.splTokenRegistered);
        console.log("sequence", tx.sequence);
        console.log("accountNumber", tx.accountNumber);
        console.log("nonce Buffer", Buffer.from(tx.nonceHex ?? "", "hex"));
        console.log("chain id Buffer", Buffer.from("5208" ?? "", "hex"));
        console.log("amount Buffer", Buffer.from(tx.amountHex ?? "", "hex"));
        console.log("gasprice Buffer", Buffer.from(tx.gasPriceHex ?? "", "hex"));
        console.log("gasLimit Buffer", Buffer.from(tx.gasLimitHex ?? "", "hex"));
    };
}
