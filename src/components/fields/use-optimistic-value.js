import React from 'react';

import useDebouncedValue from './use-debounced-value';

const useOptimisticValue = (realValue, setValueAsync) => {
  // store 
  const [state, setState] = React.useState({ value: undefined, error: null });
  
  // debounce our stored state and send the async updates when it changes
  const debouncedValue = useDebouncedValue(state.value, 500);
  React.useEffect(() => {
    if (debouncedValue !== undefined) {
      const setStateIfMatches = (newState) => {
        setState(prevState => prevState.value === debouncedValue ? newState : prevState);
      };
      setValueAsync(debouncedValue).then(
        () => setStateIfMatches({ value: undefined, error: null }),
        error => setStateIfMatches({ value: debouncedValue, error }),
      );
    }
  }, [debouncedValue]);
  
  // parse out the display value and how to change it, and send them along
  const optimisticValue = state.value !== undefined ? state.value : realValue;
  const setOptimisticValue = (newValue) => {
    setState(prevState => ({ ...prevState, value: newValue }));
  };
  
  return [optimisticValue, state.error, setOptimisticValue];
};

export default useOptimisticValue;