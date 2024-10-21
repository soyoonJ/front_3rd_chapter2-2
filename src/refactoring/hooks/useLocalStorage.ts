export const useLocalStorage = () => {
  const getLocalStorage = (key: string) => {
    return JSON.parse(localStorage.getItem(key) || '');
  };

  const setLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const removeLocalStorage = (key: string) => {
    localStorage.removeItem(key);
  };

  return { getLocalStorage, setLocalStorage, removeLocalStorage };
};
