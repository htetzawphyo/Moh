const calculateDailyBudget = (totalBudget, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDifference = end.getTime() - start.getTime();

  // Convert milliseconds to days. Add 1 to include both the start and end date.
  const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;

  const dailyBudget = totalBudget / numberOfDays;

  return dailyBudget;
};

export default calculateDailyBudget;
