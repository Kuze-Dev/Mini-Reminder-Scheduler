import {addAlarm,getAlarm,putAlarm,deleteAlarm} from '../controllers/alarmControllers.mjs'
import express from 'express'

const router = express.Router();

router.post('/alarm/:id',addAlarm);
router.get('/alarm/:id',getAlarm);
router.put('/alarm/:id',putAlarm);
router.delete('/alarm/:id',deleteAlarm)


export{router};
