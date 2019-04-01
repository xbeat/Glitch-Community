import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import TextInput from '../inputs/text-input';
import useDevToggle from '../../presenters/includes/dev-toggles';
import PopoverContainer from '../../presenters/pop-overs/popover-container';
import AutocompleteSearch from './autocomplete';

function SearchForm({ defaultValue }) {
  const [value, onChange] = useState(defaultValue);
  const [submitted, setSubmitted] = useState(false);
  const algoliaFlag = useDevToggle('Algolia Search');

  const onSubmit = (event) => {
    event.preventDefault();
    if (!value) return;
    setSubmitted(true);
  };

  return (
    <PopoverContainer>
      {({ visible, setVisible }) => (
        <form
          action="/search"
          method="get"
          role="search"
          onSubmit={onSubmit}
          autoComplete={algoliaFlag ? 'off' : 'on'}
          autoCapitalize="off"
          onFocus={() => setVisible(true)}
        >
          <TextInput name="q" onChange={onChange} opaque placeholder="bots, apps, users" type="search" value={value} />
          {submitted && <Redirect to={`/search?q=${value}`} push />}
          {algoliaFlag && visible && <AutocompleteSearch query={value} />}
        </form>
      )}
    </PopoverContainer>
  );
}

SearchForm.propTypes = {
  defaultValue: PropTypes.string,
};
SearchForm.defaultProps = {
  defaultValue: '',
};

export default SearchForm;
