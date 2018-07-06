import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';


// TODO
// styles
// needs api
// has to handle team name taken error case

class CreateTeamPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teamName: '',
      teamUrl: 'team-rocket',
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
      teamUrl: event.target.value.toUpperCase()
    });
  }

  handleSubmit(event) {
    alert('A team name and url was submitted: ' + this.state.teamUrl);
    event.preventDefault();
  }


  render() {
    return (
      <dialog className="pop-over create-team-pop">
        <section className="pop-over-info clickable-label">
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
            Use Teams to group and manage projects with collaborators
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
          <button type="submit" className="button-small has-emoji">
            <span>Create Team </span>
            <span className="emoji thumbs_up" />
          </button>
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


// CreateTeamPop.propTypes = {
//   api: PropTypes.func.isRequired,
// };

export default CreateTeamPop;