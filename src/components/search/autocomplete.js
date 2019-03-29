import React from 'react';
import PropTypes from 'prop-types';
import { TeamLink, UserLink, ProjectLink, CollectionLink } from '../../presenters/includes/link';
import { TeamAvatar, UserAvatar } from '../../presenters/includes/avatar';
import ProjectAvatar from '../../presenters/includes/project-avatar';
import CollectionAvatar from '../../presenters/includes/collection-avatar';
import Markdown from '../text/markdown';

const styles = {};

const TeamResult = ({ value: team }) => (
  <TeamLink team={team} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <TeamAvatar hideTooltip team={team} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{team.name}</div>
      <div className={styles.infoSecondary}>@{team.url}</div>
    </div>
    <div className={styles.memberContainer}>TODO: user avatars</div>
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
      <div className={styles.infoPrimary}>{project.name}</div>
      <div className={styles.infoSecondary}>
        <Markdown truncate={20}>{project.description}</Markdown>
      </div>
    </div>
  </ProjectLink>
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
    <div className={styles.memberContainer}>TODO: project avatars</div>
  </CollectionLink>
);

const resultGroups = [
  { id: 'team', label: 'Team Results', Component: TeamResult },
  { id: 'user', label: 'User Results', Component: UserResult },
  { id: 'project', label: 'Project Results', Component: ProjectResult },
  { id: 'collection', label: 'Collection Results', Component: CollectionResult },
];

const AutocompleteResults = ({ query, results }) => {
  const resultsWithItems = resultGroups.map(group => ({ ...group, items: results[group.id] }))
    .filter(group => group.items.length > 0)
  return <ul>
    {resultsWithItems.map(({ id, label, Component, items }) => (
      <li st key={id}>
        <header style={styles.resultGroup}></header>
      </li>
    ))}
  </ul>
  
  
  
};
