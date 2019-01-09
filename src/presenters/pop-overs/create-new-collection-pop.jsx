// add-project-to-collection-pop.jsx -> Add a project to a collection via a project item's menu
import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import randomColor from 'randomcolor';
import {captureException} from '../../utils/sentry';

import {TrackClick} from '../analytics';
import {getLink, defaultAvatar} from '../../models/collection';

import Loader from '../includes/loader.jsx';

import {NestedPopoverTitle} from './popover-nested.jsx';
import {PureEditableField} from '../includes/editable-field.jsx';

import _ from 'lodash';


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
    event.preventDefault();
    this.setState({working: true});
    // get text from input field
    const newCollectionName = this.state.query;
    
    // create a new collection
    try{
      const name = newCollectionName;
      const url = _.kebabCase(newCollectionName);
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
    if (!!maybeCollections && !!query && maybeCollections.some(c => c.url === _.kebabCase(query))) {
      queryError = 'You already have a collection with this url';
    }
    if(this.state.newCollectionUrl){
      return <Redirect to={this.state.newCollectionUrl}/>;
    }
    return (
      <dialog className="pop-over add-project-to-collection-pop wide-pop">
        <NestedPopoverTitle>
          Add {this.props.project.domain} to a new collection
        </NestedPopoverTitle>
        <section className="pop-over-actions">
          <div className="pop-title collection-title">Add to a new collection</div>
          <form onSubmit={this.handleSubmit}>
            <PureEditableField
              id="collection-name"
              className="pop-over-input create-input"
              value={query} 
              update={this.handleChange}
              placeholder={placeholder}
              error={error || queryError}
            />
            {!this.state.working ? (
              <TrackClick name="Create Collection clicked" properties={inherited => ({...inherited, origin: `${inherited.origin} project`})}>
                <button type="submit" className="create-collection button-small" disabled={!!queryError}>
                  Create
                </button>
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
