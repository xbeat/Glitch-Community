import React, { useState } from 'react';
import { Link, TeamLink, UserLink, ProjectLink, CollectionLink } from '../../presenters/includes/link';

function SearchForm({ defaultValue }) {
  const [value, onChange] = useState(defaultValue);
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event) => {
    event.preventDefault();
    if (!value) return;
    setSubmitted(true);
  };

  return (
    <form action="/search" method="get" role="search" onSubmit={onSubmit}>
      <TextInput className="header-search" name="q" onChange={onChange} opaque placeholder="bots, apps, users" type="search" value={value} />
      {submitted && <Redirect to={`/search?q=${value}`} push />}
    </form>
  );
}
