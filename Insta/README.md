# Instagram Follow Analyzer

Analyze your Instagram followers and following in real-time. See who doesn't follow you back, who you don't follow back, and track changes over time.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

✨ **Current Status Analysis**
- See total followers and following counts
- Identify users who don't follow you back
- Find users you're not following back
- Browse full lists of usernames

📊 **Compare Snapshots**
- Upload two different exports to compare
- See new followers gained
- Identify lost followers
- View detailed lists of changes

🎨 **User-Friendly Design**
- Clean, modern interface
- Responsive design (works on mobile & desktop)
- Dark mode support
- No login required - all processing happens locally

🔒 **Privacy First**
- All data processing happens in your browser
- No data is sent to any server
- Files are never stored or logged
- Work with your data completely offline

## Quick Start

### 1. Get Your Instagram Data

1. Go to [Instagram Account Center](https://accountscenter.instagram.com/info_and_permissions/dyi/)
2. Click **"Create export"**
3. Select **"Export to device"** (not email)
4. Check ONLY **"Followers and following"** - uncheck everything else
5. Date range: **"All time"**
6. Format: **"JSON"**
7. Media quality: **"Medium"**
8. Download and extract the ZIP file

### 2. Upload to Analyzer

1. Open [Instagram Follow Analyzer](https://yourusername.github.io/instagram-follow-analyzer/) in your browser
2. Click the **"Instructions"** tab for detailed steps
3. Go to **"Current Status"** tab
4. Upload the extracted Instagram folder
5. Instantly see your follow analysis

### 3. Compare Over Time

To track changes:
1. Export your Instagram data again (a few weeks/months later)
2. Go to **"Compare Snapshots"** tab
3. Upload your older export as "Older snapshot"
4. Upload your newer export as "Newer snapshot"
5. See who followed/unfollowed you

## File Structure

```
instagram-follow-analyzer/
├── index.html          # Main application file
├── README.md           # This file
└── LICENSE             # MIT License
```

## How It Works

The analyzer looks for two JSON files in your Instagram export:
- `followers_1.json` - Your list of followers
- `following.json` - Your list of people you follow

It then compares these lists to determine:
- **Not following back**: Users in your "following" list but not in your "followers" list
- **You don't follow**: Users in your "followers" list but not in your "following" list
- **New followers**: Users added between two snapshots
- **Lost followers**: Users removed between two snapshots

All processing happens locally in your browser using JavaScript.

## Technical Details

**Technology Stack:**
- Pure HTML5
- Vanilla JavaScript (no frameworks)
- CSS3 for styling
- LocalStorage for dark mode preference

**Browser Support:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with ES6 support

**File Size:**
- Single HTML file (~20KB)
- No external dependencies
- Works completely offline after loading

## Usage Tips

💡 **Best Practices:**
- Export your data regularly (monthly or quarterly) to track trends
- Keep old exports if you want to compare multiple snapshots
- Use the dark mode for late-night browsing

⚠️ **Important Notes:**
- Instagram data exports can take a few minutes to prepare - be patient
- The tool parses Instagram's JSON format - it may change with Instagram updates
- Large follower lists (50k+) may take a moment to process

## Troubleshooting

**"Could not find followers_1.json or following.json"**
- Make sure you extracted the entire ZIP folder
- Verify you selected "Followers and following" when exporting
- Check that the format was set to JSON

**Upload not working**
- Try a different browser
- Clear your browser cache
- Make sure JavaScript is enabled

**Nothing appears after upload**
- Check browser console for errors (F12 → Console tab)
- Your follower/following lists might be empty
- Try re-exporting fresh data from Instagram

## Features Coming Soon

🚀 **Planned Features:**
- CSV export of user lists
- Search and filter within lists
- Mutual followers section
- Activity timeline with graphs
- Account statistics (follower/following ratio)
- Batch action URLs for mass follow/unfollow

## Privacy & Security

✅ **What happens to your data:**
- All processing happens in your browser
- No data is sent to servers
- No tracking or analytics
- No cookies (except dark mode preference in LocalStorage)
- Your Instagram data is never stored

## Contributing

Found a bug or have a feature request? [Open an issue](https://github.com/yourusername/instagram-follow-analyzer/issues)

## License

MIT License - feel free to use this project for personal or commercial use. See LICENSE file for details.

## Disclaimer

This tool is not affiliated with, endorsed by, or connected to Instagram or Meta. Use at your own risk and always follow Instagram's Terms of Service.

---

Made with ❤️ for Instagram users who want to understand their audience
