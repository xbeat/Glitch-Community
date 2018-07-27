import React from 'react';
import PropTypes from 'prop-types';

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
    this.stars = 1;
    this.canvas = React.createRef();
    this.handleResize = this.handleResize.bind(this);
  }
  
  resetCanvas(width, height) {
    this.canvas.current.width = Math.max(window.innerWidth, screen.width);
    this.canvas.current.height = Math.max(window.innerHeight, screen.height);
    const context = this.canvas.current.getContext('2d');
    for (let i = 0; i < 100; ++i) {
      drawStar(this.canvas.current, context, 'white');
    }
  }
  
  handleResize() {
    this.drawStars();
  }
  
  componentDidMount() {
    this.drawStars();
    window.addEventListener('resize', this.handleResize);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
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