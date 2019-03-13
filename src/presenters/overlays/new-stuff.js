import React from 'react';
import PropTypes from 'prop-types';

import { Link } from '../includes/link';
import Markdown from '../includes/markdown';
import PopoverContainer from '../pop-overs/popover-container';
import useUserPref from '../includes/user-prefs';
import TooltipContainer from '../../components/tooltips/tooltip-container';

import newStuffLog from '../../curated/new-stuff-log';

const latestId = Math.max(...newStuffLog.map(({ id }) => id));

const NewStuffOverlay = ({ setShowNewStuff, showNewStuff, newStuff }) => (
  <dialog className="pop-over overlay new-stuff-overlay overlay-narrow" open>
    <section className="pop-over-info">
      <figure className="new-stuff-avatar" />
      <div className="overlay-title">New Stuff</div>
      <div>
        <label className="button button-small" htmlFor="showNewStuff">
          <input
            id="showNewStuff"
            className="button-checkbox"
            type="checkbox"
            checked={showNewStuff}
            onChange={(evt) => setShowNewStuff(evt.target.checked)}
          />
          Keep showing me these
        </label>
      </div>
    </section>
    <section className="pop-over-actions">
      {newStuff.map(({ id, title, body, link }) => (
        <article key={id}>
          <div className="title">{title}</div>
          <div className="body">
            <Markdown>{body}</Markdown>
          </div>
          {!!link && (
            <p>
              <Link className="link" to={link}>
                Read the blog post →
              </Link>
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
  newStuff: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      link: PropTypes.string,
    }).isRequired,
  ).isRequired,
};

class NewStuff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      log: newStuffLog,
    };
  }

  showNewStuff(setVisible) {
    setVisible(true);
    const unreadStuff = newStuffLog.filter(({ id }) => id > this.props.newStuffReadId);
    this.setState({ log: unreadStuff.length ? unreadStuff : newStuffLog });
    this.props.setNewStuffReadId(latestId);
  }

  renderOuter({ visible, setVisible }) {
    const { children, isSignedIn, showNewStuff, newStuffReadId } = this.props;
    const dogVisible = isSignedIn && showNewStuff && newStuffReadId < latestId;
    const show = () => {
      if (window.analytics) {
        window.analytics.track('Pupdate');
      }
      this.showNewStuff(setVisible);
    };
    return (
      <>
        {children(show)}
        {dogVisible && (
          <div className="new-stuff-footer">
            <TooltipContainer
              id="new-stuff-tooltip"
              type="info"
              target={(
                <button className="button-unstyled new-stuff" onClick={show}>
                  <figure className="new-stuff-avatar" alt="New Stuff" />
                </button>
              )}
              tooltip="New"
              persistent
              align={['top']}
            />
          </div>
        )}
        {visible && <div className="overlay-background" role="presentation" />}
      </>
    );
  }

  render() {
    return (
      <PopoverContainer outer={this.renderOuter.bind(this)}>
        {({ visible }) => (visible ? <NewStuffOverlay {...this.props} newStuff={this.state.log} /> : null)}
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

const NewStuffContainer = ({ children, isSignedIn }) => {
  const [showNewStuff, setShowNewStuff] = useUserPref('showNewStuff', true);
  const [newStuffReadId, setNewStuffReadId] = useUserPref('newStuffReadId', 0);
  return (
    <NewStuff
      {...{
        isSignedIn,
        showNewStuff,
        newStuffReadId,
        setShowNewStuff,
        setNewStuffReadId,
      }}
    >
      {children}
    </NewStuff>
  );
};
NewStuffContainer.propTypes = {
  children: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
};

export default NewStuffContainer;
