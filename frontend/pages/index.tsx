import React from 'react';
import { NextPageContext } from 'next';
import { Card, Button, Header, Icon } from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../utils/factory';
import { Fundraiser } from '../../typechain/Fundraiser';
import { Link } from '../routes';
import getFundraiser from '../utils/fundraiser';

interface IFundraisersProps {
  fundraisers?: Fundraiser[];
  active?: boolean;
}

class Fundraisers extends React.Component<IFundraisersProps> {
  static async getInitialProps(_ctx: NextPageContext) {
    const fundraisers = await factory.getFundraisers();

    return { fundraisers };
  }

  async renderFundraisers() {
    const items = await Promise.all(
      this.props.fundraisers.map(async (address) => {
        const active = await getFundraiser(address).fundraiserIsActive();
        return {
          header: address,
          description: (
            <Link route={`/fundraisers/${address}`}>
              <Button
                color="black"
                style={{ marginTop: 10 }}
                disabled={!active}
              >
                {active ? 'View fundraiser' : 'Inactive'}
              </Button>
            </Link>
          ),
          fluid: true,
          style: {
            marginLeft: '0',
          },
        };
      })
    );

    this.setState({ items });
  }

  state = {
    items: [],
  };

  async componentDidMount() {
    await this.renderFundraisers();
  }

  render() {
    return (
      <Layout>
        <div>
          <Header as="h2">
            <Icon name="ethereum" />
            <Header.Content>
              Fundraisers
              <Header.Subheader>Create Your own!</Header.Subheader>
            </Header.Content>
          </Header>
          <Link route="/fundraisers/create">
            <a>
              <Button
                floated="right"
                content="Create fundraiser"
                icon="add circle"
                secondary
              />
            </a>
          </Link>
          <Card.Group items={this.state.items} />
        </div>
      </Layout>
    );
  }
}

export default Fundraisers;
