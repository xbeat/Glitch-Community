import React from 'react';

import {getAvatarUrl} from '../../models/project.js';

import {DataLoader} from './includes/loader.jsx';

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

class DeletedProjects extends React.Component {
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
    return (
      <article className="deleted-projects">
        <h2>Deleted Projects <span className="emoji bomb emoji-in-title"></span></h2>
        {this.state.shown ? (
          <DataLoader get={this.props.get}>
            {({data}) => (
              <ul className="deleted-projects-container">
                {data.map(({id, domain}) => (
                  <li key={id} className="deleted-project-container">
                    <DeletedProject
                      id={id} domain={domain}
                      onClick={() => this.props.undelete(id, domain)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </DataLoader>
        ) : (
          <button className="button button-tertiary" onClick={this.clickShow}>Show</button>
        )}
      </article>
    );
  }
}