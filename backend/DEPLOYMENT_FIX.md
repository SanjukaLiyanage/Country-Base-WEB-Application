# Fixing Serverless Function Crash on Vercel

If you're seeing a `500 INTERNAL_SERVER_ERROR` with code `FUNCTION_INVOCATION_FAILED` when deploying your backend to Vercel, follow these steps to fix it:

## Step 1: Deploy Backend With Updated Files

1. Make sure you have the three critical files in your backend directory:
   - `server.js` (updated to export routes as a function)
   - `index.js` (serves as the Vercel serverless entry point)
   - `vercel.json` (configures your deployment)

2. In Vercel dashboard, deploy your backend with these settings:
   - **Root Directory**: Set to `Country-Base-WEB-Application/backend`
   - **Build Command**: Leave as default or set to `npm install`
   - **Output Directory**: Leave blank
   - **Install Command**: `npm install`

3. Set these environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB connection string 
   - `JWT_SECRET`: Your secret key for JWT
   - `NODE_ENV`: Set to `production`
   - `CLIENT_URL`: Your frontend URL (for CORS)

## Step 2: Check Logs for Specific Errors

After deployment, if you're still having issues:

1. Go to Vercel dashboard → Your project → Deployments → Latest deployment
2. Click "Functions" or "Logs" to view detailed error messages
3. Look for specific error messages about database connections, missing modules, etc.

## Step 3: Common Issues and Fixes

### Database Connection Issues:
- Ensure your MongoDB Atlas cluster allows connections from anywhere (`0.0.0.0/0` in Network Access)
- Verify your connection string is correct in environment variables
- Check if MongoDB Atlas is up and running

### Missing Dependencies:
- Make sure all required packages are in your package.json
- You may need to run `npm install` locally and commit the updated package.json

### ES Module Issues:
- If you're using ES modules (import/export), make sure your package.json has `"type": "module"`
- Or convert your code to use CommonJS (require/module.exports)

### Memory/Timeout Issues:
- Simplify your application initialization
- Remove unnecessary console.log statements 
- Make sure connections are properly managed for serverless environment

## Step 4: Testing Your API

Once deployed, test your API endpoints:

```
https://your-backend.vercel.app/api/test
```

This should return a success message if your server is working correctly.

## Need More Help?

If you're still experiencing issues, check Vercel's documentation on serverless functions:
https://vercel.com/docs/functions/serverless-functions 