import { ethers } from 'ethers';
import provider from './provider';
import fundraiser from '../../artifacts/contracts/Fundraiser.sol/Fundraiser.json';

let getFundraiser;

if (typeof window == 'undefined') {
  getFundraiser = (address) => {
    return new ethers.Contract(address, fundraiser.abi, provider);
  };
} else {
  getFundraiser = (address) => {
    return new ethers.Contract(address, fundraiser.abi, provider.getSigner(0));
  };
}

export default getFundraiser;
