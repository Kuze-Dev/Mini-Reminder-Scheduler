import { connection } from "../config/db.mjs"


export function addUserModel(data,callback){
    const query = 'INSERT INTO users (user_id,firstname,lastname,email,password,role,status,profileImage) VALUES(?,?,?,?,?,?,?,?)';
    connection.query(query,data,callback);
}

export function loginUserModel(data, callback) {
    const query = 'SELECT * FROM users WHERE email=?';
    connection.query(query, data, callback);
}
