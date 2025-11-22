# Configuration Guide

This document explains how to set up environment variables for the FitUI application.

## Environment Variables

All configuration is managed through environment variables defined in a `.env` file. The application uses [`react-native-dotenv`](https://github.com/goatandsheep/react-native-dotenv) to load these variables.

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the values in `.env`:**
   Edit the `.env` file and replace the placeholder values with your actual configuration.

3. **Restart your development server:**
   After changing environment variables, restart Metro bundler:
   ```bash
   npm start -- --reset-cache
   # or
   yarn start --reset-cache
   ```

### Environment Variables Reference

#### API Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `API_BASE_URL` | Main backend API URL | `https://api.fitui.com` |
| `AI_BASE_URL` | AI service API URL | `https://ai.fitui.com` |

#### OAuth & Authentication

| Variable | Description | Example |
|----------|-------------|---------|
| `CLIENT_ID` | OAuth client ID | `your-client-id` |
| `REDIRECT_URL` | OAuth redirect URL | `fitui://callback` |
| `SSO_REDIRECT_URL` | SSO redirect URL | `https://fitui.com/auth/callback` |

#### Google OAuth

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_AUTH` | Google auth endpoint URL | `https://accounts.google.com/o/oauth2/auth` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `your-secret` |
| `GOOGLE_SCOPES_EMAIL` | Google OAuth email scope | `email` |
| `GOOGLE_SCOPES_PROFILE` | Google OAuth profile scope | `profile` |

#### Apple OAuth

| Variable | Description | Example |
|----------|-------------|---------|
| `APPLE_REDIRECT_URL` | Apple OAuth redirect URL | `https://fitui.com/auth/apple` |

#### Other

| Variable | Description | Example |
|----------|-------------|---------|
| `BEARES_CLIENT` | Bearer client configuration | `your-beares-client-value` |

## Usage in Code

All configuration values are centralized in `src/constants/config.ts`. Import and use them like this:

```typescript
import { Config } from '@/constants/config';

// Use configuration values
const apiUrl = Config.API_BASE_URL;
const aiUrl = Config.AI_BASE_URL;
```

## Type Safety

Environment variables are typed in `src/env.d.ts`. This provides TypeScript autocomplete and type checking for all configuration values.

## Security Notes

- **Never commit `.env` files to version control**
- The `.env` file is already listed in `.gitignore`
- Use `.env.example` to document required variables without exposing secrets
- For production builds, environment variables should be managed through your CI/CD pipeline or deployment platform

## Troubleshooting

### Changes not reflecting

If you change environment variables and don't see the changes:

1. Completely stop your development server
2. Clear Metro cache: `npm start -- --reset-cache`
3. For iOS: Clean build folder in Xcode
4. For Android: `cd android && ./gradlew clean`

### TypeScript errors

If you add new environment variables:

1. Add them to `src/env.d.ts`
2. Add them to `src/constants/config.ts`
3. Restart TypeScript server in your IDE
