const TeamUserTemplate = require("../templates/includes/team-user-avatar"); // rename
const Observable = require('o_0');
// const TeamUserOptionsPop = require("../templates/pop-overs/team-user-options-pop");
// const TeamUserOptionsPopPresenter = require('./pop-overs/team-user-options-pop');
import UserInfoPop from './pop-overs/user-info-pop.jsx';

module.exports = function(application, user) {

  var self = { 

    team: application.team,
    userInfoPopVisible: Observable(false),
    // teamUserOptionsPopPresenter: TeamUserOptionsPopPresenter(application, user),

    toggleUserInfoPop(event) {
      application.closeAllPopOvers();
      event.stopPropagation();
      userInfoPopVisible.toggle()
      // const avatar = $(event.target).closest('.opens-pop-over');

      // TODO instead of disposable, put the element under the avatar
      // return avatar[0].appendChild(TeamUserOptionsPop(self.teamUserOptionsPopPresenter));
    },
    
    UserInfoPop() {
      const isOnTeam
      const currentUserIsOnTeam
      const removeUserFromTeam

      const props = {
        user: user.asProps(),
        currentUserIsOnTeam: application.team().currentUserIsOnTeam(application),
        
      }
      return reactet
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
