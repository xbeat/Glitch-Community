// create-collection-pop.jsx -> add a project to a new user or team collection
import React from 'react';
import PropTypes from 'prop-types';

import { kebabCase, orderBy } from 'lodash';
import { UserAvatar, TeamAvatar } from '../includes/avatar';
import { TrackClick } from '../analytics';
import { getLink, createCollection } from '../../models/collection';

import { AddProjectToCollectionMsg, NotificationConsumer } from '../notifications';
import { NestedPopoverTitle } from './popover-nested';
import Dropdown from './dropdown';
import { PureEditableField } from '../includes/editable-field';
import { Loader } from '../includes/loader';

// getTeamOptions: Format teams in { value: teamId, label: html elements } format for react-select
function getTeamOptions(teams) {
  const orderedTeams = orderBy(teams, team => team.name.toLowerCase());

  const teamOptions = orderedTeams.map((team) => {
    const option = {};
    const label = (
      <span id={team.id}>
        {team.name}
        {' '}
        {<TeamAvatar team={team} hideTooltip />}
      </span>
    );
    option.value = team.id;
    option.label = label;
    return option;
  });
  return teamOptions;
}

class CreateCollectionPop extends React.Component {
  constructor(props) {
    super(props);

    const currentUserOptionLabel = (
      <span>
        myself
        {' '}
        <UserAvatar user={this.props.currentUser} hideTooltip />
      </span>
    );
    const currentUserOption = { value: null, label: currentUserOptionLabel };

    this.options = [currentUserOption].concat(getTeamOptions(this.props.currentUser.teams));

    this.state = {
      loading: false,
      query: '', // The entered collection name
      selection: currentUserOption, // the selected option from the dropdown
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setSelection = this.setSelection.bind(this);
  }

  setSelection(option) {
    this.setState({
      selection: option,
    });
  }

  async handleSubmit(event, createNotification) {
    event.preventDefault();
    this.setState({ loading: true });
    // create the new collection with createCollection(api, name, teamId, notification)
    const collectionResponse = await createCollection(this.props.api, this.state.query, this.state.selection.value, createNotification);
    // add the project to the collection
    if (collectionResponse && collectionResponse.id) {
      const collection = collectionResponse;
      // add the selected project to the collection
      try {
       if(this.props.addProjectToCollection){
         // custom add project to collection function from user or team editors (triggers reload of collections on page by default)
         this.props.addProjectToCollection(this.props.project, collection)
       }else{
         // default API call to add project to collection
         this.props.api.patch(`collections/${collection.id}/add/${this.props.project.id}`);
       }
        if (this.state.selection.value) {
          const team = this.props.currentUser.teams.find(({ id }) => id === this.state.selection.value);
          collection.team = team;
        }
        collection.user = this.props.currentUser;

        const newCollectionUrl = getLink(collection);

        // show notification
        const content = (
          <AddProjectToCollectionMsg projectDomain={this.props.project.domain} collectionName={collection.name} url={newCollectionUrl} />
        );
        createNotification(content, 'notifySuccess');

        this.props.togglePopover();
      } catch (error) {
        createNotification('Unable to add project to collection.', 'notifyError');
        this.props.togglePopover();
      }
    } else {
      // error messaging is handled in createCollection
      this.props.togglePopover();
    }
  }

  handleChange(newValue) {
    this.setState({ query: newValue, error: null });
  }

  render() {
    const { error, query } = this.state;
    const { collections } = this.props;
    const { teams } = this.props.currentUser;
    let queryError; // if user already has a collection with the specified name

    const submitEnabled = this.state.query.length > 0;
    const placeholder = 'New Collection Name';

    // determine if entered name already exists for selected user / team
    const selectedOwnerCollections = this.state.selection.value
      ? collections.filter(({ teamId }) => teamId === this.state.selection.value)
      : collections.filter(({ userId }) => userId === this.props.currentUser.id);

    if (!!collections && selectedOwnerCollections.some(c => c.url === kebabCase(query))) {
      queryError = 'You already have a collection with this name';
    }

    return (
      <NotificationConsumer>
        {({ createNotification }) => (
          <dialog className="pop-over create-collection-pop wide-pop">
            <NestedPopoverTitle>
              {`Add ${this.props.project.domain} to a new collection`}
            </NestedPopoverTitle>

            <section className="pop-over-actions">
              <form onSubmit={event => this.handleSubmit(event, createNotification)}>
                <PureEditableField
                  className="pop-over-input create-input"
                  value={query}
                  update={this.handleChange}
                  placeholder={placeholder}
                  error={error || queryError}
                  aria-label={placeholder}
                />

                {teams && teams.length > 0 && (
                  <div>
                    {'for '}
                    <Dropdown
                      containerClass="user-or-team-toggle"
                      options={this.options}
                      selection={this.state.selection}
                      onUpdate={this.setSelection}
                    />
                  </div>
                )}

                {!this.state.loading ? (
                  <TrackClick
                    name="Create Collection clicked"
                    properties={inherited => ({
                      ...inherited,
                      origin: `${inherited.origin} project`,
                    })}
                  >
                    <div className="button-wrap">
                      <button type="submit" className="create-collection button-small" disabled={!!queryError || !submitEnabled}>
                        Create
                      </button>
                    </div>
                  </TrackClick>
                ) : (
                  <Loader />
                )}
              </form>
            </section>
          </dialog>
        )}
      </NotificationConsumer>
    );
  }
}

CreateCollectionPop.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

CreateCollectionPop.defaultProps = {
  addProjectToCollection: null
}

export default CreateCollectionPop;
