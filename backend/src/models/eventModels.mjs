import { connection } from '../config/db.mjs';



export function createEventModel (data, callback){
  const query = 'INSERT INTO events (title, date, time, location) VALUES (?, ?, ?, ?)';
  connection.query(query, data,callback);
}

export function getAllEventsModel(limit, offset, callback) {
  const query = `
  SELECT * FROM events
  ORDER BY date DESC
  LIMIT ? OFFSET ?;
`;

const countQuery = 'SELECT COUNT(*) AS total FROM events';

// First, get the paginated results
connection.query(query, [limit, offset], (err, results) => {
  if (err) return callback(err);

  // Then, count the total number of rows
  connection.query(countQuery, (err, countResults) => {
    if (err) return callback(err);

    const total = countResults[0].total; // Get total count from the count query
    callback(null, { rows: results, total });
  });
});
};

export function deleteEventModel(data, callback) {
  const query = 'DELETE FROM events WHERE id = ?';
  connection.query(query, data, callback);
};

export function updateEvent(id, eventData, callback) {
  const { title, date, time, location } = eventData;
  const query =
    'UPDATE events SET title = ?, date = ?, time = ?, location = ? WHERE id = ?';
  connection.query(query, [title, date, time, location, id], (error) => {
    if (error) return callback(error);
    callback(null, { id, ...eventData });
  });
};
