import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash'
import Loader from '../includes/loader.jsx';


// TODO
// has to handle team name taken error case // error styles

class CreateTeamPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teamName: 'Team Rocket',
      teamUrl: 'team-rocket',
      isLoading: false,
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
   this.refs.input.select(); 
  }

  handleChange(event) {
    this.setState({
      teamName: event.target.value, 
      teamUrl: _.kebabCase(event.target.value)
    });
  }

  handleSubmit(event) {
    // this.props.api
    // post to /teams with name and url strings
    alert('A team url and name was submitted: ' + this.state.teamUrl + ' ' + this.state.teamName );
    event.preventDefault();
  }


  render() {
    return (
      <dialog className="pop-over create-team-pop">
        <section className="pop-over-info clickable-label" onClick={() => this.props.toggleUserOptionsPop()}>
          <div className="back icon">
            <div className="left-arrow icon" />
          </div>
          <div className="pop-title">
            <span>Create Team </span>
            <span className="emoji herb" />
          </div>
        </section>
        
        <section className="pop-over-info">
          <p className="info-description">
            Showcase your team's projects and manage project members
          </p>
        </section>
        <section className="pop-over-actions">
          
        <form onSubmit={this.handleSubmit}>
          <input 
            ref="input"
            className="pop-over-input team-name-input" 
            onChange={this.handleChange} 
            type="text" 
            autoFocus 
            placeholder="Your Team Name" 
            defaultValue="Team Rocket"
          />
          <p className="action-description team-url-preview">
            /@{this.state.teamUrl}
          </p>
          
          {this.state.isLoading && 
            <Loader />
          ||
            <button type="submit" className="button-small has-emoji">
              <span>Create Team </span>
              <span className="emoji thumbs_up" />
            </button>
          }
        </form>

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


CreateTeamPop.propTypes = {
  api: PropTypes.func.isRequired,
  toggleUserOptionsPop: PropTypes.func.isRequired,
};

export default CreateTeamPop;