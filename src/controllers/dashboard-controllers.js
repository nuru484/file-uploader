const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dashboardGet = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
    });

    console.log(user);
    if (user) {
      res.render('dashboard', { title: 'Dashboard', user });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { dashboardGet };
