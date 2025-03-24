const {createRoom,deleteRoomImage,updateRoomImage}=require('../controllers/room')
const { authenticate, adminAuth } = require('../middlewares/authentication');

const upload = require('../helper/multer');

const router = require('express').Router();


/**
 * @swagger
 * /room/{id}:
 *   post:
 *     summary: Create a new room
 *     description: Allows an admin to create a new room and upload images. Authentication required.
 *     tags:
 *       - Rooms
 *     security:
 *       - BearerAuth: [] # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category the room belongs to
 *         example: "67c9e9fe16af37fc64fc25f6"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               roomName:
 *                 type: string
 *                 description: Name of the room
 *                 example: "Deluxe Suite"
 *               description:
 *                 type: string
 *                 description: Short description of the room
 *                 example: "Luxury room with a city view"
 *               price:
 *                 type: number
 *                 description: Price per night
 *                 example: 250
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 10 images of the room
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Room created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Room ID
 *                       example: "68a9b1de34cd78ef123abc45"
 *                     roomName:
 *                       type: string
 *                       description: Name of the room
 *                       example: "Deluxe Suite"
 *                     description:
 *                       type: string
 *                       description: Short description of the room
 *                       example: "Luxury room with a city view"
 *                     price:
 *                       type: number
 *                       description: Price per night
 *                       example: 250
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: uri
 *                       description: URLs of uploaded images
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time when the room was created
 *                       example: "2025-03-06T18:31:26.298Z"
 *       400:
 *         description: Bad Request - Invalid Input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Room name is required"
 *       401:
 *         description: Unauthorized - User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Authentication required"
 *       403:
 *         description: Forbidden - User is not an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access denied. Admins only."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create room"
 */

router.post('/room/:id',authenticate, adminAuth, upload.array('images',10),createRoom);


/**
 * @swagger
 * /rooms/{roomId}/images/{imageId}:
 *   delete:
 *     summary: Delete a specific image from a room
 *     description: This endpoint deletes an image from a room by removing it from both the Cloudinary storage and the room's image array in the database. Only authenticated admins can perform this action.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the room from which the image will be deleted.
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the image to be deleted.
 *     responses:
 *       200:
 *         description: Image deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image deleted successfully"
 *                 data:
 *                   type: object
 *                   description: The updated room details after image deletion.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Room ID
 *                       example: "642f2e2f1a1f5a0012345678"
 *                     images:
 *                       type: array
 *                       description: Array of room images
 *                       items:
 *                         type: object
 *                         properties:
 *                           imageId:
 *                             type: string
 *                             description: The ID of the image in Cloudinary.
 *                             example: "abcd1234"
 *                           imageUrl:
 *                             type: string
 *                             description: URL of the image.
 *                             example: "https://res.cloudinary.com/yourcloud/image/upload/v1619091212/sample.jpg"
 *       404:
 *         description: Room or image not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     RoomNotFound:
 *                       value: "Room not found"
 *                     ImageNotFound:
 *                       value: "Image not found in room"
 *       401:
 *         description: Unauthorized, token missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       403:
 *         description: Forbidden, admin rights required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden, admin access required"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */


router.delete("/rooms/:roomId/images/:imageId",authenticate, adminAuth, deleteRoomImage);


/**
 * @swagger
 * /rooms/{roomId}/images/{imageId}:
 *   put:
 *     summary: Update a room's image
 *     description: Allows admins to update a room's image. The image is uploaded to Cloudinary, and the old image is replaced.
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: ID of the room to update
 *         schema:
 *           type: string
 *           example: 64b7d0fa8d53f8ec12345678
 *       - in: path
 *         name: imageId
 *         required: true
 *         description: ID of the image to be updated
 *         schema:
 *           type: string
 *           example: 2f84d7e0c6f8b12312345678
 *       - in: formData
 *         name: image
 *         required: true
 *         description: New image file to upload
 *         schema:
 *           type: file
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The new image to be uploaded
 *     responses:
 *       200:
 *         description: Successfully updated the image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64b7d0fa8d53f8ec12345678"
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           imageUrl:
 *                             type: string
 *                             example: "https://res.cloudinary.com/example/image/upload/v1625678123/sample.jpg"
 *                           imageId:
 *                             type: string
 *                             example: "abc123"
 *       400:
 *         description: Bad Request - No image uploaded or image not found in room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   oneOf:
 *                     - example: "No image uploaded"
 *                     - example: "Image not found in room"
 *       404:
 *         description: Room not found or image not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   oneOf:
 *                     - example: "Room not found"
 *                     - example: "Image not found in room"
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

// Route to update a single image in a room
router.put("/rooms/:roomId/images/:imageId",authenticate, adminAuth, upload.single("image"), updateRoomImage);


module.exports = router;