# Coolify Deployment Guide

## Prerequisites
- A Coolify instance running
- Git repository with your Next.js application
- Node.js version 18 or higher

## Deployment Steps

1. **Login to Coolify Dashboard**
   - Navigate to your Coolify instance
   - Login with your credentials

2. **Create New Service**
   - Click "Create New" → "Service"
   - Select "Application"
   - Choose "Next.js" as your framework

3. **Configure Repository**
   - Connect your Git repository
   - Select the branch you want to deploy
   - Configure build settings:
     ```bash
     BUILD_COMMAND: npm run build
     START_COMMAND: npm start
     NODE_VERSION: 18
     ```

4. **Environment Variables**
   Add the following environment variables:
   ```
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy" and wait for the build process
   - Your application will be available at the configured domain

## Troubleshooting
- Check build logs if deployment fails
- Ensure all environment variables are correctly set
- Verify Dockerfile configuration
