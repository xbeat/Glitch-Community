import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';

export default class AnalyticsTimePopContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {application, analytics} = this.props;
    
    return (
      <PopoverContainer>
        <div className="button-wrap">
        </div>
      </PopoverContainer>
    );
  }
}

/*

    .button-wrap
      button.button-small.button-tertiary.button-select(click=@toggleAnalyticsTimePop)
        span= @analyticsTimeLabel               
        span(class=@hiddenUnlessGettingAnalyticsFromDate)= Loader
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


