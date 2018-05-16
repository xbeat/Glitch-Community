import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import Loader from '../includes/loader.jsx';



// Result.propTypes = {
//   selectFrame: PropTypes.func.isRequired,
//   isActive: PropTypes.bool.isRequired,
//   timeFrame: PropTypes.string.isRequired,
// };

// const selectFrameFactory = (analyticsTimeLabelObservable, gettingAnalyticsFromDateObservable, togglePopover) => {
//   return (event, timeFrame) => {
//     event.preventDefault();
//     analyticsTimeLabelObservable(timeFrame);
//     gettingAnalyticsFromDateObservable(true);
//     togglePopover();
//   };
// };

//   const AnalyticsTimePop = ({analyticsTimeLabelObservable, gettingAnalyticsFromDateObservable, timeFrames}) => {
//     const currentTimeFrame = analyticsTimeLabelObservable();
//     const gettingAnalyticsFromDate = gettingAnalyticsFromDateObservable();

//     return (
//       <PopoverContainer>
//         {({visible, togglePopover}) => (
//           <div className="button-wrap">
//             <button className="button-small button-tertiary button-select" onClick={togglePopover}>
//               <span>{currentTimeFrame}</span>
//               { gettingAnalyticsFromDate && <Loader/> }
//             </button>
//             { visible && (
//               <dialog className="pop-over results-list analytics-time-pop">
//                 <section className="pop-over-actions last-section">
//                   <div className="results">
//                     { timeFrames.map(timeFrame => (
//                       <Result 
//                         key={timeFrame}
//                         selectFrame={selectFrameFactory(analyticsTimeLabelObservable, gettingAnalyticsFromDateObservable, togglePopover)} 
//                         isActive={currentTimeFrame === timeFrame} 
//                         timeFrame={timeFrame}/>
//                     ))}
//                   </div>
//                 </section>
//               </dialog>
//             )}
//           </div>
//         )}
//       </PopoverContainer>
//     );
// };

const TimeFrameItem = ({selectTimeFrame, isActive, timeFrame}) => {
  let resultClass = "result button-unstyled";
  if(isActive) {
    resultClass += " active";
  }
  return (
    <button className={resultClass} onClick={() => selectTimeFrame(timeFrame)}>
      <div className="result-container">
        <div className="result-name">{timeFrame}</div>
      </div>
    </button>
  );
};

const timeFrames = [
  "Last 4 Weeks",
  "Last 2 Weeks",
  "Last 24 Hours",
]

const TeamAnalyticsTimePop = (({updateTimeFrame, currentTimeFrame}) => {

  const selectTimeFrame = (timeFrame, togglePopover) => {
    updateTimeFrame(timeFrame)
    // togglePopover()
  }

  return (
    <PopoverContainer>
      {({visible, togglePopover}) => (
        <div className="button-wrap">
          <button className="button-small button-tertiary button-select" onClick={togglePopover}>
            <span>{currentTimeFrame}</span>
          </button>
          { visible && (
            <dialog className="pop-over results-list analytics-time-pop">
              <section className="pop-over-actions last-section">
                <div className="results">
                  { timeFrames.map(timeFrame => (
                    <TimeFrameItem 
                      key={timeFrame}
                      selectTimeFrame={selectTimeFrame(timeFrame, togglePopover)} 
                      isActive={currentTimeFrame === timeFrame} 
                      timeFrame={timeFrame}/>
                  ))}
                  <p onClick={selectTimeFrame('Last 24 Hours')}>blahhhh</p>

                </div>
              </section>
            </dialog>
          )}
        </div>

      )}
    </PopoverContainer>
  )
})

TeamAnalyticsTimePop.propTypes = {
  updateTimeFrame: PropTypes.func.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
};

export default TeamAnalyticsTimePop;
