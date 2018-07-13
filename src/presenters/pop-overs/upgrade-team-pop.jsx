import React from 'react';
import PropTypes from 'prop-types';

import UsersList from "../users-list.jsx";

export class UpgradeTeamPop extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {};
  }
  
  price() {
    this.props.users.
  }
    
  render() {
    return (
      <dialog className="pop-over upgrade-team-pop">
        <section className="pop-over-info">
          <div className="pop-title">
            Upgrade {this.props.teamName}
          </div>
        </section>
        <section className="pop-over-actions">
          <div className="action-description">
            Teams cost $10 per user, per month
          </div>
          <UsersList users={this.props.users}/>
          
        </section>
        <section className="pop-over-actions cta-zone">
          <button className="button buttom-small button-cta has-emoji opens-pop-over">
            Upgrade for $60
          </button>
        </section>        
        <section className="pop-over-info">
          <div className="info-description">
            lksdjflskja klsadjf
          </div>
        </section>
      </dialog>
    );
  }
}

UpgradeTeamPop.propTypes = {
  teamName: PropTypes.string.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number.isRequired,
  togglePopover: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};


export default UpgradeTeamPop;
