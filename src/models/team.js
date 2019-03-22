/* globals CDN_URL */
const cacheBuster = Math.floor(Math.random() * 1000);

export const DEFAULT_TEAM_AVATAR = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-team-avatar.svg?1503510366819';

export const getLink = ({ url }) => `/@${url}`;

export const getAvatarUrl = ({ id, hasAvatarImage, cache = cacheBuster, size = 'large' }) => {
  const customImage = `${CDN_URL}/team-avatar/${id}/${size}?${cache}`;
  return hasAvatarImage ? customImage : DEFAULT_TEAM_AVATAR;
};

export const getAvatarStyle = ({ id, hasAvatarImage, backgroundColor, cache, size }) => {
  const image = getAvatarUrl({
    id,
    hasAvatarImage,
    cache,
    size,
  });
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


