import Observable from 'o_0';
import {debounce} from 'lodash';
import assets from '../../utils/assets';

import User from '../../models/user';
import Project from '../../models/project';
import TeamTemplate from '../../templates/pages/team';
import LayoutPresenter from '../layout';
import AnalyticsPresenter from '../analytics';

import Reactlet from "../reactlet";
import EntityPageProjects from "../entity-page-projects.jsx";
import AddTeamProject from "../includes/add-team-project.jsx";
import Observed from "../includes/observed.jsx";
import TeamProfile from "../includes/team-profile.jsx";
import TeamAnalytics from "../includes/team-analytics.jsx"

export default function(application) {
  const assetUtils = assets(application);
  
  var self = {

    application,
    team: application.team,

    TeamProfile() {
      const propsObservable = Observable(() => {
        const team = self.team().asProps();
        const props = {
          ...team,
          style: team.teamProfileStyle,
          currentUserIsOnTeam: self.currentUserIsOnTeam(),
          addUserToTeam: (id) => { self.team().addUser(application, User({id})); },
          avatarStyle: team.teamAvatarStyle,
          removeUserFromTeam: ({id}) => { self.team().removeUser(application, User({id})); },
          search: (query) => User.getSearchResultsJSON(application, query).then(users => users.map(user => User(user).asProps())),
          thanksCount: team.thanksCount,
          updateDescription: self.updateDescription,
          uploadAvatar: self.uploadAvatar,
          uploadCover: self.uploadCover,
        };
        return props;
      });

      return Reactlet(Observed, {propsObservable, component:TeamProfile});
    },

    TeamProjects() {
      const propsObservable = Observable(() => {
        return {
          closeAllPopOvers: application.closeAllPopOvers,
          isAuthorizedUser: self.currentUserIsOnTeam(),
          projectsObservable: application.team().projects,
          pinsObservable: application.team().pins,
          projectOptions: self.projectOptions(),
        };
      });

      return Reactlet(Observed, {propsObservable, component:EntityPageProjects});
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
      const projects = self.team().projects().map(function (project) {
        project = project.asProps()
        project.description = ""
        project.users = []
        return project
      })
      const id = self.team().id()
      const propsObservable = Observable(() => {
        return {
          id: id,
          api: application.api,
          projects: projects,
        }
      });
      if (!propsObservable.id) { return null; }
      return Reactlet(Observed, {propsObservable, component:TeamAnalytics});
    },
    
    //temp
    // teamAnalyticsOld() {
    //   if (self.team().fetched()) {
    //     return AnalyticsPresenter(application, self.team());
    //   }
    // },

    addTeamProjectButton() {
      const propsObservable = Observable(() => {
        return {
          api: application.api,
          teamUsers: application.team().users(),
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
