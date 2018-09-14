/* globals CDN_URL */
const cacheBuster = Math.floor(Math.random() * 1000);

export default function Team({projects, users, ...team}) {
  const props = {
    users: users ? users.map(user => User(user).asProps()) : [],
    projects: projects ? projects.map(project => Project(project).asProps()) : [],
    features: [], //shim until the api returns something real
    ...team
  };
  return {
    update: team => Team(team),
    asProps: () => props,
  };
}

export const getLink = ({url}) => {
  return `/@${url}`;
};

export const getAvatarUrl = ({id, hasAvatarImage, cache=cacheBuster, size='large'}) => {
  const customImage = `${CDN_URL}/team-avatar/${id}/${size}?${cache}`;
  const defaultImage = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-team-avatar.svg?1503510366819";
  return hasAvatarImage ? customImage : defaultImage;
};

export const getAvatarStyle = ({id, hasAvatarImage, backgroundColor, cache, size}) => {
  const image = getAvatarUrl({id, hasAvatarImage, cache, size});
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

export const getCoverUrl = ({id, hasCoverImage, cache=cacheBuster, size='large'}) => {
  const customImage = `${CDN_URL}/team-cover/${id}/${size}?${cache}`;
  const defaultImage = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625";
  return hasCoverImage ? customImage : defaultImage;
};

export const getProfileStyle = ({id, hasCoverImage, coverColor, cache, size}) => {
  const image = getCoverUrl({id, hasCoverImage, cache, size});
  return {
    backgroundColor: coverColor,
    backgroundImage: `url('${image}')`,
  };
};

export const generateUrlForName = (name) => {
  return name.replace(/[^\w]+/g, ' ').trim().replace(/\s+/g, '-').toLowerCase();
};


// Circular dependencies must go below module.exports
import Project from './project';
import User from './user';
