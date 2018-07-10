import React from 'react';

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

function normalizeProjects(userProjects, userDeleted, netDeleted) {
  // userProjects and userDeleted change on delete/undelete
  // netDeleted is loaded once then stays the same
  // so use the three to suss out what's actually deleted
  const userSet = new Set(userProjects.concat(userDeleted).map(({id}) => id));
  const stillDeleted = netDeleted.filter(({id}) => !userSet.has(id));
  return userDeleted.concat(stillDeleted);
}

export default class DeletedProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false,
    };
    this.clickShow = this.clickShow.bind(this);
  }
  
  clickShow() {
    this.setState({shown: true});
  }
  
  render() {
    const {
      projects,
      deletedProjects,
      undelete,
    } = this.props;
    return (
      <article className="deleted-projects">
        <h2>Deleted Projects <span className="emoji bomb emoji-in-title"></span></h2>
        {this.state.shown ? (
          <DataLoader get={this.props.get}>
            {({data}) => (
              <DeletedProjectsList deletedProjects={normalizeProjects(projects, deletedProjects, data)} undelete={undelete}/>
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
};