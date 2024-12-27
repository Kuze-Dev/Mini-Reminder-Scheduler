import {fetchEvents,addEvent,fetchEventById,removeEvent,modifyEvent,} from '../controllers/eventControllers.mjs';
import express from 'express';

const router = express.Router();

router.get('/getEvents', fetchEvents);
router.post('/add', addEvent);
router.get('/:id', fetchEventById);
router.delete('/delete/:id', removeEvent);
router.put('/:id', modifyEvent);

export {router};

