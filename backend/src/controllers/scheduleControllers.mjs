import { addScheduleModel,fetchScheduleModel,deleteScheduleModel,updateScheduleModel } from '../models/scheduleModels.mjs';
  
export function addSchedule (req, res) {
  const userId =req.params.id;
  const { title, date, time, location } = req.body;
  const scheduleData = [userId, title, date, time, location];
  addScheduleModel(scheduleData,(err, result) => {
    if (err) {
      console.error(err);
      return res.json({ failed: 'false',msg:'Failed to Add Schedule' });
    }else{
    res.json({success:'true',msg:'Schedule Added Successfully'});
    }
  });
};


export function fetchSchedule(req, res){
  const userId =req.params.id;
  const page = parseInt(req.query.page) || 1;      
  const limit = parseInt(req.query.limit) || 6;       
  const offset = (page - 1) * limit;                 

 
  fetchScheduleModel(limit, offset,userId, (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, msg: 'Failed to retrieve schedules' });
      }

      res.json({
        Results: results.rows,
        Totalschedules: results.total,
        currentPage: page,  
        perPage: limit,  
      });
  });
};
  
  
  
  export function deleteSchedule (req, res)  {
    const { id } = req.params;
    const { title, date, time, location } = req.body;

    const data = [id, title, date, time, location];
    deleteScheduleModel(data, (err) => {
      if (err){ 
        console.error(err);
      return res.json({ failed: 'Failed to Delete Schedule' });
    }else{
      res.json({success:'true', msg: 'Schedule Deleted Successfully'});
    }
    });
  };
  
  export function updateSchedule(req, res) {
    const { id } = req.params; // Get the schedule id from the URL parameters
    const { title, date, time, location } = req.body; // Get updated data from request body
  
    // Prepare the data for the query
    const data = [title, date, time, location, id];
  
    // Call the updateScheduleModel function to update the schedule in the database
    updateScheduleModel(data, (err) => {
      if (err) { 
        console.error(err);
        return res.json({ failed: 'Failed to Update Schedule' });
      } else {
        res.json({ success: 'true', msg: 'Schedule Updated Successfully' });
      }
    });
  }