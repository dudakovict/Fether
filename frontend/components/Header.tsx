import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }} inverted>
      <Menu.Item>
        <Icon name="envira" />
        <Link route="/">
          <a className="item">Fether</a>
        </Link>
      </Menu.Item>

      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Fundraisers</a>
        </Link>
        <Link route="/fundraisers/create">
          <a className="item">
            <Icon name="plus circle" />
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
