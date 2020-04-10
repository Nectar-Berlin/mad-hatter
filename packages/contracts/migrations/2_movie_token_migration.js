const MovieToken = artifacts.require("MovieToken");

module.exports = function(deployer) {
  deployer.deploy(MovieToken);
};
