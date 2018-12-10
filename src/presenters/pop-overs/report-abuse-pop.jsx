import React from "react";
import PropTypes from "prop-types";
import PopoverContainer from "./popover-container.jsx";
import axios from "axios";

import { CurrentUserConsumer } from "../current-user.jsx";

export class ReportAbusePop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reasonValue: "",
      emailValue: "",
      email: ""
    };
    this.submitReport = this.submitReport.bind(this);
    this.reasonOnChange = this.reasonOnChange.bind(this);
    this.formatRaw = this.formatRaw.bind(this);
    this.getUserInfoSection = this.getUserInfoSection.bind(this);
    this.emailOnChange = this.emailOnChange.bind(this);
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

- Message: ${this.state.reasonValue}`;
    return `${firstHalf}

${submitterPart}
${secondHalf}`;
  }

  async submitReport() {
    try {
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

  reasonOnChange(event) {
    this.setState({
      reasonValue: event.target.value
    });
  }

  emailOnChange(event) {
    this.setState({
      emailValue: event.target.value
    });
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
        <label className="label" htmlFor="email">
          Your email (required)
        </label>
        <input
          name="email"
          className="pop-over-input"
          value={this.state.email}
          onChange={this.emailOnChange}
        />
      </section>
    );
  }

  render() {
    return (
      <dialog className="pop-over wide-pop">
        <section className="pop-over-info">
          <h1 className="pop-title">Report Abuse</h1>
        </section>
        <section className="pop-over-actions">
          <p>This project doesn't belong on Glitch because...</p>
          <hr />
          <textarea
            className="pop-over-input"
            value={this.state.reasonValue}
            onChange={this.reasonOnChange}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
        </section>
        {this.getUserInfoSection()}
        <section className="pop-over-actions">
          <button className="button" onClick={this.submitReport}>
            Submit Report 📧
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
      <div className={'button-wrap ' + props.containerClass}>
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
