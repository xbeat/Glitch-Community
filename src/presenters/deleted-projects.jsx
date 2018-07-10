import React from 'react';
import PropTypes from 'prop-types';

import {getAvatarUrl} from '../models/project.js';

import {DataLoader} from './includes/loader.jsx';

/* globals Set */

function clickUndelete(event, callback) {
  const node = event.target.closest('li');
  node.addEventListener('animationend', callback, {once: true});
  node.classList.add('slide-up');
}

const DeletedProject = ({id, domain, onClick}) => (
  <button className="button-unstyled" onClick={evt => clickUndelete(evt, onClick)}>
    <div className="deleted-project">
      <img className="avatar" src={getAvatarUrl(id)} alt=""/>
      <div className="deleted-project-name">{domain}</div>
      <div className="button button-small">Undelete</div>
    </div>
  </button>
);
DeletedProject.propTypes = {
  id: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const DeletedProjectsList = ({deletedProjects, undelete}) => (
  <ul className="deleted-projects-container">
    {deletedProjects.map(({id, domain}) => (
      <li key={id} className="deleted-project-container">
        <DeletedProject
          id={id} domain={domain}
          onClick={() => undelete(id)}
        />
      </li>
    ))}
  </ul>
);
DeletedProjectsList.propTypes = {
  deletedProjects: PropTypes.array.isRequired,
  undelete: PropTypes.func.isRequired,
};

export default class DeletedProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false,
      loaded: false,
    };
    this.clickShow = this.clickShow.bind(this);
  }
  
  async clickShow() {
    this.setState({shown: true});
    try {
      const {data} = await this.props.get();
      this.props.setDeletedProjects(data);
      this.setState({loaded: true});
    } catch (e) {
      this.setState({shown: false});
    }
  }
  
  render() {
    const {
      deletedProjects,
      undelete,
    } = this.props;
    return (
      <article className="deleted-projects">
        <h2>Deleted Projects <span className="emoji bomb emoji-in-title"></span></h2>
        {this.state.shown ? (
          <DataLoader get={this.props.get}>
            {({data}) => (
              <DeletedProjectsList deletedProjects={deletedProjects} undelete={undelete}/>
            )}
          </DataLoader>
        ) : (
          <button className="button button-tertiary" onClick={this.clickShow}>Show</button>
        )}
      </article>
    );
  }
}
DeletedProjects.propTypes = {
  get: PropTypes.func.isRequired,
  setDeletedProjects: PropTypes.func.isRequired,
  deletedProjects: PropTypes.array.isRequired,
};