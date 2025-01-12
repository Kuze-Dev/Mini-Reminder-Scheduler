import { connection } from "../config/db.mjs"


export function addUserModel(data,callback){
    const query = 'INSERT INTO users (user_id,firstname,lastname,email,password,role,status,profileImage) VALUES(?,?,?,?,?,?,?,?)';
    connection.query(query,data,callback);
}

export function loginUserModel(data, callback) {
    const query = `SELECT * FROM users WHERE email=? AND status='Active'`;
    connection.query(query, data, callback);
}

export function getProfileDataModel(data,callback){
    const query = 'SELECT * FROM users WHERE user_id=?';
    connection.query(query,data,callback);
}

export function getAllUserModel(limit,offset,callback){
    const query = `
    SELECT * FROM users
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?;
  `;
  const countQuery = 'SELECT COUNT(*) AS total FROM users';

  connection.query(query, [limit, offset], (err, results) => {
    if (err) return callback(err);

    connection.query(countQuery,  (err, countResults) => {
      if (err) return callback(err);

      const total = countResults[0].total; // Get total count from the count query
      callback(null, { rows: results, total });
    });
  });
};

export function updateUserStatusModel(data,callback){
    const query = `UPDATE users SET status=? WHERE user_id=?`;
    connection.query(query,data,callback);
}

export function deleteUserModel(data,callback){
  const query = `DELETE FROM users WHERE user_id=?`;
  connection.query(query,data,callback);
}

export function updateUserModel(data,callback){
  const query = `UPDATE users SET firstname=?,lastname=?,email=?,password=?, profileImage=? WHERE user_id=?`;
  connection.query(query,data,callback);
}