import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash'
import Loader from '../includes/loader.jsx';
import EditableField from '../includes/editable-field.jsx';

class CreateTeamPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teamName: 'Team Rocket',
      teamUrl: 'team-rocket',
      isLoading: false,
      errorMessage: ''
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(newValue) {
    this.setState({
      teamName: newValue, 
      teamUrl: _.kebabCase(newValue),
      errorMessage: "",
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true })
    this.props.api().post(('teams'), {
      name: this.state.teamName,
      url: this.state.teamUrl,
      hasAvatarImage: false,
      coverColor: '',
      location: '',
      description: '',
      backgroundColor: '',
      hasCoverImage: false,
      isVerified: false,
    })
    .then (response => {
      this.setState({ isLoading: false })
      window.location = `/@${response.data.url}`
    }).catch (error => {
      let statusCode = error.response.data.status
      let message = error.response.data.message
      console.error(error, statusCode, message)
      this.setState({
        isLoading: false,
        errorMessage: message,
      })
    })
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
          <EditableField 
            value="Team Rocket" 
            update={this.handleChange} 
            placeholder='Your Team Name' 
            autoFocus={true} 
            fieldOnlyUpdatesOnSubmit={true}
            submitError={this.state.errorMessage}
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