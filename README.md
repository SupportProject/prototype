# Ethereum / Vue Base Boilerplate

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

The initial commit for this project is based off a vue.js / Google Firebase tutual on [medium](https://medium.com/@oleg.agapov/basic-single-page-application-using-vue-js-and-firebase-part-1-9e4c0c11a228)

## Installing the Ethereum components to the local environment


``` bash
# Install truffle, the Ethereum development framework from Consensys
npm install -g truffle
truffle version, to check installed

# install ganache as a local test Ethereum blockchain
See downloads at http://truffleframework.com/ganache/
or npm install -g ganache-cli  
See https://github.com/trufflesuite/ganache-cli

# Run an instance of ganache-cli as per below, ganache will then listen on localhost:8545
$ ganache-cli
```

## Web3js Install Troubleshooting on Windows
Helped by https://github.com/ethereum/web3.js/issues/1066

``` bash
## Resolving node-gyp problems during npm install of web3

# Firstly install node-gyp
$ npm install -g node-gyp

# Install all the required tools and configurations using Microsoft's windows-build-tools from an elevated PowerShell or CMD.exe (run as Administrator).
npm install --global --production windows-build-tools

# configure node-gyp
node-gyp configure --msvs_version=2015

# Set path to python executable:
npm config set python $(which python)

Note: I also restarted my PC but I am not sure if that is necessary.  I checked location of Python.exe and found at C:\Users\John\.windows-build-tools\python27
```

The Web3 instance will be available via the browser config on
```
window.web3
```

John D's Test Firebase configuration - insert into config/dev.js:
```
apiKey: '"AIzaSyAFtw8zsWhYQK4AKl5HjVHxnrDmAiYxW1c"',
authDomain: '"vue-eth-base.firebaseapp.com"',
databaseURL: '"https://vue-eth-base.firebaseio.com"',
projectId: '"vue-eth-base"'
```


Note: Consider importing some the these useful ethereumjs projects, especially ethereum-tx: https://github.com/ethereumjs
