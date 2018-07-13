import React from 'react';
import PropTypes from 'prop-types';

import UsersList from "../users-list.jsx";

const PRICE_PER_USER = 10

export class UpgradeTeamPop extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      monthlyCost: 0
    };
    // this.price = this.price.bind(this);
  }
  
  // price() {
  //   return (this.props.users.length * PRICE_PER_USER)
  // }
  componentDidMount() {
    let monthlyCost = this.props.users.length * PRICE_PER_USER
    this.setState({
      monthlyCost: monthlyCost
    })
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
            Glitch Teams cost ${PRICE_PER_USER} per active user, monthly.
          </div>
          <UsersList users={this.props.users}/>
          <div className="action-description">
            {this.props.users.length} users × ${PRICE_PER_USER} = ${this.state.monthlyCost}/mo
          </div>
        </section>
        <section className="pop-over-actions">
          <button className="button buttom-small button-cta has-emoji opens-pop-over">
            Upgrade {this.props.teamName}
            <span className="emoji credit-card"/>
          </button>
        </section>
        <section className="pop-over-info">
          <div className="info-description">
            We won't bill you for team members who aren't using Glitch.
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
