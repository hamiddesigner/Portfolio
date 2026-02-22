// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', function() {
        const theme = htmlElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Scroll Progress Bar and Navbar Background
    const navbar = document.querySelector('.navbar');
    const progressBar = document.querySelector('.nav-progress');

    function updateScrollElements() {
        // Calculate scroll progress
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        // Update progress bar width
        progressBar.style.width = scrollPercent + '%';
        
        // Add scrolled class to navbar when scrolled past hero section
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Call on load and scroll
    updateScrollElements();
    window.addEventListener('scroll', updateScrollElements);

    // FAQ Toggle Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const toggle = item.querySelector('.faq-toggle');
        
        item.addEventListener('click', function() {
            // Toggle the FAQ item
            const isExpanded = toggle.textContent === '−';
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                const otherToggle = otherItem.querySelector('.faq-toggle');
                if (otherItem !== item) {
                    otherToggle.textContent = '+';
                }
            });
            
            // Toggle current item
            toggle.textContent = isExpanded ? '+' : '−';
        });
    });
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        // Only apply hover effect to non-locked cards
        if (!card.classList.contains('locked')) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
        
        // Add click handler for locked cards
        if (card.classList.contains('locked')) {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                // Password functionality will be implemented later
                console.log('This case study is locked. Authentication will be required.');
            });
        }
    });

    // Calendar Functionality
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthDisplay = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const timeSlotsView = document.getElementById('timeSlotsView');
    const bookingFormView = document.getElementById('bookingFormView');
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    const bookingForm = document.getElementById('bookingForm');
    const backBtn = document.getElementById('backBtn');
    const bookingSummaryDate = document.getElementById('bookingSummaryDate');
    const bookingSummaryTime = document.getElementById('bookingSummaryTime');
    const confirmationView = document.getElementById('confirmationView');
    const confirmationDate = document.getElementById('confirmationDate');
    const confirmationTime = document.getElementById('confirmationTime');
    const newBookingBtn = document.getElementById('newBookingBtn');

    // Available time slots (can be managed from admin later)
    const availableTimeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM'
    ];

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Track if calendar dates should be clickable
    let calendarClickable = true;

    function generateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Update month display
        currentMonthDisplay.textContent = `${months[month]} ${year}`;
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Get today's date (set time to midnight for comparison)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Add previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-date other-month disabled';
            dayDiv.textContent = daysInPrevMonth - i;
            calendarGrid.appendChild(dayDiv);
        }
        
        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-date';
            dayDiv.textContent = day;
            
            // Create date for comparison
            const currentDateObj = new Date(year, month, day);
            currentDateObj.setHours(0, 0, 0, 0);
            
            // Check if date is in the past
            const isPast = currentDateObj < today;
            
            // Check if it's today
            const isToday = day === today.getDate() && 
                month === today.getMonth() && 
                year === today.getFullYear();
            
            if (isToday) {
                dayDiv.classList.add('today');
            }
            
            // Disable past dates
            if (isPast) {
                dayDiv.classList.add('disabled');
            }
            
            // Check if it's the selected date
            if (selectedDate && 
                day === selectedDate.getDate() &&
                month === selectedDate.getMonth() &&
                year === selectedDate.getFullYear()) {
                dayDiv.classList.add('selected');
            }
            
            // Add click event only for non-disabled dates
            if (!isPast) {
                dayDiv.addEventListener('click', function() {
                    if (calendarClickable) {
                        selectDate(year, month, day);
                    }
                });
            }
            
            calendarGrid.appendChild(dayDiv);
        }
        
        // Add next month's leading days
        const totalCells = firstDay + daysInMonth;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= remainingCells; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-date other-month';
            dayDiv.textContent = i;
            calendarGrid.appendChild(dayDiv);
        }
    }

    function selectDate(year, month, day) {
        selectedDate = new Date(year, month, day);
        const dateString = `${weekdays[selectedDate.getDay()]}, ${months[month]} ${day}, ${year}`;
        
        selectedDateDisplay.textContent = dateString;
        selectedDateDisplay.style.display = 'block';
        showTimeSlots();
        generateCalendar(currentDate); // Refresh to update selected state
    }

    function showTimeSlots() {
        timeSlotsGrid.innerHTML = '';
        
        availableTimeSlots.forEach(time => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'time-slot';
            slotDiv.textContent = time;
            
            slotDiv.addEventListener('click', function() {
                selectedTime = time;
                showBookingForm();
            });
            
            timeSlotsGrid.appendChild(slotDiv);
        });
    }

    function showBookingForm() {
        // Disable calendar clicks
        calendarClickable = false;
        
        // Hide time slots view
        timeSlotsView.style.display = 'none';
        
        // Show booking form view
        bookingFormView.style.display = 'flex';
        
        // Update summary
        const dateString = `${weekdays[selectedDate.getDay()]}, ${months[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
        bookingSummaryDate.textContent = dateString;
        
        // Parse time for display
        const timeMatch = selectedTime.match(/(\d+):(\d+) (AM|PM)/);
        const hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2];
        const period = timeMatch[3];
        
        let endHour = hour;
        let endPeriod = period;
        
        if (minute === '30') {
            endHour = hour + 1;
            if (endHour === 12) {
                endPeriod = period === 'AM' ? 'PM' : 'AM';
            } else if (endHour === 13) {
                endHour = 1;
                endPeriod = 'PM';
            }
        }
        
        const endMinute = minute === '00' ? '30' : '00';
        const timeDisplay = `${selectedTime} – ${endHour}:${endMinute} ${endPeriod}`;
        
        bookingSummaryTime.textContent = timeDisplay;
    }

    function showTimeSlotsList() {
        // Re-enable calendar clicks
        calendarClickable = true;
        
        timeSlotsView.style.display = 'flex';
        bookingFormView.style.display = 'none';
        confirmationView.style.display = 'none';
    }

    function showConfirmation() {
        // Disable calendar clicks
        calendarClickable = false;
        
        timeSlotsView.style.display = 'none';
        bookingFormView.style.display = 'none';
        confirmationView.style.display = 'flex';
        
        console.log('Showing confirmation for:', selectedDate, selectedTime);
        
        // Update confirmation details
        const dateString = `${weekdays[selectedDate.getDay()]}, ${months[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
        confirmationDate.textContent = dateString;
        
        if (!selectedTime) {
            console.error('No time selected');
            return;
        }
        
        // Calculate end time (30 minutes later)
        const [time, period] = selectedTime.split(' ');
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        let minute = parseInt(minutes);
        
        minute += 30;
        if (minute >= 60) {
            minute -= 60;
            hour += 1;
        }
        
        let endPeriod = period;
        if (hour > 12) {
            hour -= 12;
        } else if (hour === 12 && minute > 0) {
            endPeriod = period === 'AM' ? 'PM' : 'AM';
        }
        
        const endTime = `${hour}:${minute.toString().padStart(2, '0')} ${endPeriod}`;
        const timeDisplay = `${selectedTime} - ${endTime}`;
        confirmationTime.textContent = timeDisplay;
    }

    // Month navigation
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });

    // Back button
    backBtn.addEventListener('click', function() {
        showTimeSlotsList();
    });

    // Handle form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if time was selected
        if (!selectedTime) {
            alert('Please select a time slot before booking');
            showTimeSlotsList();
            return;
        }
        
        const nameInput = this.querySelector('input[type="text"]');
        const emailInput = this.querySelector('input[type="email"]');
        const notesInput = this.querySelector('textarea');
        const guestsInput = this.querySelectorAll('.form-group input[type="text"]')[1];
        
        const name = nameInput ? nameInput.value : '';
        const email = emailInput ? emailInput.value : '';
        const notes = notesInput ? notesInput.value : '';
        const guests = guestsInput ? guestsInput.value : '';
        
        // This will be connected to your admin panel/backend later
        console.log('Booking submitted:', {
            date: selectedDate,
            time: selectedTime,
            name: name,
            email: email,
            notes: notes,
            guests: guests
        });
        
        // Show confirmation view
        showConfirmation();
        this.reset();
    });

    // New booking button
    newBookingBtn.addEventListener('click', function() {
        showTimeSlotsList();
    });

    // Initialize calendar
    generateCalendar(currentDate);
    
    // Auto-select today's date and show available times
    const today = new Date();
    selectDate(today.getFullYear(), today.getMonth(), today.getDate());
});
