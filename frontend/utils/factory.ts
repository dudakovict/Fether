import { ethers } from 'ethers';
import fundraiserFactory from '../../artifacts/contracts/Fundraiser.sol/FundraiserFactory.json';
import provider from './provider';

let factory;

if (typeof window == 'undefined') {
  factory = new ethers.Contract(
    process.env.DEPLOYED_CONTRACT_ADDRESS,
    fundraiserFactory.abi,
    provider
  );
} else {
  factory = new ethers.Contract(
    process.env.DEPLOYED_CONTRACT_ADDRESS,
    fundraiserFactory.abi,
    provider.getSigner(0)
  );
}

export default factory;
