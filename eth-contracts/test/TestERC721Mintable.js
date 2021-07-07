const CustomERC721Mintable = artifacts.require("CustomERC721Mintable");

contract("TestERC721Mintable", (accounts) => {
  const accountOne = accounts[0];
  const accountTwo = accounts[1];
  const name = "HouToken";
  const symbol = "HTC";
  const tokenURI =
    "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

  describe("match erc721 spec", function () {
    const tokenIds = [1, 2, 3, 4, 5];
    let contract;

    before(async function () {
      contract = await CustomERC721Mintable.new(name, symbol, {
        from: accountOne,
      });

      tokenIds.forEach(async (tokenId) => {
        await contract.mint(accounts[tokenId], tokenId, tokenURI, {
          from: accountOne,
        });

        if (tokenId === 5) {
          await contract.mint(accounts[tokenId], tokenId + 1, tokenURI, {
            from: accountOne,
          });
        }
      });
    });

    it("should return total supply", async function () {
      assert.equal(await contract.totalSupply(), 5);
    });

    it("should get token balance", async function () {
      assert.equal(await contract.balanceOf(accounts[1]), 1);
      assert.equal(await contract.balanceOf(accounts[2]), 1);
      assert.equal(await contract.balanceOf(accounts[3]), 1);
      assert.equal(await contract.balanceOf(accounts[4]), 1);
      assert.equal(await contract.balanceOf(accounts[5]), 2);
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      for (let i = 0; i < tokenIds.length; i++) {
        assert.equal(
          await contract.tokenURI(tokenIds[i]),
          `${tokenURI}${i + 1}`
        );
      }
    });

    it("should transfer token from one owner to another", async function () {
      const firstOwner = accounts[2];
      const secondOwner = accounts[3];
      await contract.safeTransferFrom(firstOwner, secondOwner, 2, {
        from: firstOwner,
      });
      assert.equal(await contract.ownerOf(2), secondOwner);
    });
  });

  describe("have ownership properties", async function () {
    let contract;
    before(async () => {
      contract = await CustomERC721Mintable.new(name, symbol, {
        from: accountOne,
      });
    });
    it("should fail when minting when address is not contract owner", async function () {
      try {
        await contract.mint(accounts[6], 7, tokenURI, {
          from: accountTwo,
        });
        assert.fail("Non-contract owner should not be able to mint a token.");
      } catch (error) {
        assert.isDefined(error);
      }
    });

    it("should return contract owner", async function () {
      const owner = await contract.owner();
      assert.equal(owner, accountOne);
    });
  });
});
