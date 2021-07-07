const SquareVerifier = artifacts.require("SquareVerifier");
const { proof, inputs } = require("../../zokrates/code/square/proof.json");

contract("SquareVerifier", (accounts) => {
  const accountOne = accounts[0];
  const accountTwo = accounts[1];

  describe("verification process", function () {
    let contract;
    before(async function () {
      contract = await SquareVerifier.new();
    });

    it("should pass verification with correct proof", async function () {
      const output = await contract.verifyTx(proof.a, proof.b, proof.c, inputs);
      assert.equal(output, true, "Failed to verify a true proof");
    });

    it("should fail verification with incorrect proof", async function () {
      const output = await contract.verifyTx(proof.a, proof.b, proof.c, [
        "0x0000000000000000000000000000000000000000000000000000000000000009",
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      ]);
      assert.equal(
        output,
        false,
        "Did not fail verification for an incorrect proof"
      );
    });
  });
});
