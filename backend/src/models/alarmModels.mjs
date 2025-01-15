import { connection } from "../config/db.mjs";


export function addAlarmModel(data,callback){
    const query ='INSERT INTO alarms (user_id,alarm_title,alarm_time,alarm_date,sound) VALUES(?,?,?,?,?)';
    connection.query(query,data,callback);
}

export function getAlarmModel(data,callback){
    const query ='SELECT * FROM alarms WHERE user_id=? ORDER BY alarm_date DESC';
    connection.query(query,data,callback);
}

export function putAlarmModel(data,callback){
    const query ='UPDATE alarms SET alarm_title=?,alarm_time=?,alarm_date=?,sound=? WHERE id=?';
    connection.query(query,data,callback);
}

export function deleteAlarmModel(data,callback){
  const query = 'DELETE FROM alarms WHERE id=?';
  connection.query(query,data,callback);
}