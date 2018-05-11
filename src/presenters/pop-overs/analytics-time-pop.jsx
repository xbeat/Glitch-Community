import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import Loader from '../includes/loader.jsx';

const ResultLI = ({onClick, isActive, text}) => (
  <li className={"result" + isActive ? " active" : ""} onClick={onClick}>
     <div class="result-container">
        <div class="result-name">{text}</div>
     </div>
  </li>
);

export default class AnalyticsTimePopContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {application, analytics} = this.props;
    
    selectMonthFrame() {
      analytics.analyticsTimeLabel('Last 4 Weeks');
      return analytics.gettingAnalyticsFromDate(true);
    },

    selectWeeksFrame() {
      analytics.analyticsTimeLabel('Last 2 Weeks');
      return analytics.gettingAnalyticsFromDate(true);
    },

    selectHoursFrame() {
      analytics.analyticsTimeLabel('Last 24 Hours');
      return analytics.gettingAnalyticsFromDate(true);
    },
      
    const selectFrame(timeLabel) {
      analytics.analyticsTimeLabel(timeLabel)
      analytics.gettingAnalyticsFromDate(true);
    }
    
    return (
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button-small button-tertiary button-select" onClick={togglePopover}>
              <span>{analyticsTimeLabel}</span>
              { !hiddenUnlessGettingAnalyticsFromDate && <Loader/> }
            </button>
            { visible && (
              <dialog className="pop-over results-list analytics-time-pop">
                <section class="pop-over-actions last-section">
                  <ul class="results">
                   <ResultLI selectFrame={selectFrame} togglePopover={isActive={activeIfLabelIsMonths} text="Last 4 Weeks"/>
                   <ResultLI onClick={selectFrame} isActive={activeIfLabelIsWeeks} text="Last 2 Weeks"/>
                   <ResultLI onClick={selectFrame} isActive={activeIfLabelIsHours} text="Last 24 Hours"/>
                  </ul>
                </section>
              </dialog>
            )}
          </div>
        )}
      </PopoverContainer>
    );
  }
}




    activeIfLabelIsMonths() {
      if (analytics.analyticsTimeLabel() === 'Last 4 Weeks') { return 'active'; }
    },

    activeIfLabelIsWeeks() {
      if (analytics.analyticsTimeLabel() === 'Last 2 Weeks') { return 'active'; }
    },

    activeIfLabelIsHours() {
      if (analytics.analyticsTimeLabel() === 'Last 24 Hours') { return 'active'; }
    },
  };


  return AnalyticsTimePopTemplate(self);
}


