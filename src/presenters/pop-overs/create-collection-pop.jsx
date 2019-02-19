// create-collection-pop.jsx -> add a project to a new user or team collection
import React from "react";
import PropTypes from "prop-types";
import { captureException } from "../../utils/sentry";

import { UserAvatar, TeamAvatar } from "../includes/avatar.jsx";
import { TrackClick } from "../analytics";
import { getLink, createCollection } from "../../models/collection";

import Notifications from "../notifications.jsx";
import {AddProjectToCollectionMsg} from '../notifications.jsx';
import { NestedPopoverTitle } from "./popover-nested.jsx";
import Dropdown from "./dropdown.jsx";
import { PureEditableField } from "../includes/editable-field.jsx";
import Loader from "../includes/loader.jsx";

import { kebabCase, orderBy } from "lodash";

class CreateCollectionPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      query: "", //The entered collection nam e
      teamId: undefined // by default, create a collection for a user, but if team is selected from dropdown, set to teamID,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setTeamId = this.setTeamId.bind(this);
  }

  handleChange(newValue) {
    this.setState({ query: newValue, error: null });
  }

  setTeamId(teamId) {
    this.setState({
      teamId: teamId
    });
  }

  async handleSubmit(event, createNotification) {
    event.preventDefault();
    this.setState({ loading: true });
    console.log('handle submit');
    try {
      // create the new collection
      const newCollection = await createCollection(
        this.props.api,
        this.state.query,
        this.state.teamId
      );
      console.log('newCollection', newCollection);
      // add the project to the collection
      if (newCollection) {
        // add the selected project to the collection
        await this.props.api.patch(
          `collections/${newCollection.id}/add/${this.props.project.id}`
        ).then(() => {
          if (this.state.teamId) {
            const team = this.props.currentUser.teams.find(
              ({ id }) => id == this.state.teamId
            );
            newCollection.team = team;
          } else {
            newCollection.user = this.props.currentUser;
          }
          const newCollectionUrl = getLink(newCollection);
          
          // show notification       
          const content = <AddProjectToCollectionMsg projectDomain={this.props.project.domain} collectionName={newCollection.name} url={newCollectionUrl}/>;
          createNotification(content, "notifySuccess");
          
          this.props.togglePopover();
        });
      }else{
        
      }
    } catch (error) {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        createNotification(error.response.data.message, "notifyError");
        this.props.togglePopover();
      } else {
        captureException(error);
      }
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

    const currentUserOptionLabel = (
      <span>
        myself <UserAvatar user={this.props.currentUser} />
      </span>
    );
    const currentUserOption = [{ value: -1, label: currentUserOptionLabel }];

    // determine if entered name already exists for selected user / team
    const selectedOwnerCollections = this.state.teamId
      ? collections.filter(({ teamId }) => teamId == this.state.teamId)
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
              <form onSubmit={(event) => this.handleSubmit(event, createNotification)}>
                <PureEditableField
                  className="pop-over-input create-input"
                  value={query}
                  update={this.handleChange}
                  placeholder={placeholder}
                  error={error || queryError}
                  aria-label={placeholder}
                />

                {this.props.currentUser.teams.length > 0 && (
                  <div>
                    for{" "}
                    <Dropdown
                      containerClass="user-or-team-toggle"
                      options={currentUserOption.concat(
                        this.getTeamOptions(teams)
                      )}
                      onUpdate={this.setTeamId}
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
  togglePopover: PropTypes.func.isRequired,
};

export default CreateCollectionPop;