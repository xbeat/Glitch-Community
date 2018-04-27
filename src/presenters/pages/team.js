const Observable = require('o_0');
import debounce from 'lodash-es/debounce';
const md = require('markdown-it')({
  breaks: true,
  linkify: true,
  typographer: true,
});
const Project = require("../../models/project");

const TeamTemplate = require("../../templates/pages/team");
const LayoutPresenter = require("../layout");
const AddTeamUserPopPresenter = require("../pop-overs/add-team-user-pop");
// const AddTeamProjectPopPresenter = require("../pop-overs/add-team-project-pop");

const TeamUserPresenter = require("../team-user-avatar");
const AnalyticsPresenter = require("../analytics");

import Reactlet from "../reactlet";
import UsersList from "../users-list.jsx";
import EntityPageProjects from "../entity-page-projects.jsx";
import AddTeamProjectPop from "../pop-overs/add-team-project-pop.jsx";

module.exports = function(application) {
  const assetUtils = require('../../utils/assets')(application);

  var self = {

    application,
    team: application.team,
    hiddenIfTeamFetched() { return application.team().hiddenIfFetched(); },
    hiddenUnlessTeamFetched() { return application.team().hiddenUnlessFetched(); },
    initialTeamDescription: Observable(undefined),

    verifiedTeamTooltip() {
      return application.team().verifiedTooltip();
    },

    TeamUsersAsMember() {
      const users = application.team().users();
      return users.map(user => TeamUserPresenter(application, user));
    },

    TeamUsers() {
      const users = application.team().users();
      const props = {
        users: users.map(user => user.asProps()),
        extraClass: "team-users",
      };
      return Reactlet(UsersList, props);
    },

    TeamProjects() {
      const props = {
        closeAllPopOvers: application.closeAllPopOvers,
        isAuthorizedUser: application.team().currentUserIsOnTeam(application),
        projectsObservable: application.team().projects,
        pinsObservable: application.team().pins,
        projectOptions: self.projectOptions(),
      };

      return Reactlet(EntityPageProjects, props, "UserPageProjectsContainer");
    },

    projectOptions(){
      const userHasProjectOptions = application.team().currentUserIsOnTeam(application);
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

    addTeamUserPop() {
      return AddTeamUserPopPresenter(application);
    },

    addTeamProjectPop() {
      const action = ({project}) => (
        application.team().addProject(application, project)
      );

      const props = {
        // searchProjects: application.searchProjects,
        api: application.api(),
        teamUsers: application.team().users(),
        action,
      };

      return Reactlet(AddTeamProjectPop, props);
    },

    coverUrl() {
      if (application.team().localCoverImage()) {
        return application.team().localCoverImage();
      }
      return application.team().coverUrl();

    },

    teamProfileStyle() {
      return {
        backgroundColor: application.team().coverColor(),
        backgroundImage: `url('${self.coverUrl()}')`,
      };
    },

    teamAvatarStyle() {
      if (application.team().hasAvatarImage()) {
        return {backgroundImage: `url('${self.teamAvatarUrl()}')`};
      }
      return {backgroundColor: application.team().backgroundColor()};

    },

    teamName() {
      return application.team().name();
    },

    teamThanks() {
      return application.team().teamThanks();
    },

    isVerified() {
      return application.team().isVerified();
    },

    verifiedImage() {
      return application.team().verifiedImage();
    },

    hiddenUnlessVerified() {
      if (!self.isVerified()) { return 'hidden'; }
    },

    hiddenUnlessTeamHasThanks() {
      if (!(application.team().thanksCount() > 0)) { return 'hidden'; }
    },

    currentUserIsOnTeam() {
      return application.team().currentUserIsOnTeam(application);
    },

    hiddenUnlessCurrentUserIsOnTeam() {
      if (!self.currentUserIsOnTeam(application)) { return 'hidden'; }
    },

    hiddenIfCurrentUserIsOnTeam() {
      if (self.currentUserIsOnTeam(application)) { return 'hidden'; }
    },

    description() {
      const text = application.team().description();
      const node = document.createElement('span');
      node.innerHTML = md.render(text);
      return node;
    },

    setInitialTeamDescription() {
      const description = application.team().description();
      const node = document.createElement('span');
      node.innerHTML = md.render(description);
      if (description) {
        return self.initialTeamDescription(node);
      }
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

    teamAvatarUrl() {
      if (application.team().localAvatarImage()) {
        return application.team().localAvatarImage();
      }
      return application.team().teamAvatarUrl('large');

    },


    hiddenIfNoDescription() {
      if (application.team().description().length === 0) { return 'hidden'; }
    },

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

    hiddenUnlessAddTeamProjectPopVisible() {
      if (!application.addTeamProjectPopVisible()) { return 'hidden'; }
    },

    toggleAddTeamUserPop() {
      application.addTeamUserPopVisible.toggle();
      if (application.addTeamUserPopVisible()) {
        return $('#team-user-search').focus();
      }
    },

    toggleAddTeamProjectPop() {
      application.addTeamProjectPopVisible.toggle();
      if (application.addTeamProjectPopVisible()) {
        return $('#team-project-search').focus();
      }
    },
  };

  application.team.observe(function(newVal) {
    if (newVal) {
      return self.setInitialTeamDescription();
    }
  });

  const content = TeamTemplate(self);

  return LayoutPresenter(application, content);
};
