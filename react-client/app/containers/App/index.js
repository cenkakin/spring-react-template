/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { browserHistory } from 'react-router';
import { createStructuredSelector } from 'reselect';
import 'antd/dist/antd.min.css';

import Header from 'components/Header';
import withProgressBar from 'components/ProgressBar';
import { connect } from 'react-redux';
import { logoutRequested } from './actions';
import { makeSelectLoggedIn } from './selectors';

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

class App extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loggedIn && this.props.loggedIn) {
      browserHistory.push('/login');
    }
  }

  render() {
    return (
      <AppWrapper>
        <Helmet
          titleTemplate="%s - Spring React Template"
          defaultTitle="Spring React Template"
        />
        {this.props.loggedIn && <Header
          onLogout={this.props.logout}
        />}
        {React.Children.toArray(this.props.children)}
      </AppWrapper>
    );
  }

}

App.propTypes = {
  loggedIn: React.PropTypes.bool,
  logout: React.PropTypes.func,
  children: React.PropTypes.node,
};

const mapStateToProps = createStructuredSelector({
  loggedIn: makeSelectLoggedIn(),
});

export function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logoutRequested()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withProgressBar(App));
