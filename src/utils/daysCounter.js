const daysCounter = (startDate, endDate) => {
  const formattedStartDate = new Date(new Date(startDate).setHours(12));
  const formattedEndDate = new Date(new Date(endDate).setHours(12));

  // Calculate the time difference in milliseconds
  const durationInMilliseconds = formattedEndDate - formattedStartDate;

  // console.log(formattedStartDate);
  // console.log(formattedEndDate);
  // console.log(durationInMilliseconds);
  // console.log(durationInMilliseconds / (1000 * 60 * 60 * 24));
  // console.log(Math.round(durationInMilliseconds / (1000 * 60 * 60 * 24)));

  // Convert the duration to a more human-readable format
  return Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
};

module.exports = { daysCounter };
