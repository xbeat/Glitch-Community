import Observable from 'o_0';
import {debounce} from 'lodash';
import assets from '../../utils/assets';

import UserModel from '../../models/user';
import ProjectModel from '../../models/project';
import TeamTemplate from '../../templates/pages/team';
import LayoutPresenter from '../layout';

import Reactlet from "../reactlet";
import {TeamEntityPageProjects} from "../entity-page-projects.jsx";
import AddTeamProject from "../includes/add-team-project.jsx";
import Observed from "../includes/observed.jsx";
import {TeamProfile} from "../includes/profile.jsx";
import TeamAnalytics from "../includes/team-analytics.jsx";
import TeamMarketing from "../includes/team-marketing.jsx";

export default function(application) {
  const assetUtils = assets(application);
  
  var self = {

    application,
    team: application.team,

    TeamProfile() {
      const propsObservable = Observable(() => {
        const team = self.team().asProps();
        const props = {
          team,
          fetched: self.team().fetched(),
          userFetched: application.currentUser().fetched(),
          currentUserIsOnTeam: self.currentUserIsOnTeam(),
          addUserToTeam: (id) => { self.team().addUser(application, UserModel({id})); },
          removeUserFromTeam: ({id}) => { self.team().removeUser(application, UserModel({id})); },
          search: (query) => UserModel.getSearchResultsJSON(application, query).then(users => users.map(user => UserModel(user).asProps())),
          updateDescription: self.updateDescription,
          uploadAvatar: self.uploadAvatar,
          uploadCover: self.uploadCover,
          clearCover: self.clearCover,
        };
        return props;
      });

      return Reactlet(Observed, {propsObservable, component:TeamProfile}, 'team-profile');
    },

    TeamProjects() {
      const propsObservable = Observable(() => {
        const projects = self.team().projects().map(function (project) {
          let {...projectProps} = project.asProps();
          return projectProps;
        });

        return {
          closeAllPopOvers: application.closeAllPopOvers,
          isAuthorizedUser: self.currentUserIsOnTeam(),
          projects: projects,
          pins: application.team().pins(),
          projectOptions: self.projectOptions(),
        };
      });

      return Reactlet(Observed, {propsObservable, component:TeamEntityPageProjects});
    },

    projectOptions() {
      if(!self.currentUserIsOnTeam()) {
        return {};
      }

      return {
        removeProjectFromTeam: self.removeProjectFromTeam,
        togglePinnedState: self.togglePinnedState,
      };
    },

    teamAnalytics() {
      const propsObservable = Observable(() => {
        const projects = self.team().projects().map(function (project) {
          let {...projectProps} = project.asProps();
          projectProps.description = "";
          projectProps.users = [];
          return projectProps;
        });
        const id = self.team().id();

        return {
          id: id,
          api: application.api,
          projects: projects,
          currentUserOnTeam: self.currentUserIsOnTeam(),
        };
      });
      return Reactlet(Observed, {propsObservable, component:TeamAnalytics});
    },

    teamMarketing() {
      const propsObservable = Observable(() => {
        return {
          currentUserIsOnTeam: self.currentUserIsOnTeam(),
        };
      });
      return Reactlet(Observed, {propsObservable, component:TeamMarketing});
    },

    addTeamProjectButton() {
      const propsObservable = Observable(() => {
        return {
          myProjects: application.currentUser().projects().map(({asProps})=>asProps()),
          teamProjects: self.team().projects().map(({asProps})=>asProps()),
          teamUsers: self.team().users(),
          currentUserIsOnTeam: self.currentUserIsOnTeam(),
          addProject: (id) => {
            application.team().addProject(application, id);
          },
        };
      });
      return Reactlet(Observed, {propsObservable, component:AddTeamProject});
    },

    currentUserIsOnTeam() {
      return application.team().currentUserIsOnTeam(application);
    },

    hiddenUnlessCurrentUserIsOnTeam() {
      if (!self.currentUserIsOnTeam()) { return 'hidden'; }
    },

    updateDescription(text) {
      application.team().description(text);
      return self.updateTeam({description: text});
    },

    updateTeam: debounce(data => application.team().updateTeam(application, data)
      , 250),

    clearCover: () => assetUtils.updateHasCoverImage(false),

    uploadCover: assetUtils.uploadCoverFile,
    uploadAvatar: assetUtils.uploadAvatarFile,

    togglePinnedState(projectId) {
      const action = ProjectModel.isPinnedByTeam(application.team(), projectId) ? "removePin" : "addPin";
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
