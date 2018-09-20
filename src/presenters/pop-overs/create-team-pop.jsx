import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import {withRouter} from 'react-router-dom';
import {getLink} from '../../models/team';
import Loader from '../includes/loader.jsx';
import {NestedPopoverTitle} from '../pop-overs/popover-nested.jsx';
import {PureEditableField} from '../includes/editable-field.jsx';

// Create Team 🌿

class CreateTeamPopBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: '',
      isLoading: false,
      error: ''
    };
    this.validate = _.debounce(this.validate.bind(this), 200);
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
      'quaint',
      'quirky',
      'scrumptious',
      'sensitive',
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
    ];
  }
  
  componentDidMount() {
    let initialTeamName = this.randomName();
    this.setState({
      teamName: initialTeamName,
    });
    this.validate();
  }
  
  randomDescription() {
    let adjectives = _.sampleSize(this.descriptiveAdjectives(), 2);
    return `A ${adjectives[0]} team that makes ${adjectives[1]} things`;
  }
  
  randomName() {
    let adjective = _.sample(this.descriptiveAdjectives());
    return `${_.capitalize(adjective)} ${_.sample(this.teamSynonyms())}`;
  }
  
  async validate() {
    const name = this.state.teamName;
    if (name) {
      const url = _.kebabCase(name);
      
      const userReq = this.props.api.get(`userId/byLogin/${url}`);
      const teamReq = this.props.api.get(`teams/byUrl/${url}`);
      const [user, team] = await Promise.all([userReq, teamReq]);
      
      let error = null;
      if (user.data !== 'NOT FOUND') {
        error = 'Name in use, try another';
      } else if (team.data) {
        error = 'Team already exists, try another';
      }
      if (error) {
        this.setState(({teamName}) => (name === teamName) ? {error} : {});
      }
    }
  }
  
  async handleChange(newValue) {
    this.setState({
      teamName: newValue,
      error: '',
    });
    this.validate();
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      const {data} = await this.props.api.post('teams', {
        name: this.state.teamName,
        url: _.kebabCase(this.state.teamName),
        hasAvatarImage: false,
        coverColor: '',
        location: '',
        description: this.randomDescription(),
        backgroundColor: '',
        hasCoverImage: false,
        isVerified: false,
      });
      this.props.history.push(getLink(data));
    } catch (error) {
      const message = error && error.response && error.response.data && error.response.data.message;
      this.setState({
        isLoading: false,
        error: message || 'Something went wrong',
      });
    }
  }
  
  render() {
    const placeholder = 'Your Team Name';
    return (
      <dialog className="pop-over create-team-pop">
        <NestedPopoverTitle>
          Create Team <span className="emoji herb" />
        </NestedPopoverTitle>

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
              placeholder={placeholder}
              error={this.state.error}
            />
            <p className="action-description team-url-preview">
              /@{_.kebabCase(this.state.teamName || placeholder)}
            </p>
          
            {this.state.isLoading ? <Loader /> : (
              <button type="submit" className="button-small has-emoji">
                Create Team <span className="emoji thumbs_up" />
              </button>
            )}
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

CreateTeamPopBase.propTypes = {
  api: PropTypes.func.isRequired,
};

export const CreateTeamPop = withRouter(CreateTeamPopBase);
export default CreateTeamPop;