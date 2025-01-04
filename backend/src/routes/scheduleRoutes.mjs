import {fetchSchedule,addSchedule,deleteSchedule,updateSchedule} from '../controllers/scheduleControllers.mjs';
import express from 'express';

const router = express.Router();

router.post('/add', addSchedule);
router.get('/getSchedules', fetchSchedule);
router.delete('/delete/:id', deleteSchedule);
router.put('/update/:id', updateSchedule);

export {router};

