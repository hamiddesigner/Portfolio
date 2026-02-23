import { useState, useEffect } from 'react';
import { Calendar, Globe, Save, Plus, Trash2, X, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import './Availability.css';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABELS = {
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday'
};

const TIMEZONES = [
  'Asia/Karachi',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Australia/Sydney',
  'UTC'
];

export default function Availability() {
  const [weeklySchedule, setWeeklySchedule] = useState({
    sunday: { enabled: false, timeRanges: [] },
    monday: { enabled: false, timeRanges: [] },
    tuesday: { enabled: false, timeRanges: [] },
    wednesday: { enabled: false, timeRanges: [] },
    thursday: { enabled: false, timeRanges: [] },
    friday: { enabled: false, timeRanges: [] },
    saturday: { enabled: false, timeRanges: [] }
  });

  const [timezone, setTimezone] = useState('Asia/Karachi');
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copySource, setCopySource] = useState({ day: null, rangeIndex: null });
  const [selectedDays, setSelectedDays] = useState([]);
  
  const [specificDates, setSpecificDates] = useState([]);
  const [meetingSettings, setMeetingSettings] = useState({
    defaultDuration: 30,
    bufferBefore: 5,
    bufferAfter: 5,
    minimumNotice: 24 // hours
  });

  const [meetingTypes, setMeetingTypes] = useState([
    {
      id: Date.now(),
      name: '30-minute meeting',
      duration: 30,
      description: ['Align on your goals', 'Answer questions', 'Plan next steps'],
      isActive: true
    }
  ]);

  const [bookingPageSettings, setBookingPageSettings] = useState({
    name: 'Hamid Ali',
    avatar: '',
    videoMeeting: 'Cal Video',
    socialProof: {
      title: "Friends I've designed with:",
      companies: ['Seen Finance', 'Mastercard', 'Sable Money', 'Airbnb', 'Red Bull', 'Google']
    }
  });

  const [showDateModal, setShowDateModal] = useState(false);
  const [dateForm, setDateForm] = useState({
    date: '',
    timeFrom: '09:00',
    timeTo: '17:00',
    type: 'unavailable',
    reason: ''
  });
  const [editingDate, setEditingDate] = useState(null);

  const [showMeetingTypeModal, setShowMeetingTypeModal] = useState(false);
  const [meetingTypeForm, setMeetingTypeForm] = useState({
    name: '',
    duration: 30,
    description: ['']
  });
  const [editingMeetingType, setEditingMeetingType] = useState(null);

  const [scheduleTemplates, setScheduleTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('availability_schedule');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        
        // Validate and migrate weeklySchedule structure
        if (data.weeklySchedule) {
          const isOldStructure = DAYS.some(day => 
            Array.isArray(data.weeklySchedule[day])
          );
          
          if (isOldStructure) {
            // Migrate old structure to new structure
            const migratedSchedule = {};
            DAYS.forEach(day => {
              migratedSchedule[day] = {
                enabled: data.weeklySchedule[day] && data.weeklySchedule[day].length > 0,
                timeRanges: []
              };
            });
            setWeeklySchedule(migratedSchedule);
          } else {
            // New structure - validate it has correct shape
            const isValid = DAYS.every(day => 
              data.weeklySchedule[day] && 
              typeof data.weeklySchedule[day].enabled === 'boolean' &&
              Array.isArray(data.weeklySchedule[day].timeRanges)
            );
            
            if (isValid) {
              setWeeklySchedule(data.weeklySchedule);
            }
          }
        }
        
        setTimezone(data.timezone || 'Asia/Karachi');
        setSpecificDates(data.specificDates || []);
        setMeetingSettings(data.meetingSettings || meetingSettings);
        setMeetingTypes(data.meetingTypes || meetingTypes);
        setBookingPageSettings(data.bookingPageSettings || bookingPageSettings);
        setScheduleTemplates(data.scheduleTemplates || []);
      } catch (error) {
        console.error('Error loading availability data:', error);
      }
    }
  }, []);

  // Save to localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem('availability_schedule', JSON.stringify(data));
  };

  // Helper to get complete data object
  const getCompleteData = (overrides = {}) => {
    return {
      weeklySchedule,
      timezone,
      specificDates,
      meetingSettings,
      meetingTypes,
      bookingPageSettings,
      scheduleTemplates,
      ...overrides
    };
  };

  // Toggle day enabled/disabled
  const toggleDay = (day) => {
    const currentDay = weeklySchedule[day] || { enabled: false, timeRanges: [] };
    const newSchedule = {
      ...weeklySchedule,
      [day]: {
        ...currentDay,
        enabled: !currentDay.enabled
      }
    };
    setWeeklySchedule(newSchedule);
    saveToLocalStorage(getCompleteData({ weeklySchedule: newSchedule }));
  };

  // Add time range to a day
  const addTimeRange = (day) => {
    const currentDay = weeklySchedule[day] || { enabled: false, timeRanges: [] };
    const newSchedule = {
      ...weeklySchedule,
      [day]: {
        ...currentDay,
        enabled: true,
        timeRanges: [
          ...currentDay.timeRanges,
          { from: '12:00', to: '14:00' }
        ]
      }
    };
    setWeeklySchedule(newSchedule);
    saveToLocalStorage(getCompleteData({ weeklySchedule: newSchedule }));
  };

  // Update time range
  const updateTimeRange = (day, rangeIndex, field, value) => {
    const currentDay = weeklySchedule[day] || { enabled: false, timeRanges: [] };
    const newRanges = [...currentDay.timeRanges];
    newRanges[rangeIndex] = {
      ...newRanges[rangeIndex],
      [field]: value
    };
    
    const newSchedule = {
      ...weeklySchedule,
      [day]: {
        ...currentDay,
        timeRanges: newRanges
      }
    };
    setWeeklySchedule(newSchedule);
    saveToLocalStorage(getCompleteData({ weeklySchedule: newSchedule }));
  };

  // Delete time range
  const deleteTimeRange = (day, rangeIndex) => {
    const currentDay = weeklySchedule[day] || { enabled: false, timeRanges: [] };
    const newRanges = currentDay.timeRanges.filter((_, i) => i !== rangeIndex);
    const newSchedule = {
      ...weeklySchedule,
      [day]: {
        ...currentDay,
        timeRanges: newRanges,
        enabled: newRanges.length > 0 ? currentDay.enabled : false
      }
    };
    setWeeklySchedule(newSchedule);
    saveToLocalStorage(getCompleteData({ weeklySchedule: newSchedule }));
    toast.success('Time range deleted');
  };

  // Open copy modal
  const openCopyModal = (day, rangeIndex) => {
    setCopySource({ day, rangeIndex });
    setSelectedDays([]);
    setShowCopyModal(true);
  };

  // Toggle day selection in copy modal
  const toggleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Apply copy to selected days
  const applyCopy = () => {
    if (selectedDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    const sourceDay = weeklySchedule[copySource.day] || { enabled: false, timeRanges: [] };
    const sourceRange = sourceDay.timeRanges[copySource.rangeIndex];
    
    if (!sourceRange) {
      toast.error('Source time range not found');
      return;
    }
    
    const newSchedule = { ...weeklySchedule };

    selectedDays.forEach(day => {
      const currentDay = newSchedule[day] || { enabled: false, timeRanges: [] };
      newSchedule[day] = {
        ...currentDay,
        enabled: true,
        timeRanges: [...currentDay.timeRanges, { ...sourceRange }]
      };
    });

    setWeeklySchedule(newSchedule);
    saveToLocalStorage(getCompleteData({ weeklySchedule: newSchedule }));
    setShowCopyModal(false);
    toast.success(`Time range copied to ${selectedDays.length} day(s)`);
  };

  // Select all slots (preset)
  const selectAll = () => {
    const newSchedule = {};
    DAYS.forEach(day => {
      newSchedule[day] = {
        enabled: true,
        timeRanges: [{ from: '09:00', to: '17:00' }]
      };
    });
    setWeeklySchedule(newSchedule);
    saveToLocalStorage(getCompleteData({ weeklySchedule: newSchedule }));
    toast.success('All days set to 9 AM - 5 PM');
  };

  // Clear all slots
  const clearAll = () => {
    const newSchedule = {};
    DAYS.forEach(day => {
      newSchedule[day] = { enabled: false, timeRanges: [] };
    });
    setWeeklySchedule(newSchedule);
    saveToLocalStorage(getCompleteData({ weeklySchedule: newSchedule }));
    toast.success('All time slots cleared');
  };

  // Apply preset
  const applyPreset = (preset) => {
    let newSchedule = {};
    
    if (preset === 'weekdays9to5') {
      DAYS.forEach(day => {
        if (['saturday', 'sunday'].includes(day)) {
          newSchedule[day] = { enabled: false, timeRanges: [] };
        } else {
          newSchedule[day] = {
            enabled: true,
            timeRanges: [{ from: '09:00', to: '17:00' }]
          };
        }
      });
      toast.success('Weekdays 9-5 preset applied');
    } else if (preset === 'weekends') {
      DAYS.forEach(day => {
        if (['saturday', 'sunday'].includes(day)) {
          newSchedule[day] = {
            enabled: true,
            timeRanges: [{ from: '09:00', to: '17:00' }]
          };
        } else {
          newSchedule[day] = { enabled: false, timeRanges: [] };
        }
      });
      toast.success('Weekends only preset applied');
    } else if (preset === 'evenings') {
      DAYS.forEach(day => {
        newSchedule[day] = {
          enabled: true,
          timeRanges: [{ from: '18:00', to: '21:00' }]
        };
      });
      toast.success('Evening hours preset applied');
    }
    
    setWeeklySchedule(newSchedule);
    saveToLocalStorage(getCompleteData({ weeklySchedule: newSchedule }));
  };

  // Handle timezone change
  const handleTimezoneChange = (newTimezone) => {
    setTimezone(newTimezone);
    saveToLocalStorage(getCompleteData({ timezone: newTimezone }));
    toast.success('Timezone updated');
  };

  // Open add date modal
  const openAddDate = () => {
    setDateForm({
      date: '',
      timeFrom: '09:00',
      timeTo: '17:00',
      type: 'unavailable',
      reason: ''
    });
    setEditingDate(null);
    setShowDateModal(true);
  };

  // Open edit date modal
  const openEditDate = (dateOverride) => {
    setDateForm({
      date: dateOverride.date,
      timeFrom: dateOverride.timeRange.from,
      timeTo: dateOverride.timeRange.to,
      type: dateOverride.type,
      reason: dateOverride.reason
    });
    setEditingDate(dateOverride);
    setShowDateModal(true);
  };

  // Save specific date override
  const saveSpecificDate = () => {
    if (!dateForm.date) {
      toast.error('Please select a date');
      return;
    }

    if (dateForm.timeFrom >= dateForm.timeTo) {
      toast.error('End time must be after start time');
      return;
    }

    const dateOverride = {
      id: editingDate ? editingDate.id : Date.now().toString(),
      date: dateForm.date,
      timeRange: {
        from: dateForm.timeFrom,
        to: dateForm.timeTo
      },
      type: dateForm.type,
      reason: dateForm.reason
    };

    let updatedDates;
    if (editingDate) {
      updatedDates = specificDates.map(d => d.id === editingDate.id ? dateOverride : d);
      toast.success('Date override updated');
    } else {
      updatedDates = [...specificDates, dateOverride];
      toast.success('Date override added');
    }

    setSpecificDates(updatedDates);
    saveToLocalStorage(getCompleteData({ specificDates: updatedDates }));
    setShowDateModal(false);
  };

  // Delete specific date
  const deleteSpecificDate = (id) => {
    const updatedDates = specificDates.filter(d => d.id !== id);
    setSpecificDates(updatedDates);
    saveToLocalStorage(getCompleteData({ specificDates: updatedDates }));
    toast.success('Date override deleted');
  };

  // Save meeting settings
  const saveMeetingSettings = () => {
    saveToLocalStorage(getCompleteData());
    toast.success('Meeting settings saved');
  };

  // Meeting Type Handlers
  const openMeetingTypeModal = (meetingType = null) => {
    if (meetingType) {
      setEditingMeetingType(meetingType.id);
      setMeetingTypeForm({
        name: meetingType.name,
        duration: meetingType.duration,
        description: [...meetingType.description]
      });
    } else {
      setEditingMeetingType(null);
      setMeetingTypeForm({
        name: '',
        duration: 30,
        description: ['']
      });
    }
    setShowMeetingTypeModal(true);
  };

  const saveMeetingType = () => {
    if (!meetingTypeForm.name.trim()) {
      toast.error('Please enter a meeting type name');
      return;
    }

    const filteredDescription = meetingTypeForm.description.filter(d => d.trim() !== '');
    
    if (editingMeetingType) {
      // Update existing
      const updated = meetingTypes.map(mt =>
        mt.id === editingMeetingType
          ? { ...mt, name: meetingTypeForm.name, duration: meetingTypeForm.duration, description: filteredDescription }
          : mt
      );
      setMeetingTypes(updated);
      saveToLocalStorage(getCompleteData({ meetingTypes: updated }));
      toast.success('Meeting type updated');
    } else {
      // Add new
      const newType = {
        id: Date.now(),
        name: meetingTypeForm.name,
        duration: meetingTypeForm.duration,
        description: filteredDescription,
        isActive: true
      };
      const updated = [...meetingTypes, newType];
      setMeetingTypes(updated);
      saveToLocalStorage(getCompleteData({ meetingTypes: updated }));
      toast.success('Meeting type added');
    }

    setShowMeetingTypeModal(false);
  };

  const deleteMeetingType = (id) => {
    if (!window.confirm('Are you sure you want to delete this meeting type?')) return;
    
    const updated = meetingTypes.filter(mt => mt.id !== id);
    setMeetingTypes(updated);
    saveToLocalStorage(getCompleteData({ meetingTypes: updated }));
    toast.success('Meeting type deleted');
  };

  const toggleMeetingTypeActive = (id) => {
    const updated = meetingTypes.map(mt =>
      mt.id === id ? { ...mt, isActive: !mt.isActive } : mt
    );
    setMeetingTypes(updated);
    saveToLocalStorage(getCompleteData({ meetingTypes: updated }));
  };

  const addDescriptionPoint = () => {
    setMeetingTypeForm({
      ...meetingTypeForm,
      description: [...meetingTypeForm.description, '']
    });
  };

  const updateDescriptionPoint = (index, value) => {
    const updated = [...meetingTypeForm.description];
    updated[index] = value;
    setMeetingTypeForm({ ...meetingTypeForm, description: updated });
  };

  const removeDescriptionPoint = (index) => {
    setMeetingTypeForm({
      ...meetingTypeForm,
      description: meetingTypeForm.description.filter((_, i) => i !== index)
    });
  };

  // Booking Page Settings Handlers
  const updateBookingPageSettings = (field, value) => {
    const updated = { ...bookingPageSettings, [field]: value };
    setBookingPageSettings(updated);
    saveToLocalStorage(getCompleteData({ bookingPageSettings: updated }));
  };

  const updateSocialProof = (field, value) => {
    const updated = {
      ...bookingPageSettings,
      socialProof: { ...bookingPageSettings.socialProof, [field]: value }
    };
    setBookingPageSettings(updated);
    saveToLocalStorage(getCompleteData({ bookingPageSettings: updated }));
  };

  const addCompany = (company) => {
    if (!company.trim()) return;
    const updated = {
      ...bookingPageSettings,
      socialProof: {
        ...bookingPageSettings.socialProof,
        companies: [...bookingPageSettings.socialProof.companies, company.trim()]
      }
    };
    setBookingPageSettings(updated);
    saveToLocalStorage(getCompleteData({ bookingPageSettings: updated }));
  };

  const removeCompany = (index) => {
    const updated = {
      ...bookingPageSettings,
      socialProof: {
        ...bookingPageSettings.socialProof,
        companies: bookingPageSettings.socialProof.companies.filter((_, i) => i !== index)
      }
    };
    setBookingPageSettings(updated);
    saveToLocalStorage(getCompleteData({ bookingPageSettings: updated }));
  };

  // Schedule Template Handlers
  const saveAsTemplate = () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: templateName.trim(),
      weeklySchedule: JSON.parse(JSON.stringify(weeklySchedule)), // Deep copy
      createdAt: new Date().toISOString()
    };

    const updated = [...scheduleTemplates, newTemplate];
    setScheduleTemplates(updated);
    saveToLocalStorage(getCompleteData({ scheduleTemplates: updated }));
    setShowTemplateModal(false);
    setTemplateName('');
    toast.success(`Template "${newTemplate.name}" saved`);
  };

  const applyTemplate = (template) => {
    if (!window.confirm(`Apply "${template.name}" template? This will replace your current weekly schedule.`)) {
      return;
    }

    setWeeklySchedule(JSON.parse(JSON.stringify(template.weeklySchedule))); // Deep copy
    saveToLocalStorage(getCompleteData({ weeklySchedule: template.weeklySchedule }));
    toast.success(`Template "${template.name}" applied`);
  };

  const deleteTemplate = (id) => {
    const template = scheduleTemplates.find(t => t.id === id);
    if (!window.confirm(`Delete template "${template?.name}"?`)) return;

    const updated = scheduleTemplates.filter(t => t.id !== id);
    setScheduleTemplates(updated);
    saveToLocalStorage(getCompleteData({ scheduleTemplates: updated }));
    toast.success('Template deleted');
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="availability-page">
      <div className="admin-container">
        <div className="page-header">
          <h1>Manage Availability</h1>
        </div>

        {/* Weekly Schedule */}
        <div className="availability-section">
          <h2>Weekly Schedule</h2>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="btn-secondary" onClick={clearAll}>
              Clear All
            </button>
            <button className="btn-secondary" onClick={() => applyPreset('weekdays9to5')}>
              Weekdays 9-5
            </button>
            <button className="btn-secondary" onClick={() => applyPreset('weekends')}>
              Weekends Only
            </button>
            <button className="btn-secondary" onClick={() => applyPreset('evenings')}>
              Evening Hours
            </button>
          </div>

          {/* Days with Time Ranges */}
          <div className="days-list">
            {DAYS.map(day => (
              <div key={day} className="day-item">
                {weeklySchedule[day]?.enabled && weeklySchedule[day]?.timeRanges?.length > 0 ? (
                  <div className="time-ranges">
                    {weeklySchedule[day]?.timeRanges?.map((range, index) => (
                      <div key={index} className="time-range-row">
                        {index === 0 && (
                          <>
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={weeklySchedule[day]?.enabled || false}
                                onChange={() => toggleDay(day)}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                            <span className="day-name">{DAY_LABELS[day]}</span>
                          </>
                        )}
                        {index > 0 && <div className="day-spacer"></div>}
                        <input
                          type="time"
                          value={range.from}
                          onChange={(e) => updateTimeRange(day, index, 'from', e.target.value)}
                        />
                        <span className="time-separator">-</span>
                        <input
                          type="time"
                          value={range.to}
                          onChange={(e) => updateTimeRange(day, index, 'to', e.target.value)}
                        />
                        <button
                          className="icon-button"
                          onClick={() => addTimeRange(day)}
                          title="Add new time slot"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          className="icon-button"
                          onClick={() => openCopyModal(day, index)}
                          title="Copy to other days"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          className="icon-button danger"
                          onClick={() => deleteTimeRange(day, index)}
                          title="Delete time slot"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="day-row-disabled">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={weeklySchedule[day]?.enabled || false}
                        onChange={() => toggleDay(day)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="day-name">{DAY_LABELS[day]}</span>
                    <button
                      className="btn-secondary add-first-slot"
                      onClick={() => addTimeRange(day)}
                    >
                      <Plus size={16} />
                      Add new time slot
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Timezone Selector */}
          <div className="timezone-selector">
            <label>
              <Globe size={16} />
              Timezone
            </label>
            <select value={timezone} onChange={(e) => handleTimezoneChange(e.target.value)}>
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Copy Times Modal */}
        {showCopyModal && (
          <div className="modal-overlay" onClick={() => setShowCopyModal(false)}>
            <div className="modal-content copy-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>COPY TIMES TO</h3>
                <button className="modal-close" onClick={() => setShowCopyModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="day-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedDays.length === DAYS.filter(d => d !== copySource.day).length}
                      onChange={() => {
                        if (selectedDays.length === DAYS.filter(d => d !== copySource.day).length) {
                          setSelectedDays([]);
                        } else {
                          setSelectedDays(DAYS.filter(d => d !== copySource.day));
                        }
                      }}
                    />
                    <span>Select all</span>
                  </label>

                  {DAYS.filter(d => d !== copySource.day).map(day => (
                    <label key={day} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={() => toggleDaySelection(day)}
                      />
                      <span>{DAY_LABELS[day]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowCopyModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={applyCopy}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Specific Dates */}
        <div className="availability-section">
          <div className="section-header">
            <h2>Special Dates</h2>
            <button className="btn-primary" onClick={openAddDate}>
              <Plus size={16} />
              Add Date Override
            </button>
          </div>

          {specificDates.length === 0 ? (
            <p className="empty-state">No special dates set. Add date overrides for vacations, holidays, or special availability.</p>
          ) : (
            <div className="dates-list">
              {specificDates.map(dateOverride => (
                <div key={dateOverride.id} className="date-item">
                  <div className="date-info">
                    <div className="date-main">
                      <Calendar size={16} />
                      <span className="date-text">{formatDate(dateOverride.date)}</span>
                      <span className={`date-type ${dateOverride.type}`}>
                        {dateOverride.type === 'available' ? 'Available' : dateOverride.type === 'unavailable' ? 'Unavailable' : 'Busy'}
                      </span>
                    </div>
                    <div className="date-details">
                      {dateOverride.timeRange.from} - {dateOverride.timeRange.to}
                      {dateOverride.reason && ` • ${dateOverride.reason}`}
                    </div>
                  </div>
                  <div className="date-actions">
                    <button className="btn-icon" onClick={() => openEditDate(dateOverride)}>
                      Edit
                    </button>
                    <button className="btn-icon danger" onClick={() => deleteSpecificDate(dateOverride.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meeting Settings */}
        <div className="availability-section">
          <h2>Meeting Settings</h2>
          
          <div className="settings-grid">
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={bookingPageSettings.name}
                onChange={(e) => updateBookingPageSettings('name', e.target.value)}
                placeholder="e.g., Hamid Ali"
              />
            </div>

            <div className="form-group">
              <label>Video Meeting Platform</label>
              <select
                value={bookingPageSettings.videoMeeting || 'Cal Video'}
                onChange={(e) => updateBookingPageSettings('videoMeeting', e.target.value)}
              >
                <option value="Cal Video">Cal Video</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Around">Around</option>
                <option value="Phone Call">Phone Call</option>
                <option value="In Person">In Person</option>
              </select>
            </div>

            <div className="form-group">
              <label>Default Meeting Duration</label>
              <select
                value={meetingSettings.defaultDuration}
                onChange={(e) => setMeetingSettings({ ...meetingSettings, defaultDuration: parseInt(e.target.value) })}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Buffer Before Meetings</label>
              <select
                value={meetingSettings.bufferBefore}
                onChange={(e) => setMeetingSettings({ ...meetingSettings, bufferBefore: parseInt(e.target.value) })}
              >
                <option value={0}>None</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Buffer After Meetings</label>
              <select
                value={meetingSettings.bufferAfter}
                onChange={(e) => setMeetingSettings({ ...meetingSettings, bufferAfter: parseInt(e.target.value) })}
              >
                <option value={0}>None</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Minimum Notice Required</label>
              <select
                value={meetingSettings.minimumNotice}
                onChange={(e) => setMeetingSettings({ ...meetingSettings, minimumNotice: parseInt(e.target.value) })}
              >
                <option value={0}>No minimum</option>
                <option value={2}>2 hours</option>
                <option value={4}>4 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={72}>3 days</option>
                <option value={168}>1 week</option>
              </select>
            </div>
          </div>

          <button className="btn-primary" onClick={saveMeetingSettings}>
            <Save size={16} />
            Save Meeting Settings
          </button>
        </div>
      </div>

      {/* Date Override Modal */}
      {showDateModal && (
        <div className="modal-overlay" onClick={() => setShowDateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingDate ? 'Edit Date Override' : 'Add Date Override'}</h3>
              <button className="modal-close" onClick={() => setShowDateModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={dateForm.date}
                  onChange={(e) => setDateForm({ ...dateForm, date: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>From Time *</label>
                  <input
                    type="time"
                    value={dateForm.timeFrom}
                    onChange={(e) => setDateForm({ ...dateForm, timeFrom: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>To Time *</label>
                  <input
                    type="time"
                    value={dateForm.timeTo}
                    onChange={(e) => setDateForm({ ...dateForm, timeTo: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Type *</label>
                <select
                  value={dateForm.type}
                  onChange={(e) => setDateForm({ ...dateForm, type: e.target.value })}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="busy">Busy</option>
                </select>
              </div>

              <div className="form-group">
                <label>Reason (optional)</label>
                <input
                  type="text"
                  value={dateForm.reason}
                  onChange={(e) => setDateForm({ ...dateForm, reason: e.target.value })}
                  placeholder="e.g., Vacation, Conference, Holiday"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDateModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={saveSpecificDate}>
                <Save size={16} />
                {editingDate ? 'Update' : 'Add'} Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Type Modal */}
      {showMeetingTypeModal && (
        <div className="modal-overlay" onClick={() => setShowMeetingTypeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingMeetingType ? 'Edit Meeting Type' : 'Add Meeting Type'}</h3>
              <button className="modal-close" onClick={() => setShowMeetingTypeModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Meeting Name *</label>
                <input
                  type="text"
                  value={meetingTypeForm.name}
                  onChange={(e) => setMeetingTypeForm({ ...meetingTypeForm, name: e.target.value })}
                  placeholder="e.g., 30-minute meeting"
                />
              </div>

              <div className="form-group">
                <label>Duration *</label>
                <select
                  value={meetingTypeForm.duration}
                  onChange={(e) => setMeetingTypeForm({ ...meetingTypeForm, duration: parseInt(e.target.value) })}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description Points</label>
                <div className="description-points">
                  {meetingTypeForm.description.map((point, idx) => (
                    <div key={idx} className="description-point-row">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updateDescriptionPoint(idx, e.target.value)}
                        placeholder="e.g., Align on your goals"
                      />
                      {meetingTypeForm.description.length > 1 && (
                        <button
                          className="icon-btn icon-btn-danger"
                          onClick={() => removeDescriptionPoint(idx)}
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className="btn-secondary"
                    onClick={addDescriptionPoint}
                  >
                    <Plus size={16} />
                    Add Point
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowMeetingTypeModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={saveMeetingType}>
                <Save size={16} />
                {editingMeetingType ? 'Update' : 'Add'} Meeting Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
