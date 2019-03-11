import React from 'react';
import { debounce } from 'lodash';

const useOptimisticValue = (realValue, onChangeAsync) => {
  const [stateValue, setStateValue] = React.useState(undefined);
  
  // use a ref so we can get the current value in async functions
  const valueRef = React.useRef(stateValue);
  React.useEffect(() => {
    valueRef.current = stateValue;
  }, [stateValue]);
  
  const onChange = async (newValue) => {
    setStateValue(newValue);
    try {
      await onChangeAsync(newValue);
    } catch (error) {
    }
  };
};

export default useOptimisticValue;