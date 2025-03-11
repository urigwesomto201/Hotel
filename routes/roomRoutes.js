const {createRoom,deleteRoomImage,updateRoomImage}=require('../controllers/room')
const upload = require('../helper/multer');

const router = require('express').Router();

router.post('/room/:id', upload.array('images',10),createRoom);

router.delete("/rooms/:roomId/images/:imageId", deleteRoomImage);

// Route to update a single image in a room
router.put("/rooms/:roomId/images/:imageId", upload.single("image"), updateRoomImage);


module.exports = router;