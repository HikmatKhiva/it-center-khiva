import { useState } from "react";

type Props = {
  value?: Date | null;
  onChange?: (date: Date) => void;
};

const Calendar: React.FC<Props> = ({ value, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const startWeek = startOfMonth.getDay(); // 0-6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (Date | null)[] = [];
  for (let i = 0; i < startWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const handleDayClick = (date: Date | null) => {
    if (!date || !onChange) return;
    onChange(date);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="w-full">
      <header>
        <button onClick={prevMonth}>{"<"}</button>
        <span>
          {year} - {month + 1}
        </span>
        <button onClick={nextMonth}>{">"}</button>
      </header>
      <table className="w-full h-[calc(100vh_-_200px)]">
        <thead>
          <tr>
            {["Yak", "Dush", "Sesh", "Chor", "Pay", "Juma", "Shan"].map(
              (d, i) => (
                <th
                  className={`${
                    (i + 1) % 2 == 0 ? "text-blue-500" : "text-red-500"
                  }`}
                  key={d}
                >
                  {d}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="w-full">
          {weeks.map((week, i) => (
            <tr className="w-40 h-[20px] bg-red-500 " key={i}>
              {week.map((date, j) => (
                <td
                  className=" border border-[#F3F3F4] text-center"
                  key={j}
                  onClick={() => handleDayClick(date)}
                >
                  {date ? date.getDate() : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
