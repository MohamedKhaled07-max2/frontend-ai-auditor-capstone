# Capstone Reflection

The hardest part of this project was getting the AI integration working reliably in a real application instead of only making the interface look correct. I originally planned to use the Anthropic API, but API credit limitations meant I had to switch providers. Moving to Gemini required me to solve environment variable problems, package-version conflicts, model availability issues, and streaming behaviour before I could continue building the actual product.

Once the AI connection was stable, the next challenge was making the feature feel like one complete application rather than a generic chatbot. I changed the project into a Frontend AI Auditor where users can paste React or Next.js code and receive structured scores, issues, strengths, and recommended fixes. I then connected the follow-up chat to the original code and generated audit so that questions are answered using the actual review as context.

If I built the project again, I would decide on the AI provider and package versions earlier and verify the production API setup before spending time polishing the interface. I would also split more of the main page into reusable components earlier in development, because this would make testing and maintenance easier.

One thing that surprised me was how much production-readiness work exists outside the main feature itself. Streaming, stopping generation, error handling, responsive behaviour, accessibility, testing, environment variables, deployment, and documentation all mattered just as much as making the AI return a useful answer.

Accessibility testing was especially useful. Lighthouse initially gave the application an accessibility score of 95, and axe DevTools identified insufficient text contrast in the empty follow-up chat state. After changing the text colour, axe reported zero automatic issues and Lighthouse accessibility increased to 100.

This project taught me that shipping a frontend application means more than getting the happy path to work. A production-ready application needs to handle failure, remain usable across devices, protect secrets, be testable, and be understandable by another developer reading the repository.