import React from 'react';
import { debounce } from 'lodash';

const useOptimisticValue = (realValue, setValueAsync) => {
  const [stateValue, setStateValue] = React.useState({ value: undefined, error: null });
  
  // use a ref so we can get the current value in async functions
  const valueRef = React.useRef(stateValue);
  React.useEffect(() => {
    valueRef.current = stateValue;
  }, [stateValue]);
  
  const setValue = async (newValue) => {
    setStateValue({ value: newValue, error: null });
    try {
      await setValueAsync(newValue);
      setStateValue(prevState => {
        if (prevState.value === newValue) {
          return { value: undefined, error: null };
        }
        return prevState;
      });
    } catch (error) {
      setStateValue(prevState => {
        if (prevState.value === newValue) {
          return { value: newValue, error };
        }
        return prevState;
      });
    }
  };
  
  const optimisticValue = stateValue === undefined ? realValue : stateValue;
  return [optimisticValue, stateValue.error, setValue];
};

export default useOptimisticValue;