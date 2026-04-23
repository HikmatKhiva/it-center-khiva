import {
  calculateIncomeForYear,
  calculateAllTeachersSalaries,
  calculateStats,
} from "./stats.helper.js";
// get stats
const getStats = async (req, res) => {
  try {
    const { year } = req.query;
    const stats = await calculateStats(year);
    res.status(200).json([stats]);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getYearlyIncome = async (req, res) => {
  try {
    const { year } = req.query;
    const yearly = await calculateIncomeForYear(year);
    res.status(200).json(yearly);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getTeachersSalary = async (req, res) => {
  try {
    const date = new Date();
    const {
      year = date.getFullYear(),
      month = date.getMonth(),
      percentage = 0.5,
    } = req.query;
    const teachers = await calculateAllTeachersSalaries(
      parseInt(year, 10),
      parseInt(month, 10),
      Number(percentage),
    );
    res.status(200).json(teachers);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export { getStats, getTeachersSalary, getYearlyIncome };
