import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';

import ProjectModel from '../../models/project';
import UserModel from '../../models/user';

import Loader from '../includes/loader.jsx';
import ProjectResultItem from '../includes/project-result-item.jsx';
import UserResultItem from '../includes/user-result-item.jsx';

class EditColorColorPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      color: null
    };
    
    this.onClick = this.onClick.bind(this);
  }
  
  onClick() {
    this.props.togglePopover();
    {/* TO DO - apply color change here*/}
  }
  
  render() {
    const isLoading = (!!this.state.maybeRequest || !this.state.maybeResults);
    return (
      <dialog className="pop-over add-collection-project-pop">
        <section className="pop-over-info">
          <input id="team-user-search" 
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            value={this.state.query} onChange={this.handleChange}
            className="pop-over-input search-input pop-over-search"
            placeholder="Search by project name or URL"
          />
        </section>
        {!!this.state.query && <section className="pop-over-actions last-section results-list">
          {isLoading && <Loader />}
          {!!this.state.maybeResults && <ProjectSearchResults projects={this.state.maybeResults} action={this.onClick} />}
        </section>}
      </dialog>
    );
  }
}

EditColorColorPop.propTypes = {
  api: PropTypes.func.isRequired,
  collectionID: PropTypes.number.isRequired
};

export default EditColorColorPop;