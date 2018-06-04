import React from 'react';
import PropTypes from 'prop-types';

const Loader = () => {
  return (
    <div className="loader">
      <div className="moon"></div>
      <div className="earth"></div>
      <div className="asteroid"></div>    
      <div className="asteroid-dust"></div>    
    </div>    
  );
};
export default Loader;

export class DataLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maybeData: null,
      loaded: false,
      maybeError: null,
    };
  }
  
  componentDidMount() {
    this.props.get().then(
      data => this.setState({
        maybeData: data,
        loaded: true,
      }),
      error => {
        console.error(error);
        this.setState({
          maybeError: error,
        });
      }
    );
  }
  
  renderLoading() {
    
  
  render() {
    return (this.state.loaded
      ? this.props.children(this.state.maybeData)
      : (this.state.maybeError
        ? this.props.error(this.state.maybeError)
        : <Loader/>
      )
    );
  }
}
DataLoader.propTypes = {
  children: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
  get: PropTypes.func.isRequired,
};
