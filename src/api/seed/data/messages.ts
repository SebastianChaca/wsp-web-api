export const messages = () => {
  const arrayOfObjects = [];

  for (let index = 0; index < 51; index++) {
    const message = `message: ${index}`;
    arrayOfObjects.push(message);
  }
  return arrayOfObjects;
};
