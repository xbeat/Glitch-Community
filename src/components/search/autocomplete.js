snoc  import React from 'react';
import MaskImage from 'Components/images/mask-image';
import { Link, TeamLink, UserLink, ProjectLink } from '../../presenters/includes/link';
import { TeamAvatar, UserAvatar } from 'Components/images/avatar';
import ProjectAvatar from '../../presenters/includes/project-avatar';
import CollectionAvatar from '../../presenters/includes/collection-avatar';
import { useAlgoliaSearch } from '../../state/search';
import useDebouncedValue from '../../hooks/use-debounced-value';
import styles from './autocomplete.styl';

const StarterKitResult = ({ value: starterKit }) => (
  <a href={starterKit.url} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <MaskImage src={starterKit.imageURL} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{starterKit.name}</div>
      <div className={styles.infoSecondary}>{starterKit.description}</div>
    </div>
  </a>
);

const TeamResult = ({ value: team }) => (
  <TeamLink team={team} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <TeamAvatar hideTooltip team={{ ...team, hasAvatarImage: true }} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{team.name}</div>
      <div className={styles.infoSecondary}>@{team.url}</div>
    </div>
  </TeamLink>
);

const UserResult = ({ value: user }) => (
  <UserLink user={user} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <UserAvatar hideTooltip user={user} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{user.name}</div>
      <div className={styles.infoSecondary}>@{user.login}</div>
    </div>
  </UserLink>
);

const ProjectResult = ({ value: project }) => (
  <ProjectLink project={project} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <ProjectAvatar {...project} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{project.domain}</div>
      <div className={styles.infoSecondary}>{project.description}</div>
    </div>
  </ProjectLink>
);

const CollectionLink = ({ collection, children, ...props }) => (
  <a href={`/@${collection.fullUrl}`} {...props}>
    {children}
  </a>
);

const CollectionResult = ({ value: collection }) => (
  <CollectionLink collection={collection} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <CollectionAvatar {...collection} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{collection.name}</div>
      <div className={styles.infoSecondary}>@{collection.fullUrl}</div>
    </div>
  </CollectionLink>
);

const SeeAllResults = ({ query }) => (
  <Link to={`/search?q=${query}`} className={styles.seeAllResults}>
    See all results →
  </Link>
);

const resultGroups = [
  { id: 'starterKit', label: 'Top Results', Component: StarterKitResult },
  { id: 'team', label: 'Teams', Component: TeamResult },
  { id: 'user', label: 'Users', Component: UserResult },
  { id: 'project', label: 'Projects', Component: ProjectResult },
  { id: 'collection', label: 'Collection Results', Component: CollectionResult },
];

const MAX_RESULTS_PER_TYPE = 3;

export const AutocompleteResults = ({ query, results }) => {
  const resultGroupsWithItems = resultGroups
    .map((group) => ({ ...group, items: results[group.id].slice(0, MAX_RESULTS_PER_TYPE) }))
    .filter((group) => group.items.length > 0);
  return (
    <div className={styles.container}>
      <ul>
        {resultGroupsWithItems.map(({ id, label, Component, items }) => (
          <li key={id}>
            <header className={styles.resultGroupHeader}>{label}</header>
            <ul>
              {items.map((item) => (
                <li key={item.id} className={styles.resultItem}>
                  <Component value={item} />
                </li>
              ))}
            </ul>
          </li>
        ))}
        <li>
          <SeeAllResults query={query} />
        </li>
      </ul>
    </div>
  );
};

const Autocomplete = ({ query }) => {
  const debouncedQuery = useDebouncd
  const results = useAlgoliaSearch(query);
  if (results.totalHits > 0 && results.status === 'ready') {
    return (
      <div className={styles.popOver}>
        <AutocompleteResults query={query} results={results} />
      </div>
    );
  }
  return null;
};

export default Autocomplete;
