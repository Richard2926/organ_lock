var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "shine cream middle child victory slogan yellow first risk segment bonus garment";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/b58597a282c941b98d61a92f109c122e", 0, 4);
      },
      network_id: 4
    }
  },
  compilers: {
    solc: {
      version: "0.8.0", 
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}