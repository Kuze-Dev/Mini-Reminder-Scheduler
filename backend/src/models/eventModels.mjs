import { connection } from '../config/db.mjs';

export const getAllEvents = (callback) => {
  const query = 'SELECT * FROM events ORDER BY date ASC';
  connection.query(query, callback);
};

export const createEvent = (eventData, callback) => {
  const { title, date, time, location } = eventData;
  const query = 'INSERT INTO events (title, date, time, location) VALUES (?, ?, ?, ?)';
  connection.query(query, [title, date, time, location], (error, result) => {
    if (error) return callback(error);
    callback(null, { id: result.insertId, ...eventData });
  });
};

export const getEventById = (id, callback) => {
  const query = 'SELECT * FROM events WHERE id = ?';
  connection.query(query, [id], (error, results) => {
    if (error) return callback(error);
    callback(null, results[0]);
  });
};

export const deleteEvent = (id, callback) => {
  const query = 'DELETE FROM events WHERE id = ?';
  connection.query(query, [id], callback);
};

export const updateEvent = (id, eventData, callback) => {
  const { title, date, time, location } = eventData;
  const query =
    'UPDATE events SET title = ?, date = ?, time = ?, location = ? WHERE id = ?';
  connection.query(query, [title, date, time, location, id], (error) => {
    if (error) return callback(error);
    callback(null, { id, ...eventData });
  });
};
