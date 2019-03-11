import React from 'react';
import { debounce } from 'lodash';

const useOptimisticValue = (realValue, onChangeAsync) => {
  const [stateValue, setStateValue] = React.useState({ value: undefined, error: null });
  
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
      setStateValue(prevState => {
        if (prevState.value === newValue) {
          return { ...prevState, error };
        }
        return prevState;
      });
    }
  };
};

export default useOptimisticValue;