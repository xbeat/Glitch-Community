import React from 'react';

import useDebouncedValue from './use-debounced-value';

const useOptimisticValue = (realValue, setValueAsync) => {
  // store what is being typed in, along with an error message
  // value undefined means that the field is unchanged from the 'real' value
  const [state, setState] = React.useState({ value: undefined, error: null });
  
  // debounce our stored value and send the async updates when it is not undefined
  const debouncedValue = useDebouncedValue(state.value, 500);
  React.useEffect(() => {
    if (debouncedValue !== undefined) {
      // they might have typed something else during the async action
      // if the value changed then we'll get a new debounced effect in time
      const setStateIfMatches = (newState) => {
        setState(prevState => prevState.value === debouncedValue ? newState : prevState);
      };
      // this scope can't be async/await because it's an effect
      setValueAsync(debouncedValue).then(
        () => setStateIfMatches({ value: undefined, error: null }),
        error => setStateIfMatches({ value: debouncedValue, error }),
      );
    }
  }, [debouncedValue]);
  
  // replace undefined with the real value
  const optimisticValue = state.value !== undefined ? state.value : realValue;
  const setOptimisticValue = (newValue) => {
    setState(prevState => ({ ...prevState, value: newValue }));
  };
  
  return [optimisticValue, state.error, setOptimisticValue];
};

export default useOptimisticValue;