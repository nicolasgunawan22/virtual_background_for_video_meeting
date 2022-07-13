import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import { events } from './data'
function Calendar() {
   return (
      <div>
         <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            weekends={false}
            events={events}
            eventDidMount={(info) => console.log(info.event.extendedProps)}
            eventClick={(info) => {
               info.jsEvent.preventDefault();

               if (info.event.url) {
                  window.open(info.event.url);
               }
            }}
            eventResizableFromStart={true}
            editable={true}
            droppable={true}
         />
      </div>
   )
}

export default Calendar