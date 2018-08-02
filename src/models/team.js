let Team;

const cache = {};
const cacheBuster = Math.floor(Math.random() * 1000);

import Model from './model';
import User from './user';

export default Team = function(I, self) {

  if (I == null) { I = {}; }
  if (self == null) { self = Model(I); }
  if (cache[I.id]) {
    return cache[I.id];
  }
  
  self.defaults(I, {
    id: undefined,
    name: undefined,
    description: "",
    url: undefined,
    backgroundColor: undefined,
    hasCoverImage: undefined,
    coverColor: undefined,
    isCategory: false,
    fetched: false,
    users: [],
    projects: [],
    isVerified: false,
    teamPins: [],
    hasAvatarImage: false,
  }
  );
    
  self.attrObservable(...Array.from(Object.keys(I) || []));
  
  self.attrModels('projects', Project);
  self.attrModels('users', User);
  self.attrObservable("localCoverImage");
  self.attrObservable("localAvatarImage");

  self.extend({
    
    pins: self.teamPins,
  
    coverUrl(size='large') {
      if(self.localCoverImage()) {
        return self.localCoverImage();
      }
      
      if (self.hasCoverImage()) {
        return `https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/team-cover/${self.id()}/${size}?${cacheBuster}`;           
      } 
      return "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625";
    },

    teamAvatarUrl(size) {
      if(self.localAvatarImage()) {
        return self.localAvatarImage();
      }

      size = size || 'small';
      if (self.hasAvatarImage()) {
        return `https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/team-avatar/${self.id()}/${size}?${cacheBuster}`;
      } 
      return "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-team-avatar.svg?1503510366819";
      
    },

    teamProfileStyle() {
      return {
        backgroundColor: self.coverColor(),
        backgroundImage: `url('${self.coverUrl()}')`,
      };
    },

    teamAvatarStyle() {
      if (self.hasAvatarImage()) {
        return {backgroundImage: `url('${self.teamAvatarUrl()}')`};
      }
      return {backgroundColor: self.backgroundColor()};
    },
    
    asProps() {
      return {
        get users() { return self.users().map(({asProps}) => asProps()); },
        get projects() { return self.projects().map(({asProps}) => asProps()); },
        get teamPins() { return self.teamPins(); },
        
        backgroundColor: self.backgroundColor(),
        coverColor: self.coverColor(),
        coverUrlSmall: self.coverUrl('small'),
        coverUrl: self.coverUrl(),
        description: self.description(),
        id: self.id(),
        isVerified: self.isVerified(),
        name: self.name(),
        teamAvatarStyle: self.teamAvatarStyle(),
        teamProfileStyle: self.teamProfileStyle(),
        hasAvatarImage: !!self.hasAvatarImage(),
        hasCoverImage: !!self.hasCoverImage(),
        url: self.url(),
      };
    },
  });

  if (I.id) {
    cache[I.id] = self;
  }
  // console.log '👯 team cache', cache

  return self;
};


Team._cache = cache;


export const getAvatarUrl = ({id, hasAvatarImage, cache=cacheBuster}) => {
  const customImage = `https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/team-avatar/${id}/small?${cache}`;
  const defaultImage = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-team-avatar.svg?1503510366819";
  return hasAvatarImage ? customImage : defaultImage;
};

export const getAvatarStyle = ({id, hasAvatarImage, backgroundColor, cache}) => {
  const image = getAvatarUrl({id, hasAvatarImage, cache});
  if (hasAvatarImage) {
    return {
      backgroundImage: `url('${image}')`,
    };
  }
  return {
    backgroundColor,
    backgroundImage: `url('${image}')`,
  };
};

export const getProfileStyle = ({id, hasCoverImage, coverColor, cache=cacheBuster}) => {
  const customImage = `https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/team-cover/${id}/large?${cache}`;
  const defaultImage = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625";
  return {
    backgroundColor: coverColor,
    backgroundImage: `url('${hasCoverImage ? customImage : defaultImage}')`,
  };
};


// Circular dependencies must go below module.exports
import Project from './project';
