const dashboardGet = async (req, res) => {
  try {
    res.render('dashboard', { title: 'Dashboard' });
  } catch (error) {
    console.error('Error rendering dashboard', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { dashboardGet };
