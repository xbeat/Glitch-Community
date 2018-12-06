import React from "react";
import PropTypes from "prop-types";
import PopoverContainer from "./popover-container.jsx";

import { CurrentUserConsumer } from "../current-user.jsx";

export class ReportAbusePop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // this.onClick = this.onClick.bind(this);
  }
  /*
  onClick(event, report) {
    event.preventDefault();
    this.props.togglePopover();
  }
*/

  render() {
    return (
      <dialog className="pop-over wide-pop">
        <section className="pop-over-info">
          <h1 className='pop-title hello'>Report Abuse</h1>
        </section>
        <section className='pop-over-actions'>
          <p>This project doesn't belong on Glitch because...</p>
          <textarea
            className="pop-over-input"
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
        </section>
        <section>
          <p>Reported by {this.props.currentUser.login}</p>
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
