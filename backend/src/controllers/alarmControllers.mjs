import {addAlarmModel,getAlarmModel,putAlarmModel,deleteAlarmModel} from '../models/alarmModels.mjs'

export function addAlarm(req,res){
    const userId = req.params.id;
    const {alarm_title,alarm_time,alarm_date,sound} =req.body;
    const data =[userId,alarm_title,alarm_time,alarm_date,sound];
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
   const userId = req.params.id;
   const data =[userId]
    getAlarmModel(data,(err,results)=>{
        if(err){
            console.error(err);
            return res.json({failed:'False',msg:'Failed to Retrieve Alarm'});
        }else{
            res.json({success:'true',results});
        }
    });
}

export function putAlarm(req,res){
    const {id} = req.params;
    const {alarm_title,alarm_time,alarm_date,sound} =req.body;
    const data =[alarm_title,alarm_time,alarm_date,sound,id];
    putAlarmModel(data,(err,results)=>{
        if(err){
            console.error(err);
            return res.json({failed:'False',msg:'Failed to Update Alarm'});
        }else{
            res.json({success:'true',msg:'Alarm Updated Successfully'});
        }
    });
}

export function deleteAlarm(req,res){
    const {id} = req.params;
    const data =[id];
    deleteAlarmModel(data,(err,results)=>{
        if(err){
            console.error(err);
            return res.json({failed:'False',msg:'Failed to Delete Alarm'});
        }else{
            res.json({success:'true',msg:'Alarm Deleted Successfully'});
        }
    });
}