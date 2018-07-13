import React from 'react';
import PropTypes from 'prop-types';

import UsersList from "../users-list.jsx";

const PRICE_PER_USER = 10

export class UpgradeTeamPop extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {};
    this.price = this.price.bind(this);
  }
  
  price() {
    return (this.props.users.length * PRICE_PER_USER)
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
            Teams cost ${PRICE_PER_USER} per active user, per month. We won't bill you for members of your team who aren't using Glitch.
          </div>
          <UsersList users={this.props.users}/>
          <div className="action-description">
            ${PRICE_PER_USER} per active user, per month
          </div>
        </section>
        <section className="pop-over-actions">
          <button className="button buttom-small button-cta has-emoji opens-pop-over">
            Upgrade for ${this.price()}
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
