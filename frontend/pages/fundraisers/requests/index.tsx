import React from 'react';
import Layout from '../../../components/Layout';
import { Button, Table, Header, Icon } from 'semantic-ui-react';
import { Link, Router } from '../../../routes';
import { NextPageContext } from 'next';
import { Fundraiser } from '../../../../typechain/Fundraiser';
import { ethers } from 'ethers';
import Request from '../../../components/Request';
import getFundraiser from '../../../utils/fundraiser';

interface IReqeustsProps {
  address?: string;
  requestCount?: number;
  donatorCount?: number;
  pendingRequestCount?: number;
  requests?: any[];
  fundraiser?: Fundraiser;
  fundings: number;
  fundingGoal: number;
  fundraiserIsActive: boolean;
}

class Requests extends React.Component<IReqeustsProps> {
  static async getInitialProps({ query }: NextPageContext) {
    const address = query.address;
    const fundraiser = (await getFundraiser(address as string)) as Fundraiser;

    const requestCount = await (await fundraiser.requestCount()).toNumber();
    const donatorCount = await (await fundraiser.donatorCount()).toNumber();
    const fundings = await (await fundraiser.fundings()).toNumber();
    const fundingGoal = await (await fundraiser.fundingGoal()).toNumber();
    const fundraiserIsActive = await fundraiser.fundraiserIsActive();

    const pendingRequestCount = await (
      await fundraiser.pendingRequests()
    ).toNumber();

    const unprocessedRequests = await Promise.all(
      Array(requestCount)
        .fill(undefined)
        .map((_element, index) => {
          return fundraiser.requests(index);
        })
    );

    const requests = [];
    for (let unprocessedRequest of unprocessedRequests) {
      const request = {
        title: unprocessedRequest[0],
        amount: ethers.utils.formatEther(unprocessedRequest[1]._hex),
        approvalCount: parseInt(unprocessedRequest[2]._hex),
        complete: unprocessedRequest[3],
      };

      requests.push(request);
    }

    return {
      address,
      requests,
      requestCount,
      donatorCount,
      pendingRequestCount,
      fundings,
      fundingGoal,
      fundraiserIsActive,
    };
  }

  componentDidMount() {
    if (this.props.fundings >= this.props.fundingGoal) {
      this.setState({ finished: true });
    }
  }

  state = {
    errorMessage: '',
    loading: false,
    finished: false,
  };

  renderRequests() {
    return this.props.requests.map((request, index) => {
      return (
        <Request
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          donatorCount={this.props.donatorCount}
        />
      );
    });
  }

  onWithdrawAll = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    const fundraiser = await getFundraiser(this.props.address);
    try {
      const tx = await fundraiser.createWithdrawAllRequest('Withdraw all');

      await tx.wait();

      Router.replaceRoute(`/fundraisers/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/fundraisers/${this.props.address}`}>
          <a style={{ color: 'black' }}>
            <Icon name="reply all"></Icon>
          </a>
        </Link>
        <Link route={`/fundraisers/${this.props.address}/requests/create`}>
          <a>
            <Button
              secondary
              floated="right"
              style={{ marginBottom: 10 }}
              disabled={!this.props.fundraiserIsActive}
            >
              Create request
            </Button>
          </a>
        </Link>
        <Button
          disabled={!this.state.finished || !this.props.fundraiserIsActive}
          negative
          floated="right"
          style={{ marginBottom: 10 }}
          onClick={this.onWithdrawAll}
          loading={this.state.loading}
        >
          Withdraw all
        </Button>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Approval count</Table.HeaderCell>
              <Table.HeaderCell>Approve</Table.HeaderCell>
              <Table.HeaderCell>Complete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderRequests()}</Table.Body>
        </Table>
        <Header as="h3">
          <Icon name="ethereum" />
          <Header.Content>
            Viewing {this.props.requestCount} requests
            <Header.Subheader>
              Currently pending {this.props.pendingRequestCount} requests
            </Header.Subheader>
          </Header.Content>
        </Header>
      </Layout>
    );
  }
}

export default Requests;
