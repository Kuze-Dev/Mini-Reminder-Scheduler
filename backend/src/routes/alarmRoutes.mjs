import {addAlarm,getAlarm} from '../controllers/alarmControllers.mjs'
import express from 'express'

const router = express.Router();

router.post('/alarm',addAlarm);
router.get('/alarm',getAlarm);


export{router};
