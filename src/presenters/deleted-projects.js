// deleted projects is a little strange
// it loads the projects from the api, but expects them to be stored elsewhere
// so it takes an initially empty list of projects and a function to fill it once they load

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getAvatarUrl } from '../models/project';
import { TrackClick } from './analytics';
import { Loader } from './includes/loader';

import { useAPI } from '../state/api';
import Heading from '../components/text/heading';

function clickUndelete(event, callback) {
  const node = event.target.closest('li');
  node.addEventListener('animationend', callback, { once: true });
  node.classList.add('slide-up');
}

const DeletedProject = ({ id, domain, onClick }) => (
  <TrackClick name="Undelete clicked">
    <button className="button-unstyled" onClick={(evt) => clickUndelete(evt, onClick)}>
      <div className="deleted-project">
        <img className="avatar" src={getAvatarUrl(id)} alt="" />
        <div className="deleted-project-name">{domain}</div>
        <div className="button button-small">Undelete</div>
      </div>
    </button>
  </TrackClick>
);
DeletedProject.propTypes = {
  id: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const DeletedProjectsList = ({ deletedProjects, undelete }) => (
  <ul className="deleted-projects-container">
    {deletedProjects.map(({ id, domain }) => (
      <li key={id} className="deleted-project-container">
        <DeletedProject id={id} domain={domain} onClick={() => undelete(id)} />
      </li>
    ))}
  </ul>
);
DeletedProjectsList.propTypes = {
  deletedProjects: PropTypes.array.isRequired,
  undelete: PropTypes.func.isRequired,
};

// states: init (!loaded, !shown) | loading (!loaded, shown) | ready (loaded, shown)

function DeletedProjects ({ deletedProjects, setDeletedProjects }) {
  const api = useAPI();
  // hidden | loading | ready
  const [state, setState] = useState('hidden')
  const clickShow = async () => {
    setState('loading')
    try {
      const { data } = await api.get('user/deleted-projects');
      setDeletedProjects(data);
      setState('ready');
    } catch (e) {
      setState('hidden');
    }
  }
  const clickHide = () => {
    setState('hidden')
  }
  
   if (!this.state.shown) {
      return (
        <button className="button button-tertiary" onClick={this.clickShow}>
          Show
        </button>
      );
    }
    if (!this.state.loaded) {
      return <Loader />;
    }
    if (!this.props.deletedProjects.length) {
      return 'nothing found';
    }
    return (
      <>
        <DeletedProjectsList {...this.props} />
        <button className="button button-tertiary" onClick={this.clickHide}>
          Hide Deleted Projects
        </button>
      </>
    );
  }
}

DeletedProjects.propTypes = {
  deletedProjects: PropTypes.array,
  setDeletedProjects: PropTypes.func.isRequired,
};

DeletedProjects.defaultProps = {
  deletedProjects: [],
};


const DeletedProjectsWrap = (props) => (
  <article className="deleted-projects">
    <Heading tagName="h2">
      Deleted Projects <span className="emoji bomb emoji-in-title" />
    </Heading>
    <DeletedProjects {...props} />
  </article>
)

export default DeletedProjectsWrap; 