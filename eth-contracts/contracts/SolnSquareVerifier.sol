// SPDX-License-Identifier: MIT
pragma solidity 0.5.7;

import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";

contract SolnSquareVerifier is CustomERC721Mintable {
    uint256 public solutionCount = 0;

    struct Solution {
        uint256 index;
        address solutionAddress;
    }

    mapping(bytes32 => Solution) private solutions;

    SquareVerifier private verifier;

    event SolutionAdded(uint256 index, address solutionAddress);

    event TokenMinted(address to, uint256 tokenId);

    constructor(
        address verifierAddress,
        string memory name,
        string memory symbol
    ) public CustomERC721Mintable(name, symbol) {
        verifier = SquareVerifier(verifierAddress);
    }

    modifier requireSolutionIsUnique(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory inputs
    ) {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, inputs[0]));
        require(
            solutions[key].solutionAddress == address(0),
            "Solution already exists"
        );
        _;
    }

    modifier requireSolutionIsVerified(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory inputs
    ) {
        bool verified = verifier.verifyTx(a, b, c, inputs);
        require(verified, "Solution cannot be verified");
        _;
    }

    function addSolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory inputs
    )
        public
        requireSolutionIsUnique(a, b, c, inputs)
        requireSolutionIsVerified(a, b, c, inputs)
        returns (bool success)
    {
        success = false;

        bytes32 key = keccak256(abi.encodePacked(a, b, c, inputs[0]));
        Solution memory solution = Solution({
            index: solutionCount,
            solutionAddress: msg.sender
        });
        solutions[key] = solution;
        solutionCount++;

        success = true;
        emit SolutionAdded(solution.index, solution.solutionAddress);
    }

    function mint(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory inputs,
        address to,
        uint256 tokenId
    ) public {
        addSolution(a, b, c, inputs);
        super.mint(
            to,
            tokenId,
            "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"
        );
        emit TokenMinted(to, tokenId);
    }
}
