import Observable from 'o_0';
import {debounce} from 'lodash';
import mdFactory from 'markdown-it';
import assets from '../../utils/assets';

const md = mdFactory({
  breaks: true,
  linkify: true,
  typographer: true,
});

import User from '../../models/user';
import Project from '../../models/project';
import TeamTemplate from '../../templates/pages/team';
import LayoutPresenter from '../layout';
import AnalyticsPresenter from '../analytics';

import Reactlet from "../reactlet";
import EntityPageProjects from "../entity-page-projects.jsx";
import AddTeamProject from "../includes/add-team-project.jsx";

import TeamProfile from "../includes/team-profile.jsx";

export default function(application) {
  const assetUtils = assets(application);
  
  var self = {

    application,
    team: application.team,

    TeamProfile() {
      console.log("outer observation");
      const propsObservable = Observable(() => {
        console.log("inner observation");
        const team = self.team().asProps();
        const props = {
          ...team,
          style: team.teamProfileStyle,
          currentUserIsOnTeam: self.currentUserIsOnTeam(),
          addUserToTeam: (id) => { self.team().addUser(application, User({id})); },
          applyDescription: self.applyDescription,
          avatarStyle: team.teamAvatarStyle,
          removeUserFromTeam: ({id}) => { self.team().removeUser(application, User({id})); },
          search: (query) => User.getSearchResultsJSON(application, query).then(users => users.map(user => User(user).asProps())),
          thanksCount: team.teamThanks,
          updateDescription: self.updateDescription,
          uploadAvatar: self.uploadAvatar,
          uploadCover: self.uploadCover,
        };
        return props;
      });
      
      return Reactlet(TeamProfile, {propsObservable}, "Team-Profile");
    },

    TeamProjects() {
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        isAuthorizedUser: self.currentUserIsOnTeam(),
        projectsObservable: application.team().projects,
        pinsObservable: application.team().pins,
        projectOptions: self.projectOptions(),
      };

      return Reactlet(EntityPageProjects, props, "UserPageProjectsContainer");
    },

    projectOptions() {
      const userHasProjectOptions = self.currentUserIsOnTeam();
      if(!userHasProjectOptions) {
        return {};
      }

      return {
        removeProjectFromTeam: self.removeProjectFromTeam,
        togglePinnedState: self.togglePinnedState,
      };
    },

    teamAnalytics() {
      if (self.team().fetched()) {
        return AnalyticsPresenter(application, self.team());
      }
    },

    addTeamProjectButton() {
      const props = {
        api: application.api,
        teamUsers: application.team().users(),
        addProject: (id) => {
          application.team().addProject(application, id);
        },
      };

      return Reactlet(AddTeamProject, props);
    },

    currentUserIsOnTeam() {
      return application.team().currentUserIsOnTeam(application);
    },

    hiddenUnlessCurrentUserIsOnTeam() {
      if (!self.currentUserIsOnTeam()) { return 'hidden'; }
    },

    updateDescription(event) {
      const text = event.target.textContent;
      application.team().description(text);
      return self.updateTeam({
        description: text});
    },

    updateTeam: debounce(data => application.team().updateTeam(application, data)
      , 250),

    applyDescription(event) {
      return event.target.innerHTML = md.render(application.team().description());
    },
    // application.notifyUserDescriptionUpdated true


    uploadCover() {
      const input = document.createElement("input");
      input.type = 'file';
      input.accept = "image/*";
      input.onchange = function(event) {
        const file = event.target.files[0];
        console.log('☔️☔️☔️ input onchange', file);
        return assetUtils.addCoverFile(file);
      };
      input.click();
      console.log('input created: ', input);
      return false;
    },

    uploadAvatar() {
      const input = document.createElement("input");
      input.type = 'file';
      input.accept = "image/*";
      input.onchange = function(event) {
        const file = event.target.files[0];
        console.log('☔️☔️☔️ input onchange', file);
        return assetUtils.addAvatarFile(file);
      };
      input.click();
      console.log('input created: ', input);
      return false;
    },

    togglePinnedState(projectId) {
      const action = Project.isPinnedByTeam(application.team(), projectId) ? "removePin" : "addPin";
      return application.team()[action](application, projectId);
    },

    removeProjectFromTeam(projectId) {
      application.team().removeProject(application, projectId);
    },

    hiddenIfOnTeam() {
      if (self.currentUserIsOnTeam()) { return 'hidden'; }
    },
  };

  const content = TeamTemplate(self);

  return LayoutPresenter(application, content);
}
