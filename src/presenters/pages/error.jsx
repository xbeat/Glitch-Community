import React from 'react';
import PropTypes from 'prop-types';

import {Helmet} from 'react-helmet';
import Layout from '../layout';

const logo = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fcarp.svg";

const drawStar = (canvas, context, color) => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  context.fillStyle = color;
  context.fillRect(x, y, 2, 2);
};

class Stars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
    this.canvas = React.createRef();
    this.handleResize = this.handleResize.bind(this);
    this.interval = null;
  }
  
  componentDidUpdate(prevProps, prevState) {
    const {width, height} = this.state;
    if(width === prevState.width && height === prevState.height) {
      return;
    }
    
    const initialStars = Math.round((width * height) / 15000);
    let additionalStars = Math.round((width * height) / 3500);
    const context = this.canvas.current.getContext('2d');
    
    for (let i = 0; i < initialStars; ++i) {
      drawStar(this.canvas.current, context, 'white');
    }
    
    window.clearInterval(this.interval);
    this.interval = window.setInterval(() => {
      drawStar(this.canvas.current, context, '#CB82C0');
      if ( --additionalStars <= 0) {
        window.clearInterval(this.interval);
      }
    }, 100);
  }
  
  handleResize() {
    const width = Math.max(window.innerWidth, screen.width);
    const height = Math.max(window.innerHeight, screen.height);
    if (width > this.state.width || height > this.state.height) {
      this.setState({width, height});
    }
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.clearInterval(this.interval);
    this.interval = null;
  }
  
  render() {
    return <canvas id="stars" {...this.state} ref={this.canvas}/>;
  }
}

const ErrorPage = ({title, description}) => (
  <div className="content error-page">
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <div className="container">
      <h1>{title}</h1>
      <h2>{description}</h2>
      <div className="actions">
        <a href="/"> {/* This is not a Link so it does a full reload */}
          <img src={logo} width="80px" height="66px" alt="Glitch"/>
        </a>
      </div>
      <Stars/>
    </div>
  </div>
);
ErrorPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default ErrorPage;



const telescopeImageUrl = 'https://cdn.glitch.com/7138972f-76e1-43f4-8ede-84c3cdd4b40a%2Ftelescope_404.svg?1543258683849';

const NotFoundPage = ({api}) => (
  <Layout api={api}>
    <Helmet>
      <title>👻 Page not found</title> {/* eslint-disable-line */}
    </Helmet>
    <main className="error-page-container">
      <img className="error-image" src={telescopeImageUrl} alt="" width="318px" height="297px" />
      <div className="error-msg">
        <h1>Page Not Found</h1>
        <p>Maybe a typo, or perhaps it's moved?</p>
        <a className="button button-link" href="/">Back to Glitch</a>
      </div>
    </main>
  </Layout>
);

NotFoundPage.propTypes = {
  api: PropTypes.func.isRequired,
};

export default NotFoundPage;


const emailUrl = 'https://cdn.glitch.com/26ac422d-705d-42be-b9cb-1fbdfe7e5a63%2Ferror-mailer.svg?1543429767321';

const EmailErrorPage = ({api}) => (
  <Layout api={api}>
    <Helmet>
      <title>✉️ Email Login Problem</title> {/* eslint-disable-line */}
    </Helmet>
    <main className="error-page-container">
      <img className="error-image" src={emailUrl} alt="" width="318px" height="297px" />
      <div className="error-msg">
        <h1>Page Not Found</h1>
        <p>Maybe a typo, or perhaps it's moved?</p>
        <a className="button button-link" href="/">Back to Glitch</a>
      </div>
    </main>
  </Layout>
);

NotFoundPage.propTypes = {
  api: PropTypes.func.isRequired,
};

export default NotFoundPage;