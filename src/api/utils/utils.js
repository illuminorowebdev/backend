exports.getTodayYYYYMMDD = () => {
  const date = new Date();

  const twoLetter = v => (v < 10 ? `0${v}` : v);

  return `${date.getFullYear()}-${twoLetter(date.getMonth() + 1)}-${twoLetter(date.getDate())}`;
};
