import React from 'react';

const readFromStorage = (name) => {
  try {
    const raw = window.localStorage.getItem(name);
    if (raw !== null) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.warn('Failed to read from localStorage!', error);
  }
  return undefined;
};

const writeToStorage = (name, value) => {
  try {
    if (value !== undefined) {
      window.localStorage.setItem(name, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(name);
    }
  } catch (error) {
    console.warn('Failed to write to localStorage!', error);
  }
};

const useLocalStorage = (name, defaultValue) => {
  const [rawValue, setValueInMemory] = React.useState(() => readFromStorage(name));

  React.useEffect(() => {
    const reload = () => setValueInMemory(readFromStorage(name));
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
