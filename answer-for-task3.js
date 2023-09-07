//Answer for task3

const workDayStart = '09:00';
const workDayEnd = '19:00';

let schedules = [
    [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
    [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
    [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']]
];

const newScheduleDurationInMinutes = 60;

function findFreeSlots(busySlots) {  
    // Convert busy slots to minutes since midnight for easier comparison
    const busySlotsMinutes = busySlots.map(slot => ({
      start: parseTime(slot[0]),
      end: parseTime(slot[1])
    }));
  
    // Sort busy slots by start time
    busySlotsMinutes.sort((a, b) => a.start - b.start);
  
    const freeSlots = [];
  
    // Check for a gap at the beginning of the day
    if (busySlotsMinutes[0].start > parseTime(workDayStart)) {
      freeSlots.push({
        freeSlot: [workDayStart, formatTime(busySlotsMinutes[0].start)],
        durationInMinutes: compareTime(workDayStart, formatTime(busySlotsMinutes[0].start))
      });
    }
  
    // Find gaps between busy slots
    for (let i = 0; i < busySlotsMinutes.length - 1; i++) {
      const currentSlot = busySlotsMinutes[i];
      const nextSlot = busySlotsMinutes[i + 1];
      const currentSlotEnd = currentSlot.end;
      const nextSlotStart = nextSlot.start;
  
      if (nextSlotStart > currentSlotEnd) {
        freeSlots.push({
            freeSlot: [formatTime(currentSlotEnd), formatTime(nextSlotStart)],
            durationInMinutes: compareTime(formatTime(currentSlotEnd), formatTime(nextSlotStart))
        });
      }
    }
  
    // Check for a gap at the end of the day
    if (busySlotsMinutes[busySlotsMinutes.length - 1].end < parseTime(workDayEnd)) {
      freeSlots.push({
        freeSlot: [formatTime(busySlotsMinutes[busySlotsMinutes.length - 1].end), workDayEnd],
        durationInMinutes: compareTime(formatTime(busySlotsMinutes[busySlotsMinutes.length - 1].end), workDayEnd)
      });
    }
  
    return freeSlots;
  }

// function getTimeDifferenceInMinutes(time1, time2) {
//     const [hours1, minutes1] = time1.split(':').map(Number);
//     const [hours2, minutes2] = time2.split(':').map(Number);
    
//     const date1 = new Date(0, 0, 0, hours1, minutes1);
//     const date2 = new Date(0, 0, 0, hours2, minutes2);
    
//     const timeDifferenceInMilliseconds = date2 - date1;
//     const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60);
    
//     return Math.abs(timeDifferenceInMinutes);
// }

function findLatestTime(timeArray) {
    if (timeArray.length === 0) {
      return null;
    }

    let latestTime = parseTime(timeArray[0]);
    let latestIndex = 0;
  
    for (let i = 1; i < timeArray.length; i++) {
      const currentTime = parseTime(timeArray[i]);
  
      if (currentTime > latestTime) {
        latestTime = currentTime;
        latestIndex = i;
      }
    }
  
    return timeArray[latestIndex];
}

function compareTime(currentSlotEnd, nextSlotStart) {
    return parseTime(nextSlotStart) - parseTime(currentSlotEnd);
}

function findEarliestTime(timeArray) {
    if (timeArray.length === 0) {
      return null; // No times to compare
    }
  
    // Initialize variables to store the earliest time and its index
    let earliestTime = parseTime(timeArray[0]);
    let earliestIndex = 0;
  
    for (let i = 1; i < timeArray.length; i++) {
      const currentTime = parseTime(timeArray[i]);
  
      if (currentTime < earliestTime) {
        earliestTime = currentTime;
        earliestIndex = i;
      }
    }
  
    return timeArray[earliestIndex];
}
  
function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

const schedulesFilter1 = schedules.map((busySlots) => {
    const freeSlots = findFreeSlots(busySlots);
    return freeSlots;
});

const schedulesFilter2 = schedulesFilter1.filter((freeSlots) => {
    const newItem = freeSlots.filter((freeSlotObject) => {
        if(newScheduleDurationInMinutes < freeSlotObject.durationInMinutes) {
            return true;
        }
        return false;
    })
    return newItem.length > 0 ? true : false;
})

if(schedulesFilter2.length !== schedules.length) {
  return null;
}

const bestSlots = [];
let currentTime = parseTime('00:00');
for(const item of schedulesFilter2) {
    const slots = [];
    for(const freeslotObject of item) {
        slots.push(freeslotObject.freeSlot[0]);
    }
    let earliest = findEarliestTime(slots);

    do {
        if(currentTime < parseTime(earliest)) {
            currentTime = parseTime(earliest); 
        }  else {
            slots.shift();
            earliest = findEarliestTime(slots);
        }
    }
    while(parseTime(earliest) < currentTime);
    bestSlots.push(earliest);
}

const bestTimeForNewMeeting = findLatestTime(bestSlots);
console.log(bestTimeForNewMeeting);