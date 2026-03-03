# PRD - Daily Task Roulette App

## 1. Product Overview

### Product Name
Daily Task Roulette

### Product Summary
A mobile-first web app that lets a user maintain a pool of tasks, spin a daily roulette to randomly select one task, accept it or reroll up to 3 times per day, complete it, and archive it automatically so it no longer appears in future roulettes.

The app supports two pre-created users:
- Dian
- Brilly

Both users use the same initial password:
- `password123`

### Primary Goal
Turn a large task backlog (for example 100 tasks) into a fun, low-friction daily action system that encourages progress through gamified random selection.

### Core Value Proposition
- Reduces decision fatigue by choosing a task for the user
- Makes task selection fun and interactive
- Prevents endless avoidance by limiting rerolls to 3 per day
- Keeps the active pool clean by archiving completed tasks automatically
- Supports multiple users with separate task pools, reroll limits, and history

## 2. Objectives

### Business / Product Objectives
- Provide a simple but delightful daily engagement loop
- Encourage users to complete at least one task per day
- Make task entry fast enough for bulk import (100 tasks pasted in one action)
- Ensure mobile usability is excellent, since this is expected to be used casually throughout the day

### User Objectives
- Add many tasks quickly
- Spin and get a surprise task
- Reject a task and reroll when needed, but with a hard daily limit
- Mark a task as done with minimal friction
- Review archived completed tasks later

## 3. Users

### Initial Users
1. **Dian**
2. **Brilly**

### Authentication Requirements
- Username-based login
- Password-based login
- Seed the database with two users on first setup:
  - `Dian / password123`
  - `Brilly / password123`
- Passwords must be hashed in the database (never stored in plain text)
- Both users are standard users (no admin role required for v1)

## 4. Core Use Cases

### Use Case 1: Bulk Add Tasks
A user pastes up to 100 tasks (or more) into a textarea, one task per line, then submits. The system creates one task per non-empty line.

### Use Case 2: Daily Roulette Spin
A user opens the app and spins the roulette. The system randomly selects one eligible active task for that user.

### Use Case 3: Accept Task
The user accepts the selected task as today's chosen task. That task becomes the user's current daily task.

### Use Case 4: Reroll Task
The user does not want the shown task and rerolls. The system selects another eligible task, and increments the daily reroll count. The user can reroll up to 3 times per day.

### Use Case 5: Finish Task
The user completes the accepted task and marks it as finished. The task is automatically moved to archive and removed from future roulette selection.

### Use Case 6: Review Archive
The user opens the archive page and views all completed tasks, ordered by most recently finished.

## 5. Scope

### In Scope (v1)
- Login and logout
- Two seeded users
- Task CRUD (minimum: create, list, archive-on-complete)
- Bulk task import via newline-separated text
- Daily roulette selection
- Accept selected task
- Reroll up to 3 times per user per day
- Mark task as finished
- Archive completed tasks
- Mobile-first responsive UI
- Modern, playful, polished UX

### Out of Scope (v1)
- Social sharing
- Push notifications
- Multi-device sync conflict handling beyond normal DB persistence
- Task categories, tags, due dates, priorities
- Collaborative tasks across users
- Admin dashboard
- Analytics beyond simple counts

## 6. Functional Requirements

### 6.1 Authentication
1. The app must provide a login screen.
2. Users log in with username and password.
3. Sessions must persist securely.
4. Logged-in users can log out.
5. A logged-in user can only access their own tasks, daily roulette state, and archive.

### 6.2 Task Creation
1. The app must provide a bulk input textarea.
2. Users can paste multiple tasks separated by newline.
3. On submit, each non-empty line becomes one task.
4. Blank lines must be ignored.
5. Leading/trailing whitespace must be trimmed.
6. Duplicate lines may be allowed in v1 unless deduplication is explicitly added.
7. Newly created tasks default to `active`.

### 6.3 Task Pool Management
1. Users must see their active task count.
2. Users must be able to view a list of active tasks.
3. Tasks marked as finished must move to archive.
4. Archived tasks must not appear in roulette anymore.

### 6.4 Roulette Logic
1. A user can spin only from their own active, non-archived tasks.
2. The roulette must randomly choose from eligible tasks.
3. The selected task should be displayed prominently in a fun, animated way.
4. If the user has no active tasks, the app must show a clear empty state and prompt them to add tasks.
5. If the user already accepted a task for the day and has not finished it, the app should show that accepted task as the current task.

### 6.5 Accept Task
1. After a roulette spin, the user can tap `Accept`.
2. Accepted task becomes the current selected task for that day.
3. The app must clearly indicate that this is today's accepted task.
4. Once accepted, the user can mark it as finished.

### 6.6 Reroll Rules
1. A user can reroll a shown task up to 3 times per day.
2. The daily reroll count resets at local day boundary.
3. The UI must show remaining rerolls (for example: `2 of 3 rerolls left`).
4. Once the user reaches 3 rerolls, reroll must be disabled for the rest of the day.
5. The system should avoid immediately repeating the same task in the same roulette session if other eligible tasks exist.

### 6.7 Finish Task
1. An accepted task can be marked `Finished`.
2. On finish, the task status changes to `archived`.
3. The task receives a completion timestamp.
4. The current daily task slot becomes empty after completion.
5. The finished task disappears from the active pool immediately.

### 6.8 Archive
1. Users must be able to view archived tasks.
2. Archive entries show at least:
   - task text
   - completion date/time
3. Archive should be sorted newest first by default.

## 7. UX / UI Requirements

### Design Direction
The app should feel:
- Modern
- Cool
- Fun to interact with
- Clean and premium
- Lightweight, not cluttered

### UX Principles
- Mobile-first before desktop expansion
- Fast task entry
- One-thumb friendly interactions
- High visual feedback for key actions
- Clear daily progression: spin -> decide -> do -> finish

### Visual Style
- Rounded cards and panels
- Smooth micro-animations
- Confetti or positive success feedback when a task is finished
- Engaging roulette reveal animation
- Soft gradients, polished shadows, vivid accent colors used tastefully
- Large tap targets
- Sticky bottom action area on mobile where useful

### Key Screens
1. **Login Screen**
   - Username
   - Password
   - Login button
   - Simple, visually appealing layout

2. **Home / Today Screen**
   - Greeting with username
   - Active task count
   - Current rerolls left today
   - Primary roulette card
   - Current accepted task section (if any)
   - Main CTA buttons: Spin, Accept, Reroll, Finish

3. **Add Tasks Screen**
   - Large textarea for newline-separated task input
   - Helper text: one task per line
   - Import button
   - Preview count before saving (recommended)

4. **Active Tasks Screen**
   - Scrollable list of active tasks
   - Simple clean card list

5. **Archive Screen**
   - Completed tasks list
   - Completion timestamp visible

### Mobile-First Notes
- Base layout optimized for 360px-430px widths
- Bottom navigation preferred for core sections:
  - Today
  - Add
  - Active
  - Archive
- Desktop version can expand into a centered max-width app shell

## 8. User Flows

### Flow A: First Login
1. User opens app
2. Login with seeded credentials
3. Lands on Today screen
4. Empty state appears if no tasks yet
5. User is prompted to add tasks

### Flow B: Add 100 Tasks
1. User opens Add screen
2. Pastes 100 lines into textarea
3. Taps Import
4. System trims and saves all non-empty lines
5. Success state shows number of tasks imported
6. User returns to Today screen

### Flow C: Daily Roulette
1. User taps Spin
2. App animates selection
3. Task is revealed
4. User chooses:
   - Accept, or
   - Reroll
5. If reroll chosen and rerolls remain, a new task is shown and reroll count decreases
6. If accepted, task becomes today's current task

### Flow D: Complete Task
1. User opens Today screen
2. Sees accepted task
3. Taps Finish
4. Task moves to archive
5. Success feedback appears
6. Today screen resets to no active accepted task

## 9. Business Rules

1. Tasks belong to exactly one user.
2. Users cannot see or affect each other's tasks.
3. Only active tasks are eligible for roulette.
4. Archived tasks are permanently excluded from roulette unless a future restore feature is added.
5. Reroll limit is 3 per user per calendar day.
6. Reroll count resets daily.
7. Finishing a task archives it immediately.
8. If there is only one eligible active task, reroll is allowed but will not change the result unless product decides to disable reroll in this case. Recommended v1 behavior: disable reroll when there is only one eligible task remaining in the current session.

## 10. Suggested Data Model (SQLite)

### Table: `users`
- `id` (integer, primary key)
- `username` (text, unique, not null)
- `password_hash` (text, not null)
- `created_at` (datetime, not null)
- `updated_at` (datetime, not null)

### Table: `tasks`
- `id` (integer, primary key)
- `user_id` (integer, foreign key -> users.id)
- `title` (text, not null)
- `status` (text, not null) - values: `active`, `archived`
- `created_at` (datetime, not null)
- `updated_at` (datetime, not null)
- `completed_at` (datetime, nullable)

### Table: `daily_task_state`
Tracks the current day state per user.
- `id` (integer, primary key)
- `user_id` (integer, foreign key -> users.id)
- `date_key` (text, not null) - format `YYYY-MM-DD`
- `current_task_id` (integer, nullable, foreign key -> tasks.id)
- `reroll_count` (integer, not null, default 0)
- `created_at` (datetime, not null)
- `updated_at` (datetime, not null)

#### Unique Constraint
- Unique on (`user_id`, `date_key`)

### Optional Table: `roulette_sessions` (nice-to-have)
Used if you want stronger prevention of repeated tasks within the same spin session.
- `id`
- `user_id`
- `date_key`
- `shown_task_ids_json`
- `last_shown_task_id`
- timestamps

For v1, this can be skipped if the repeat-avoidance logic is handled in memory/server action state.

## 11. Technical Requirements

### Tech Stack
- **Frontend**: Next.js (App Router)
- **Backend**: Next.js route handlers / server actions
- **Database**: SQLite
- **ORM**: Prisma (recommended)
- **Auth**: NextAuth or custom session auth (custom is acceptable for simple seeded users)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui recommended
- **Animation**: Framer Motion recommended

### Architecture Notes
- Mobile-first responsive layout
- Server-side validation for all important actions
- Seed script for initial users
- Clear separation of:
  - auth
  - task management
  - roulette logic
  - daily state logic

### Suggested Project Structure
- `app/(auth)/login`
- `app/(app)/today`
- `app/(app)/add`
- `app/(app)/active`
- `app/(app)/archive`
- `app/api/...` or server actions
- `lib/auth`
- `lib/db`
- `lib/roulette`
- `prisma/schema.prisma`

## 12. Roulette Logic Specification

### Eligibility Filter
Eligible tasks are:
- owned by current user
- status = `active`
- not already finished

### Daily State Resolution
When user opens Today screen:
1. Resolve today's `date_key`
2. Load or create `daily_task_state`
3. If `current_task_id` exists and task is still active, show it as today's accepted task
4. If `current_task_id` is archived, clear it

### Spin Logic
1. Get eligible tasks
2. If no tasks, return empty state
3. If a current accepted task already exists, do not spin another unless product explicitly allows replacing it. Recommended v1: block new spin until current accepted task is finished.
4. Randomly select a task
5. Prefer a task that was not just shown in the same session, if possible

### Reroll Logic
1. Verify no accepted task exists yet for today
2. Verify `reroll_count < 3`
3. Increment reroll count
4. Select a different eligible task if possible
5. Return updated task and remaining rerolls

### Accept Logic
1. Save selected task as `current_task_id` for today's state
2. Lock in the daily choice until finished

### Finish Logic
1. Verify accepted task exists and belongs to current user
2. Update task status to `archived`
3. Set `completed_at`
4. Clear `current_task_id`

## 13. Validation Rules

- Username required
- Password required
- Bulk task textarea can be empty, but submission should show validation error if zero valid lines found
- Each imported task line max length recommended: 200-300 chars
- Ignore duplicate blank lines
- Prevent users from modifying other users' records
- Prevent finishing a task that is not the current accepted task (recommended for v1 consistency)

## 14. Error and Empty States

### Empty States
- No tasks yet: prompt to add tasks
- No archive yet: show encouraging message
- No accepted task today: prompt user to spin

### Error States
- Invalid login credentials
- No rerolls remaining today
- No eligible tasks available
- Current task no longer exists
- Bulk import contains zero valid tasks

Errors should be friendly, short, and non-technical.

## 15. Security Requirements

- Passwords must be hashed using bcrypt/argon2
- Session cookie must be secure and HTTP-only where applicable
- Server-side authorization checks on every mutating action
- No client-only trust for reroll limits or task completion

## 16. Non-Functional Requirements

- Fast load on mobile networks
- Smooth animation without feeling heavy
- Accessible touch targets and readable text sizes
- Reliable daily state persistence across refreshes
- Works well in latest mobile Chrome and Safari

## 17. Acceptance Criteria

### Authentication
- User can log in as Dian with `password123`
- User can log in as Brilly with `password123`
- User session persists after refresh

### Bulk Input
- User can paste 100 newline-separated tasks and import them successfully
- Each non-empty line becomes an active task

### Roulette
- User can spin and receive a random active task
- User can reroll up to 3 times in one day
- On the 4th reroll attempt, reroll is blocked
- Reroll resets the next day

### Completion
- User can accept a task
- User can mark the accepted task as finished
- Finished task moves to archive
- Finished task no longer appears in roulette pool

### Multi-user Separation
- Dian and Brilly have separate task pools and daily states
- One user cannot see the other's tasks

### UX
- Core flows are easy on mobile
- Buttons are clearly tappable
- Visual feedback is satisfying and clear

## 18. Seed Data Requirements

### Seed Users
Create these users during setup:
- Username: `Dian`
- Password: `password123`

- Username: `Brilly`
- Password: `password123`

### Notes
- Store hashed passwords only
- Use a seed script so the setup is reproducible

## 19. Future Enhancements (Post-v1)

- Task restore from archive
- Categories / tags
- Daily streaks
- Sound effects / haptics on spin
- Smart weighting so neglected tasks appear more often
- Task difficulty labels
- Shared challenges between users
- Admin import/export
- PWA install support
- Reminder notifications

## 20. Build Recommendation Summary

This app should be built as a **mobile-first Next.js app with SQLite**, using a clean but highly interactive UI. The core experience should center around a delightful roulette moment, strong visual clarity, and low-friction task completion.

The product should prioritize:
- fun task selection
- strict but simple reroll rules
- clean archival behavior
- fast bulk task input
- polished mobile UX

This is intentionally a focused v1: simple enough to build quickly, but fun enough to feel engaging every day.
