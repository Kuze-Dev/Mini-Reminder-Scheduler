import { connection } from '../config/db.mjs';



export function  addScheduleModel (data, callback){
  const query = 'INSERT INTO schedules (title, date, time, location) VALUES (?, ?, ?, ?)';
  connection.query(query, data,callback);
}

export function fetchScheduleModel(limit, offset, callback) {
  const query = `
  SELECT * FROM schedules
  ORDER BY date DESC
  LIMIT ? OFFSET ?;
`;

const countQuery = 'SELECT COUNT(*) AS total FROM schedules';

// First, get the paginated results
connection.query(query, [limit, offset], (err, results) => {
  if (err) return callback(err);

  // Then, count the total number of rows
  connection.query(countQuery, (err, countResults) => {
    if (err) return callback(err);

    const total = countResults[0].total; // Get total count from the count query
    callback(null, { rows: results, total });
  });
})
;
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


