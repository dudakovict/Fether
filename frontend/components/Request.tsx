import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import { Fundraiser } from '../../typechain/Fundraiser';
import getFundraiser from '../utils/fundraiser';
import { Router } from '../routes';

interface IRequestProps {
  request?: any;
  address?: string;
  id?: number;
  donatorCount: number;
}

class Request extends React.Component<IRequestProps> {
  onApprove = async (event) => {
    event.preventDefault();

    this.setState({ loadingApproval: true, errorMessage: '' });

    const fundraiser = (await getFundraiser(this.props.address)) as Fundraiser;
    try {
      const tx = await fundraiser.approveWithdrawRequest(this.props.id);

      await tx.wait();

      Router.replaceRoute(`/fundraisers/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loadingApproval: false });
  };

  onComplete = async (event) => {
    event.preventDefault();

    this.setState({ loadingComplete: true, errorMessage: '' });

    const fundraiser = (await getFundraiser(this.props.address)) as Fundraiser;

    try {
      const tx = await fundraiser.completeWithdrawRequest(this.props.id);

      await tx.wait();

      Router.replaceRoute(`/fundraisers/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loadingComplete: false });
  };

  state = {
    errorMessage: '',
    loadingApproval: false,
    loadingComplete: false,
  };

  render() {
    const readyToComplete =
      this.props.request.approvalCount > this.props.donatorCount / 2;
    return (
      <Table.Row
        disabled={this.props.request.complete}
        positive={readyToComplete && !this.props.request.complete}
        negative={!readyToComplete && !this.props.request.complete}
      >
        <Table.Cell>{this.props.id}</Table.Cell>
        <Table.Cell>{this.props.request.title}</Table.Cell>
        <Table.Cell>{this.props.request.amount}</Table.Cell>
        <Table.Cell>
          {this.props.request.approvalCount}/{this.props.donatorCount}
        </Table.Cell>
        <Table.Cell>
          {this.props.request.complete ? null : (
            <Button
              color="blue"
              basic
              loading={this.state.loadingApproval}
              onClick={this.onApprove}
            >
              Approve
            </Button>
          )}
        </Table.Cell>
        <Table.Cell>
          {this.props.request.complete ? null : (
            <Button
              color="black"
              basic
              loading={this.state.loadingComplete}
              onClick={this.onComplete}
            >
              Complete
            </Button>
          )}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default Request;
