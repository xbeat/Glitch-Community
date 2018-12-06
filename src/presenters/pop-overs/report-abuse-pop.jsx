import React from 'react';
import PropTypes from 'prop-types';

import {CurrentUserConsumer} from '../current-user.jsx';

export class ReportAbusePop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    
    this.onClick = this.onClick.bind(this);
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
          <p>This project doesn't belong on Glitch because...</p>
          <input
            id="team-project-search" className="pop-over-input search-input pop-over-search"
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
        </section>
      </dialog>
    );
  }
}

ReportAbusePop.propTypes = {
  api: PropTypes.any.isRequired
};

const ReportAbusePopContainer = (props) => (
  <CurrentUserConsumer>
    {currentUser => <ReportAbusePop currentUser={currentUser} {...props}/>}
  </CurrentUserConsumer>
);

const ReportAbusePopButton = props => (
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button-small" data-track="" onClick={togglePopover}>Report Abuse</button>
            {visible && <ReportAbusePopContainer />}
          </div>
        )}
      </PopoverContainer>
    );

ReportAbusePopButton.propTypes = {
};

export default ReportAbusePopButton;
