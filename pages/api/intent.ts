require("dotenv").config();
import { ChatGPTAPI } from "chatgpt";
import transactionData from "@/components/extras/data";

const chatGPTApi = new ChatGPTAPI({
  apiKey: process.env.NEXT_PUBLIC_GPT_API_KEY,
  debug: true,
});

const getResponse = async (req: any, res: any) => {
  if (!req) return null;
  if (req.method != "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  if (!req.body.userInput) {
    return res.status(400).json({ message: "Input required" });
  }

  const template = `      
  You are given a statement regarding either a token transfer/money transfer or an NFT transfer and you will have to answer the amount and token name and the address or email to send  it to in case of money/token transfer and NFT name and the address to send it to in case of NFT transfer. Return in the answer in form of an object with three key-value pairs: 'address,' 'nftName,' and 'amount' and in case if the answer is not avalaible in the statement please return null as answer.
  Take reference from the data provided here and follow the output structure accordingly: ${transactionData}. The output should contain only and all three of them : address , nftName and amount .The amount should always be an integer.The nftName should always be in the output, even when it is null.
`;

  try {
    console.log("api starting");
    const prompt = `${template} statement: ${req.body.userInput}`;
    console.log(prompt);
    const response = await chatGPTApi.sendMessage(prompt);
    console.log("res given");
    const output = response.text;
    console.log(output);
    res.status(200).json({ output: output });
  } catch (error) {
    console.log({ error });
  }
};

export default getResponse;

// for example: a statement is : Transfer 100 dollars to archit.eth, here the output should be {amount: 100, address:archit.eth} or statement: send 3 bayc NFTs to 0x8d7A86A304890abaA30Ef6a2aAd037531C071D37, the output should be : {amount:4, nftname: bayc, address:0x8d7A86A304890abaA30Ef6a2aAd037531C071D37 }`;
