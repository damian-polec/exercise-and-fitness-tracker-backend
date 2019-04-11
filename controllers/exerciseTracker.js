const Data = require('../models/data');

exports.getData = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const userData = await Data.find({
      year: currentYear,
      month: currentMonth,
      user: userId
    })
    res.json({data: userData})
  } catch (error) {
    console.log(error);
  }
  
}