function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    console.error('Failed to get local storage');
    return null;
  }
}

export function getLocalStorage<T>(key: string): T | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const data = storage.getItem(key);
  if (data === null) {
    return null;
  }

  try {
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Failed to get local storage key: ${key} err: ${err}`);
    storage.removeItem(key);
    return null;
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to set local storage key: ${key} err: ${err}`);
  }
}

export function removeLocalStorage(key: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch (err) {
    console.error(`Failed to remove local storage key: ${key} err: ${err}`);
  }
}
