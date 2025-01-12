import {addAlarmModel,getAlarmModel} from '../models/alarmModels.mjs'

export function addAlarm(req,res){
    const {alarm_title,alarm_time,alarm_date,sound} =req.body;
    const data =[alarm_title,alarm_time,alarm_date,sound];
    addAlarmModel(data,(err,results)=>{
        if(err){
            console.error(err);
            return res.json({failed:'False',msg:'Failed to Add Alarm'});
        }else{
            res.json({success:'true',msg:'Alarm Added Successfully'});
        }
    });
}

export function getAlarm(req,res){
   
    getAlarmModel((err,results)=>{
        if(err){
            console.error(err);
            return res.json({failed:'False',msg:'Failed to Retrieve Alarm'});
        }else{
            res.json({success:'true',results});
        }
    });
}