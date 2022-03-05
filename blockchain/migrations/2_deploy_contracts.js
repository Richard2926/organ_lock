const Waitlist = artifacts.require("./Waitlist.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Waitlist, accounts[1], accounts[2]);
};