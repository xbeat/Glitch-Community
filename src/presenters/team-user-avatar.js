const TeamUserTemplate = require("../templates/includes/team-user-avatar"); // rename
const Observable = require('o_0');
// const TeamUserOptionsPop = require("../templates/pop-overs/team-user-options-pop");
// const TeamUserOptionsPopPresenter = require('./pop-overs/team-user-options-pop');
import UserInfoPop from './pop-overs/user-info-pop.jsx';

module.exports = function(application, user) {

  var self = { 

    team: application.team,
    userInfoPopVisible: Observable fal
    // teamUserOptionsPopPresenter: TeamUserOptionsPopPresenter(application, user),

    showUserInfoPop(event) {
      application.closeAllPopOvers();
      event.stopPropagation();
      const avatar = $(event.target).closest('.opens-pop-over');
      
      const isOnTeam
      const currentUserIsOnTeam
      const removeUserFromTeam

      const props
      
      // TODO instead of disposable, put the element under the avatar
      return avatar[0].appendChild(TeamUserOptionsPop(self.teamUserOptionsPopPresenter));
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
