import { ethers } from 'ethers';

let provider;

if (
  typeof window !== 'undefined' &&
  typeof (window as any).ethereum !== 'undefined'
) {
  if (typeof (window as any).ethereum !== 'undefined') {
    provider = new ethers.providers.Web3Provider((window as any).ethereum);

    if (
      typeof (window as any).ethereum.autoRefreshOnNetworkChange !== 'undefined'
    ) {
      (window as any).ethereum.autoRefreshOnNetworkChange = false;
    }

    (window as any).ethereum.on('chainChanged', () => {
      document.location.reload();
    });

    (window as any).ethereum
      .enable()
      .then((_accounts) => {})
      .catch((err) => {
        throw err;
      });
  } else {
    provider = new ethers.providers.Web3Provider(
      (window as any).web3.currentProvider
    );
  }
} else {
  provider = new ethers.providers.InfuraProvider(
    'rinkeby',
    process.env.INFURA_API_KEY
  );
}

export default provider;
