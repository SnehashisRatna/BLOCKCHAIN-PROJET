// SPDX-License-Identifier: MIT
//pragma solidity >=0.4.22 <0.9.0;

pragma solidity ^0.8.19;

contract SimpleStorage {
    uint256 private _value;

    event ValueChanged(uint256 newValue);

    function read() public view returns (uint256) {
        return _value;
    }

    function write(uint256 newValue) public {
        _value = newValue;
        emit ValueChanged(newValue);
    }
}