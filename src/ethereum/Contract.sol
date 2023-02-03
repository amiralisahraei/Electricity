// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract SimpleToken is Context, ERC20 {


    uint public due_date_amount;
    uint public due_date;
    address public contract_owner;
    mapping(address => bool) public blackaddresss;
    address[] public blacklist;
    bool public BlockAllTransactions = false;


    constructor (string memory TokenName, string memory TokenSymbol, uint TokenAmount, uint DueDateAmount, uint DueDate) 
        ERC20(TokenName, TokenSymbol) 
    {
        due_date_amount = DueDateAmount;
        due_date = DueDate;
        contract_owner = msg.sender;
        _mint(_msgSender(), TokenAmount * (10 ** uint256(decimals())));
    }

    modifier OnlyOwner{
        require(msg.sender == contract_owner, "Only owner can call this function");
        _;
    }

    modifier CheckBlackList(address Address){
        require(blackaddresss[Address] == false, "This address is in black list ");
        _;
    }

    modifier CheckBlockTransactions(bool input) {
        require(input == false, "All transactions are blocked");
        _;
    }

    function addBlackList(address blackaddress) public OnlyOwner  {
        require(blackaddresss[blackaddress] == false, "This address is avaialable in black list");
        blackaddresss[blackaddress] = true;
        blacklist.push(blackaddress);
    }

    function removeFromBlacklist(address blackaddress) public OnlyOwner {
        for(uint j = 0; j < blacklist.length; j++) {
            if(blacklist[j] == blackaddress){
                blacklist[j] = blacklist[blacklist.length-1];
                blacklist.pop();
            }
        }
    }

    function EnableBlockTransactions(bool input) public OnlyOwner{
        BlockAllTransactions = input;
    }

    function MintToken(uint amount) public {
        _mint(_msgSender(), amount * (10 ** uint256(decimals())));
    }

    function ShowBlackList() public view returns(address[] memory) {
        return blacklist;
    }


    function transfer(address to, uint256 amount) public virtual override 
        CheckBlackList(msg.sender) 
        CheckBlockTransactions(BlockAllTransactions)
        returns (bool)
    {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    function transferFrom( address from, address to, uint256 amount) public virtual override 
        CheckBlackList(msg.sender) 
        CheckBlockTransactions(BlockAllTransactions) 
        returns (bool) 
    {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }



}