import { MonitoringService } from './monitoringService';

class ClientMonitoring {
  private monitoringService: MonitoringService;
  private isInitialized = false;
  private lastScrollCall: number | null = null;

  constructor() {
    this.monitoringService = MonitoringService.getInstance();
  }

  public init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.isInitialized = true;

    // Record initial page view
    this.recordPageView();

    // Set up event listeners
    this.setupEventListeners();

    // Set up performance monitoring
    this.setupPerformanceMonitoring();

    // Set up error monitoring
    this.setupErrorMonitoring();

    // Set up navigation monitoring
    this.setupNavigationMonitoring();
  }

  private recordPageView(): void {
    const url = window.location.pathname;
    const userAgent = navigator.userAgent;

    this.monitoringService.recordPageView(url, userAgent, '', '');
  }

  private setupEventListeners(): void {
    // Monitor user interactions
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      if (target) {
        const eventName = this.getElementIdentifier(target);
        this.monitoringService.recordUserEvent(
          'click',
          eventName,
          window.location.pathname
        );
      }
    });

    document.addEventListener('scroll', _event => {
      // Throttle scroll events
      if (this.throttleScroll()) {
        this.monitoringService.recordUserEvent(
          'scroll',
          'page_scroll',
          window.location.pathname
        );
      }
    });

    // Monitor form submissions
    document.addEventListener('submit', event => {
      const form = event.target as HTMLFormElement;
      if (form) {
        const formName =
          form.getAttribute('data-form-name') || form.action || 'unknown_form';
        this.monitoringService.recordUserEvent(
          'form_submit',
          formName,
          window.location.pathname
        );
      }
    });

    // Monitor video interactions
    document.addEventListener('play', event => {
      const target = event.target as HTMLVideoElement;
      if (target && target.tagName === 'VIDEO') {
        this.monitoringService.recordUserEvent(
          'video_play',
          'video_start',
          window.location.pathname
        );
      }
    });

    // Monitor downloads
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      if (target && target.tagName === 'A') {
        const link = target as HTMLAnchorElement;
        if (
          link.download ||
          link.href.includes('.pdf') ||
          link.href.includes('.zip')
        ) {
          this.monitoringService.recordUserEvent(
            'download',
            link.href,
            window.location.pathname
          );
        }
      }
    });
  }

  private setupPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // Monitor Largest Contentful Paint
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint') {
              this.monitoringService.recordPerformanceMetric(
                'LCP',
                entry.startTime
              );
            }
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor First Input Delay
        const fidObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'first-input') {
              const firstInputEntry = entry as PerformanceEventTiming;
              this.monitoringService.recordPerformanceMetric(
                'FID',
                firstInputEntry.processingStart - firstInputEntry.startTime
              );
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Monitor Cumulative Layout Shift
        const clsObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'layout-shift') {
              const layoutShiftEntry = entry as LayoutShift;
              this.monitoringService.recordPerformanceMetric(
                'CLS',
                layoutShiftEntry.value
              );
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Monitor First Contentful Paint
        const fcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (
              entry.entryType === 'paint' &&
              entry.name === 'first-contentful-paint'
            ) {
              this.monitoringService.recordPerformanceMetric(
                'FCP',
                entry.startTime
              );
            }
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // Monitor Time to First Byte
        const ttfbObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'navigation') {
              const navigationEntry = entry as PerformanceNavigationTiming;
              this.monitoringService.recordPerformanceMetric(
                'TTFB',
                navigationEntry.responseStart - navigationEntry.requestStart
              );
            }
          });
        });
        ttfbObserver.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }

  private setupErrorMonitoring(): void {
    // Monitor JavaScript errors
    window.addEventListener('error', event => {
      this.monitoringService.recordError(
        'JavaScript Error',
        'error',
        event.message
      );
    });

    // Monitor unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.monitoringService.recordError(
        'Unhandled Promise Rejection',
        'error',
        event.reason
      );
    });

    // Monitor resource loading errors
    window.addEventListener(
      'error',
      event => {
        if (event.target && event.target !== window) {
          const target = event.target as HTMLElement;
          this.monitoringService.recordError(
            'Resource Load Error',
            'warning',
            `Failed to load: ${target.tagName}`
          );
        }
      },
      true
    );
  }

  private setupNavigationMonitoring(): void {
    // Monitor navigation changes (for SPA)
    let currentPath = window.location.pathname;

    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.recordPageView();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private getElementIdentifier(element: HTMLElement): string {
    // Try to get a meaningful identifier for the element
    if (element.id) return element.id;
    if (element.className) return element.className.split(' ')[0];
    if (element.getAttribute('data-testid'))
      return element.getAttribute('data-testid')!;
    if (element.getAttribute('aria-label'))
      return element.getAttribute('aria-label')!;
    if (element.textContent) return element.textContent.slice(0, 20).trim();
    return element.tagName.toLowerCase();
  }

  private throttleScroll(): boolean {
    // Simple throttle for scroll events
    const now = Date.now();
    if (!this.lastScrollCall || now - this.lastScrollCall > 1000) {
      // 1 second throttle
      this.lastScrollCall = now;
      return true;
    }
    return false;
  }
}

// Performance API type definitions
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
}

interface PerformanceNavigationTiming extends PerformanceEntry {
  responseStart: number;
  requestStart: number;
}

// Initialize client monitoring
export const clientMonitoring = new ClientMonitoring();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      clientMonitoring.init();
    });
  } else {
    clientMonitoring.init();
  }
}
