import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import {debounce} from 'lodash';

export const TeamMarketing = () => {
  const forPlatformsIcon = 'https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188';
  return (
    <section className="team-marketing">
      <p>
        <img className="for-platforms-icon" src={forPlatformsIcon} alt="fishing emoji"></img>
        <span>Want your own team page, complete with detailed app analytics?</span>
      </p>
      <a href="https://glitch.com/forteams">
        <button className="button has-emoji">
          About Teams 
          <span className="emoji fishing_pole" role="img" aria-label="emoji" />
        </button>
      </a>
    </section>
  );
};

export const VerifiedBadge = () => {
  const image = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fverified.svg?1501783108220';
  const tooltip = 'Verified to be supportive, helpful people';
  return (
    <span data-tooltip={tooltip}>
      <img className="verified" src={image} alt={tooltip}/>
    </span>
  );
};

export class WhitelistedDomainIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {src: null};
  }
  
  domain() {
    return this.props.domain.replace(/^@/, '');
  }
  
  async load() {
    let data = {
      domain: this.domain(),
      icons: []
    };
    try {
      // Do not use the normal api here, we don't want to send our auth around
      ({data} = await axios.get(`https://favicongrabber.com/api/grab/${this.domain()}`));
    } catch (error) {
      // The api returns an error when the domain doesn't exist, so ignore it
    }
    if (data.domain === this.domain()) {
      if (data.icons.length) {
        this.setState({src: data.icons[0].src});
      } else {
        this.setState({src: null});
      }
    }
  }
  
  componentDidMount() {
    this.load();
    this.load = debounce(this.load.bind(this), 500);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.domain !== this.props.domain) {
      this.load();
    }
  }
  
  componentWillUnmount() {
    this.load.cancel();
  }
  
  render() {
    const domain = this.domain();
    if (this.state.src) {
      return (
        <img
          className="whitelisted-domain"
          alt={domain}
          src={this.state.src}
          onError={() => this.setState({src: null})}
        />
      );
    }
    return (
      <div className="whitelisted-domain" aria-label={domain}>
        {domain[0].toUpperCase()}
      </div>
    );
  }
}

//temp
export const AdminOnlyBadge = ({...props}) => {
  return (
    <React.Fragment>
      { (props.currentUserIsTeamAdmin === false) && 
        <div className="status-badge">
          <span className="status admin">Admin</span>
        </div> 
      }
    </React.Fragment>
  );
};

AdminOnlyBadge.propTypes = {
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
};
