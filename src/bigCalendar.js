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

import ArrowLeft from './assets/icons/ArrowLeftIcon'
import ArrowRight from './assets/icons/ArrowRightIcon'
import CloseIcon from './assets/icons/CloseIcon'
import ClockIcon from './assets/icons/ClockIcon'
import EditPencilIcon from './assets/icons/EditPencilIcon'
import TrashBinIcon from './assets/icons/TrashBinIcon'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './App.css'

function BigCalendar() {
   const [myEvents, setMyEvents] = useState(events)
   const DnDCalendar = withDragAndDrop(Calendar)
   const localizer = momentLocalizer(moment)
   const [isShowDetails, setShowDetails] = useState(false)
   const [currentView, setCurrentView] = useState(Views.MONTH)

   const handleOnView = (view) => {
      setCurrentView(view)
   }

   const toggleMeetingDetails = (event) => {
      setShowDetails(true)
   }

   const MyCustomEvent = useCallback((props) => {
      return (
         <div className="custom-event" onClick={() => toggleMeetingDetails(props.event)}>
            <span style={{ fontWeight: 'bold' }}>{props.title}</span>
            <br />
            {moment(props.event.start).format('LT')}
         </div>
      )
   }, [])


   const MyToolbar = useCallback((props) => {
      const handleViewClick = (view) => {
         console.log(view)
         setCurrentView(view)
         props.onView(view)
      }

      return (
         <div className="toolbar">
            <div className="toolbar-left">
               <button onClick={() => props.onNavigate("PREV")}><ArrowLeft /></button>
               <button onClick={() => props.onNavigate("NEXT")}><ArrowRight /></button>
               <h2 className="date-label">
                  {currentView === Views.DAY
                     ? moment(props.date).format("DD MMMM, YYYY")
                     : currentView === Views.WEEK
                        ? moment(props.date).format("DD MMMM, YYYY")
                        : moment(props.date).format("MMMM, YYYY")

                  }
               </h2>
            </div>

            <form className="toolbar-right">
               <input className="radio-custom" type="radio" id="monthly" name="view" value="month" style={{ display: 'none' }} />
               <label onClick={() => handleViewClick(Views.MONTH)} htmlFor="monthly" style={{ background: currentView === Views.MONTH ? '#EB008B' : 'transparent', color: currentView === Views.MONTH ? 'white' : 'black' }}>Monthly</label>
               <input className="radio-custom" type="radio" id="weekly" name="view" value="week" style={{ display: 'none' }} />
               <label onClick={() => handleViewClick(Views.WEEK)} htmlFor="weekly" style={{ background: currentView === Views.WEEK ? '#EB008B' : 'transparent', color: currentView === Views.WEEK ? 'white' : 'black' }}>Weekly</label>
               <input className="radio-custom" type="radio" id="daily" name="view" value="day" style={{ display: 'none' }} />
               <label onClick={() => handleViewClick(Views.DAY)} htmlFor="daily" style={{ background: currentView === Views.DAY ? '#EB008B' : 'transparent', color: currentView === Views.DAY ? 'white' : 'black' }}>Daily</label>
            </form>
         </div>
      )
   }, [currentView])

   const CustomEventWrapper = (props) => {
      console.log({ props })
      return (
         <div
            style={{
               overflow: 'hidden',
               backgroundColor: '#2bbecb',
               color: 'white',
               whiteSpace: 'nowrap'
            }}

         >
            <div className="custom-event" onClick={() => toggleMeetingDetails(props.event)}>
               <span style={{ fontWeight: 'bold' }}>{props.event.title}</span>
               <br />
               {moment(props.event.start).format('LT')}
            </div>
         </div>
      )
   }

   const { components, defaultDate, defaultView } = useMemo(() => ({
      components: {
         toolbar: MyToolbar,
         day: {
            event: MyCustomEvent
         },
         week: {
            event: MyCustomEvent
         },
         month: {
            event: MyCustomEvent,
            // eventWrapper: CustomEventWrapper
         },
      },
      defaultDate: new Date(),
      defaultView: Views.MONTH
   }), [MyCustomEvent, MyToolbar])

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
         <h1 style={{ marginBottom: 16 }}>Meeting Schedule</h1>
         <p style={{ margin: 0, marginBottom: 50 }}>Lorem ipsum dolor sit amet</p>
         <div className="calendar-container">
            <DnDCalendar
               components={components}
               selectable
               step={15}
               defaultDate={defaultDate}
               defaultView={defaultView}
               events={myEvents}
               localizer={localizer}
               onEventDrop={moveEvent}
               onEventResize={resizeEvent}
               popup
               resizable
            />
         </div>

         {isShowDetails && (
            <div>
               <div
                  style={{
                     position: "fixed",
                     zIndex: 10,
                     top: 0,
                     left: 0,
                     right: 0,
                     bottom: 0,
                     background: '#3C3C3C',
                     opacity: '70%'
                  }}
               >
               </div>
               <div
                  style={{
                     position: "fixed",
                     minHeight: 615,
                     width: "min(80%, 940px)",
                     zIndex: 11,
                     margin: 'auto',
                     left: 0,
                     right: 0,
                     top: 'calc(50% - 615px/2)',
                     background: '#FFFFFF',
                     borderRadius: '20px'
                  }}
               >
                  <div
                     style={{
                        padding: '32px 40px'
                     }}
                  >
                     <div
                        style={{
                           display: 'flex',
                           justifyContent: 'flex-end',
                        }}
                     >
                        <span
                           onClick={() => setShowDetails(false)}
                        >
                           <CloseIcon />
                        </span>
                     </div>
                     <div
                        style={{
                           display: 'flex',
                           justifyContent: 'flex-start',
                           alignItems: 'flex-start',
                           gap: 20,
                        }}
                     >
                        <div
                           style={{
                              background: '#C6EEF1',
                              padding: 12,
                              borderRadius: '50%',
                              display: 'flex',
                              justifyContent: 'center'
                           }}
                        >
                           <ClockIcon />
                        </div>
                        <div
                           style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 14,
                           }}
                        >
                           <div
                              style={{
                                 fontWeight: 600,
                                 fontSize: 12,
                                 letterSpacing: "0.08em"
                              }}
                           >
                              THURSDAY, 12 JULY 2022   |   09:00 - 10:00 AM
                           </div>
                           <div
                              style={{
                                 display: 'flex',
                                 justifyContent: 'flex-start',
                                 alignItems: 'center',
                                 gap: 18,
                              }}
                           >
                              <h2
                                 style={{
                                    fontSize: 30,
                                    margin: 0,
                                    color: '#2BBECB'
                                 }}
                              >
                                 Meeting with Dayu
                              </h2>
                              <div
                                 style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                 }}
                              >
                                 <EditPencilIcon />
                              </div>
                              <div
                                 style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                 }}
                              >
                                 <TrashBinIcon />
                              </div>
                           </div>
                           <div style={{ fontSize: 14, }}>
                              Meeting starts in an hour
                           </div>
                        </div>
                     </div>
                     <div
                        style={{
                           display: 'flex',
                           justifyContent: 'flex-start',
                           alignItems: 'flex-start',
                           gap: 75,
                        }}
                     >
                        <div>
                           <h2>Meeting Information</h2>
                        </div>
                        <div>
                           <h2>Participants</h2>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}

export default BigCalendar