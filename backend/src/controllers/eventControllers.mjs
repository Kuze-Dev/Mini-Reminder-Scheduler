import {
    getAllEvents,
    createEvent,
    getEventById,
    deleteEvent,
    updateEvent,
  } from '../models/eventModels.mjs';
  
  export const fetchEvents = (req, res) => {
    getAllEvents((error, events) => {
      if (error) return res.status(500).json({ error: 'Error fetching events' });
      res.status(200).json(events);
    });
  };
  
  export const addEvent = (req, res) => {
    createEvent(req.body, (error, newEvent) => {
      if (error) return res.status(500).json({ error: 'Error adding event' });
      res.status(201).json({newEvent,msg:'Event Added Successfully'});
    });
  };
  
  export const fetchEventById = (req, res) => {
    const { id } = req.params;
    getEventById(id, (error, event) => {
      if (error) return res.status(500).json({ error: 'Error fetching event' });
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.status(200).json(event);
    });
  };
  
  export const removeEvent = (req, res) => {
    const { id } = req.params;
    deleteEvent(id, (error) => {
      if (error) return res.status(500).json({ error: 'Error deleting event' });
      res.status(200).json({ message: 'Event deleted successfully' });
    });
  };
  
  export const modifyEvent = (req, res) => {
    const { id } = req.params;
    updateEvent(id, req.body, (error, updatedEvent) => {
      if (error) return res.status(500).json({ error: 'Error updating event' });
      res.status(200).json(updatedEvent);
    });
  };
  