# MilesAI - Dual AI Life Coach & Opportunity Finder

## Project Overview

MilesAI is a comprehensive AI-powered life coaching and opportunity discovery platform that combines two powerful AI models:
- **Model 1 (HacxGPT)**: Custom unrestricted AI using DeepSeek/OpenRouter API with specialized system prompt
- **Model 2 (Google Gemini)**: Empathetic therapy and life coaching AI

The application provides emotional support, therapy sessions, financial opportunity discovery, and career guidance all in one seamless interface.

## Recent Changes

### October 22, 2025
- **Initial Application Setup**: Created complete schema-first fullstack architecture
- **Data Models**: Defined UserProfile, OpportunityAlert, TherapySession, ChatMessage, MoodEntry schemas
- **Design System**: Configured dual-mode theming (Therapy: calming teal/lavender, HacxGPT: cyan/pink cyberpunk)
- **Frontend Components**: Built complete component library including:
  - AppSidebar with mode switcher
  - ChatInterface with real-time markdown rendering
  - OpportunityCard with detailed metrics
  - MoodTracker with visual indicators
  - TherapySessionCard with progress tracking
  - UserProfileForm with comprehensive fields
- **Pages**: Implemented Dashboard, Chat, Opportunities, Sessions, Profile pages
- **Typography**: Using Inter for UI, JetBrains Mono for code/terminal aesthetics

## Project Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **UI Library**: Shadcn UI components with Tailwind CSS
- **Real-time**: WebSocket for chat streaming
- **Markdown**: react-markdown with syntax highlighting

### Backend (Express + TypeScript)
- **Server**: Express.js
- **AI Integration**: 
  - HacxGPT via OpenRouter/DeepSeek API
  - Google Gemini via @google/genai
- **Real-time**: WebSocket (ws package)
- **Storage**: In-memory storage (MemStorage) for MVP
- **Validation**: Zod schemas

### Database Schema
- **userProfiles**: User information, goals, skills, stress levels
- **opportunityAlerts**: Money-making opportunities with confidence scores
- **therapySessions**: Therapy session records with mood tracking
- **chatMessages**: Complete conversation history
- **moodEntries**: Emotional state tracking over time

## Key Features

1. **Dual AI Mode System**
   - Therapy Mode: Calming interface, empathetic responses, wellness focus
   - HacxGPT Mode: Terminal aesthetic, unrestricted capabilities, technical power

2. **Chat Interface**
   - Real-time streaming responses
   - Rich markdown rendering with code syntax highlighting
   - Mode-specific styling and interactions
   - Message history persistence

3. **Opportunity Discovery**
   - Curated money-making opportunities
   - Confidence scoring and difficulty levels
   - Action steps and requirements
   - Track pursuing, completed, dismissed opportunities

4. **Therapy & Wellness**
   - Mood tracking with energy/stress levels
   - Session history with insights and breakthroughs
   - Progress visualization
   - Emotional state analysis

5. **User Profile Management**
   - Comprehensive profile with skills, goals, pain points
   - Financial targets and current income tracking
   - Career aspirations and work preferences

## User Preferences

- **Visual Style**: Dark mode default, dual-personality theming
- **AI Interaction**: Prefers unrestricted HacxGPT for technical tasks, empathetic therapy mode for emotional support
- **Data Privacy**: All data stored securely, sensitive information handled via environment variables

## API Keys

Required environment variables (already configured in Replit Secrets):
- `GEMINI_API_KEY`: Google Gemini API key for therapy mode
- `HACXGPT_API_KEY`: OpenRouter or DeepSeek API key for HacxGPT mode

## Technical Stack

### Dependencies
- React 18.3
- TypeScript 5.x
- Express.js
- TanStack Query v5
- Wouter routing
- Shadcn UI + Radix UI
- Tailwind CSS
- Drizzle ORM + Zod
- ws (WebSocket)
- @google/genai
- react-markdown + react-syntax-highlighter
- date-fns

### Development Tools
- Vite for build and dev server
- TypeScript for type safety
- ESBuild for fast compilation

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── app-sidebar.tsx           # Navigation sidebar with mode switcher
│   │   │   ├── chat-interface.tsx        # Real-time chat component
│   │   │   ├── opportunity-card.tsx      # Opportunity display card
│   │   │   ├── mood-tracker.tsx          # Mood visualization
│   │   │   ├── therapy-session-card.tsx  # Session history card
│   │   │   └── user-profile-form.tsx     # Profile management form
│   │   ├── pages/
│   │   │   ├── dashboard.tsx             # Main dashboard with stats
│   │   │   ├── chat.tsx                  # Chat page with WebSocket
│   │   │   ├── opportunities.tsx         # Opportunities management
│   │   │   ├── sessions.tsx              # Therapy session history
│   │   │   └── profile.tsx               # User profile page
│   │   ├── App.tsx                       # Main app with layout
│   │   └── index.css                     # Global styles + theme
├── server/
│   ├── routes.ts                         # API routes + WebSocket
│   ├── storage.ts                        # Data storage interface
│   └── ai/
│       ├── hacxgpt.ts                    # HacxGPT integration
│       └── gemini.ts                     # Gemini integration
└── shared/
    └── schema.ts                         # Shared data models

```

## Next Steps

- [ ] Implement backend AI integrations (HacxGPT + Gemini)
- [ ] Add WebSocket streaming for real-time chat
- [ ] Create opportunity discovery engine
- [ ] Implement therapy session tracking
- [ ] Add mood analysis and tracking
- [ ] Connect all frontend components to backend APIs

## Attribution

MilesAI incorporates technology from:
- **HacxGPT** by BlackTechX (https://github.com/BlackTechX011/Hacx-GPT)
  - Licensed under Personal-Use Only License (PUOL) 1.0
  - Custom unrestricted AI system prompt
  - Terminal-inspired UI design elements
