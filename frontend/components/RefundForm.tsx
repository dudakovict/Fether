import React from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import getFundraiser from '../utils/fundraiser';
import { Fundraiser } from '../../typechain/Fundraiser';
import { Router } from '../routes';

interface IRefundFormProps {
  instance?: Fundraiser;
  address?: string;
}

class RefundForm extends React.Component<IRefundFormProps> {
  state = {
    address: '',
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    const fundraiser = (await getFundraiser(this.props.address)) as Fundraiser;
    try {
      const tx = await fundraiser.refund(this.state.address);

      await tx.wait();

      Router.replaceRoute(`/fundraisers/${this.props.address}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false, amount: '' });
  };

  render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        error={!!this.state.errorMessage}
        style={{ marginTop: 50 }}
      >
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={this.state.address}
            onChange={(event) => this.setState({ address: event.target.value })}
            label="address"
            labelPosition="right"
          />
        </Form.Field>
        <Message error header="Error" content={this.state.errorMessage} />
        <Button negative basic loading={this.state.loading}>
          Refund
        </Button>
      </Form>
    );
  }
}

export default RefundForm;
