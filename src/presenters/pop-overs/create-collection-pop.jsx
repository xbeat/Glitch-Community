// create-collection-pop.jsx -> add a project to a new user or team collection
import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import randomColor from "randomcolor";
import { captureException } from "../../utils/sentry";

import { UserAvatar, TeamAvatar } from "../includes/avatar.jsx";
import { TrackClick } from "../analytics";
import { getLink, defaultAvatar } from "../../models/collection";

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

  setTeamId(buttonContents) {
    const teamId = buttonContents.props.id;
    this.setState({
      teamId: teamId
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });

    // create a new collection
    try {
      const name = this.state.query;
      const url = kebabCase(name);
      const avatarUrl = defaultAvatar;
      const coverColor = randomColor({ luminosity: "light" });
      const teamId = this.state.teamId;

      const { data } = await this.props.api.post("collections", {
        name,
        url,
        avatarUrl,
        coverColor,
        teamId
      });

      // add the selected project to the collection
      await this.props.api.patch(
        `collections/${data.id}/add/${this.props.project.id}`
      );

      // redirect to that collection
      if (data && data.url) {
        if (this.state.teamId) {
          const { data: team } = await this.props.api.get(
            `/teams/${this.state.teamId}`
          );
          data.team = team;
        } else {
          data.user = this.props.currentUser;
        }
        const newCollectionUrl = getLink(data);
        this.setState({ newCollectionUrl });
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

  render() {
    const { error, query } = this.state;
    const { collections } = this.props;

    const submitEnabled = this.state.query.length > 0;
    const nameTakenError = "You already have a collection with this url";

    const placeholder = "New Collection Name";

    const teams = this.props.currentUser.teams;

    const currentUserMenuItem = (
      <span>
        myself <UserAvatar user={this.props.currentUser} isStatic />
      </span>
    );

    function getTeamMenuContents() {
      const orderedTeams = orderBy(teams, team => team.name.toLowerCase());
      const menuContents = [];
      menuContents.push(currentUserMenuItem); // add user as first option

      orderedTeams.map(team => {
        let content = (
          <span id={team.id}>
            {team.name} {<TeamAvatar team={team} className="user" />}
          </span>
        );
        menuContents.push(content);
      });
      return menuContents;
    }

    // filter collections based on selected owner from dropdown
    const selectedOwnerCollections = this.state.teamId
      ? collections.filter(({ teamId }) => teamId == this.state.teamId)
      : collections.filter(({ userId }) => userId == this.props.currentUser.id);

    if (
      !!collections &&
      selectedOwnerCollections.some(c => c.url === kebabCase(query))
    ) {
      error = nameTakenError;
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
              error={error || error}
            />

            {this.props.currentUser.teams.length > 0 && (
              <div>
                for{" "}
                <Dropdown
                  buttonContents={currentUserMenuItem}
                  menuContents={getTeamMenuContents()}
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
                    disabled={!!error || !submitEnabled}
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
