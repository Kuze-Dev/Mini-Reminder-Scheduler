import { connection } from "../config/db.mjs";


export function addAlarmModel(data,callback){
    const query ='INSERT INTO alarms (alarm_title,alarm_time,alarm_date,sound) VALUES(?,?,?,?)';
    connection.query(query,data,callback);
}

export function getAlarmModel(callback){
    const query ='SELECT * FROM alarms ORDER BY alarm_date DESC';
    connection.query(query,callback);
}