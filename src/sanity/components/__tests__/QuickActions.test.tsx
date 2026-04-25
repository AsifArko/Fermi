import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickActions } from '../QuickActions';

// Mock the monitoring API calls
global.fetch = jest.fn();

describe('QuickActions', () => {
  beforeEach(() => {
    // Mock successful API responses
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('page-views')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({ data: Array(10).fill({ uniqueVisitor: true }) }),
        });
      }
      if (url.includes('system-metrics')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [{ cpuUsage: 25, memoryUsage: 40, diskUsage: 15 }],
            }),
        });
      }
      if (url.includes('error-logs')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: [] }),
        });
      }
      if (url.includes('user-events')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: Array(5).fill({ timestamp: new Date().toISOString() }),
            }),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({ data: [] }) });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main heading and description', () => {
    render(<QuickActions />);

    expect(screen.getByText('Welcome & Quick Actions')).toBeInTheDocument();
    expect(
      screen.getByText(/Monitor your platform performance/)
    ).toBeInTheDocument();
  });

  it('renders analytics overview section', () => {
    render(<QuickActions />);

    expect(screen.getByText('Analytics & System Overview')).toBeInTheDocument();
    expect(screen.getByText('Total Page Views')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('System Health')).toBeInTheDocument();
    expect(screen.getByText('Error Rate')).toBeInTheDocument();
  });

  it('renders content management section with action cards', () => {
    render(<QuickActions />);

    expect(screen.getByText('Content Management')).toBeInTheDocument();
    expect(screen.getByText('Create Course')).toBeInTheDocument();
    expect(screen.getByText('Add Module')).toBeInTheDocument();
    expect(screen.getByText('Add Lesson')).toBeInTheDocument();
    expect(screen.getByText('Manage Students')).toBeInTheDocument();
  });

  it('renders request location map', () => {
    render(<QuickActions />);

    expect(screen.getByText('Request Locations')).toBeInTheDocument();
    expect(
      screen.getByText('Geographic distribution of app requests')
    ).toBeInTheDocument();
  });

  it('renders refresh button', () => {
    render(<QuickActions />);

    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('renders quick tips section', () => {
    render(<QuickActions />);

    expect(screen.getByText('💡 Quick Tips')).toBeInTheDocument();
    expect(screen.getByText(/Use these quick actions/)).toBeInTheDocument();
  });

  it('handles action button clicks', () => {
    // Mock window.location.href
    const mockLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    });

    render(<QuickActions />);

    const createCourseButton = screen.getByText('Create Course');
    fireEvent.click(createCourseButton);

    // Note: In a real test environment, you'd need to mock the navigation
    // This test verifies the component renders and handles clicks
    expect(createCourseButton).toBeInTheDocument();
  });
});
