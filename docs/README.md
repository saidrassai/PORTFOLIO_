# Documentation Index

This folder contains comprehensive documentation for the Modern Minimalist Portfolio project.

## 📚 Available Guides

### Deployment & Production
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions for various platforms
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment verification steps
- **[Production Guide](./PRODUCTION_GUIDE.md)** - Production optimization and configuration
- **[MIME Type Fix](./MIME_TYPE_FIX.md)** - Resolving JavaScript module MIME type issues

### Development & Features
- **[Build Guide](./BUILD_GUIDE.md)** - Build configuration and optimization
- **[Interaction Features](./INTERACTION_FEATURES.md)** - 3D interactions and animation details

### Quick References
- **[Deployment Ready](./DEPLOYMENT_READY.md)** - Final deployment summary and status

## 🔍 How to Access Files After Removal

If any documentation files are removed from the main branch, you can always recover them using Git:

### View File History
```bash
git log --follow -- filename.md
```

### Restore a Deleted File
```bash
git checkout <commit-hash> -- filename.md
```

### Browse Previous Commits
```bash
git checkout <commit-hash>
# Browse files, then return to main
git checkout main
```

### GitHub Web Interface
1. Go to the repository on GitHub
2. Click "History" or browse specific commits
3. View any file from any previous commit

All files committed to Git are preserved forever in the repository history! 📁✨
