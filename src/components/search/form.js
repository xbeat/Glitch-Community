import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import TextInput from '../inputs/text-input';
import useDevToggle from '../../presenters/includes/dev-toggles';
import AutocompleteSearch from './autocomplete';

function SearchForm({ defaultValue }) {
  const [value, onChange] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const algoliaFlag = useDevToggle('Algolia Search');

  const onSubmit = (event) => {
    event.preventDefault();
    if (!value) return;
    setSubmitted(true);
  };

  return (
    <form
      action="/search"
      method="get"
      role="search"
      onSubmit={onSubmit}
      autoComplete={algoliaFlag ? 'off' : 'on'}
      onFocus={(e) => setFocused(true)}
      onBlur={(e) => {
        console.log(e, e.target)
      }}
    >
      <TextInput name="q" onChange={onChange} opaque placeholder="bots, apps, users" type="search" value={value} />
      {submitted && <Redirect to={`/search?q=${value}`} push />}
      {focused && algoliaFlag && <AutocompleteSearch query={value} />}
    </form>
  );
}

SearchForm.propTypes = {
  defaultValue: PropTypes.string,
};
SearchForm.defaultProps = {
  defaultValue: '',
};

export default SearchForm;
