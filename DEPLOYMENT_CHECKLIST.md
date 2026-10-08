# Deployment Checklist

## Pre-deployment

- [x] Production build passes with `npm run build`
- [x] TypeScript compilation passes
- [x] Unit tests pass
- [x] Component coverage is above 50%
- [x] Gemini API key is stored server-side only
- [x] `.env.local` is excluded from Git
- [x] Error states are visible to users
- [x] Mobile layout tested at approximately 375px
- [x] Accessibility tested with axe DevTools
- [x] Lighthouse accessibility score meets requirements

## Deployment

- [x] Source code pushed to GitHub
- [x] Application deployed to Vercel
- [x] `GOOGLE_GENERATIVE_AI_API_KEY` configured in Vercel
- [x] Production audit endpoint tested
- [x] Production follow-up chat tested
- [x] Live application is functional

## Monitoring

Vercel deployment and runtime logs are used to identify production errors and failed API requests.

## Failure Safety

If an AI request fails, the interface displays a clear error message instead of crashing or silently failing.

The application validates empty submissions before making an AI request.

## Rollback Plan

If a production deployment introduces a problem:

1. Open the Vercel project.
2. Go to Deployments.
3. Select the last known working deployment.
4. Redeploy or promote that deployment to production.

Alternatively, revert the problematic Git commit on the `main` branch and push the reverted version.

## Sign-off

Deployment reviewed and tested successfully.

Status: Ready for submission.