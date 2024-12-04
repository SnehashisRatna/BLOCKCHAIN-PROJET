const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = function(deployer) {
      deployer.deploy(SimpleStorage, { gas: 4000000 });
    };