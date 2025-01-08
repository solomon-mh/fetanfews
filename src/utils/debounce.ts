

export const debounce = <T extends (...args: any[]) =>void>(func: T, delay: number): (...args: Parameters<T>) => void => {
  let timeout:any;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};
