export const formatTime = {
  DateTime: (dateInput: Date): string => {
    const date = new Date(dateInput);
    // Extract month, day, and year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed in JavaScript
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    // Format the date as "M.D.YYYY"
    return `${month}.${day}.${year}`;
  },
  DateTimeHours: (dateInput: Date): string => {
    const date = new Date(dateInput);
    // Extract month, day, and year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed in JavaScript
    const day = date.getDate().toString().padStart(2, "0");;
    const year = date.getFullYear();
    // Format the Date object to show only hours and minutes
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const formattedTime = `${hours}:${minutes}`;
    // Format the date as "M.D.YYYY"
    return `${month}.${day}.${year} ${formattedTime}`;
  },
};