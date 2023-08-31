const value = await new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(999);
  }, 100);
});

export { value };
