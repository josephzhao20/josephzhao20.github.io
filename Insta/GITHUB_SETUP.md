# GitHub Setup & Deployment Guide

## Option 1: Create a New Repository (Recommended)

### Step 1: Create Repository on GitHub
1. Go to [github.com](https://github.com)
2. Click the `+` icon and select **New repository**
3. Name it: `instagram-follow-analyzer`
4. Description (optional): "Analyze your Instagram followers and following"
5. Choose **Public** (so it's accessible)
6. Click **Create repository**

### Step 2: Clone & Add Files Locally
```bash
# Clone your new repository
git clone https://github.com/yourusername/instagram-follow-analyzer.git
cd instagram-follow-analyzer

# Copy the files from /home/claude/ to this folder
# You should now have:
# - index.html
# - README.md
# - LICENSE
# - .gitignore
```

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Initial commit: Instagram Follow Analyzer"
git branch -M main
git remote add origin https://github.com/yourusername/instagram-follow-analyzer.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll to **Pages** section
4. Under "Source", select **main** branch
5. Click **Save**
6. Wait 1-2 minutes for deployment
7. Your site will be available at: `https://yourusername.github.io/instagram-follow-analyzer/`

---

## Option 2: Add to Existing Repository

If you already have a repository:

```bash
# Navigate to your repo
cd your-existing-repo

# Create a new folder (optional)
mkdir instagram-follow-analyzer
cd instagram-follow-analyzer

# Copy the files here
# - index.html
# - README.md
# - LICENSE

# Commit and push
git add .
git commit -m "Add: Instagram Follow Analyzer tool"
git push
```

Then enable GitHub Pages as shown above. Your URL will be:
`https://yourusername.github.io/instagram-follow-analyzer/`

---

## Accessing Your Tool

Once deployed, you can access it at:
- **Direct:** `https://yourusername.github.io/instagram-follow-analyzer/`
- **Short link:** Create a bitly/short.link link for easy sharing

---

## Customization

### Update the README
Edit `README.md` and change:
- `yourusername` to your actual GitHub username (in links)
- Add your contact info or social media
- Add any additional instructions

### Custom Domain (Optional)
If you have a custom domain:
1. Go to **Settings** → **Pages**
2. Under "Custom domain", enter your domain
3. Create a `CNAME` file in your repo with your domain

---

## Sharing Your Tool

Once live, share it:
- Direct link: `https://yourusername.github.io/instagram-follow-analyzer/`
- Social media: Post on Instagram, Twitter, TikTok
- Discord/Reddit: Share in relevant communities
- Friends: Text the link

---

## Updating the Tool

To add new features:

```bash
# Make changes to index.html or README.md
# Then:
git add .
git commit -m "Update: Added new feature"
git push
```

Your site updates automatically within seconds!

---

## Troubleshooting

**Site not showing up**
- Wait 2-3 minutes after enabling Pages
- Check that you're going to the correct URL
- Verify Pages is enabled in Settings

**Old version showing**
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode
- Wait a few minutes for GitHub to redeploy

**File not found errors**
- Make sure `index.html` is in the root directory
- Check that all file names match exactly

---

## Analytics (Optional)

To track usage, add Google Analytics:

1. Get a Google Analytics ID
2. Add this before `</head>` in index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

---

## Support

If you need help:
- Check GitHub Pages docs: https://pages.github.com/
- GitHub Help: https://docs.github.com/en/pages
- Create an issue in your repository

Good luck! 🚀
