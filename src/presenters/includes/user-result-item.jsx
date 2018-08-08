import React from 'react';
import PropTypes from 'prop-types';

import {ANON_AVATAR_URL, getAvatarThumbnailUrl} from '../../models/user';
import {ThanksShort} from './thanks.jsx';

const UserResultItem = ({user, action}) => {
  const {name, login, thanksCount} = user;
  
  const handleClick = (event) => {
    console.log('💣');
    action(event);
  };

  return (
    <button onClick={handleClick} className="button-unstyled result">
      <img className="avatar" src={getAvatarThumbnailUrl(user)} alt={`User avatar for ${login}`}/>
      <div className="result-name" title={name}>{name}</div>
      <div className="result-description" title={login}>@{login}</div>
      {thanksCount > 0 && <ThanksShort count={thanksCount} />}
    </button>
  );
};

UserResultItem.propTypes = {
  user: PropTypes.shape({
    avatarThumbnailUrl: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
  }).isRequired,
  action: PropTypes.func.isRequired,
};


export default UserResultItem;


export class InviteByEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {color: '#7a7'};
  }
  
  render() {
    const style = {backgroundColor: this.state.color};
    return (
      <button onClick={this.props.onClick} className="button-unstyled result">
        <img className="avatar" src={ANON_AVATAR_URL} style={style} alt=""/>
        <div className="result-name">Invite {this.props.email}</div>
      </button>
    );
  }
}

InviteByEmail.propTypes = {
  email: PropTypes.string.isRequired,
};