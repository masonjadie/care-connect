require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    multipleStatements: true
  });

  console.log('Creating meals table...');

  await connection.query(`
    CREATE TABLE IF NOT EXISTS meals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      calories INT NOT NULL,
      protein VARCHAR(50) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      tags JSON,
      image VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  const [rows] = await connection.query('SELECT COUNT(*) as count FROM meals');
  if (rows[0].count === 0) {
    console.log('Seeding initial meals...');
    const initialMeals = [
      ['Roasted Salmon with Asparagus', 'Fresh Atlantic salmon roasted with lemon and herbs, served over steamed asparagus and quinoa.', 'Heart Healthy', 420, '32g', 14.50, JSON.stringify(['Omega-3', 'Gluten Free']), 'meals/roasted-salmon.png'],
      ['Mediterranean Chickpea Salad', 'Crunchy chickpeas, cucumbers, cherry tomatoes, and feta cheese with a light lemon-olive oil dressing.', 'Vegetarian', 350, '12g', 11.00, JSON.stringify(['Fiber Rich', 'Fresh']), 'meals/mediterranean-salad.png'],
      ['Turkey Meatloaf & Sweet Potato', 'Lean ground turkey meatloaf served with mashed sweet potatoes and sautéed green beans.', 'Low Sodium', 380, '28g', 13.00, JSON.stringify(['Low Fat', 'Filling']), 'meals/turkey-meatloaf.png'],
      ['Grilled Chicken Stir-Fry', 'Sliced chicken breast with bell peppers, broccoli, and snap peas in a low-glycemic ginger soy sauce.', 'Diabetic Friendly', 310, '24g', 12.50, JSON.stringify(['No Sugar Added', 'High Protein']), 'meals/chicken-stirfry.png'],
      ['Lentil & Vegetable Soup', 'Hearty soup made with brown lentils, carrots, celery, and spinach. Served with a whole grain roll.', 'Vegetarian', 290, '15g', 9.50, JSON.stringify(['Plant Based', 'Low Calorie']), 'meals/roasted-salmon.png']
    ];

    await connection.query(
      'INSERT INTO meals (name, description, category, calories, protein, price, tags, image) VALUES ?',
      [initialMeals]
    );
  }

  console.log('Meals table ready.');
  await connection.end();
}

run().catch(console.error);
