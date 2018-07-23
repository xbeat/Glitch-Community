import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from '../pop-overs/popover-container.jsx';

import markdownFactory from 'markdown-it';
import markdownSanitizer from 'markdown-it-sanitizer';
const markdown = markdownFactory({html: true})
  .use(markdownSanitizer);
import Observable from 'o_0';
import OverlayNewStuffTemplate from '../../templates/overlays/new-stuff';
import newStuffLog from '../new-stuff-log';

export function old(application) {
  
  application.overlayNewStuffVisible.observe(function() {
    if (application.overlayNewStuffVisible() === true) {
      self.updateNewStuffRead();
      return self.newStuffNotificationVisible(false);
    }
  });

  var self = {

    newStuffLog: newStuffLog(self),
    
    newStuffNotificationVisible: Observable(false),
    newStuff: Observable([]),
    
    mdToNode(md) {
      const node = document.createElement('span');
      node.innerHTML = markdown.render(md);
      return node;
    },

    visibility() {
      if (!application.overlayNewStuffVisible()) { return "hidden"; }
    },
        
    getUpdates() {
      const MAX_UPDATES = 3;
      const updates = self.newStuffLog.updates();
      const newStuffReadId = application.getUserPref('newStuffReadId');
      const totalUpdates = self.newStuffLog.totalUpdates();
      
      const latestStuff = updates.slice(0, MAX_UPDATES);
      self.newStuff(latestStuff);

      let hasNewStuff = true;
      if (newStuffReadId) {
        const unread = totalUpdates - newStuffReadId;
        const newStuff = updates.slice(0, unread);
        if (unread <= 0) {
          hasNewStuff = false;
        } else {
          self.newStuff(newStuff);
        }
      }
            
      const isSignedIn = application.currentUser().isSignedIn();
      const ignoreNewStuff = application.getUserPref('showNewStuff') === false;
      const visible = isSignedIn && hasNewStuff && !ignoreNewStuff;
      
      return self.newStuffNotificationVisible(visible);
    },


    checked(event) {
      const showNewStuff = application.getUserPref('showNewStuff');
      if ((showNewStuff != null) && (event != null)) {
        return application.updateUserPrefs('showNewStuff', event);
      } else if (showNewStuff != null) {
        return showNewStuff;
      } 
      return application.updateUserPrefs('showNewStuff', true);
      
    },

    updateNewStuffRead() {
      return application.updateUserPrefs('newStuffReadId', self.newStuffLog.totalUpdates());
    },
      
    hiddenUnlessNewStuffNotificationVisible() {
      if (!self.newStuffNotificationVisible()) { return 'hidden'; }
    },
        
    showNewStuffOverlay() {
      return application.overlayNewStuffVisible(true);
    },
  };

  self.getUpdates();
  return OverlayNewStuffTemplate(self);
}

const NewStuffOverlay = () => (
  <dialog className="pop-over overlay new-stuff-overlay overlay-narrow" open>
    hello
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
  
  markRead() {
    
  }
  
  render() {
    
    const RenderOutside = ({visible, setVisible}) => {
      const show = () => {
        setVisible(true);
        this.markRead();
      };
      return <React.Fragment>
        {this.props.children(show)}
        <NewStuffDog onClick={show}/>
        {visible && <div className="overlay-background" role="presentation"></div>}
      </React.Fragment>;
    };
    return (
      <PopoverContainer outer={RenderOutside}>
        {({visible}) => (visible ? <NewStuffOverlay/> : null)}
      </PopoverContainer>
    );
  }
}
NewStuffOverlayContainer.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired,
};

export default NewStuffOverlayContainer;