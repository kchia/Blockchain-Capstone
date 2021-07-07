// migrating the appropriate contracts
const CustomERC721Mintable = artifacts.require("./CustomERC721Mintable.sol");
const SquareVerifier = artifacts.require("./SquareVerifier.sol");
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function (deployer) {
  deployer.deploy(CustomERC721Mintable, "HouToken", "HTC");
  deployer.deploy(SquareVerifier).then(() => {
    return deployer.deploy(
      SolnSquareVerifier,
      SquareVerifier.address,
      "HouToken",
      "HTC"
    );
  });
};
