import React from "react";
import PropTypes from "prop-types";
import PopoverContainer from "./popover-container.jsx";
import { PureEditableField, PureEditableTextArea } from '../includes/editable-field.jsx';
import _ from 'lodash';
import axios from "axios";

import { CurrentUserConsumer } from "../current-user.jsx";

export class ReportAbusePop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      email: '',
      emailError: '',
      reasonError: '',
    };
    this.submitReport = this.submitReport.bind(this);
    this.reasonOnChange = this.reasonOnChange.bind(this);
    this.formatRaw = this.formatRaw.bind(this);
    this.getUserInfoSection = this.getUserInfoSection.bind(this);
    this.emailOnChange = this.emailOnChange.bind(this);
    this.validateNotEmpty = this.validateNotEmpty.bind(this);
    this.debouncedValidateEmail = _.debounce(() => this.validateNotEmpty('email', 'emailError', 'Email'), 200);
    this.debouncedValidateReason = _.debounce(() => this.validateNotEmpty('reason', 'reasonError', 'A description of the issue'), 200);
  }

  padTo(content, length) {
    while (content.length < length) {
      content += "_";
    }
    return content;
  }

  formatRaw() {
    const submitter = this.props.currentUser.login
      ? this.props.currentUser.login
      : "anonymous";
    let email;
    if (this.state.email) {
      email = this.state.email;
    } else {
      const emailObj =
        Array.isArray(this.props.currentUser.emails) &&
        this.props.currentUser.emails.find(email => email.primary);
      email = emailObj && emailObj.email;
    }
    const glitchLink = `https://glitch.com/~${this.props.projectName}`;
    const firstHalf = `
- Project Name: [${glitchLink}](${glitchLink}),

- Project Id: ${this.props.projectId},

`;
    const submitterPart =
      submitter != "anonymous"
        ? `- Submitted by: [${submitter}](https://glitch.com/@${submitter})`
        : "";
    const secondHalf = `
- Contact: ${email}

- Message: ${this.state.reason}`;
    return `${firstHalf}

${submitterPart}
${secondHalf}`;
  }

  async submitReport() {
    try {
      
      this.validateNotEmpty('email', 'emailError', 'Email');
      this.validateNotEmpty('reason', 'reasonError', 'A description of the issue');
      if (this.state.emailError != '' || this.state.reasonError != '') {
        
      }
      
      const submitter = this.props.currentUser.login
        ? this.props.currentUser.login
        : "anonymous";
      const { data } = await axios.post(
        "https://support-poster.glitch.me/post",
        {
          raw: this.formatRaw(),
          title: `Abuse Report for ${this.props.projectName} from ${submitter}`
        }
      );
      console.log(data);
    } catch (error) {
      // captureException(error);
      console.log(error);
    }
  }
  
  validateNotEmpty(stateField, errorField, fieldDescription) {
    if (this.state[stateField] === '') {
      this.setState({[errorField]: `${fieldDescription} is required`}); 
      return;
    }
    this.setState({[errorField]: ''}); 
  }
  
  reasonOnChange(value) {
    this.setState({
      reason: value
    });
    this.debouncedValidateReason();
  }

  emailOnChange(value) {
    this.setState({
      email: value
    });
    this.debouncedValidateEmail();
  }

  getUserInfoSection() {
    if (this.props.currentUser.login) {
      return (
        <section className="pop-over-info">
          <p className="info-description right">
            from <strong>{this.props.currentUser.login}</strong>
          </p>
        </section>
      );
    }
    return (
      <section className="pop-over-info">
        <PureEditableField
          value={this.state.email}
          update={this.emailOnChange}
          blur={() => this.debouncedValidateEmail()}
          placeholder=''
          error={this.state.emailError}
          prefix='Your email (required)'
        />
      </section>
    );
  }

  render() {
    const reasonLabel = <>
      <p>This project doesn't belong on Glitch because...</p>
      <hr />
    </>;
    return (
      <dialog className="pop-over wide-pop top-right">
        <section className="pop-over-info">
          <h1 className="pop-title">Report Abuse</h1>
        </section>
        <section className="pop-over-actions">
          <PureEditableTextArea
            value={this.state.reason}
            update={this.reasonOnChange}
            blur={() => this.debouncedValidateReason()}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            placeholder=''
            error={this.state.reasonError}
            prefix={reasonLabel} 
          />
        </section>
        {this.getUserInfoSection()}
        <section className="pop-over-actions">
          <button className="button" onClick={this.submitReport}>
            Submit Report <span role="img" aria-label="">📧</span>
          </button>
        </section>
      </dialog>
    );
  }
}

ReportAbusePop.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  currentUser: PropTypes.object
};

const ReportAbusePopContainer = props => (
  <CurrentUserConsumer>
    {currentUser => <ReportAbusePop currentUser={currentUser} {...props} />}
  </CurrentUserConsumer>
);

const ReportAbusePopButton = props => (
  <PopoverContainer>
    {({ visible, togglePopover }) => (
      <div className='button-wrap'>
        <button
          className="button-small button-tertiary"
          data-track=""
          onClick={togglePopover}
        >
          Report Abuse
        </button>
        {visible && (
          <ReportAbusePopContainer
            projectName={props.projectName}
            projectId={props.projectId}
          />
        )}
      </div>
    )}
  </PopoverContainer>
);

ReportAbusePopButton.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired
};

export default ReportAbusePopButton;
