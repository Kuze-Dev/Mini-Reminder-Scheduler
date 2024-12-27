import {fetchEvents,addEvent,removeEvent,modifyEvent,} from '../controllers/eventControllers.mjs';
import express from 'express';

const router = express.Router();

router.post('/add', addEvent);
router.get('/getEvents', fetchEvents);
router.delete('/delete/:id', removeEvent);
router.put('/:id', modifyEvent);

export {router};

