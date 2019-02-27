import React from 'react';

const readFromStorage = (storage, name) => {
  try {
    const raw = storage.getItem(name);
    if (raw !== null) {
      console.log('read',name,'as',raw,'at',Date.now());
      return JSON.parse(raw);
    }
  } catch (error) {
    console.warn('Failed to read from localStorage!', error);
  }
  return undefined;
};

const writeToStorage = (storage, name, value) => {
  console.log('set',name,'to',value,'at',Date.now());
  try {
    if (value !== undefined) {
      storage.setItem(name, JSON.stringify(value));
    } else {
      storage.removeItem(name);
    }
  } catch (error) {
    console.warn('Failed to write to localStorage!', error);
  }
};

const useLocalStorage = (name, defaultValue) => {
  const storage = window.localStorage;

  const [rawValue, setValueInMemory] = React.useState(() => readFromStorage(storage, name));

  React.useEffect(() => {
    const reload = (event) => {
      if (event.storageArea === storage && event.key === name) {
        setValueInMemory(readFromStorage(storage, name));
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
    writeToStorage(storage, name, newValue);
  };

  return [value, setValue];
};

export default useLocalStorage;
