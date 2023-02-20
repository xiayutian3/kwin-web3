// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract StudentStorage {
  uint public age;
  string public name;

  function setData (string memory _name, uint _age) public {
    name = _name;
    age = _age;
  }

  function getData() public view returns(string memory, uint){
    return (name, age);
  }
}