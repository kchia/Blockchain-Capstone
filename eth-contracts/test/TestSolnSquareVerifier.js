const SquareVerifier = artifacts.require("SquareVerifier");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const { proof, inputs } = require("../../zokrates/code/square/proof.json");

contract("SolnSquareVerifier", (accounts) => {
  const accountOne = accounts[0];
  const accountTwo = accounts[1];

  describe("minting process", function () {
    let contract;
    beforeEach(async function () {
      const verifier = await SquareVerifier.new({ from: accountOne });
      contract = await SolnSquareVerifier.new(
        verifier.address,
        "HouToken",
        "HTC",
        {
          from: accountOne,
        }
      );
    });

    it("should add a new solution", async function () {
      const {
        logs: [eventLog],
      } = await contract.addSolution(proof.a, proof.b, proof.c, inputs);

      assert.equal(eventLog.event, "SolutionAdded");
    });

    it("should mint an ERC721 token for a verified individual", async function () {
      const tokenId = 10;
      const {
        logs: [firstEvent, secondEvent, thirdEvent],
      } = await contract.mint(
        proof.a,
        proof.b,
        proof.c,
        inputs,
        accountTwo,
        tokenId
      );

      assert.equal(firstEvent.event, "SolutionAdded");
      assert.equal(secondEvent.event, "Transfer");
      assert.equal(thirdEvent.event, "TokenMinted");
      assert.equal(await contract.ownerOf(tokenId), accountTwo);
    });
  });
});
