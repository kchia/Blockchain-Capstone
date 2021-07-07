require("dotenv").config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const fs = require("fs");

const ContractJSON = require("../build/contracts/CustomERC721Mintable.json");
const MNEMONIC = fs.readFileSync("secret.txt").toString().trim();

const NODE_API_KEY = process.env.INFURA_KEY;
const isInfura = !!process.env.INFURA_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const TOKEN_COUNT = 10;

async function main() {
  if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error(
      "Please set a mnemonic, Infura key, owner, network, and contract address."
    );
    return;
  }

  const network =
    NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";

  const provider = new HDWalletProvider(
    MNEMONIC,
    isInfura
      ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
      : "https://eth-" + network + ".alchemyapi.io/v2/" + NODE_API_KEY
  );

  const web3Instance = new web3(provider);

  const contract = new web3Instance.eth.Contract(
    ContractJSON.abi,
    CONTRACT_ADDRESS,
    { gasLimit: "1000000" }
  );

  for (let i = 0; i < TOKEN_COUNT; i++) {
    const result = await contract.methods
      .mint(
        OWNER_ADDRESS,
        i + 1,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"
      )
      .send({ from: OWNER_ADDRESS });
    console.log("Minted token. Transaction: " + result.transactionHash);
  }
}

main();
