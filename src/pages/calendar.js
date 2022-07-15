import React, { useState, useMemo, useCallback } from 'react'
import {
   Calendar,
   Views,
   momentLocalizer
} from 'react-big-calendar'
import moment from 'moment'
import { meetings } from '../data'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import ArrowLeft from '../assets/icons/ArrowLeftIcon'
import ArrowRight from '../assets/icons/ArrowRightIcon'
import CloseIcon from '../assets/icons/CloseIcon'
import ClockIcon from '../assets/icons/ClockIcon'
import EditPencilIcon from '../assets/icons/EditPencilIcon'
import TrashBinIcon from '../assets/icons/TrashBinIcon'
import CopyIcon from '../assets/icons/CopyIcon'
import DefaultAvatarIcon from '../assets/icons/DefaultAvatarIcon'
import TextMessageIcon from '../assets/icons/TextMessageIcon'
import DocumentIcon from '../assets/icons/DocumentIcon'
import DownloadIcon from '../assets/icons/DownloadIcon'
import ShareIcon from '../assets/icons/ShareIcon'

import 'react-tabs/style/react-tabs.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../App.css'

function BigCalendar() {
   const [myEvents, setMyEvents] = useState(meetings)
   const localizer = momentLocalizer(moment)
   const [isShowDetails, setShowDetails] = useState(false)
   const [currentView, setCurrentView] = useState(Views.MONTH)
   const [meetingDetails, setMeetingDetails] = useState({})

   const toggleMeetingDetails = (event) => {
      setShowDetails(true)
      setMeetingDetails(event)
   }

   const MyCustomEvent = useCallback((props) => {
      return (
         <div
            onClick={() => toggleMeetingDetails(props.event)}
            style={{
               fontSize: currentView === Views.DAY ? 16 : 12,
               height: '100%',
            }}
         >
            <span style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{props.title}</span>
            <br />
            {currentView === Views.DAY
               ? (
                  <>
                     {moment(props.event.start).format('LT')} - {moment(props.event.end).format('LT')}
                  </>
               )
               : moment(props.event.start).format('LT')
            }
         </div>
      )
   }, [currentView])


   const MyToolbar = useCallback((props) => {
      const handleViewClick = (view) => {
         console.log(view)
         setCurrentView(view)
         props.onView(view)

         if (view === Views.WEEK || view === Views.DAY) {
            const elements = document.getElementsByClassName("rbc-event");
            const firstElement = elements[0];
            firstElement.scrollIntoView({ behavior: "smooth", block: "center" });
         }
      }

      return (
         <div className="toolbar">
            <div className="toolbar-left">
               <button onClick={() => props.onNavigate("PREV")}><ArrowLeft /></button>
               <button onClick={() => props.onNavigate("NEXT")}><ArrowRight /></button>
               <h2 className="date-label">
                  {currentView === Views.DAY
                     ? moment(props.date).format("DD MMMM, YYYY")
                     : moment(props.date).format("MMMM, YYYY")
                  }
               </h2>
            </div>

            <form className="toolbar-right">
               <input className="radio-custom" type="radio" id="monthly" name="view" value="month" style={{ display: 'none' }} />
               <label onClick={() => handleViewClick(Views.MONTH)} htmlFor="monthly" style={{ cursor: 'pointer', background: currentView === Views.MONTH ? '#EB008B' : 'transparent', color: currentView === Views.MONTH ? 'white' : 'black' }}>Monthly</label>
               <input className="radio-custom" type="radio" id="weekly" name="view" value="week" style={{ display: 'none' }} />
               <label onClick={() => handleViewClick(Views.WEEK)} htmlFor="weekly" style={{ cursor: 'pointer', background: currentView === Views.WEEK ? '#EB008B' : 'transparent', color: currentView === Views.WEEK ? 'white' : 'black' }}>Weekly</label>
               <input className="radio-custom" type="radio" id="daily" name="view" value="day" style={{ display: 'none' }} />
               <label onClick={() => handleViewClick(Views.DAY)} htmlFor="daily" style={{ cursor: 'pointer', background: currentView === Views.DAY ? '#EB008B' : 'transparent', color: currentView === Views.DAY ? 'white' : 'black' }}>Daily</label>
            </form>
         </div>
      )
   }, [currentView])

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
         <div className="header-container">
            <h1 style={{ margin: 0, marginBottom: 8, fontSize: 26 }}>Meeting Schedule</h1>
            <p style={{ margin: 0, marginBottom: 32 }}>Lorem ipsum dolor sit amet</p>
         </div>
         <div className="calendar-container">
            <Calendar
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
                  onClick={() => setShowDetails(false)}
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
                           className="close-icon-container"
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
                           margin: "0 0 30px 0"
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
                              {moment(meetingDetails.start).format('dddd, DD MMMM YYYY').toUpperCase()}
                              {" "}
                              |
                              {" "}
                              {moment(meetingDetails.start).format('hh:mm')}
                              -
                              {moment(meetingDetails.end).format('hh:mm')}
                              {" "}
                              {moment(meetingDetails.end).format('A')}
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
                                 {meetingDetails.title}
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
                           <div style={{ fontSize: 14 }}>
                              Meeting starts in an hour
                           </div>
                        </div>
                     </div>
                     <Tabs
                        selectedTabClassName='selected-tab'
                     >
                        <TabList>
                           <Tab>Details</Tab>
                           <Tab>Recordings</Tab>
                           <Tab>Chatroom</Tab>
                           <Tab>Other Files/Docs</Tab>
                        </TabList>

                        <TabPanel>
                           <div
                              style={{
                                 display: 'flex',
                                 justifyContent: 'flex-start',
                                 alignItems: 'flex-start',
                                 gap: 75,
                                 padding: '45px 0 0 0'
                              }}
                           >
                              <div
                                 style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                 }}
                              >

                                 <h2 style={{ margin: 0, marginBottom: 30 }}>Meeting Information</h2>
                                 <div
                                    style={{
                                       display: 'flex',
                                       justifyContent: 'flex-start',
                                       alignItems: 'center',
                                       gap: 24,
                                       margin: 0,
                                       marginBottom: 14
                                    }}
                                 >
                                    <button
                                       style={{
                                          backgroundColor: '#EB008B',
                                          borderRadius: '96px',
                                          padding: '14px 18px',
                                          fontSize: 16,
                                          color: 'white',
                                          border: 'none',
                                          cursor: 'pointer',
                                       }}
                                    >
                                       Start Meeting
                                    </button>
                                    <div
                                       style={{
                                          display: 'flex',
                                          justifyContent: 'flex-start',
                                          alignItems: 'center',
                                          gap: 8,
                                          cursor: 'pointer'
                                       }}
                                    >
                                       <CopyIcon />
                                       <span style={{ color: '#AAAAAA', fontSize: '12px' }}>Copy meeting details</span>
                                    </div>
                                 </div>
                                 <a style={{ fontSize: '14px' }} href="https://meeting.ehashtag.id.com/898-wmb-sun">meeting.ehashtag.id.com/898-wmb-sun</a>
                                 {Boolean(meetingDetails.meetingNotes) && (
                                    <div
                                       style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          width: '100%',
                                          border: '1px dashed #AAAAAA',
                                          borderRadius: 10,
                                          padding: '10px 20px',
                                          margin: '34px 0 0 0'
                                       }}
                                    >
                                       <div
                                          style={{
                                             display: 'flex',
                                             alignItems: 'center',
                                             gap: 12
                                          }}
                                       >
                                          <DocumentIcon />
                                          <div
                                             style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                fontSize: '14px'
                                             }}
                                          >
                                             <span>{meetingDetails.meetingNotes.title}</span>
                                             <span style={{ color: '#2BBECB' }}>View Notes</span>
                                          </div>
                                       </div>
                                       <div
                                          style={{
                                             display: 'flex',
                                             alignItems: 'center',
                                             gap: 12
                                          }}
                                       >
                                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 30, width: 30, backgroundColor: '#D5FAFD', borderRadius: '50%' }}><DownloadIcon /></div>
                                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 30, width: 30, backgroundColor: '#D5FAFD', borderRadius: '50%' }}><ShareIcon /></div>
                                       </div>
                                    </div>
                                 )}
                              </div>
                              <div>
                                 <h2 style={{ margin: 0, marginBottom: 30 }}>Participants</h2>
                                 <div
                                    style={{
                                       display: 'flex',
                                       flexDirection: 'column',
                                       justifyContent: 'flex-start',
                                       gap: 16,
                                       width: '100%'
                                    }}
                                 >
                                    {meetingDetails.participants.map((participant, index) => {
                                       return (
                                          <div
                                             style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: 10,
                                             }}
                                          >
                                             <div
                                                style={{
                                                   display: 'flex',
                                                   justifyContent: 'flex-start',
                                                   alignItems: 'center',
                                                   gap: 10,
                                                }}
                                             >
                                                {participant.fromContact ? (
                                                   <div
                                                      style={{
                                                         width: 32,
                                                         height: 32,
                                                         borderRadius: '50%',
                                                         backgroundColor: '#D5FAFD',
                                                         color: '#1E858E',
                                                         display: 'flex',
                                                         justifyContent: 'center',
                                                         alignItems: 'center',
                                                         fontSize: '14px'
                                                      }}
                                                   >
                                                      {participant.name.split(" ")[0][0]}{participant.name.split(" ")[1][0]}
                                                   </div>
                                                ) : (
                                                   <DefaultAvatarIcon />
                                                )}
                                                <div style={{ fontSize: '14px' }}>{participant.name}</div>
                                             </div>

                                             {participant.fromContact && (
                                                <div
                                                   style={{
                                                      display: 'flex',
                                                      justifyContent: 'flex-end',
                                                      alignItems: 'center',
                                                      gap: 5,
                                                      cursor: 'pointer'
                                                   }}
                                                >
                                                   <TextMessageIcon />
                                                   <div style={{ color: '#AAAAAA', fontSize: '10px' }}>Send message</div>
                                                </div>
                                             )}

                                          </div>
                                       )
                                    })}
                                 </div>
                              </div>
                           </div>
                        </TabPanel>
                        <TabPanel>
                           <h2>Any content 2</h2>
                        </TabPanel>
                        <TabPanel>
                           <h2>Any content 3</h2>
                        </TabPanel>
                        <TabPanel>
                           <h2>Any content 4</h2>
                        </TabPanel>
                     </Tabs>

                  </div>
               </div>
            </div>
         )}
      </div>
   )
}

export default BigCalendar