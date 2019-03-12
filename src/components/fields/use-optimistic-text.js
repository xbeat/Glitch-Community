import useOptimisticValue from './use-optimistic-value';

const useOptimisticText = (realValue, setRealValueAsync) => (
  useOptimisticValue(realValue, (newValue) => setRealValueAsync(newValue.trim()))
);

export default useOptimisticText;
