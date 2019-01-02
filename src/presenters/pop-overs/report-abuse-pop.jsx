import React from "react";
import PropTypes from "prop-types";
import PopoverWithButton from "./popover-with-button";
import {
  PureEditableField,
  PureEditableTextArea
} from "../includes/editable-field.jsx";
import { parseOneAddress } from "email-addresses";
import _ from "lodash";
import axios from "axios";
import { captureException } from "../../utils/sentry";

import { CurrentUserConsumer } from "../current-user.jsx";

const defaultReason = "This project doesn't belong on Glitch because...";
class ReportAbusePop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: defaultReason,
      email: "",
      emailError: "",
      reasonError: "",
      submitted: false
    };
    this.submitReport = this.submitReport.bind(this);
    this.reasonOnChange = this.reasonOnChange.bind(this);
    this.formatRaw = this.formatRaw.bind(this);
    this.getUserInfoSection = this.getUserInfoSection.bind(this);
    this.emailOnChange = this.emailOnChange.bind(this);
    this.validateNotEmpty = this.validateNotEmpty.bind(this);
    this.validateReason = this.validateReason.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.renderSuccess = this.renderSuccess.bind(this);
    this.renderFailure = this.renderFailure.bind(this);
    this.pickFormBody = this.pickFormBody.bind(this);

    this.debouncedValidateEmail = _.debounce(() => this.validateEmail(), 200);
    this.debouncedValidateReason = _.debounce(() => this.validateReason(), 200);
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
        : "- Submitted by: anonymous";
    const secondHalf = `
- Contact: ${email}

- Message: ${this.state.reason}`;
    return `${firstHalf}
${submitterPart}
${secondHalf}`;
  }

  async submitReport() {
    try {
      const emailErrors = this.validateEmail();
      const reasonErrors = this.validateReason();
      if (emailErrors.emailError != "" || reasonErrors.reasonError != "") {
        return;
      }

      await axios.post("https://support-poster.glitch.me/post", {
        raw: this.formatRaw(),
        title: `Abuse Report for ${this.props.projectName}`
      });
      this.setState({ submitted: true, submitSuccess: true });
    } catch (error) {
      captureException(error);
      this.setState({ submitted: true, submitSuccess: false });
    }
  }

  validateNotEmpty(stateField, errorField, fieldDescription) {
    let errorObj;
    if (this.state[stateField] === "") {
      errorObj = { [errorField]: `${fieldDescription} is required` };
    } else {
      errorObj = { [errorField]: "" };
    }
    this.setState(errorObj);
    return errorObj;
  }

  validateReason() {
    let errorObj = this.validateNotEmpty(
      "reason",
      "reasonError",
      "A description of the issue"
    );
    if (errorObj.reasonError == "" && this.state.reason === defaultReason) {
      errorObj = { reasonError: "Reason is required" };
      this.setState(errorObj);
    }
    return errorObj;
  }

  validateEmail() {
    if (this.props.currentUser.login) {
      return { emailError: "" };
    }

    let errors = this.validateNotEmpty("email", "emailError", "Email");
    if (errors.emailError != "") {
      return errors;
    }

    const email = parseOneAddress(this.state.email);
    if (!email) {
      errors = { emailError: "Please enter a valid email" };
    } else {
      errors = { emailError: "" };
    }
    this.setState(errors);
    return errors;
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
          placeholder="your@email.com"
          error={this.state.emailError}
          inputType="email"
        />
      </section>
    );
  }

  renderForm() {
    return (
      <>
        <section className="pop-over-info">
          <h1 className="pop-title">Report Abuse</h1>
        </section>
        <section className="pop-over-actions">
          <PureEditableTextArea
            value={this.state.reason}
            update={this.reasonOnChange}
            blur={() => this.debouncedValidateReason()}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            placeholder=""
            error={this.state.reasonError}
          />
        </section>
        {this.getUserInfoSection()}
        <section className="pop-over-actions">
          <button className="button button-small" onClick={this.submitReport}>
            Submit Report
          </button>
        </section>
      </>
    );
  }

  renderSuccess() {
    return (
      <>
        <section className="pop-over-info">
          <h1 className="pop-title">Report Abuse</h1>
        </section>
        <section className="pop-over-actions">
          <div className="notification notifySuccess">Report Sent</div>
          <p className="pop-description tight-line">
            Thanks for helping to keep Glitch a safe, friendly community{" "}
            <span className="emoji park" role="img" aria-label="" />
          </p>
        </section>
      </>
    );
  }

  renderFailure() {
    return (
      <>
        <section className="pop-over-info">
          <h1 className="pop-title">
            Failed to Send{" "}
            <span className="emoji sick" role="img" aria-label="" />
          </h1>
        </section>
        <section className="pop-over-info">
          <p className="info-description">
            But you can still send us your message by emailing the details below
            to <b>support@glitch.com</b>
          </p>
        </section>
        <section className="pop-over-actions">
          <textarea
            className="content-editable tall-text traditional"
            value={_.trimStart(this.formatRaw())}
            readOnly
          />
        </section>
      </>
    );
  }

  pickFormBody() {
    if (this.state.submitted) {
      if (!this.state.submitSuccess) {
        return this.renderFailure();
      }
      return this.renderSuccess();
    }
    return this.renderForm();
  }

  render() {
    return (
      <dialog className="pop-over wide-pop top-right report-abuse-pop">
        {this.pickFormBody()}
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
  <PopoverWithButton
    buttonClass="button-small button-tertiary margin"
    buttonText="Report Abuse"
  >
    <ReportAbusePopContainer
      projectName={props.projectName}
      projectId={props.projectId}
    />
  </PopoverWithButton>
);

ReportAbusePopButton.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired
};

export default ReportAbusePopButton;
