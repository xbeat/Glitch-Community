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

{/*
const CollectionOwnerDialog = ({api, currentUser}) => {
  const orderedTeams = orderBy(currentUser.teams, team => team.name.toLowerCase());
  return(
    <dialog className="pop-over mini-pop">
      { orderedTeams.map(team => (
        <section className="mini-pop-action">{team.name}<TeamAvatar team={team} className="user"/></section>
      )) }
    </dialog>
  );
};
*/}

class CreateNewCollectionPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      working: false,
      error: null, //null or string
      query: '', //The actual search text
      collectionPair: 'wondrous-collection',
      maybeCollections: null, //null means still loading
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(newValue) {
    this.setState({ query: newValue, error: null });
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
      const collectionPair = this.state.collectionPair.split('-');
      const description = `A ${collectionPair[1]} of projects that does ${collectionPair[0]} things`;
      const avatarUrl = defaultAvatar;
      const coverColor = randomColor({luminosity: 'light'});
      
      const {data} = await this.props.api.post('collections', {
        name,
        description,
        url,
        avatarUrl,
        coverColor,
      });

      const newCollection = {user: this.props.currentUser, ...data};

      // add the selected project to the collection
      await this.props.api.patch(`collections/${newCollection.id}/add/${this.props.project.id}`);         
      
      // redirect to that collection
      const newCollectionUrl = getLink(newCollection);
      this.setState({newCollectionUrl});
    }catch(error){
      if (error && error.response && error.response.data && error.response.data.message) {
        this.setState({error: error.response.data.message});
      } else {
        captureException(error);
      }
    }
  }

  render() {
    const {error, maybeCollections, query} = this.state;
    let queryError = this.state.error;
    let placeholder = "New Collection Name";
    
    // for testing dropdown stuff
    // for populating user team contents for dropdown menu
    const teams = this.props.currentUser.teams;
    
    function getTeamContents(){
      const orderedTeams = orderBy(teams, team => team.name.toLowerCase());   
      const teamContents = [];
      orderedTeams.map(team => {
        let content = <>{team.name} {<TeamAvatar team={team} className="user"/>}</>;
        teamContents.push(content);
        })
      return teamContents;
    }
    const userTeamContents = getTeamContents();
    const collectionOwnerBtnContents = <>myself <UserAvatar user={this.props.currentUser} isStatic={true}/></>;
    
    //--> end dropdown stuff
    
    if (!!maybeCollections && !!query && maybeCollections.some(c => c.url === kebabCase(query))) {
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
          {/* TO DO: Add back to submit form */}
          {/* <form onSubmit={this.handleSubmit}> */}
          <form>
            <PureEditableField
              id="collection-name"
              className="pop-over-input create-input"
              value={query} 
              update={this.handleChange}
              placeholder={placeholder}
              error={error || queryError}
            />
            <br style={{clear: "both"}}/>for
            
            <Dropdown buttonContents={collectionOwnerBtnContents} menuContents={userTeamContents}/>
            
            <br/>
            
            {!this.state.working ? (
              <TrackClick name="Create Collection clicked" properties={inherited => ({...inherited, origin: `${inherited.origin} project`})}>
                <div className="button-wrap">
                  <button type="submit" className="create-collection button-small" disabled={!!queryError}>
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
