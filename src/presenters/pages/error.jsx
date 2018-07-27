import React from 'react';
import PropTypes from 'prop-types';

const logo = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fcarp.svg";

class Stars extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }
  
  drawStars() {
    this.canvas.current.width = screen.width;
    this.canvas.current.height = screen.height;
    const context = this.canvas.current.getContext('2d');
  }
  
  componentDidMount() {
    this.drawStars();
  }
  
  render() {
    return <canvas id="stars" ref={this.canvas}/>;
  }
}

const ErrorPage = ({title, description}) => (
  <div className="content error-page">
    <div className="container">
      <h1>{title}</h1>
      <h2>{description}</h2>
      <div className="actions">
        <a href="/">
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