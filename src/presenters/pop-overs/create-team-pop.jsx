import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';

// move to a seperate file
// needs api
// has to handle team name taken error case

class CreateTeamPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teamName: '',
      teamUrl: '',
    };
  }
  
  render() {
    return (
      <dialog className="pop-over user-options-pop">
        <section className="pop-over-info">
          <div className="pop-title">
            Create Team
          </div>
        </section>
        <section className="pop-over-actions">
          
          <input className="pop-over-input" placeholder="Team name" value={this.state.teamName} />

          <p className="action-description">
            /{this.state.teamUrl}
          </p>

        </section>
        <section className="pop-over-info">
          <p className="info-description">
            You can change this later
          </p>
        </section>      
      </dialog>
    )
  }
}


// CreateTeamPop.propTypes = {
//   api: PropTypes.func.isRequired,
// };

export default CreateTeamPop;