import React, { useState, useMemo, useCallback } from 'react'
import {
   Calendar,
   Views,
   momentLocalizer
} from 'react-big-calendar'
import moment from 'moment'
import { events } from './data'
import * as dates from './utils/dates'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './App.css'

function BigCalendar() {
   const [myEvents, setMyEvents] = useState(events)
   const DnDCalendar = withDragAndDrop(Calendar)
   const localizer = momentLocalizer(moment)

   const { components, defaultDate } = useMemo(() => ({
      components: {

      },
      defaultDate: new Date(),
   }), [])

   const moveEvent = useCallback(({
      event,
      start,
      end,
      resourceId,
      isAllDay: droppedOnAllDaySlot = false,
   }) => {
      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
         event.allDay = true
      }

      setMyEvents((prev) => {
         const existing = prev.find((ev) => ev.id === event.id) ?? {}
         const filtered = prev.filter((ev) => ev.id !== event.id)
         return [...filtered, { ...existing, start, end, resourceId, allDay }]
      })
   }, [setMyEvents])

   const resizeEvent = useCallback(({
      event,
      start,
      end
   }) => {
      setMyEvents((prev) => {
         const existing = prev.find((ev) => ev.id === event.id) ?? {}
         const filtered = prev.filter((ev) => ev.id !== event.id)
         return [...filtered, { ...existing, start, end }]
      })
   }, [setMyEvents])

   return (
      <div className="container">
         {/* <div
            style={{
               position: 'fixed',
               height: '100vh',
               width: 250,
               display: 'flex',
               flexDirection: 'column',
               gap: 10,
               alignItems: 'center',
            }}
         >
            <h1>Calendar</h1>
         </div> */}
         <h1>Calendar</h1>
         <div className="calendar-container">
            <DnDCalendar
               components={components}
               selectable
               step={15}
               defaultDate={defaultDate}
               defaultView={Views.MONTH}
               events={myEvents}
               localizer={localizer}
               onEventDrop={moveEvent}
               onEventResize={resizeEvent}
               popup
               resizable
            />
         </div>
      </div>
   )
}

export default BigCalendar