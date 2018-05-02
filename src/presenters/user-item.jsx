import UserTemplate from '../templates/includes/user-item';

export default function(application, user) {

  var self = {
    application,
    user,

    login() {
      return `@${user.login()}`;
    },

    name() {
      return user.name();
    },

    truncatedDescription() {
      return user.truncatedDescriptionMarkdown();
    },

    coverUrl() {
      return user.coverUrl('small');
    },

    coverColor() {
      return user.coverColor();
    },

    thanks() {
      return user.userThanks();
    },

    userLink() {
      return user.userLink();
    },

    avatarUrl() {
      return user.userAvatarUrl('large');
    },

    hiddenUnlessThanks() {
      if (!(user.thanksCount() > 0)) { return 'hidden'; }
    },
    
    hiddenUnlessDescription() {
      if (!user.description()) { return 'hidden'; }
    },
    
    hiddenUnlessName() {
      if (!user.name()) { return 'hidden'; }
    },

    style() {
      return {
        backgroundImage: `url('${self.coverUrl()}')`,
        backgroundColor: self.coverColor(),
      };
    },
  };

  return UserTemplate(self);
}
