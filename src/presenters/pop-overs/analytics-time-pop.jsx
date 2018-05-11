import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import Loader from '../includes/loader.jsx';

export default class AnalyticsTimePopContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {application, analytics} = this.props;
    
    return (
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button-small button-tertiary button-select" onClick={togglePopover}>
              <span>{analyticsTimeLabel}</span>
              { !hiddenUnlessGettingAnalyticsFromDate && <Loader/> }
            </button>
           <dialog className="pop-over results-list analytics-time-pop">
            <section class="pop-over-actions last-section">
               <ul class="results">
                  <li class={`result ${activeIfLabelIsMonths}`} onClick={selectMonthFrame}>
                     <div class="result-container">
                        <div class="result-name">Last 4 Weeks</div>
                     </div>
                  </li>
                  <li class="result active">
                     <div class="result-container">
                        <div class="result-name">Last 2 Weeks</div>
                     </div>
                  </li>
                  <li class="result">
                     <div class="result-container">
                        <div class="result-name">Last 24 Hours</div>
                     </div>
                  </li>
               </ul>
            </section>
          </dialog>
          </div>
        )}
      </PopoverContainer>
    );
  }
}

const ResultLI = ({onClick, isActive, text}) => (
  <li class="result">
     <div class="result-container">
        <div class="result-name">Last 24 Hours</div>
     </div>
  </li>
);

/*

      dialog.pop-over.results-list.analytics-time-pop.disposable(click=@stopPropagation)

        section.pop-over-actions.last-section
          ul.results
            li.result(click=@selectMonthFrame class=@activeIfLabelIsMonths)
              .result-container
                .result-name Last 4 Weeks
            li.result(click=@selectWeeksFrame class=@activeIfLabelIsWeeks)
              .result-container
                .result-name Last 2 Weeks
            li.result(click=@selectHoursFrame class=@activeIfLabelIsHours)
              .result-container
                .result-name Last 24 Hours      
*/

export default function(application, analytics) {

  const self = {
  
    application,

    stopPropagation(event) {
      return event.stopPropagation();
    },

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


