import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import Loader from '../includes/loader.jsx';

const ResultLI = ({selectFrame, isActive, timeFrame}) => {
  return (
    <li className={"result" + isActive ? " active" : ""} onClick={(event) => selectFrame(event, timeFrame)}>
       <div class="result-container">
          <div class="result-name">{timeFrame}</div>
       </div>
    </li>
    );
};

const selectFrameFactory = (analytics, togglePopover) => {
  return (event, timeFrame) => {
    event.preventDefault();
    analytics.analyticsTimeLabel(timeFrame)
    analytics.gettingAnalyticsFromDate(true);
    togglePopover();
  }
}

export default class AnalyticsTimePopContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {application, analytics} = this.props;
    const timeFrames = [
      "Last 4 Weeks",
      "Last 2 Weeks",
      "Last 24 Hours",
    ];

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
                    { timeFrames.map(timeFrame => (
                     <ResultLI 
                       selectFrame={selectFrameFactory(analytics, togglePopover)} 
                       isActive={activeIfLabelIsMonths} timeFrame={timeFrame}/>
                    ))}
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


