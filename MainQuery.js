// first find the DBs 
   show dbs

// Then select or go to to inside DB
use ZenClassProgramme

//  Then Create the collection inside the db
   db.createCollection("users")  
   db.createCollection("codekata")
   db.createCollection("attendance")
   db.createCollection("topics")
   db.createCollection("tasks")
   db.createCollection("company_drives")
   db.createCollection("mentors")

   show collections

//Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020 

db.company_drives.find({
   Date: {
     $gt: "15 oct 2020",
     $lt: "31 oct 2020"
   }
 })


// Find all the company drives and students who are appeared for the placement.

db.company_drives.find({
   Placement_status:"pass"  }
 )


// Find the number of problems solved by the user in codekata

db.users.aggregate([
   {
      $lookup:{
         from:"codekata",
         localField:"user_name",
         foreignField:"user_name",
         as:"No of problem solved"
      }
   },
   {
      $project:
      {
         _id:0,
         user_name:1,
         batch:1,
         HowMuchcodesolved:"$No of problem solved.HowMuchcode_solved"
      }
   },
   {$unwind:"$HowMuchcodesolved"}
  
])


// Find all the mentors with who has the mentee's count more than 15

db.users.aggregate([
   {
     $lookup: {
       from: "mentors",
       localField: "batch",
       foreignField: "batch",
       as: "mentorInfo",
     },
   },
   {
     $group: {
       _id: {
         mentorId: "$mentorInfo.batch",
         mentorName: "$mentorInfo.mentor_name",
       },
       menteeCount: { $sum: 1 },
     },
   },
   {
     $match: {
       menteeCount: { $gt: 15 },
     },
   },
 ]);

// Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020

db.attendance.aggregate([
  {
    $lookup: {
      from: "tasks",
      localField: "user_name",
      foreignField: "user_name",
      as: "taskInfo"
    },
  },
  {
    $group:{
      _id:{
        username :"$taskInfo.user_name",
        userstatus :"$status",
        userTaskStatus :"$taskInfo.Task_status",
        userDate:"$Date"
      },
    },
  },
  {
    $match: {
      userstatus: "absent",
      userTaskStatus :"not Submitted"
    }
  },
  {
    $match: {
      date: {
        $gte: ISODate("2020-10-15"),
        $lte: ISODate("2020-10-31")
      }
    }
  }
]);



//  Find all the topics and tasks which are thought in the month of October

db.topics.aggregate([
  {
    $lookup:{
      from:"tasks",
      localField: "Date",
      foreignField: "Date",
      as: "taskInfo"
    },
    },
    {
      $group:{
        _id:{
          userstatus :"$taskInfo.Task_Name",
          userTaskStatus :"$Topic",
          userDate:"$Date"
        },
      },
    },
    {
      $match: {
        date: {
          $gte: ISODate("2023-10-01"),
          $lte: ISODate("2023-10-31")
        }
      }
    }
  
])