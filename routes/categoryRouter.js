// const { createCategory,getAll } = require('../controllers/categoryController');
// const { authenticate,adminAuth } = require('../middlewares/authentication');

// const router = require('express').Router();

// router.post('/category', authenticate, adminAuth, createCategory)
// router.get('get',getAll)

// module.exports = router

const { createCategory, getAll } = require('../controllers/categoryController');
const { authenticate, adminAuth } = require('../middlewares/authentication');

const router = require('express').Router();

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category.
 *     description: Create a new category with amenities, specifying the user (admin) who created it.
 *     security:
 *       - bearerAuth: []   # Secured by authentication token
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amenities
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *                 example: Luxury Suites
 *               amenities:
 *                 type: array
 *                 description: A list of amenities for the category.
 *                 items:
 *                   type: string
 *                 example: [Wi-Fi, Spa, Ocean View]
 *     responses:
 *       201:
 *         description: Category successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: Category Created
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the category.
 *                       example: 60b8d29592a3b2a76c75a06b
 *                     name:
 *                       type: string
 *                       description: The name of the category.
 *                       example: Luxury Suites
 *                     amenities:
 *                       type: array
 *                       description: The amenities for the category.
 *                       items:
 *                         type: string
 *                       example: [Wi-Fi, Spa, Ocean View]
 *                     createdBy:
 *                       type: object
 *                       properties:
 *                         adminId:
 *                           type: string
 *                           description: The ID of the admin who created the category.
 *                           example: 60a5a1b529a3b1c4f67d1234
 *                         adminName:
 *                           type: string
 *                           description: The full name of the admin.
 *                           example: John Doe
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: User not found
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Internal Server Error
 */




router.post('/category', authenticate, adminAuth, createCategory);

/**
 * @swagger
 * /category/get:
 *   get:
 *     summary: Retrieve all categories with related rooms.
 *     description: Retrieve a list of all categories from the database along with the rooms associated with each category.
  *     tags:
 *       - Category
  *     security: [] # No authentication required
 *     responses:
 *       200:
 *         description: A list of categories with rooms.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: All category in the database
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The category ID.
 *                         example: 60b8d29592a3b2a76c75a06b
 *                       categoryName:
 *                         type: string
 *                         description: The name of the category.
 *                         example: Luxury Suites
 *                       rooms:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             roomName:
 *                               type: string
 *                               description: The name of the room.
 *                               example: Ocean View Suite
 *                             price:
 *                               type: number
 *                               description: The price of the room.
 *                               example: 300
 *                             description:
 *                               type: string
 *                               description: The room description.
 *                               example: A spacious suite with an ocean view, luxurious amenities.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Internal Server Error
 */

router.get('/category/get', getAll);
  
module.exports = router;     
