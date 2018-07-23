import React from 'react';
import PropTypes from 'prop-types';

import Markdown from '../includes/markdown.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';

import newStuffLog from '../../curated/new-stuff-log';

const NewStuffOverlay = ({setShowNewStuff, showNewStuff, newStuff}) => (
  <dialog className="pop-over overlay new-stuff-overlay overlay-narrow" open>
    <section className="pop-over-info">
      <figure className="new-stuff-avatar"/>
      <div className="overlay-title">New Stuff</div>
      <div>
        <label className="button button-small" htmlFor="showNewStuff">
          <input id="showNewStuff" className="button-checkbox" type="checkbox"
            checked={showNewStuff} onChange={evt => setShowNewStuff(evt.target.checked)}
          />
          Keep showing me these
        </label>
      </div>
    </section>
    <section className="pop-over-actions">
      {newStuff.map(({id, title, body, link}) => (
        <article key={id}>
          <div className="title">{title}</div>
          <div className="body"><Markdown>{body}</Markdown></div>
          {!!link && (
            <p>
              <a className="link" href={link}>
                Read the blog post →
              </a>
            </p>
          )}
        </article>
      ))}
    </section>
  </dialog>
);

const NewStuffDog = ({onClick}) => (
  <div className="new-stuff-footer">
    <button className="button-unstyled new-stuff opens-pop-over" onClick={onClick}>
      <figure className="new-stuff-avatar" data-tooltip="New" data-tooltip-top="true" data-tooltip-persistent="true" alt="New Stuff"/>
    </button>
  </div>
);

class UserPref extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.default,
    };
    this.handleStorage = this.handleStorage.bind(this);
  }
  
  handleStorage() {
    const value = this.props.getUserPref(this.props.name);
    this.setState({
      value: value !== undefined ? value : this.props.default,
    });
  }
  
  componentDidMount() {
    this.handleStorage();
    window.addEventListener('storage', this.handleStorage, {passive: true});
  }
  
  componentWillUnmount() {
    window.removeEventListener('storage', this.handleStorage, {passive: true});
  }
  
  set(value) {
    this.setState({value});
    this.props.setUserPref(this.props.name, value);
  }
  
  render() {
    return this.props.children(this.state.value, this.set.bind(this));
  }
}

const latestId = Math.max(...newStuffLog.map(({id}) => id));

const NewStuffOverlayContainer = ({children, isSignedIn, showNewStuff, newStuffReadId, setShowNewStuff, setNewStuffReadId}) => {
  const showDog = isSignedIn && showNewStuff && (newStuffReadId < latestId);
  const RenderOuter = ({visible, setVisible}) => {
    const show = () => {
      setVisible(true);
      setNewStuffReadId(latestId);
    };
    return <React.Fragment>
      {children(show)}
      {showDog && <NewStuffDog onClick={show}/>}
      {visible && <div className="overlay-background" role="presentation"></div>}
    </React.Fragment>;
  };
  
  const RenderInner = ({visible}) => (visible ? (
    <NewStuffOverlay
      setShowNewStuff={setShowNewStuff} showNewStuff={showNewStuff}
      newStuff={unreadStuff.length ? unreadStuff : newStuffLog}
    />
  ): null);

  const unreadStuff = newStuffLog.filter(({id}) => id > newStuffReadId);
  return <PopoverContainer outer={RenderOuter}>{RenderInner}</PopoverContainer>;
};

const NewStuffContainer = ({children, getUserPref, setUserPref}) => (
  <UserPref name="showNewStuff" default={true} {...{getUserPref, setUserPref}}>
    {(showNewStuff, setShowNewStuff) => (
      <UserPref name="newStuffReadId" default={0} {...{getUserPref, setUserPref}}>
        {(newStuffReadId, setNewStuffReadId) => (
          <NewStuffOverlayContainer {...{showNewStuff, newStuffReadId, setShowNewStuff, setNewStuffReadId}}>
            {children}
          </NewStuffOverlayContainer>
        )}
      </UserPref>
    )}
  </UserPref>
);
NewStuffContainer.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NewStuffContainer;