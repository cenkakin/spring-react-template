import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Form, Input, message } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { browserHistory } from 'react-router';

import { makeSelectLoggedIn, makeSelectLoginError, makeSelectLoginLoading } from '../App/selectors';
import { makeSelectLoginData } from './selectors';
import { changeLoginData } from './actions';
import { loginRequested } from '../App/actions';
import StyledForm from './Form';
import StyledFormItem from './FormItem';
import messages from './messages';
import StyledAntButton from './Button';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn) {
      browserHistory.push('/');
    }
    const { loginError } = nextProps;
    if (this.props.loginLoading !== nextProps.loginLoading && nextProps.loginError) {
      const { intl } = this.props;
      message.error(intl.formatMessage(loginError));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { onChangeLoginData, onSubmitForm } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onChangeLoginData(values);
        onSubmitForm();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <StyledForm onSubmit={this.handleSubmit}>
        <StyledFormItem label="Kullanıcı adı">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Lütfen bu alanı boş bırakmayınız.' }],
          })(
            <Input />,
          )}
        </StyledFormItem>
        <StyledFormItem label="Parola">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Lütfen bu alanı boş bırakmayınız.' }],
          })(
            <Input type="password" />,
          )}
        </StyledFormItem>
        <StyledFormItem>
          <StyledAntButton type="primary" htmlType="submit">
            <FormattedMessage {...messages.loginButton} />
          </StyledAntButton>
        </StyledFormItem>
      </StyledForm>
    );
  }
}

LoginForm.propTypes = {
  form: React.PropTypes.object,
  onSubmitForm: React.PropTypes.func,
  onChangeLoginData: React.PropTypes.func,
  loginError: React.PropTypes.object,
  loginLoading: React.PropTypes.bool,
  intl: React.PropTypes.object,
};


export function mapDispatchToProps(dispatch) {
  return {
    onChangeLoginData: (loginData) => dispatch(changeLoginData(loginData)),
    onSubmitForm: () => {
      dispatch(loginRequested());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  loggedIn: makeSelectLoggedIn(),
  username: makeSelectLoginData(),
  loginError: makeSelectLoginError(),
  loginLoading: makeSelectLoginLoading(),
});

const Login = Form.create()(injectIntl(LoginForm, {
  withRef: true,
}));
export default connect(mapStateToProps, mapDispatchToProps)(Login);
