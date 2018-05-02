const TeamUserTemplate = require("../templates/includes/team-user-avatar"); // rename
const Observable = require('o_0');

// const TeamUserOptionsPop = require("../templates/pop-overs/team-user-options-pop");
// const TeamUserOptionsPopPresenter = require('./pop-overs/team-user-options-pop');

import UserInfoPop from './pop-overs/user-info-pop.jsx';
import Reactlet from "./reactlet";

module.exports = function(application, user) {

  var self = { 

    team: application.team,
    userInfoPopVisible: Observable(false),
    // teamUserOptionsPopPresenter: TeamUserOptionsPopPresenter(application, user),

    hiddenUnlessUserInfoPopVisible() {
      if (!self.userInfoPopVisible()) {
        return 'hidden';
      }
    },
    
    toggleUserInfoPop(event) {
      // application.closeAllPopOvers();
      event.stopPropagation();
      self.userInfoPopVisible.toggle();
      // const avatar = $(event.target).closest('.opens-pop-over');

      // TODO instead of disposable, put the element under the avatar
      // return avatar[0].appendChild(TeamUserOptionsPop(self.teamUserOptionsPopPresenter));
    },
    
    UserInfoPop() {
      const currentUserIsOnTeam = application.team().currentUserIsOnTeam(application);
      const props = {
        id: user.id(),
        color: user.color(),
        name: user.name(),
        login: user.login(),
        avatar: user.userAvatarUrl('large'),
        link: user.userLink(),

        isOnTeam: self.userIsOnTeam(),
        currentUserIsOnTeam: currentUserIsOnTeam,
        removeUser: () => application.team().removeUser(application, user),
      };
      return Reactlet(UserInfoPop, props);
    },
  
    userIsOnTeam() {
      let teamId = self.team().id;
      if (!user.teams()) {
        return false;
      }
      if (user.teams().find(team => {
        team.id === teamId;
      })) {
        return true;
      }
    },
    
    login() {
      return user.login();
    },

    tooltipName() {
      return user.tooltipName();
    },

    style() {
      return {backgroundColor: user.color()};
    },

    avatarUrl() {
      return user.userAvatarUrl('large');
    },

    alt() {
      return user.alt();
    },
  };

  return TeamUserTemplate(self);
};
