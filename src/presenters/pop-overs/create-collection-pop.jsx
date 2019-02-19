// create-collection-pop.jsx -> add a project to a new user or team collection
import React from "react";
import PropTypes from "prop-types";

import { UserAvatar, TeamAvatar } from "../includes/avatar.jsx";
import { TrackClick } from "../analytics";
import { getLink, createCollection } from "../../models/collection";

import Notifications from "../notifications.jsx";
import { AddProjectToCollectionMsg } from "../notifications.jsx";
import { NestedPopoverTitle } from "./popover-nested.jsx";
import Dropdown from "./dropdown.jsx";
import { PureEditableField } from "../includes/editable-field.jsx";
import Loader from "../includes/loader.jsx";

import { kebabCase, orderBy } from "lodash";

class CreateCollectionPop extends React.Component {
  constructor(props) {
    super(props);

    const currentUserOptionLabel = (
      <span>
        myself <UserAvatar user={this.props.currentUser} />
      </span>
    );
    const currentUserOption = { value: -1, label: currentUserOptionLabel };

    this.state = {
      loading: false,
      query: "", //The entered collection name
      options: [currentUserOption].concat(
        this.getTeamOptions(this.props.currentUser.teams)
      ), // options that will appear in the dropdown
      selection: currentUserOption, // the selected option from the dropdown 
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setSelection = this.setSelection.bind(this);
  }

  handleChange(newValue) {
    this.setState({ query: newValue, error: null });
  }

  setSelection(option) {
    this.setState({
      selection: option
    });
  }

  async handleSubmit(event, createNotification) {
    event.preventDefault();
    this.setState({ loading: true });
    // create the new collection with createCollection(api, name, teamId, notification)
    const collectionResponse = await createCollection(
      this.props.api,
      this.state.query,
      this.state.selection.value,
      createNotification
    );
    // add the project to the collection
    if (collectionResponse && collectionResponse.id) {
      const collection = collectionResponse;
      // add the selected project to the collection
      await this.props.api
        .patch(`collections/${collection.id}/add/${this.props.project.id}`)
        .then(() => {
          if (this.state.selection.value) {
            const team = this.props.currentUser.teams.find(
              ({ id }) => id == this.state.selection.value
            );
            collection.team = team;
          } else {
            collection.user = this.props.currentUser;
          }
          const newCollectionUrl = getLink(collection);

          // show notification
          const content = (
            <AddProjectToCollectionMsg
              projectDomain={this.props.project.domain}
              collectionName={collection.name}
              url={newCollectionUrl}
            />
          );
          createNotification(content, "notifySuccess");

          this.props.togglePopover();
        });
    } else {
      // error messaging is handled in createCollection
      this.props.togglePopover();
    }
  }

  // getTeamOptions: Format teams in { value: teamId, label: html elements } format for react-select
  getTeamOptions(teams) {
    const orderedTeams = orderBy(teams, team => team.name.toLowerCase());
    const teamOptions = [];

    orderedTeams.map(team => {
      let option = {};
      let label = (
        <span id={team.id}>
          {team.name} {<TeamAvatar team={team} />}
        </span>
      );
      option.value = team.id;
      option.label = label;
      teamOptions.push(option);
    });
    return teamOptions;
  }

  render() {
    const { error, query } = this.state;
    const { collections } = this.props;
    let queryError; // if user already has a collection with the specified name

    const submitEnabled = this.state.query.length > 0;
    const placeholder = "New Collection Name";

    const teams = this.props.currentUser.teams;

    // determine if entered name already exists for selected user / team
    const selectedOwnerCollections = this.state.selection.value
      ? collections.filter(({ teamId }) => teamId == this.state.selection.value)
      : collections.filter(({ userId }) => userId == this.props.currentUser.id);

    if (
      !!collections &&
      selectedOwnerCollections.some(c => c.url === kebabCase(query))
    ) {
      queryError = "You already have a collection with this name";
    }

    return (
      <Notifications>
        {({ createNotification }) => (
          <dialog className="pop-over create-collection-pop wide-pop">
            <NestedPopoverTitle>
              Add {this.props.project.domain} to a new collection
            </NestedPopoverTitle>

            <section className="pop-over-actions">
              <form
                onSubmit={event => this.handleSubmit(event, createNotification)}
              >
                <PureEditableField
                  className="pop-over-input create-input"
                  value={query}
                  update={this.handleChange}
                  placeholder={placeholder}
                  error={error || queryError}
                  aria-label={placeholder}
                />

                {teams.length > 0 && (
                  <div>
                    for{" "}
                    <Dropdown
                      containerClass="user-or-team-toggle"
                      options={this.state.options}
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
                      origin: `${inherited.origin} project`
                    })}
                  >
                    <div className="button-wrap">
                      <button
                        type="submit"
                        className="create-collection button-small"
                        disabled={!!queryError || !submitEnabled}
                      >
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
      </Notifications>
    );
  }
}

CreateCollectionPop.propTypes = {
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  project: PropTypes.object.isRequired,
  fromProject: PropTypes.bool,
  togglePopover: PropTypes.func.isRequired
};

export default CreateCollectionPop;
