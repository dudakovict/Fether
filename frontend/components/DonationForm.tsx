import React from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import getFundraiser from '../utils/fundraiser';
import { ethers } from 'ethers';
import { Fundraiser } from '../../typechain/Fundraiser';
import { Router } from '../routes';

interface IDonationFormProps {
  instance?: Fundraiser;
  address?: string;
}

class DonationForm extends React.Component<IDonationFormProps> {
  state = {
    amount: '',
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    const fundraiser = await getFundraiser(this.props.address);
    try {
      const tx = await fundraiser.donate({
        value: ethers.utils.parseEther(this.state.amount),
      });

      await tx.wait();

      Router.replaceRoute(`/fundraisers/${this.props.address}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false, amount: '' });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to donate</label>
          <Input
            value={this.state.amount}
            onChange={(event) => this.setState({ amount: event.target.value })}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>
        <Message error header="Error" content={this.state.errorMessage} />
        <Button secondary loading={this.state.loading}>
          Donate!
        </Button>
      </Form>
    );
  }
}

export default DonationForm;
