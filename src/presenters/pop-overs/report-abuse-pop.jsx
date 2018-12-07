import React from "react";
import PropTypes from "prop-types";
import PopoverContainer from "./popover-container.jsx";
import axios from "axios";

import { CurrentUserConsumer } from "../current-user.jsx";

export class ReportAbusePop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.submitReport = this.submitReport.bind(this);
    // this.onClick = this.onClick.bind(this);
  }
  /*
  onClick(event, report) {
    event.preventDefault();
    this.props.togglePopover();
  }
*/
  
  submitReport() {
    try {
      const {data} = await axios.get(`https://freemail.glitch.me/${domain}`);
      valid = !data.free;
    } catch (error) {
      captureException(error);
    }
  }

  render() {
    return (
      <dialog className="pop-over wide-pop">
        <section className="pop-over-info">
          <h1 className='pop-title'>Report Abuse</h1>
        </section>
        <section className='pop-over-actions'>
          <p>This project doesn't belong on Glitch because...</p>
          <hr />
          <textarea
            className="pop-over-input"
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
        </section>
        <section className="pop-over-info">
          <p className='info-description right'>from <strong>{this.props.currentUser.login}</strong></p>
        </section>
        <section>
          <button className="button" onClick={this.submitReport}>Submit Report 📧</button>
        </section>
      </dialog>
    );
  }
}

ReportAbusePop.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired
};

const ReportAbusePopContainer = props => (
  <CurrentUserConsumer>
    {currentUser => <ReportAbusePop currentUser={currentUser} {...props} />}
  </CurrentUserConsumer>
);

const ReportAbusePopButton = props => (
  <PopoverContainer>
    {({ visible, togglePopover }) => (
      <div className="button-wrap">
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
