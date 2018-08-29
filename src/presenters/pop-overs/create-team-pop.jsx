import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Loader from '../includes/loader.jsx';
import {PureEditableField} from '../includes/editable-field.jsx';

const TEAM_ALREADY_EXISTS_ERROR = "Team already exists, try another"

class CreateTeamPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: '',
      teamUrl: '',
      isLoading: false,
      error: ''
    };

    this.randomDescription = this.randomDescription.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  descriptiveAdjectives() { 
    return [
      'charming',
      'bold',
      'brave',
      'cool',
      'docile',
      'dope',
      'faithful',
      'fertile',
      'fervent',
      'forgiving',
      'genial',
      'genteel',
      'grouchy',
      'hopeful',
      'humane',
      'jolly',
      'joyful',
      'lunar',
      'magical',
      'moral',
      'mysterious',
      'mystery',
      'notorious',
      'passionate',
      'preposterous',
      'quaint',
      'quirky',
      'scrumptious',
      'sensitive',
      'sober',
      'tropical',
      'woeful',
      'whimsical',
      'zealous',
    ];
  }

  teamSynonyms() {
    return [
      'team',
      'group',
      'coven',
      'squad',
      'crew',
      'party',
      'troupe',
      'band',
      'posse',
    ]
  }
  
  componentDidMount() {
    let initialTeamName = this.randomName()
    this.setState({
      teamName: initialTeamName,
      teamUrl: _.kebabCase(initialTeamName),
    })
  }
  
  randomDescription() {
    let adjectives = _.sampleSize(this.descriptiveAdjectives(), 2);
    return `A ${adjectives[0]} ${_.sample(this.teamSynonyms())} that makes ${adjectives[1]} things`;
  }
  
  randomName() {
    let adjective = _.sample(this.descriptiveAdjectives())
    return `${_.capitalize(adjective)} ${_.sample(this.teamSynonyms())}`
  }
  
  isTeamUrlAvailable(url) {
    this.props.api.get(`teams/byUrl/${url}`)
    .then (({data}) => {
      if (data) {
        this.setState({
          error: TEAM_ALREADY_EXISTS_ERROR
        })
      } else {
        this.setState({
          error: ""
        })
      }
    })
  }
  
  handleChange(newValue) {
    console.log ('🚓', newValue)
    let url = _.kebabCase(newValue)
    this.setState({
      teamName: newValue, 
      teamUrl: url,
      error: "",
    });
    this.isTeamUrlAvailable(url)
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    this.props.api.post(('teams'), {
      name: this.state.teamName,
      url: this.state.teamUrl,
      hasAvatarImage: false,
      coverColor: '',
      location: '',
      description: this.randomDescription(),
      backgroundColor: '',
      hasCoverImage: false,
      isVerified: false,
    })
    .then (response => {
        this.setState({ isLoading: false });
        window.location = `/@${response.data.url}`;
      }).catch (error => {
        this.setState({
          isLoading: false,
          error: TEAM_ALREADY_EXISTS_ERROR,
        });
      });
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
            Showcase your projects in one place, manage collaborators, and view analytics
          </p>
        </section>
        
        <section className="pop-over-actions">  
          <form onSubmit={this.handleSubmit}>
            <PureEditableField
              value={this.state.teamName}
              update={this.handleChange}
              placeholder='Your Team Name'
              submitError={this.state.error}
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
    );
  }
}


CreateTeamPop.propTypes = {
  api: PropTypes.func.isRequired,
  toggleUserOptionsPop: PropTypes.func.isRequired,
};

export default CreateTeamPop;
