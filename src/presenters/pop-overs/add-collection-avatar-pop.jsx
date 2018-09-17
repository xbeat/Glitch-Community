import React from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';


class AddCollectionAvatarPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      avatar: null,
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }
  
  handleChange(evt) {
    const query = evt.currentTarget.value.trim();
    this.setState({ query });
    if (query) {
      {/* TO DO: SEARCH BY URL */}
      this.startSearch();
    } else {
      this.clearSearch();
    }
  }
  
  onClick(project, createPersistentNotification) {
    this.props.togglePopover();
    console.log(`clicked ${project.domain}`);
    
    // show notification
    createPersistentNotification(<p>Added <b><span className="project-name">{project.domain}</span></b></p>, "notifySuccess")
    
  }
  
  render() {
    return (
      <dialog className="pop-over add-collection-project-pop wide-pop">
        <section className="pop-over-info">
          <button className="avatar">
            <img src="https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcomputer.svg"/>
          </button>

        </section>
      </dialog>
    );
  }
}

AddCollectionAvatarPop.propTypes = {
  api: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  togglePopover: PropTypes.array.isRequired,
};

export default AddCollectionAvatarPop;