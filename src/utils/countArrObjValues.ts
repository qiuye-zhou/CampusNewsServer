export const countValues = (arr: any[], key: string | number) => {
  return arr.reduce((acc, obj) => {
    const value = obj[key];
    if (acc[value]) {
      acc[value] += 1;
    } else {
      acc[value] = 1;
    }
    return acc;
  }, {});
};
