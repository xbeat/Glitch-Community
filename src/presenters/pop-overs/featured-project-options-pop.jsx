import React from 'react';
import PropTypes from 'prop-types';
import PopoverContainer from './popover-container.jsx';
import {CurrentUserConsumer} from '../current-user.jsx';
import PopoverButton from './popover-button';

// Project Options Pop
const FeaturedProjectOptionsPop = ({unfeatureProject, featuredProjectId, togglePopover, ...props} ) => {
  
  function animateThenUnfeature(){
    // animation stuff
    const featuredContainer = document.getElementById('featured-project-embed');
    featuredContainer.classList.add('slide-down');
    togglePopover();
    unfeatureProject(featuredProjectId);
  }
   
  return(
    <dialog className="pop-over project-options-pop">
      <section className="pop-over-actions">
        <PopoverButton onClick={animateThenUnfeature} text="Un-feature" emoji="arrow-down"/>
      </section>
    </dialog>
  );
};

FeaturedProjectOptionsPop.propTypes = {
  api: PropTypes.any,
  currentUser: PropTypes.object,
  togglePopover: PropTypes.func.isRequired,
  featureProject: PropTypes.func,
};


// Project Options Container
// create as stateful react component
export default function FeaturedProjectOptions({unfeatureProject, featuredProjectId}, {...props}) {

  return (
    <PopoverContainer>
      {({togglePopover, visible}) => (
        <CurrentUserConsumer>
          {user => (
            <div>
              <button className="project-options button-borderless opens-pop-over" onClick={togglePopover}> 
                <div className="down-arrow" />
              </button>
              { visible && <FeaturedProjectOptionsPop {...props} unfeatureProject={unfeatureProject} featuredProjectId={featuredProjectId} togglePopover={togglePopover}/> }
            </div>
          )}
        </CurrentUserConsumer>
      )}
    </PopoverContainer>     
  );
}

FeaturedProjectOptions.propTypes = {
  api: PropTypes.func.isRequired,
  project: PropTypes.object,
  unfeatureProject: PropTypes.func.isRequired,
};

