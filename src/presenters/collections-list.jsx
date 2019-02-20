<<<<<<< HEAD
import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { TrackClick } from "./analytics";
import CollectionItem from "./collection-item.jsx";
import { getLink, createCollection } from "../models/collection";
import Loader from "./includes/loader.jsx";
import Notifications from "./notifications.jsx";
=======
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import randomColor from 'randomcolor';
import { kebabCase, orderBy } from 'lodash';
import { TrackClick } from './analytics';
import CollectionItem from './collection-item';
import { defaultAvatar, getLink } from '../models/collection';
import { getCollections, getPredicate } from '../models/words';
import { Loader } from './includes/loader';
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656

import { orderBy } from "lodash";

class CollectionsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deletedCollectionIds: []
    };
    this.deleteCollection = this.deleteCollection.bind(this);
  }

  async deleteCollection(id) {
    this.setState(({ deletedCollectionIds }) => ({
<<<<<<< HEAD
      deletedCollectionIds: [...deletedCollectionIds, id]
=======
      deletedCollectionIds: [...deletedCollectionIds, id],
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    }));
    await this.props.api.delete(`/collections/${id}`);
  }

  render() {
    const {
      title,
      api,
      isAuthorized,
      maybeCurrentUser,
<<<<<<< HEAD
      maybeTeam
    } = this.props;
    const deleteCollection = this.deleteCollection;
    const collections = this.props.collections.filter(
      ({ id }) => !this.state.deletedCollectionIds.includes(id)
=======
      maybeTeam,
    } = this.props;
    const { deleteCollection } = this;
    const collections = this.props.collections.filter(
      ({ id }) => !this.state.deletedCollectionIds.includes(id),
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    );
    const hasCollections = !!collections.length;
    const canMakeCollections = isAuthorized && !!maybeCurrentUser;

    if (!hasCollections && !canMakeCollections) {
      return null;
    }
    return (
      <article className="collections">
        <h2>{title}</h2>
        {canMakeCollections && (
          <>
            <CreateCollectionButton
              {...{ api, currentUser: maybeCurrentUser, maybeTeam }}
            />
            {!hasCollections && (
              <CreateFirstCollection
                {...{ api, currentUser: maybeCurrentUser }}
              />
            )}
          </>
        )}
        <CollectionsUL
<<<<<<< HEAD
          {...{ collections, api, isAuthorized, deleteCollection }}
=======
          {...{
            collections, api, isAuthorized, deleteCollection,
          }}
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
        />
      </article>
    );
  }
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  maybeCurrentUser: PropTypes.object,
  maybeTeam: PropTypes.object,
  title: PropTypes.node.isRequired,
<<<<<<< HEAD
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired
=======
  api: PropTypes.func,
  isAuthorized: PropTypes.bool.isRequired,
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
};

CollectionsList.defaultProps = {
  maybeCurrentUser: undefined,
  maybeTeam: undefined,
  api: null,
};

const CreateFirstCollection = () => (
  <div className="create-first-collection">
    <img
      src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934"
      alt=""
    />
    <p className="placeholder">
      Create collections to organize your favorite projects.
    </p>
    <br />
  </div>
);

export class CreateCollectionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRedirect: false,
      loading: false,
<<<<<<< HEAD
      newCollectionUrl: ""
=======
      newCollectionUrl: '',
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    };
    this.createCollectionOnClick = this.createCollectionOnClick.bind(this);
  }

<<<<<<< HEAD
  async createCollectionOnClick(createNotification) {
    this.setState({ loading: true });

    let collectionResponse = await createCollection(
      this.props.api,
      null,
      this.props.maybeTeam ? this.props.maybeTeam.id : null,
      createNotification
    );
    if (collectionResponse && collectionResponse.id) {
      const collection = collectionResponse;
=======
  generateNames = async () => {
    let collectionSynonyms = [
      'mix',
      'bricolage',
      'playlist',
      'assortment',
      'potpourri',
      'melange',
      'album',
      'collection',
      'variety',
      'compilation',
    ];
    let predicate = 'radical';

    try {
      // get collection names
      collectionSynonyms = await getCollections();
      predicate = await getPredicate();
    } catch (error) {
      // If there's a failure, we'll stick with our defaults.
    }

    return [collectionSynonyms, predicate];
  }

  async postCollection(collectionSynonym, predicate) {
    const name = [predicate, collectionSynonym].join('-');
    const description = `A ${collectionSynonym} of projects that does ${predicate} things`;
    const url = kebabCase(name);

    // defaults
    const avatarUrl = defaultAvatar;

    // get a random color
    const coverColor = randomColor({ luminosity: 'light' });

    // set the team id if there is one
    const teamId = this.props.maybeTeam ? this.props.maybeTeam.id : undefined;

    const { data } = await this.props.api.post('collections', {
      name,
      description,
      url,
      avatarUrl,
      coverColor,
      teamId,
    });

    if (data && data.url) {
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
      if (this.props.maybeTeam) {
        collection.team = this.props.maybeTeam;
      } else {
        collection.user = this.props.currentUser;
      }
<<<<<<< HEAD
      const newCollectionUrl = getLink(collection);
      this.setState({ newCollectionUrl, shouldRedirect: true });
    } else {
      // error messaging handled in createCollection
      this.setState({ loading: false });
=======
      const newCollectionUrl = getLink(data);
      this.setState({ newCollectionUrl, shouldRedirect: true });
      return true;
    }
    return false;
  }

  async createCollection() {
    this.setState({ loading: true });

    const [collectionSynonymns, predicate] = await this.generateNames();
    let creationSuccess = false;
    for (const synonym of collectionSynonymns) {
      try {
        // eslint-disable-next-line no-await-in-loop
        creationSuccess = await this.postCollection(synonym, predicate);
        if (creationSuccess) {
          break;
        }
      } catch (error) {
        // Try again.
      }
    }
    if (!creationSuccess) {
      console.log('Unable to create collection :-(');
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    }
  }

  render() {
    if (this.state.shouldRedirect) {
<<<<<<< HEAD
      return <Redirect to={this.state.newCollectionUrl} push={true} />;
=======
      return <Redirect to={this.state.newCollectionUrl} push />;
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    }
    if (this.state.loading) {
      return (
        <div id="create-collection-container">
          <Loader />
        </div>
      );
    }
    return (
<<<<<<< HEAD
      <Notifications>
        {({ createNotification }) => (
          <div id="create-collection-container">
            <TrackClick name="Create Collection clicked">
              <button
                className="button"
                id="create-collection"
                onClick={() => this.createCollectionOnClick(createNotification)}
              >
                Create Collection
              </button>
            </TrackClick>
          </div>
        )}
      </Notifications>
=======
      <div id="create-collection-container">
        <TrackClick name="Create Collection clicked">
          <button
            className="button"
            id="create-collection"
            type="button"
            onClick={() => this.createCollection()}
          >
            Create Collection
          </button>
        </TrackClick>
      </div>
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
    );
  }
}

CreateCollectionButton.propTypes = {
  api: PropTypes.any,
  currentUser: PropTypes.object.isRequired,
<<<<<<< HEAD
  maybeTeam: PropTypes.object
=======
  maybeTeam: PropTypes.object,
};

CreateCollectionButton.defaultProps = {
  maybeTeam: undefined,
  api: null,
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
};

export const CollectionsUL = ({
  collections,
  deleteCollection,
  api,
<<<<<<< HEAD
  isAuthorized
=======
  isAuthorized,
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
}) => {
  // order by updatedAt date
  const orderedCollections = orderBy(
    collections,
<<<<<<< HEAD
    collection => collection.updatedAt
=======
    collection => collection.updatedAt,
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
  ).reverse();
  return (
    <ul className="collections-container">
      {/* FAVORITES COLLECTION CARD - note this currently references empty favorites category in categories.js
        <CollectionItem key={null} collection={null} api={api} isAuthorized={isAuthorized}></CollectionItem>
      */}

      {orderedCollections.map(collection => (
        <CollectionItem
          key={collection.id}
<<<<<<< HEAD
          {...{ collection, api, isAuthorized, deleteCollection }}
=======
          {...{
            collection, api, isAuthorized, deleteCollection,
          }}
>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
        />
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  api: PropTypes.func,
  collections: PropTypes.array.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func
};

<<<<<<< HEAD
=======
CollectionsUL.defaultProps = {
  deleteCollection: () => {},
  api: null,
};

>>>>>>> d5ac21db1a0ca1c8d931f02a7aa2d92c31076656
export default CollectionsList;
