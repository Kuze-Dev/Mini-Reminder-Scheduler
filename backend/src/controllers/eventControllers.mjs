import {createEventModel,getAllEventsModel,deleteEventModel,updateEvent, } from '../models/eventModels.mjs';
  
export function addEvent (req, res) {
  const { title, date, time, location } = req.body;
  const eventData = [ title, date, time, location];
  createEventModel(eventData,(err, result) => {
    if (err) {
      console.error(err);
      return res.json({ failed: 'false',msg:'Failed to Add Event' });
    }else{
    res.json({success:'true',msg:'Event Added Successfully'});
    }
  });
};


export function fetchEvents(req, res){
  const page = parseInt(req.query.page) || 1;        // Get current page, default to 1 if not provided
  const limit = parseInt(req.query.limit) || 3;       // Items per page, default to 3 if not provided
  const offset = (page - 1) * limit;                 // Calculate offset for pagination

  // Call the model to fetch paginated events
  getAllEventsModel(limit, offset, (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, msg: 'Failed to retrieve events' });
      }

      res.json({
        Results: results.rows,
        Totalevents: results.total,
        currentPage: page,  
        perPage: limit,  
      });
  });
};
  
  
  
  export function removeEvent (req, res)  {
    const { id } = req.params;
    const data = [id];
    deleteEventModel(data, (err) => {
      if (err){ 
        console.error(err);
      return res.json({ failed: 'Failed to Delete Event' });
    }else{
      res.json({success:'true', msg: 'Event Deleted Successfully'});
    }
    });
  };
  
  export function modifyEvent (req, res){
    const { id } = req.params;
    updateEvent(id, req.body, (error, updatedEvent) => {
      if (error) return res.status(500).json({ error: 'Error updating event' });
      res.status(200).json(updatedEvent);
    });
  };
  