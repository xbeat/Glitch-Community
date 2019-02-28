import React from 'react';
import { captureException } from '../../utils/sentry';

const getStorage = () => {
  try {
    const storage = window.localStorage;
    storage.setItem('test', 'test');
    storage.getItem('test');
    storage.removeItem('test');
    return storage;
  } catch (error) {
    console.warn('Local storage not available, using memory store');
  }
  const getItem = () => null;
  const setItem = () => {};
  const removeItem = () => {};
  return { getItem, setItem, removeItem };
};
const storage = getStorage();

const readFromStorage = (name) => {
  try {
    const raw = storage.getItem(name);
    if (raw !== null) {
      return JSON.parse(raw);
    }
  } catch (error) {
    captureException(error);
  }
  return undefined;
};

const writeToStorage = (name, value) => {
  try {
    if (value !== undefined) {
      storage.setItem(name, JSON.stringify(value));
    } else {
      storage.removeItem(name);
    }
  } catch (error) {
    captureException(error);
  }
};

const useLocalStorage = (name, defaultValue) => {
  const [rawValue, setValueInMemory] = React.useState(() => readFromStorage(name));

  React.useEffect(() => {
    const reload = (event) => {
      if (event.storageArea === storage && event.key === name) {
        setValueInMemory(readFromStorage(name));
      }
    };
    window.addEventListener('storage', reload, { passive: true });
    return () => {
      window.removeEventListener('storage', reload, { passive: true });
    };
  }, [name]);

  const value = rawValue !== undefined ? rawValue : defaultValue;
  const setValue = (newValue) => {
    setValueInMemory(newValue);
    writeToStorage(name, newValue);
  };

  return [value, setValue];
};

export default useLocalStorage;
