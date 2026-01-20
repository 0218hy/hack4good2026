#Problem statement 
MINDS: How might we reduce friction in activity sign-ups for both individuals and
caregivers, while reducing manual effort for staff in managing and
consolidating registration data?

# MINDS Acitivity Hub
A responsive, accessible web application for booking and managing charity activities for MINDS.

## Project Overview
- Full-stack website for comprehensive activity booking and management system for MINDS
- Frontend: React + Vite (minds/)
- Backend: Go lang + sqlc (backend/)
- Status: Currently transitioning from mock frontend data to full backend.

##  Key Features
### Multi-Role User System
- **4 Distinct User Roles**: Participants, Caregivers, Volunteers, and Staff
- **Role-Based Registration & Dashboards**: Personalized interfaces for each user role 

### Activity Management
- **Calendar & List Views**: Dual view options for browsing activities
- **Advanced Filtering**: Filter by accessibility needs (wheelchair, sign language), date, capacity
- **Activity Signup/Cancellation**
- **Recurring Activities**: Full support for weekly, biweekly, and monthly recurring events
- **Conflict Detection**: Automatic detection of scheduling conflicts when booking activities

### Accessibility Features
- **High Contrast Design**: Optimized for users with visual impairments
- **Accessibility Indicators**: Clear labels for wheelchair accessibility and sign language support

### Bilingual Interface
- **English & Chinese Support**
- **Dual Display Mode**: Buttons and filters show both languages simultaneously
- **Language Toggle**: Activity-specific content switches based on language selection

### Staff Administrative Panel
- **Activity Creation & Management**
- **Register Account Management**
- **Participant/Caregiver Management**
- **Volunteer Management**
- **Activity Statistics**
- **Attendance Tracking**: Mark attendance and manage payment status

### Caregiver Features
- **Participant Profile Management**: Manage accessibility needs and preferences

### Participant & Volunteer Features
- **Browse Activities**
- **My Registered Activities**
- **Capacity Indicators**: Real-time vacancy information
- **Status Badges**: Clear OPEN/FULL/CLOSED status indicators

## Tech Stack
- **Frontend Framework**: React with TypeScript
- **Backend Framework**: Go lang with go-chi, postgreSQL, sqlc

## Getting started
1. Run the backend in backend
    ```go run cmd/*.go```
2. Run the frontend in minds
    ```npm i```
    ```npm run dev```

## Usage

1. **Landing Page**: Start at the main landing page
2. **Register**: Registration will be only done by staff to ensure the identity of participant, caregiver and the volunteer
3. **Login**: Use email + phone number to log in (for non-staff), Use email + password to log in (for staff)
4. **Dashboard**: Access your role-specific dashboard to browse and manage activities

## User Roles Explained
### Participant
- Browse and register for activities
- View registered activities in calendar/list format
- Cancel registrations
- View activity details and requirements

### Caregiver
- All participant features
- Register participants under their care
- Option to accompany participants to activities
- Manage participant accessibility needs

### Volunteer
- Browse activities needing volunteers
- Register as volunteer for activities
- View volunteer commitments
- Separate volunteer capacity tracking from participants

### Staff
- Create and manage all activities
- Create user accounts for all roles
- View and manage all participants, caregivers, and volunteers
- Edit participant profiles and caregiver information
- Track attendance and payment status
- View statistics of activities
- Delete activities and user accounts


## Design Principles
1. **Accessibility First**: High contrast, clear labels, keyboard navigation
2. **Bilingual Support**: Display both English and Chinese
3. **Intuitive Navigation**: Clear user flows and minimal clicks
4. **Visual Feedback**: Status indicators, confirmation indicators


## Future Enhancement
- Payment page 
- Full language toggle (English / Chinese / Melayu / Tamil)
- Accessibility button (bigger text, high contrast, screen-reader mode)


