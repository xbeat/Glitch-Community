import React from 'react';
import PropTypes from 'prop-types';
import { TeamLink } from '..

const styles = {}

const TeamResult = ({ value: team }) => (
  <TeamLink team={team} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <img className={styles.rectAvatar} src={getAvatarUrl(team)} alt="" />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{team.name}</div>
      <div className={styles.infoSecondary}>@{team.url}</div>
    </div>
    <div className={styles.memberContainer}>
      TODO: avatars
    </div>
  </TeamLink>
)



const resultGroups = [
  { id: 'team', label: 'Team Results', Component: TeamResult },
  { id: 'user', label: 'User Results',  },
  { id: 'project', label: 'Project Results' },
  { id: 'collection', label: 'Collection Results' },
]

const AutocompleteResults = ({ query, results }) => {
  const { status, totalHits } = results
  if (status === 'loading') {
    return <Loading />
  }

}