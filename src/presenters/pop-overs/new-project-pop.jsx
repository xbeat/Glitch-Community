import React from 'react';
import PropTypes from 'prop-types';
import ProjectResultItem from '../includes/project-result-item.jsx';
import PopoverContainer from './popover-container.jsx';

const NewProjectPop = ({newProjects}) => (
  <div className="pop-over new-project-pop">
    <section className="pop-over-actions results-list">
      <div className="results">
        { newProjects.map((project) => (
          <a key={project.id} href={project.link}>
            <ProjectResultItem {...project}/>
          </a>
        ))}
      </div>
    </section>
  </div>
);

NewProjectPop.propTypes = {
  newProjects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  })).isRequired,
};

class NewProjectPopContainer extends React.Component {
  constuctor(props) {
    super(props);
  }
  
  componentDidMount() {
    //todo: move into new-project-pop
    const NewProjectPopContainer = ({api}) => {
      const projectIds = [
        'a0fcd798-9ddf-42e5-8205-17158d4bf5bb', // 'hello-express'
        'cb519589-591c-474f-8986-a513f22dbf88', // 'hello-sqlite'
        '929980a8-32fc-4ae7-a66f-dddb3ae4912c', // 'hello-webpage'
      ];
      const projects = this.props.getProjectsByIds(projectIds);
      const fetchedProjects = projects.filter(project => project.fetched());
      const newProjects = fetchedProjects.map((project) => {
      const props = project.asProps();

        //Deliberately hide the user list 
        props.users = [];
        return props;
      });

      return <NewProjectPop newProjects={newProjects}/>
    }
  }
  
  render() {
    const props = this.props;
    return (
      <PopoverContainer>
        {({visible, togglePopover}) => (
          <div className="button-wrap">
            <button className="button-small" data-track="open new-project pop" onClick={togglePopover}>New Project</button>
            {visible && <NewProjectPop {...props}/>}
          </div>
        )}
      </PopoverContainer>
    );
  }
}

export default NewProjectPopContainer;
