// create-collection-pop.jsx -> add a project to a new user or team collection
import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import randomColor from "randomcolor";
import { captureException } from "../../utils/sentry";

import { UserAvatar, TeamAvatar } from "../includes/avatar.jsx";
import { TrackClick } from "../analytics";
import { getLink, defaultAvatar, postNewCollection } from "../../models/collection";

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
      query: "", //The entered collection name
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

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    
    let team = undefined;
    
    if(this.state.teamId){
      let { data } = await this.props.api.get(
        `/teams/${this.state.teamId}`
      );
      team = data;
    }
    
    const newCollectionUrl = await postNewCollection(this.props.api, this.state.query, null, (this.state.teamId ? null : this.props.currentUser), team);

    // create a new collection
    try {
      const name = this.state.query;
      const url = kebabCase(name);
      const avatarUrl = defaultAvatar;
      const coverColor = randomColor({ luminosity: "light" });
      const teamId = this.state.teamId;

      const { data: newCollection } = await this.props.api.post("collections", {
        name,
        url,
        avatarUrl,
        coverColor,
        teamId
      });

      if (newCollection) {
        // add the selected project to the collection
        await this.props.api.patch(
          `collections/${newCollection.id}/add/${this.props.project.id}`
        );
        // redirect to collection
        if (newCollection.url) {
          if (this.state.teamId) {
            const { data: team } = await this.props.api.get(
              `/teams/${this.state.teamId}`
            );
            newCollection.team = team;
          } else {
            newCollection.user = this.props.currentUser;
          }
          const newCollectionUrl = getLink(newCollection);
          this.setState({ newCollectionUrl });
        }
      }
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

  // getTeamOptions: Format teams in { value: teamId, label: html elements } format for react-select
  getTeamOptions(teams) {
    const orderedTeams = orderBy(teams, team => team.name.toLowerCase());
    const teamOptions = [];

    orderedTeams.map(team => {
      let item = {};
      let label = (
        <span id={team.id}>
          {team.name} {<TeamAvatar team={team} />}
        </span>
      );
      item.value = team.id;
      item.label = label;
      teamOptions.push(item);
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

    if (this.state.newCollectionUrl) {
      return <Redirect to={this.state.newCollectionUrl} />;
    }
    return (
      <dialog className="pop-over create-collection-pop wide-pop">
        <NestedPopoverTitle>
          Add {this.props.project.domain} to a new collection
        </NestedPopoverTitle>

        <section className="pop-over-actions">
          <form onSubmit={this.handleSubmit}>
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
                  options={currentUserOption.concat(this.getTeamOptions(teams))}
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
    );
  }
}

CreateCollectionPop.propTypes = {
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  project: PropTypes.object.isRequired,
  fromProject: PropTypes.bool
};

export default CreateCollectionPop;
