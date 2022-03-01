// SPDX-License-Identifier: MIT
// Creator: Chiru Labs

pragma solidity ^0.8.4;

import "./ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/*
 * @title MerkleProof
 * @dev Merkle proof verification
 * @note Based on https://github.com/ameensol/merkle-tree-solidity/blob/master/src/MerkleProof.sol
 */
library MerkleProof {
  
  function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf,
        uint index
    ) public pure returns (bool) {
        bytes32 hash = leaf;

        for (uint i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (index % 2 == 0) {
                hash = keccak256(abi.encodePacked(hash, proofElement));
            } else {
                hash = keccak256(abi.encodePacked(proofElement, hash));
            }

            index = index / 2;
        }

        return hash == root;
    }
}

contract MAPE is ERC721A, Ownable {
    uint256 public constant maxSupply = 7888;
    uint256 private constant maxBatchSize = 7888;
    uint256 private constant reservedAmount = 7888;

    constructor() ERC721A("MAPE NFT", "MAPE") {}

    uint256 public preSalePrice = 99 ether;
    uint256 public mintPrice = 130 ether;

    bool public _preSale = false;
    bool public _publicSale = false;

    function setMintPrice(uint256 newMintPrice) external onlyOwner {
        mintPrice = newMintPrice;
    }

    function setPreSalePrice(uint256 newMintPrice) external onlyOwner {
        preSalePrice = newMintPrice;
    }

    function flipPreSale() external onlyOwner {
        _preSale = !_preSale;
    }

    function flipPublicSale() external onlyOwner {
        _publicSale = !_publicSale;
    }

    /**
     * metadata URI
     */
    string private _baseURIExtended = "https://media.random.art/metadata/unrevealed/";

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseURIExtended = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIExtended;
    }

    /**
     * withdraw proceeds
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        Address.sendValue(payable(msg.sender), balance);
    }

    /**
     * pre-mint for team
     */
    mapping(address => bool) teamMembers;

    function devMint(uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= reservedAmount, "Not enough Tokens.");
        _safeMint(msg.sender, amount);
    }

    function addTeamMember(address user) public onlyOwner {
        teamMembers[user] = true;
    }

    function removeTeamMember(address user) public onlyOwner {
        teamMembers[user] = false;
    }

    /**
    * Public minting
     
    */

    bytes32 public merkleRootOGALOne = 0x3f755a721590785731b83e135c98ec66732bb48abffc88a341b88ab94e37cac4;
    bytes32 public merkleRootOGALTwo = 0x3f755a721590785731b83e135c98ec66732bb48abffc88a341b88ab94e37cac4;
    bytes32 public merkleRootOGALThr = 0x3f755a721590785731b83e135c98ec66732bb48abffc88a341b88ab94e37cac4;
    bytes32 public merkleRootAL = 0x3f755a721590785731b83e135c98ec66732bb48abffc88a341b88ab94e37cac4;

    mapping(address => uint256) tokenAmountsPerAddy;

    function mintNFT(uint256 amount, bytes32[] memory _merkleProofOGALOne, bytes32[] memory _merkleProofOGALTwo, bytes32[] memory _merkleProofOGALThr, bytes32[] memory _merkleProofAL, uint indexOGALOne, uint indexOGALTwo, uint indexOGALThr, uint indexAL) public payable {
        require(tx.origin == msg.sender, "Not Allowed contract mint!");
        if(teamMembers[msg.sender]) {
            _safeMint(msg.sender, amount);
        } else if(_preSale) {
            bytes32 leaf = keccak256((abi.encodePacked(msg.sender)));
            bool _OGALOne =  MerkleProof.verify(_merkleProofOGALOne, merkleRootOGALOne, leaf, indexOGALOne);
            bool _OGALTwo =  MerkleProof.verify(_merkleProofOGALTwo, merkleRootOGALTwo, leaf, indexOGALTwo);
            bool _OGALThr =  MerkleProof.verify(_merkleProofOGALThr, merkleRootOGALThr, leaf, indexOGALThr);
            bool _AL =  MerkleProof.verify(_merkleProofAL, merkleRootAL, leaf, indexAL);
            require(_OGALOne || _OGALTwo || _OGALThr || _AL, "Not Allowed user for PreSale");
            if(_OGALOne && tokenAmountsPerAddy[msg.sender] > 0) {
                require(msg.value > preSalePrice * amount, "Payment required for additional NFT(s)");
            }
            if(_OGALTwo && tokenAmountsPerAddy[msg.sender] > 1) {
                require(msg.value > preSalePrice * amount, "RPayment required for additional NFT(s)");
            }
            if(_OGALThr && tokenAmountsPerAddy[msg.sender] > 9) {
                require(msg.value > preSalePrice * amount, "Payment required for additional NFT(s)");
            }
            if(!_OGALOne && !_OGALTwo && _AL) {
                require(msg.value > preSalePrice * amount, "Require Pay for AL Mint");
            }
            _safeMint(msg.sender, amount);
            tokenAmountsPerAddy[msg.sender] += amount;
        } else if(_publicSale) {
            require(msg.value > mintPrice * amount, "Insufficient Funds...");
            _safeMint(msg.sender, amount);
        }
    }

    function setMerkleRootOGALOne(bytes32 _merkleProof) public onlyOwner {
        merkleRootOGALOne = _merkleProof;
    }

    function setMerkleRootOGALTwo(bytes32 _merkleProof) public onlyOwner {
        merkleRootOGALTwo = _merkleProof;
    }

    function setMerkleRootOGALThr(bytes32 _merkleProof) public onlyOwner {
        merkleRootOGALThr = _merkleProof;
    }

    function setMerkleRootAL(bytes32 _merkleProof) public onlyOwner {
        merkleRootAL = _merkleProof;
    }
}
