import React from 'react';
import PropTypes from 'prop-types';

const styles = {}

const TeamResult = ({ value })

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