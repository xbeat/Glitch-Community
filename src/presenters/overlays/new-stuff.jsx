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
        <label className="button button-small">
          <input className="button-checkbox" type="checkbox"
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

class NewStuffOverlayContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewStuff: true,
      newStuffReadId: 0,
    };
  }
  
  componentDidMount() {
    const {getUserPref} = this.props;
    this.setState({
      showNewStuff: getUserPref('showNewStuff') === false ? false : true,
      newStuffReadId: getUserPref('newStuffReadId') || 0,
    });
  }
  
  latestId() {
    return Math.max(...newStuffLog.map(({id}) => id));
  }
  
  markRead() {
    const id = this.latestId();
    this.setState({newStuffReadId: id});
    this.props.setUserPref('newStuffReadId', id);
  }
  
  setShowNewStuff(show) {
    this.setState({showNewStuff: show});
    this.props.setUserPref('showNewStuff', show);
  }
  
  render() {
    const {children, isSignedIn} = this.props;
    const {showNewStuff, newStuffReadId} = this.state;
    
    const showDog = isSignedIn && showNewStuff && (newStuffReadId < this.latestId());
    const RenderOutside = ({visible, setVisible}) => {
      const show = () => {
        setVisible(true);
        this.markRead();
      };
      return <React.Fragment>
        {children(show)}
        {showDog && <NewStuffDog onClick={show}/>}
        {visible && <div className="overlay-background" role="presentation"></div>}
      </React.Fragment>;
    };
    
    const unreadStuff = newStuffLog.filter(({id}) => id > newStuffReadId);
    const setShowNewStuff = this.setShowNewStuff.bind(this);
    return (
      <PopoverContainer outer={RenderOutside}>
        {({visible}) => (visible ? (
          <NewStuffOverlay
            setShowNewStuff={setShowNewStuff} showNewStuff={showNewStuff}
            newStuff={unreadStuff.length ? unreadStuff : newStuffLog}
          />
        ): null)}
      </PopoverContainer>
    );
  }
}
NewStuffOverlayContainer.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired,
};

export default NewStuffOverlayContainer;