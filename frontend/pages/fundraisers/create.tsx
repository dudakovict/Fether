import React from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message, Header, Icon } from 'semantic-ui-react';
import { Router } from '../../routes';
import { FundraiserFactory } from '../../../typechain/FundraiserFactory';
import factory from '../../utils/factory';

export default class CreateFundraiser extends React.Component {
  state = {
    fundingGoal: '',
    minimumDonation: '',
    recipient: '',
    errorMessage: '',
    loading: false,
  };

  onSumbit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const tx = (await factory.createFundraiser(
        this.state.recipient,
        this.state.fundingGoal,
        this.state.minimumDonation
      )) as FundraiserFactory;

      await tx.wait();

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Header as="h3">
          <Icon name="ethereum" />
          Create a fundraiser!
        </Header>
        <Form onSubmit={this.onSumbit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Funding goal</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.fundingGoal}
              onChange={(event) =>
                this.setState({ fundingGoal: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Minimum contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumDonation}
              onChange={(event) =>
                this.setState({ minimumDonation: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient</label>
            <Input
              label="address"
              labelPosition="right"
              value={this.state.recipient}
              onChange={(event) =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>

          <Message error header="Error!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} secondary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}
