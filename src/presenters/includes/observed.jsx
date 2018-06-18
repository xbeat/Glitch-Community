import React from 'react';
import PropTypes from 'prop-types';

import {throttle} from 'lodash';

// This is a shim component that helps us allow observables to be
// monitored from inside react, rather than at the jade level.

export default class Observed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { observedProps: this.props.propsObservable() };
  }
  
  componentDidMount() {
    const update = (props) => {
      this.setState({observedProps: props});
    };
    const throttled = throttle(update, 150);
    this.props.propsObservable.observe(throttled);
  }
  componentWillUnmount() {
    this.props.propsObservable.releaseDependencies();
  }
  
  render() {
    return <this.props.component {...this.state.observedProps}/>;
  }
}

Observed.propTypes = {
  propsObservable: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
};