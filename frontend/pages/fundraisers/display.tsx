import React from 'react';
import Layout from '../../components/Layout';
import { NextPageContext } from 'next';
import getFundraiser from '../../utils/fundraiser';
import { Fundraiser } from '../../../typechain/Fundraiser';
import { Card, Grid, Button } from 'semantic-ui-react';
import DonationForm from '../../components/DonationForm';
import RefundForm from '../../components/RefundForm';
import { Link } from '../../routes';
import { ethers } from 'ethers';

interface IFundraiserProps {
  fundraiser?: Fundraiser;
  minimumDonation: number;
  fundingGoal: number;
  fundings: number;
  donatorCount: number;
  requestCount: number;
  owner: string;
  recipient: string;
  address: string;
  threshold: number;
}

class DisplayFundraiser extends React.Component<IFundraiserProps> {
  static async getInitialProps({ query }: NextPageContext) {
    const fundraiser = await getFundraiser(query.address);
    const statistics = await fundraiser.statistics();

    return {
      address: query.address,
      minimumDonation: statistics[0].toNumber(),
      fundingGoal: statistics[1].toNumber(),
      fundings: statistics[2].toNumber(),
      donatorCount: statistics[3].toNumber(),
      requestCount: statistics[4].toNumber(),
      threshold: statistics[5].toNumber(),
      owner: statistics[6],
      recipient: statistics[7],
    };
  }

  renderStatistics() {
    const {
      minimumDonation,
      fundingGoal,
      fundings,
      donatorCount,
      requestCount,
      threshold,
      owner,
      recipient,
    } = this.props;

    const items = [
      {
        header: owner,
        meta: 'Address of owner',
        description:
          'The owner is the person who created this fundraiser and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: recipient,
        meta: 'Address of recipient',
        description: 'Recipient is the beneficiary of this fundraiser',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: ethers.utils.formatEther(fundingGoal),
        meta: 'Funding goal',
        description: 'Amount of ether this fundraiser is asking for',
      },
      {
        header: minimumDonation,
        meta: 'Minimum donation',
        description: 'Minimum amount of wei needed to become a donator',
      },
      {
        header: ethers.utils.formatEther(fundings),
        meta: 'Current fundings',
        description: 'Current amount of ether this fundraiser has accumulated',
      },
      {
        header: donatorCount,
        meta: 'Number of donators',
        description:
          'Current number of people who have donated to this fundraiser',
      },
      {
        header: requestCount,
        meta: 'Request count',
        description: 'Number of withdrawal requests that have been created',
      },
      {
        header: ethers.utils.formatEther(threshold),
        meta: 'Threshold',
        description:
          "The owner can't create withdrawal requests before the fundings have passed the threshold and donators can't request a refund after the fundings have passed the threshold",
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderStatistics()}</Grid.Column>

            <Grid.Column width={6}>
              <DonationForm address={this.props.address} />
              <RefundForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/fundraisers/${this.props.address}/requests`}>
                <a>
                  <Button secondary>View requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default DisplayFundraiser;
