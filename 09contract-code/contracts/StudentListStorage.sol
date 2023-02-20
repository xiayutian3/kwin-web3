// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract StudentListStorage {
  struct Student {
    uint id;
    string name;
    uint age;
    address account;
  }

  Student[] public studentList;

  // 往数组添加元素
  function addList (string memory _name, uint _age) public returns(uint) {
    uint count = studentList.length;
    uint index = count+1;
    // msg.sender 交易的发起者
    studentList.push(Student(index,_name,_age,msg.sender));
    return studentList.length;
  }

  function getList() public view returns(Student[] memory){
    return studentList;
  }
}