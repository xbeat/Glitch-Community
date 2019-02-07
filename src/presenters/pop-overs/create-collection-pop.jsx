// create-collection-pop.jsx -> add a project to a new user or team collection
import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import randomColor from 'randomcolor';
import {captureException} from '../../utils/sentry';

import {UserAvatar, TeamAvatar} from '../includes/avatar.jsx';
import {TrackClick} from '../analytics';
import {getLink, defaultAvatar} from '../../models/collection';      

import Loader from '../includes/loader.jsx';

import {NestedPopoverTitle} from './popover-nested.jsx';
import Dropdown from './dropdown.jsx';
import {PureEditableField} from '../includes/editable-field.jsx';

import {kebabCase, orderBy} from 'lodash';

class CreateNewCollectionPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      working: false,
      query: '', //The actual search text
      teamId: undefined, // by default, create a collection for a user, but if team is selected from dropdown, set to teamID,
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setTeamId = this.setTeamId.bind(this);
  }
  
  handleChange(newValue) {
    this.setState({ query: newValue, error: null });
  }
  
  setTeamId(buttonContents){
    const teamId = buttonContents.props.id;
    this.setState({
      teamId: teamId
    });
  }

  async handleSubmit(event){
    console.log('handle submit');
    event.preventDefault();
    this.setState({working: true});
    // get text from input field
    const newCollectionName = this.state.query;
    
    // create a new collection
    try{
      const name = newCollectionName;
      const url = kebabCase(newCollectionName);
      const avatarUrl = defaultAvatar;
      const coverColor = randomColor({luminosity: 'light'});
      const teamId = this.state.teamId;
      
      const {data} = await this.props.api.post('collections', {
        name,
        url,
        avatarUrl,
        coverColor,
        teamId,
      });

      // add the selected project to the collection
      await this.props.api.patch(`collections/${data.id}/add/${this.props.project.id}`);         
      
      // redirect to that collection
      if(data && data.url){
        if(this.state.teamId){
          const {data: team} = await this.props.api.get(`/teams/${this.state.teamId}`);
          console.log('got team');
          data.team = team; 
        }else{
          console.log('set user');
          data.user = this.props.currentUser;
        }
        const newCollectionUrl = getLink(data);
        this.setState({newCollectionUrl});
      }
      

    }catch(error){
      if (error && error.response && error.response.data && error.response.data.message) {
        this.setState({error: error.response.data.message});
      } else {
        captureException(error);
      }
    }
  }

  render() {
    const {error, query} = this.state;
    const {collections} = this.props;
    console.log('collections', collections);
    
    let queryError = this.state.error;
    let submitEnabled = this.state.query.length > 0;

    let placeholder = "New Collection Name";
    
    const teams = this.props.currentUser.teams;
    const currentUserMenuItem = <>myself <UserAvatar user={this.props.currentUser} isStatic={true}/></>;
    
    function getTeamMenuContents(){
      const orderedTeams = orderBy(teams, team => team.name.toLowerCase());   
      const menuContents = [];
      menuContents.push(currentUserMenuItem); // add user as first option
      
      orderedTeams.map(team => {
        let content = <span id={team.id}>{team.name} {<TeamAvatar team={team} className="user"/>}</span>;
        menuContents.push(content);
      });
      return menuContents;
    }
    
    if (!!collections && collections.some(c => c.url === kebabCase(query))) {
      queryError = 'You already have a collection with this url';
    }
    if(this.state.newCollectionUrl){
      return <Redirect to={this.state.newCollectionUrl}/>;
    }
    return (
      <dialog className="pop-over create-collection-pop wide-pop">
        <NestedPopoverTitle>
          Add {this.props.project.domain} to a new collection
        </NestedPopoverTitle>
        
        <section className="pop-over-actions">
          <form onSubmit={this.handleSubmit}> 
            <PureEditableField
              id="collection-name"
              className="pop-over-input create-input"
              value={query} 
              update={this.handleChange}
              placeholder={placeholder}
              error={error || queryError}
            />
            
            { this.props.currentUser.teams.length > 0 ?
              <>
                <br style={{clear: "both"}}/>for
                <Dropdown buttonContents={currentUserMenuItem} menuContents={getTeamMenuContents()} onUpdate={this.setTeamId}/>
              </>
              : null
            }
            
            <br style={{clear: "both"}}/>
            
            {!this.state.working ? (
              <TrackClick name="Create Collection clicked" properties={inherited => ({...inherited, origin: `${inherited.origin} project`})}>
                <div className="button-wrap">
                  <button type="submit" className="create-collection button-small" disabled={!!queryError || !submitEnabled}>
                    Create
                  </button>
                </div>
              </TrackClick>
            ) : <Loader/>}       
          </form>  
        </section>
      </dialog>
    );
  }
}

CreateNewCollectionPop.propTypes = {
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  project: PropTypes.object.isRequired,
  fromProject: PropTypes.bool,
};

export default CreateNewCollectionPop;
