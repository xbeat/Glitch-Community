import React from 'react';
import PropTypes from 'prop-types';

import ProjectResultItem from '../includes/project-result-item.jsx';
import PopoverContainer from './popover-container.jsx';

const AllProjectsItem = () => {
  const BENTO_BOX = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png?1502469566743';
  return (
    <li className="result">
      <img className="avatar" src={BENTO_BOX} alt='Bento emoji'/>
      <div className="result-name" title="All Projects">All Projects</div>
    </li>
  );
};



const PopOver = ({projects, action, togglePopover, setFilter, filter}) => {
  const onClick = (project) => {
    togglePopover();
    action(project);
    setFilter("");
  };
  
  const filteredProjects = projects.filter(({name}) => {
    return name.toLowerCase().includes(filter.toLowerCase());
  });
  
  return (
    <dialog className="pop-over analytics-projects-pop">
      <section className="pop-over-info">
        <input
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          onChange={(event) => {setFilter(event.target.value);}} 
          id="analytics-project-filter" 
          className="pop-over-input search-input pop-over-search" 
          placeholder="Filter projects"
          value={filter}
        />
      </section>
      <section className="pop-over-actions results-list">
        <ul className="results">
          <button className="button-unstyled" onClick={() => {onClick({domain: "All Projects"});}}>
            < AllProjectsItem />
          </button>
          { filteredProjects.map((project) => (
            <li key={project.id} className="button-unstyled">
              <ProjectResultItem {...project} action={() => { onClick(project); }} />
            </li>
          ))}
        </ul>
      </section>
    </dialog>
  ); 
};

// PopOver.propTypes = {
//   projects: PropTypes.arrayOf(PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     avatar: PropTypes.string.isRequired,
//     domain: PropTypes.string.isRequired,
//     description: PropTypes.string.isRequired,
//   })).isRequired,
//   action: PropTypes.func.isRequired,
//   togglePopover: PropTypes.func.isRequired,
//   setFilter: PropTypes.func.isRequired,
//   filter: PropTypes.string.isRequired,
// };

class TeamAnalyticsProjectPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {filter: ""};
    this.setFilter = this.setFilter.bind(this);
  }
  
  setFilter(query) {
    this.setState({filter: query});
  }
  
  render() {
    const {updateProjectdomain, currentProjectDomain, projects} = this.props;
    return (
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button-small button-tertiary" onClick={togglePopover}>
              {currentProjectDomain}
            </button>
            {visible && 
              <PopOver 
                projects={projects}
                updateProjectdomain={updateProjectdomain}
                currentProjectDomain={currentProjectDomain}
                togglePopover={togglePopover}
                setFilter={this.setFilter}
                filter={this.state.filter}
              />
            }
          </div>
        )}
      </PopoverContainer>
    );
  }
}

TeamAnalyticsProjectPop.propTypes = {
  updateProjectdomain: PropTypes.func.isRequired,
  currentProjectDomain: PropTypes.string.isRequired,
};

export default TeamAnalyticsProjectPop;
