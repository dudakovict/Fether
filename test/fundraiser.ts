import { ethers } from 'hardhat';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { FundraiserFactory } from '../typechain/FundraiserFactory';
import { Fundraiser } from '../typechain/Fundraiser';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

chai.use(solidity);
const { expect } = chai;

describe('FundraiserFactory', () => {
  let fundraisers: FundraiserFactory;
  let fundraiser: Fundraiser;
  let fundraiserAddress: string;
  let signers: SignerWithAddress[];

  beforeEach(async () => {
    signers = await ethers.getSigners();
    const fundraisersFactory = await ethers.getContractFactory(
      'FundraiserFactory',
      signers[0]
    );

    fundraisers = (await fundraisersFactory.deploy()) as FundraiserFactory;
    await fundraisers.deployed();

    await fundraisers.createFundraiser(signers[0].address, '100', '10');

    [fundraiserAddress] = await fundraisers.getFundraisers();
    fundraiser = (await ethers.getContractAt(
      'Fundraiser',
      fundraiserAddress,
      signers[0]
    )) as Fundraiser;
  });

  describe('Fundraiser', async () => {
    it('deploys contracts', async () => {
      expect(fundraisers.address).to.properAddress;
      expect(fundraiser.address).to.properAddress;
    });

    it('initializes storage variables correctly', async () => {
      const fundingGoal = await fundraiser.fundingGoal();
      const fundings = await fundraiser.fundings();
      const threshold = await fundraiser.threshold();
      const minimumDonation = await fundraiser.minimumDonation();
      const recipient = await fundraiser.recipient();
      const fundingsGoalReached = await fundraiser.fundingGoalReached();
      const donatorCount = await fundraiser.donatorCount();
      const requestCount = await fundraiser.requestCount();
      const pendingRequests = await fundraiser.pendingRequests();
      expect(fundingGoal).to.eq('100');
      expect(fundings).to.eq('0');
      expect(threshold).to.eq('25');
      expect(minimumDonation).to.eq('10');
      expect(recipient).to.eq(signers[0].address);
      expect(fundingsGoalReached).to.eq(false);
      expect(donatorCount).to.eq('0');
      expect(requestCount).to.eq('0');
      expect(pendingRequests).to.eq('0');
    });

    it('allows donations and marks users as donators', async () => {
      await fundraiser.donate({ value: '10' });

      const donator = await fundraiser.donators(signers[0].address);
      expect(donator.donator).to.eq(signers[0].address);
    });

    it('allows refunds', async () => {
      await fundraiser.donate({ value: '10' });
      await fundraiser.refund(signers[0].address);

      const donator = await fundraiser.donators(signers[0].address);
      const fundings = await fundraiser.fundings();
      expect(donator.amount).to.eq(0);
      expect(fundings).to.eq(0);
    });

    it('marks signer as owner', async () => {
      const owner = await fundraiser.owner();
      expect(owner).to.eq(signers[0].address);
    });

    it('requires a minimum donation', async () => {
      try {
        await fundraiser.donate({ value: '5' });
        expect(false);
      } catch (error) {
        expect(error);
      }
    });

    it('allows owner to make a withdrawal request', async () => {
      await fundraiser.donate({ value: '25' });
      await fundraiser.createWithdrawRequest('Test', '20');

      const request = await fundraiser.requests(0);
      expect(request.title).to.eq('Test');
    });

    it("doesn't allow owner to make withdrawal request before threshold has been passed", async () => {
      try {
        await fundraiser.createWithdrawRequest('Test', '20');
        expect(false);
      } catch (error) {
        expect(error);
      }
    });

    it('allows approval and completion of requests', async () => {
      await fundraiser.donate({ value: '25' });
      await fundraiser.createWithdrawRequest('Test', '20');

      const request = await fundraiser.requests(0);
      await fundraiser.approveWithdrawRequest(0);
      await fundraiser.completeWithdrawRequest(0);
      expect(request.complete);
    });

    it('allows owners to withdraw all of the balance from the contract', async () => {
      const [owner, addr1] = await ethers.getSigners();
      await fundraiser.connect(addr1).donate({ value: '100' });
      await fundraiser.connect(owner).createWithdrawAllRequest('Test');

      const request = await fundraiser.requests(0);
      await fundraiser.connect(addr1).approveWithdrawRequest(0);
      await fundraiser.connect(owner).completeWithdrawRequest(0);
      expect(request.complete);
    });
  });
});
