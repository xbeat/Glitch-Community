import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import Loader from '../includes/loader.jsx';

const ResultLI = ({selectFrame, isActive, timeFrame}) => (
  <li className={"result" + isActive ? " active" : ""} onClick={(event) => selectFrame(event, timeFrame)}>
     <div className="result-container">
        <div className="result-name">{timeFrame}</div>
     </div>
  </li>
);

ResultLI.propTypes = {
  selectFrame: PropTypes
};

const selectFrameFactory = (analyticsTimeLabelObservable, gettingAnalyticsFromDateObservable, togglePopover) => {
  return (event, timeFrame) => {
    event.preventDefault();
    analyticsTimeLabelObservable(timeFrame)
    gettingAnalyticsFromDateObservable(true);
    togglePopover();
  }
}

const  AnalyticsTimePop = ({analyticsTimeLabelObservable, gettingAnalyticsFromDateObservable}) => {
  const timeFrames = [
    "Last 4 Weeks",
    "Last 2 Weeks",
    "Last 24 Hours",
  ];
  const currentTimeFrame = analyticsTimeLabelObservable();
  const gettingAnalyticsFromDate = gettingAnalyticsFromDateObservable();

  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className="button-small button-tertiary button-select" onClick={togglePopover}>
            <span>{currentTimeFrame}</span>
            { gettingAnalyticsFromDate && <Loader/> }
          </button>
          { visible && (
            <dialog className="pop-over results-list analytics-time-pop">
              <section className="pop-over-actions last-section">
                <ul className="results">
                  { timeFrames.map(timeFrame => (
                   <ResultLI 
                     selectFrame={selectFrameFactory(analyticsTimeLabelObservable, gettingAnalyticsFromDateObservable, togglePopover)} 
                     isActive={currentTimeFrame === timeFrame} 
                     timeFrame={timeFrame}/>
                  ))}
                </ul>
              </section>
            </dialog>
          )}
        </div>
      )}
    </PopoverContainer>
  );
};

export default AnalyticsTimePop;