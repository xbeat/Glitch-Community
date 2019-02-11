// add-project-to-collection-pop.jsx -> Add a project to a collection via a project item's menu
import React from "react";
import PropTypes from "prop-types";
import { NestedPopover } from "./popover-nested";
import { captureException } from "../../utils/sentry";

import { TrackClick } from "../analytics";
import { getAvatarUrl } from "../../models/project";

import Loader from "../includes/loader.jsx";

import CollectionResultItem from "../includes/collection-result-item.jsx";

import CreateCollectionPop from "./create-collection-pop.jsx";

import { NestedPopoverTitle } from "./popover-nested.jsx";

import { orderBy } from "lodash";

const AddProjectPopoverTitle = ({ project }) => {
  return (
    <NestedPopoverTitle>
      <img
        src={getAvatarUrl(project.id)}
        alt={`Project avatar for ${project.domain}`}
      />{" "}
      Add {project.domain} to collection
    </NestedPopoverTitle>
  );
};
AddProjectPopoverTitle.propTypes = {
  project: PropTypes.object.isRequired
};

class AddProjectToCollectionPopContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "", // value of filter input field
      filteredCollections: this.props.collections // collections filtered from search query
    };
    this.updateFilter = this.updateFilter.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collections !== this.props.collections) {
      this.setState({
        filteredCollections: nextProps.collections
      });
    }
  }

  updateFilter(query) {
    query = query.toLowerCase().trim();
    let filteredCollections = this.props.collections.filter(collection =>
      collection.name.toLowerCase().includes(query)
    );
    this.setState({ filteredCollections, query });
  }

  render() {
    const { filteredCollections, query } = this.state;
    const NoSearchResultsPlaceholder = (
      <p className="info-description">
        No matching collections found – add to a new one?
      </p>
    );
    const NoCollectionPlaceholder = (
      <p className="info-description">
        Create collections to organize your favorite projects.
      </p>
    );

    if (!this.props.collections) {
      return (
        <dialog className="pop-over add-project-to-collection-pop wide-pop">
          {!this.props.fromProject && (
            <AddProjectPopoverTitle project={this.props.project} />
          )}
          <div className="loader-container">
            <Loader />
          </div>
        </dialog>
      );
    }

    return (
      <dialog className="pop-over add-project-to-collection-pop wide-pop">
        {/* Only show this nested popover title from project-options */}
        {!this.props.fromProject && (
          <AddProjectPopoverTitle project={this.props.project} />
        )}

        {this.props.collections.length > 3 && (
          <section className="pop-over-info">
            <input
              className="pop-over-input search-input pop-over-search"
              onChange={evt => {
                this.updateFilter(evt.target.value);
              }}
              placeholder="Filter collections"
            />
          </section>
        )}

        {filteredCollections && filteredCollections.length ? (
          <section className="pop-over-actions results-list">
            <ul className="results">
              {filteredCollections.map(
                collection =>
                  // filter out collections that already contain the selected project
                  collection.projects &&
                  collection.projects.every(
                    project => project.id !== this.props.project.id
                  ) && (
                    <li key={collection.id}>
                      <TrackClick
                        name="Project Added to Collection"
                        context={{
                          groupId: collection.team ? collection.team.id : 0
                        }}
                      >
                        <CollectionResultItem
                          api={this.props.api}
                          onClick={this.props.addProjectToCollection}
                          project={this.props.project}
                          collection={collection}
                          togglePopover={this.props.togglePopover}
                          currentUser={this.props.currentUser}
                        />
                      </TrackClick>
                    </li>
                  )
              )}
            </ul>
          </section>
        ) : (
          <section className="pop-over-info">
            {query ? NoSearchResultsPlaceholder : NoCollectionPlaceholder}
          </section>
        )}

        <section className="pop-over-actions">
          <button
            className="create-new-collection button-small button-tertiary"
            onClick={this.props.createCollectionPopover}
          >
            Add to a new collection
          </button>
        </section>
      </dialog>
    );
  }
}

AddProjectToCollectionPopContents.propTypes = {
  addProjectToCollection: PropTypes.func,
  collections: PropTypes.array,
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  togglePopover: PropTypes.func, // required but added dynamically
  project: PropTypes.object.isRequired,
  fromProject: PropTypes.bool
};

class AddProjectToCollectionPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maybeCollections: null // null means still loading
    };
  }

  async loadCollections() {
    try {
      let allCollections = [];
      
      // first, load all of the user's collections
      const userCollections = await this.props.api.get(
        `collections/?userId=${this.props.currentUser.id}`
      );
      userCollections.data.forEach(userCollection => {
        userCollection.user = this.props.currentUser;
      });
      allCollections = userCollections.data;

      // next load all of the user's team's collections
      const userTeams = this.props.currentUser.teams;
      for (const team of userTeams) {
        const { data: teamCollections } = await this.props.api.get(
          `collections/?teamId=${team.id}`
        );
        if (teamCollections) {
          teamCollections.forEach(teamCollection => {
            teamCollection.team = this.props.currentUser.teams.find(
              userTeam => userTeam.id == team.id
            );
            allCollections.push(teamCollection);
          });
        }
      }

      // let orderedCollections = orderBy(allCollections, ['updatedAt'], ['desc']);
      const orderedCollections = orderBy(
        allCollections, collection => collection.updatedAt
      ).reverse();
      this.setState({ maybeCollections: orderedCollections });
    } catch (error) {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        this.setState({ error: error.response.data.message });
      } else {
        captureException(error);
      }
    }
  }

  async componentDidMount() {
    this.loadCollections();
  }

  render() {
    return (
      <NestedPopover
        alternateContent={() => (
          <CreateCollectionPop
            {...this.props}
            api={this.props.api}
            collections={this.state.maybeCollections}
            togglePopover={this.props.togglePopover}
          />
        )}
        startAlternateVisible={false}
      >
        {createCollectionPopover => (
          <AddProjectToCollectionPopContents
            {...this.props}
            collections={this.state.maybeCollections}
            createCollectionPopover={createCollectionPopover}
          />
        )}
      </NestedPopover>
    );
  }
}

AddProjectToCollectionPop.propTypes = {
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object
};

export default AddProjectToCollectionPop;
