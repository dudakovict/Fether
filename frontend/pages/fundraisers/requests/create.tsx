import React from 'react';
import { Link, Router } from '../../../routes';
import { Form, Button, Message, Input, Icon, Header } from 'semantic-ui-react';
import { NextPageContext } from 'next';
import Layout from '../../../components/Layout';
import { Fundraiser } from '../../../../typechain/Fundraiser';
import getFundraiser from '../../../utils/fundraiser';
import { ethers } from 'ethers';
import provider from '../../../utils/provider';

interface ICreateRequestProps {
  address?: string;
}

class CreateRequest extends React.Component<ICreateRequestProps> {
  static async getInitialProps({ query }: NextPageContext) {
    const address = query.address;

    return { address };
  }

  state = {
    title: '',
    amount: '',
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    const { title, amount } = this.state;

    try {
      const fundraiser = await getFundraiser(this.props.address);

      const balance = ethers.utils
        .formatEther(
          parseInt((await provider.getBalance(fundraiser.address))._hex)
        )
        .toString();

      if (amount > balance) {
        throw new Error('Invalid amount. Not enough balance');
      }

      const tx = await fundraiser.createWithdrawRequest(
        title,
        ethers.utils.parseEther(amount)
      );

      await tx.wait();

      Router.pushRoute(`/fundraisers/${this.props.address}/requests`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/fundraisers/${this.props.address}/requests`}>
          <a style={{ color: 'black' }}>
            <Icon name="reply all"></Icon>
          </a>
        </Link>
        <Header as="h3">
          <Icon name="ethereum" />
          Create a request!
        </Header>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Title</label>
            <Input
              value={this.state.title}
              onChange={(event) => this.setState({ title: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Amount</label>
            <Input
              value={this.state.amount}
              label="ether"
              labelPosition="right"
              onChange={(event) =>
                this.setState({ amount: event.target.value })
              }
            />
          </Form.Field>

          <Message error header="Error" content={this.state.errorMessage} />
          <Button secondary loading={this.state.loading}>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CreateRequest;
