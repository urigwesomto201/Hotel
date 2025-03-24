const { register, verifyUser, login, getAll, makeAdmin } = require('../controllers/usercontroller');
const { authenticate, superAdminAuth } = require('../middlewares/authentication');
const {registers} = require('../middlewares/validator')
const jwt = require('jsonwebtoken');
const passport = require('passport')
const router = require('express').Router();


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user.
 *     description: Registers a new user, hashes the password, and sends a verification email with a token.
 *     tags: 
 *       - User
 *     security: [] # No authentication required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the user.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email of the user.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: Password of the user.
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: User registered successfully and verification email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                       description: The user's full name.
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       description: The user's email.
 *                       example: johndoe@example.com
 *                     password:
 *                       type: string
 *                       description: The hashed password of the user.
 *                       example: $2b$10$...
 *       400:
 *         description: Email already in use.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Email: johndoe@example.com already in use'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */




router.post('/users',registers,  register);

/**
 * @swagger
 * /verify-user/{token}:
 *   get:
 *     summary: Verify a user's email
 *     description: This endpoint verifies a user's email using the provided verification token. If the token has expired, a new verification link will be sent to the user's email.
 *     tags: 
 *       - User
 *     security: [] # No authentication required
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The verification token sent to the user's email.
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     responses:
 *       200:
 *         description: Successful account verification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account verified successfully"
 *       400:
 *         description: User has already been verified or token is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User has already been verified, please proceed to login"
 *       401:
 *         description: Token expired, a new verification link sent to the user's email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Link expired: A new verification link was sent, please check your email"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.get('/verify-user/:token', verifyUser);


/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     description: Log in a user using their email and password. Returns a token if successful.
  *     tags: 
 *       - User
 *     security: [] # No authentication required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60c72b2f5f1b2c001c8e4e10
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     isAdmin:
 *                       type: boolean
 *                       example: false
 *                     isSuperAdmin:
 *                       type: boolean
 *                       example: false
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad Request. Either email or password is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: please enter email and password
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.post('/login', login);


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users from the database
 *     description: This endpoint fetches all users stored in the database. Only authenticated users can access this endpoint.
 *     tags: 
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All users in the database
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The user's ID.
 *                         example: "61616cba3f1e2c23a5b8eb32"
 *                       fullName:
 *                         type: string
 *                         description: The user's full name.
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         description: The user's email address.
 *                         example: "john.doe@example.com"
 *                       isAdmin:
 *                         type: boolean
 *                         description: Indicates if the user is an admin.
 *                         example: false
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get('/users', authenticate, getAll);


/**
 * @swagger
 * /make-admin/{id}:
 *   patch:
 *     summary: Make a user an admin
 *     description: This route allows a super admin to promote a user to an admin role.
 *     tags: 
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to be promoted to admin.
 *         schema:
 *           type: string
 *           example: 6400f3f5bca2038a12345678
 *     responses:
 *       200:
 *         description: User successfully made an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User: John Doe is now an Admin"
 *       400:
 *         description: User is already an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is already an Admin"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.patch('/make-admin/:id', authenticate, superAdminAuth, makeAdmin);


/**
 * @swagger
 * /google-autheticate:
 *   get:
 *     summary: Authenticate a user with Google
 *     description: Redirects the user to Google for authentication using OAuth.
 *     tags:
 *       - Google Authentication 
 *     security: [] # No authentication needed before redirecting to Google
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/google-autheticate', passport.authenticate('google',{scope: ['profile','email']}));


/**
 * @swagger
 * /auth/google/login:
 *   get:
 *     summary: Login a user using Google OAuth
 *     description: Authenticates a user via Google and returns a JWT token upon successful login.
 *     tags:
 *       - Google Authentication
 *     security: [] # No Authentication Required
 *     responses:
 *       200:
 *         description: Google authentication successful, JWT token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "GoogleAuth Login Successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: "605c72b1f1a3c619946b57da"
 *                     fullName:
 *                       type: string
 *                       description: User's full name
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email address
 *                       example: "johndoe@example.com"
 *                     isVerified:
 *                       type: boolean
 *                       description: Whether the user's email is verified
 *                       example: true
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request - Google authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Google authentication failed"
 *       401:
 *         description: Unauthorized - Token not provided or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied, token must be provided"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.get('/auth/google/login', passport.authenticate('google'),async(req,res)=>{
    console.log('Req User: ',req.user)
    const token = await jwt.sign({userId: req.user._id, isVerified: req.user.isVerified}, process.env.SECRET,{expiresIn:'1day'});
    res.status(200).json({
        message: 'Google Auth Login Successful',
        data:req.user,
        token
    })
});



// router.post('/resend-verification', resendVerificationEmail);


module.exports = router
