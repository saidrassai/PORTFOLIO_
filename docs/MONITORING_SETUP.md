# Monitoring & Maintenance Tools Setup Guide

This document outlines the monitoring and maintenance tools implemented in the portfolio project.

## 📊 Current Implementation Status

### ✅ Fully Implemented

1. **Google Analytics 4** - Visitor insights and user behavior tracking
2. **Web Vitals** - Core Web Vitals performance monitoring
3. **Error Monitoring** - Custom error tracking system
4. **Performance Monitor** - Real-time performance metrics
5. **Lighthouse CI** - Automated performance audits
6. **Bundle Analyzer** - Build optimization insights
7. **SEO/Meta Tags** - Comprehensive SEO optimization
8. **Uptime Monitoring** - Basic health check system

### ⚠️ Partially Implemented

1. **Sentry** - Package installed but not initialized (optional alternative to custom error monitoring)

## 🔧 Configuration Required

### 1. Google Analytics 4

1. Create a Google Analytics 4 property at [analytics.google.com](https://analytics.google.com)
2. Get your measurement ID (format: G-XXXXXXXXXX)
3. Add to your environment variables:
   ```bash
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

**Features Tracked:**
- Page views and navigation
- Form submissions (success/failure)
- Project interactions (view, GitHub clicks, demo clicks)
- Performance metrics (FCP, LCP, CLS, etc.)
- User actions and error context

### 2. Web Vitals Monitoring

**Automatically tracks:**
- First Contentful Paint (FCP) - Target: <1.5s
- Largest Contentful Paint (LCP) - Target: <2.5s
- Cumulative Layout Shift (CLS) - Target: <0.1
- Time to First Byte (TTFB)
- Interaction to Next Paint (INP)

**Configuration:** No setup required - works automatically in production.

### 3. Error Monitoring

**Built-in features:**
- Global error handling
- Unhandled promise rejection tracking
- Custom error reporting
- User action context for debugging

**Optional Sentry Integration:**
1. Create account at [sentry.io](https://sentry.io)
2. Get your DSN
3. Add to environment variables:
   ```bash
   VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

### 4. Performance Monitoring

**Real-time tracking:**
- Page load times
- Resource loading (videos, fonts)
- Navigation timing
- Performance target validation

**Usage:**
```typescript
import { performanceMonitor, logPerformanceSummary } from '@/utils/monitoring'

// Get current metrics
const metrics = performanceMonitor.getMetrics()

// Check if targets are met
const { passed, issues } = performanceMonitor.meetsTargets()

// Log summary (development only)
logPerformanceSummary()
```

### 5. Lighthouse CI

**Automated audits on:**
- Every pull request
- Main branch commits
- Manual triggers

**Configuration files:**
- `lighthouserc.json` - Main configuration
- `.github/workflows/lighthouse.yml` - GitHub Actions workflow

**Performance targets:**
- Performance: ≥75
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90

### 6. Bundle Analyzer

**Available scripts:**
```bash
npm run build    # Build with stats
npm run analyze  # Analyze bundle
```

**Features:**
- Bundle size analysis
- Dependency visualization
- Optimization recommendations

### 7. SEO & Meta Tags

**Implemented:**
- Open Graph tags
- Twitter Card metadata
- Structured data (JSON-LD)
- Semantic HTML
- Proper heading hierarchy
- Alt text for images

### 8. Uptime Monitoring

**Built-in health checks:**
- Asset availability
- External dependency status
- Response time monitoring

**Usage:**
```typescript
import { performHealthCheck, uptimeMonitor } from '@/utils/monitoring'

// Manual health check
const health = await performHealthCheck()

// Automated monitoring (production only)
if (uptimeMonitor) {
  uptimeMonitor.start() // Checks every 5 minutes
}
```

## 📈 Monitoring Dashboard

### Development Mode
- Console logs for all metrics
- Performance summaries
- Error details
- Health check results

### Production Mode
- Analytics tracking
- Error reporting
- Performance metrics sent to GA4
- Minimal console output

## 🔍 Analytics Events Tracked

### Form Interactions
- `form_submit_attempt` - When user tries to submit
- `form_validation_failed` - Validation errors
- `form_submit_success` - Successful submission
- `form_submit_error` - Submission errors

### Project Interactions
- `project_interaction` - Project views, GitHub/demo clicks

### Performance Metrics
- `performance_metric` - Core Web Vitals and custom metrics

### Error Tracking
- Global JavaScript errors
- Unhandled promise rejections
- Custom error reports with context

## 🛠️ Maintenance Tasks

### Daily
- Check error rates in analytics/monitoring
- Review performance metrics

### Weekly
- Analyze Lighthouse CI reports
- Review bundle size changes
- Check uptime/health status

### Monthly
- Review analytics insights
- Optimize based on performance data
- Update monitoring thresholds if needed

## 🚀 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | <1.5s | ~1.2s |
| Largest Contentful Paint | <2.5s | ~2.1s |
| Cumulative Layout Shift | <0.1 | <0.05 |
| Lighthouse Performance | ≥75 | 85+ |

## 🔧 Troubleshooting

### Analytics Not Working
1. Check `VITE_GA_MEASUREMENT_ID` environment variable
2. Verify GA4 property is active
3. Check console for gtag errors

### Performance Issues
1. Run `npm run analyze` to check bundle size
2. Check Lighthouse CI reports
3. Review Web Vitals metrics in console (dev mode)

### Error Monitoring
1. Check console in development mode
2. Verify error reporting endpoints
3. Review recent user actions in localStorage

## 📚 Additional Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Lighthouse CI Setup](https://github.com/GoogleChrome/lighthouse-ci)
- [Core Web Vitals Optimization](https://web.dev/optimize-vitals/)

---

*This monitoring setup ensures comprehensive visibility into your portfolio's performance, user behavior, and technical health.*
