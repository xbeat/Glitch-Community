// add-project-to-collection-pop -> Add a project to a collection via a project item's menu
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import randomColor from 'randomcolor';
import _ from 'lodash';
import { captureException } from '../../utils/sentry';

import { TrackClick } from '../analytics';
import { getLink, defaultAvatar } from '../../models/collection';
import { getAvatarUrl } from '../../models/project';
import { getCollectionPair } from '../../models/words';

import { Loader } from '../includes/loader';

import CollectionResultItem from '../includes/collection-result-item';

import { NestedPopoverTitle } from './popover-nested';
import { PureEditableField } from '../includes/editable-field';

class AddProjectToCollectionPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      working: false,
      error: null, // null or string
      query: '', // The actual search text
      collectionPair: 'wondrous-collection',
      maybeCollections: null, // null means still loading
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    this.loadCollections();
    try {
      const collectionPair = await getCollectionPair();
      this.setState(prev => ({
        query: prev.query || collectionPair,
        collectionPair,
      }));
    } catch (error) {
      // it's ok rocky. you go when you feel like it
    }
  }

  async loadCollections() {
    const collections = await this.props.api.get(`collections/?userId=${this.props.currentUser.id}`);
    this.setState({
      maybeCollections: _.orderBy(collections.data, collection => collection.updatedAt).reverse(),
    });
  }

  handleChange(newValue) {
    this.setState({ query: newValue, error: null });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ working: true });
    // get text from input field
    const newCollectionName = this.state.query;

    // create a new collection
    try {
      const name = newCollectionName;
      const url = _.kebabCase(newCollectionName);
      const collectionPair = this.state.collectionPair.split('-');
      const description = `A ${collectionPair[1]} of projects that does ${collectionPair[0]} things`;
      const avatarUrl = defaultAvatar;
      const coverColor = randomColor({ luminosity: 'light' });

      const { data } = await this.props.api.post('collections', {
        name,
        description,
        url,
        avatarUrl,
        coverColor,
      });

      const newCollection = { user: this.props.currentUser, ...data };

      // add the selected project to the collection
      await this.props.api.patch(`collections/${newCollection.id}/add/${this.props.project.id}`);

      // redirect to that collection
      const newCollectionUrl = getLink(newCollection);
      this.setState({ newCollectionUrl });
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.message) {
        this.setState({ error: error.response.data.message });
      } else {
        captureException(error);
      }
    }
  }

  render() {
    const placeholder = 'New Collection Name';
    const { error, maybeCollections, query } = this.state;
    let queryError = this.state.error;
    if (!!maybeCollections && !!query && maybeCollections.some(c => c.url === _.kebabCase(query))) {
      queryError = 'You already have a collection with this url';
    }
    if (this.state.newCollectionUrl) {
      return <Redirect to={this.state.newCollectionUrl} />;
    }
    return (
      <dialog className="pop-over add-project-to-collection-pop wide-pop">
        {!this.props.fromProject ? (
          <NestedPopoverTitle>
            <img src={getAvatarUrl(this.props.project.id)} alt={`Project avatar for ${this.props.project.domain}`} />
            {` Add ${this.props.project.domain} to collection`}
          </NestedPopoverTitle>
        ) : null}
        {/* eslint-disable no-nested-ternary */}
        {maybeCollections ? (
          maybeCollections.length ? (
            <section className="pop-over-actions results-list">
              <ul className="results">
                {/* filter out collections that already contain the selected project} */}
                {maybeCollections.map(
                  collection => collection.projects.every(project => project.id !== this.props.project.id) && (
                    <li key={collection.id}>
                      <TrackClick
                        name="Project Added to Collection"
                        context={{
                          groupId: collection.team ? collection.team.id : 0,
                        }}
                      >
                        <CollectionResultItem
                          onClick={this.props.addProjectToCollection}
                          currentUserLogin={this.props.currentUser.login}
                          project={this.props.project}
                          collection={collection}
                          togglePopover={this.props.togglePopover}
                        />
                      </TrackClick>
                    </li>
                  ),
                )}
              </ul>
            </section>
          ) : (
            <section className="pop-over-info">
              <p className="info-description">Organize your favorite projects in one place</p>
            </section>
          )
        ) : (
          <Loader />
        )}
        {/* eslint-enable no-nested-ternary */}

        <section className="pop-over-info">
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
              <TrackClick
                name="Create Collection clicked"
                properties={inherited => ({
                  ...inherited,
                  origin: `${inherited.origin} project`,
                })}
              >
                <button type="submit" className="create-collection button-small" disabled={!!queryError}>
                  Create
                </button>
              </TrackClick>
            ) : (
              <Loader />
            )}
          </form>
        </section>
      </dialog>
    );
  }
}

AddProjectToCollectionPop.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  api: PropTypes.func,
  currentUser: PropTypes.object.isRequired,
  togglePopover: PropTypes.func, // required but added dynamically
  project: PropTypes.object.isRequired,
  fromProject: PropTypes.bool,
};

AddProjectToCollectionPop.defaultProps = {
  togglePopover: null,
  fromProject: false,
  api: null,
};

export default AddProjectToCollectionPop;
