import React from 'react';
import { FormattedMessage } from 'react-intl';

import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import messages from './messages';


class Header extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>
        <NavBar>
          <HeaderLink to="/">
            <FormattedMessage {...messages.home} />
          </HeaderLink>
          <HeaderLink onClick={this.props.onLogout}>
            <FormattedMessage {...messages.logout} />
          </HeaderLink>
        </NavBar>
      </div>
    );
  }
}

Header.propTypes = {
  onLogout: React.PropTypes.func,
};

export default Header;
