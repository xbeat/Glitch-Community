import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';

// move to a seperate file
// needs api

class AddTeamUserPop extends React.Component {
    constructor(props) {
    super(props);
    
    this.state = {
      teamName: ''
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startSearch = debounce(this.startSearch.bind(this), 300);
    this.onClick = this.onClick.bind(this);
  }

const CreateTeamPop = () => {
  return (
    <dialog className="pop-over user-options-pop">
      <section className="pop-over-actions">
        <p>yoyoyoyo</p>
      </section>
    </dialog>
  )
}

// CreateTeamPop.propTypes = {
//   api: PropTypes.string.isRequired,
//   avatarStyle: PropTypes.object.isRequired,
// };

export default CreateTeamPop;