import React from 'react';
import PropTypes from 'prop-types';

import Markdown from '../includes/markdown.jsx';
import PopoverContainer from '../pop-overs/popover-container.jsx';
import UserPref from '../includes/user-pref.jsx';

import newStuffLog from '../../curated/new-stuff-log';
const latestId = Math.max(...newStuffLog.map(({id}) => id));

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
NewStuffOverlay.propTypes = {
  setShowNewStuff: PropTypes.func.isRequired,
  showNewStuff: PropTypes.bool.isRequired,
  newStuff: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    link: PropTypes.string,
  }).isRequired).isRequired,
};

const NewStuffDog = ({onClick}) => (
  <div className="new-stuff-footer">
    <button className="button-unstyled new-stuff opens-pop-over" onClick={onClick}>
      <figure className="new-stuff-avatar" data-tooltip="New" data-tooltip-top="true" data-tooltip-persistent="true" alt="New Stuff"/>
    </button>
  </div>
);
NewStuffDog.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const Outer = ({children, visible, showPopup, dogVisible}) => {
  return (
    <React.Fragment>
      {children(showPopup)}
      {dogVisible && <NewStuffDog onClick={showPopup}/>}
      {visible && <div className="overlay-background" role="presentation"></div>}
    </React.Fragment>
  );
};

class NewStuff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      log: newStuffLog,
    };
  }
  
  showPopup(setVisible) {
    setVisible(true);
    const unreadStuff = newStuffLog.filter(({id}) => id > this.props.newStuffReadId);
    this.setState({
      log: unreadStuff.length ? unreadStuff : newStuffLog,
    });
    this.props.setNewStuffReadId(latestId);
  }
  
  render() {
    const {children, isSignedIn, showNewStuff, newStuffReadId} = this.props;
    const dogVisible = isSignedIn && showNewStuff && (newStuffReadId < latestId);
    return (
      <PopoverContainer outer={({visible, setVisible}) => <Outer {...{visible, dogVisible}} showPopup={this>{children}</Outer>}>
        {({visible}) => (visible ? (
          <NewStuffOverlay {...this.props} newStuff={this.state.log}/>
        ) : null)}
      </PopoverContainer>
    );
  }
}
NewStuff.propTypes = {
  children: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  showNewStuff: PropTypes.bool.isRequired,
  newStuffReadId: PropTypes.number.isRequired,
  setNewStuffReadId: PropTypes.func.isRequired,
};

const NewStuffContainer = ({children, isSignedIn, getUserPref, setUserPref}) => (
  <UserPref name="showNewStuff" default={true} {...{getUserPref, setUserPref}}>
    {(showNewStuff, setShowNewStuff) => (
      <UserPref name="newStuffReadId" default={0} {...{getUserPref, setUserPref}}>
        {(newStuffReadId, setNewStuffReadId) => (
          <NewStuff {...{isSignedIn, showNewStuff, newStuffReadId, setShowNewStuff, setNewStuffReadId}}>
            {children}
          </NewStuff>
        )}
      </UserPref>
    )}
  </UserPref>
);
NewStuffContainer.propTypes = {
  children: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  getUserPref: PropTypes.func.isRequired,
  setUserPref: PropTypes.func.isRequired,
};

export default NewStuffContainer;