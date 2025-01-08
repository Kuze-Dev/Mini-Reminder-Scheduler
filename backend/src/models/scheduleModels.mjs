import { connection } from '../config/db.mjs';



export function  addScheduleModel (data, callback){
  const query = 'INSERT INTO schedules (user_id,title, date, time, location) VALUES (?, ?, ?, ?,?)';
  connection.query(query, data,callback);
}

export function fetchScheduleModel(limit, offset, userId, callback) {
  const query = `
    SELECT * FROM schedules 
    WHERE user_id = ? 
    ORDER BY date DESC 
    LIMIT ? OFFSET ?;
  `;

  const countQuery = 'SELECT COUNT(*) AS total FROM schedules WHERE user_id = ?';

  // First, get the paginated results
  connection.query(query, [userId, limit, offset], (err, results) => {
    if (err) return callback(err);

    // Then, count the total number of rows for the specified user
    connection.query(countQuery, [userId], (err, countResults) => {
      if (err) return callback(err);

      const total = countResults[0].total; // Get total count from the count query
      callback(null, { rows: results, total });
    });
  });
};


export function updateScheduleModel(data, callback) {
  // SQL query to update the schedule in the schedules table
  const query = 'UPDATE schedules SET title = ?, date = ?, time = ?, location = ? WHERE id = ?';
  
  // Run the query with the provided data
  connection.query(query, data, callback);
};


export function deleteScheduleModel(data, callback) {
  const query = 'DELETE FROM schedules WHERE id = ?';
  connection.query(query, data, callback);
};


