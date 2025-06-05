# 🔄 How to Switch Netlify to Your New Portfolio Repository

## Method 1: Update Existing Netlify Site (Recommended)

### Step 1: Access Your Netlify Dashboard
1. Go to [netlify.com](https://netlify.com) and log in
2. Find your existing site in the dashboard
3. Click on the site name to enter site settings

### Step 2: Change Repository
1. Go to **Site settings** → **Build & deploy** → **Continuous deployment**
2. Under **Repository**, click **Edit settings**
3. Click **Link to a different repository**
4. Select **GitHub** as your Git provider
5. Choose the repository: `saidrassai/PORTFOLIO_`
6. Set branch to: `master`

### Step 3: Update Build Settings
1. In **Build settings**, set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

### Step 4: Add Environment Variables
1. Go to **Site settings** → **Environment variables**
2. Add these variables:
   ```
   VITE_RECAPTCHA_SITE_KEY = 6LcT9FYrAAAAAGiEnqygkW7t5oxGmJnshJfeVctu
   ```

### Step 5: Deploy
1. Click **Deploy site** or **Trigger deploy**
2. Monitor the build process in **Deploys** tab
3. Your new portfolio will be live!

---

## Method 2: Create New Netlify Site

### Step 1: Create New Site
1. In Netlify dashboard, click **Add new site** → **Import an existing project**
2. Choose **Deploy with GitHub**
3. Select repository: `saidrassai/PORTFOLIO_`
4. Configure build settings:
   - **Branch**: `master`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Step 2: Add Environment Variables
1. After deployment, go to **Site settings** → **Environment variables**
2. Add: `VITE_RECAPTCHA_SITE_KEY = 6LcT9FYrAAAAAGiEnqygkW7t5oxGmJnshJfeVctu`

### Step 3: Configure Custom Domain (if needed)
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter: `rassaisaid.me` (or your preferred domain)
4. Follow DNS configuration instructions

---

## Method 3: Command Line Deployment (Advanced)

If you have Netlify CLI installed:

```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to existing site OR create new site
netlify link  # to link existing site
# OR
netlify init  # to create new site

# Deploy
netlify deploy --prod --dir=dist
```

---

## 🔧 Quick Fix Commands

If you need to build and deploy quickly:

```bash
# Build the project
npm run build

# If using Netlify CLI
netlify deploy --prod --dir=dist
```

---

## ⚠️ Important Notes

1. **Environment Variables**: Make sure to add the reCAPTCHA site key
2. **Domain**: If you have a custom domain, you may need to reconfigure DNS
3. **Build Time**: First build might take 5-10 minutes
4. **SSL**: Netlify will automatically provision SSL for your domain

---

## 📞 Need Help?

If you run into issues:
1. Check the **Deploy log** in Netlify dashboard
2. Verify environment variables are set correctly
3. Ensure your GitHub repository is accessible
4. Contact me if you need assistance with any step!

---

**Your new portfolio will be live and professional! 🚀**
