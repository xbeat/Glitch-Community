//temp

import UserInfoPop from './pop-overs/user-info-pop.jsx';
import Reactlet from "./reactlet";
import TeamUserTemplate from '../templates/includes/team-user-avatar';

export default function(application, user) {

  var self = { 

    team: application.team,
    
    //     hiddenUnlessUserInfoPopVisible() {
    //       if (!self.userInfoPopVisible()) {
    //         return 'hidden';
    //       }
    //     },
    
    //     toggleUserInfoPop(event) {
    //       application.closeAllPopOvers();
    //       event.stopPropagation();
    //       self.userInfoPopVisible.toggle();
    //     },

    UserInfoPop() {
      const currentUserIsOnTeam = application.team().currentUserIsOnTeam(application);
      const props = {
        id: user.id(),
        color: user.color(),
        name: user.name(),
        login: user.login(),
        avatar: user.userAvatarUrl('large'),
        link: user.userLink(),
        thanksCount: user.thanksCount(),
        thanksString: user.userThanks(),
        isOnTeam: self.userIsOnTeam(),
        currentUserIsOnTeam: currentUserIsOnTeam,
        removeUserFromTeam: () => application.team().removeUser(application, user),
        // closeAllPopOvers: () => application.closeAllPopOvers()
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
}
