# Deploying to Vercel

This guide will help you deploy your Country-Base Web Application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional, but helpful)
   ```
   npm install -g vercel
   ```
3. Git repository (GitHub, GitLab, or Bitbucket)

## Environment Variables

Make sure to set these environment variables in the Vercel dashboard:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your secret key for JWT
- `NODE_ENV`: Set to `production`

## Deployment Steps

### 1. Push your code to a Git repository

If you haven't already, initialize a git repository, commit your changes, and push to GitHub, GitLab, or Bitbucket.

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

### 2. Deploy using Vercel dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - Set the Framework Preset to "Other"
   - Set the Build Command to `npm run vercel-build`
   - Set the Output Directory to `dist`
5. Add the environment variables mentioned above
6. Click "Deploy"

### 3. Alternative: Deploy using Vercel CLI

1. Login to Vercel
   ```
   vercel login
   ```

2. Navigate to your project folder and run:
   ```
   vercel
   ```

3. Follow the prompts to configure your deployment
   - Link to existing project: No
   - Project name: (choose a name)
   - Framework preset: Other
   - Build command: npm run vercel-build
   - Output directory: dist
   - Development command: npm run dev

4. Set environment variables:
   ```
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add NODE_ENV production
   ```

5. Deploy to production:
   ```
   vercel --prod
   ```

## Troubleshooting

- **CORS Issues**: If you experience CORS issues, make sure your server is properly configured to accept requests from your Vercel domain.
- **MongoDB Connection**: Ensure your MongoDB Atlas cluster allows connections from any IP (0.0.0.0/0) or specifically from Vercel's IPs.
- **Deployment Fails**: Check the build logs in Vercel dashboard for specific errors.

## Post-Deployment

After a successful deployment, you'll receive a URL for your application (typically `https://your-project-name.vercel.app`). Test the application thoroughly to ensure everything works correctly. 