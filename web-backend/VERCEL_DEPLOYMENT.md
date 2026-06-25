# Vercel Deployment Guide - EEE Virtual Lab

## Prerequisites
1. Node.js 18+ installed
2. Git installed and initialized
3. GitHub account
4. Vercel account (free at https://vercel.com)

## Step-by-Step Deployment Instructions

### 1. Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - Ready for Vercel deployment"
```

### 2. Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/srm-eee-vlab.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Connect your GitHub repository
5. Click "Import"
6. Configure project settings:
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
7. Add Environment Variables (see below)
8. Click "Deploy"

### 4. Environment Variables Setup

On Vercel Dashboard, go to Project Settings → Environment Variables and add:

```
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=generate-a-random-secret (use: openssl rand -base64 32)
```

For GitHub/Google OAuth (Optional):
```
GITHUB_ID=your-github-app-id
GITHUB_SECRET=your-github-app-secret
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```

### 5. Generate NEXTAUTH_SECRET
On your local machine:
```bash
openssl rand -base64 32
```
Copy the output and paste it as NEXTAUTH_SECRET in Vercel environment variables.

### 6. Update Environment Variable
After deployment, update the deployed site URL:
- Update NEXTAUTH_URL to: `https://your-project.vercel.app` (or your custom domain)

### 7. Custom Domain (Optional)
1. In Vercel Dashboard, go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions from your domain registrar

## Troubleshooting

### Build Errors
- Ensure all dependencies are in package.json (no local file: dependencies)
- Check that Next.js version is compatible
- Verify all environment variables are set

### API Route Issues
- Ensure `/api` routes are in `app/api` directory
- Check for missing environment variables
- Verify authentication configuration

### Performance Issues
- Check build output for bundle size warnings
- Optimize images using Next.js Image component
- Consider using incremental static regeneration (ISR)

## Useful Commands

```bash
# Test production build locally
npm run build
npm start

# Check build size
vercel build --prod

# View deployment logs
vercel logs

# Rollback to previous deployment
vercel rollback
```

## Additional Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment/vercel)
- [NextAuth.js Documentation](https://next-auth.js.org)

## Support
For issues, check:
1. Vercel Build Logs (in Dashboard)
2. Browser Console for client-side errors
3. Vercel Function Logs (for API errors)
