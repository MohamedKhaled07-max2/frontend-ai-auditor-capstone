# Frontend AI Auditor

Frontend AI Auditor is an AI-enhanced frontend review tool that analyzes React and Next.js components for accessibility, user experience, responsiveness, and resilience. It provides structured scores, identifies specific issues, recommends fixes, and includes a streaming follow-up chat so developers can ask questions about their audit.

## Live Application

https://frontend-ai-auditor-capstone.vercel.app

## Repository

https://github.com/MohamedKhaled07-max2/frontend-ai-auditor-capstone

## Problem

Frontend developers often need to review components for accessibility, responsive design, UX, and error handling. Manually checking all of these areas can be time-consuming, especially for newer developers.

Frontend AI Auditor provides a quick first-pass review and explains why issues matter and how they can be improved.

## Who It Is For

The application is designed for:

- Frontend developers
- React and Next.js developers
- Students learning frontend development
- Developers performing quick accessibility and UX reviews

## Why I Chose This Idea

I wanted the AI integration to solve a real frontend-development problem rather than simply create a generic chatbot.

The application uses AI as a code-review assistant that produces structured frontend audits and allows the developer to ask follow-up questions about the generated results.

## Features

- React and Next.js code input
- AI-generated structured frontend audit
- Overall quality score
- Accessibility score
- User experience score
- Responsiveness score
- Resilience score
- Strengths and weaknesses
- Recommended fixes
- Recommended next steps
- Streaming AI follow-up conversation
- Stop generation during streaming
- Smart auto-scroll
- Jump-to-latest control
- Responsive mobile interface
- Accessible form controls and keyboard focus states
- Safe error states

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- Google Gemini API
- Zod
- Streamdown
- Vitest
- React Testing Library
- axe DevTools
- Lighthouse
- Vercel

## Local Setup

Clone the repository:

```bash
git clone https://github.com/MohamedKhaled07-max2/frontend-ai-auditor-capstone.git
cd frontend-ai-auditor-capstone