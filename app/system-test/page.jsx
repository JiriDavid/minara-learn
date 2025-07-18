"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  User,
  BookOpen,
  Users,
  BarChart3,
  Calendar,
  FileText,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

export default function SystemTestPage() {
  const { user, role, isAdmin, isInstructor } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  const tests = [
    {
      id: 'auth_check',
      name: 'Authentication Check',
      description: 'Verify user authentication and role',
      endpoint: '/api/debug/user',
      category: 'Authentication'
    },
    {
      id: 'users_me',
      name: 'User Profile API',
      description: 'Check user profile API endpoint',
      endpoint: '/api/users/me',
      category: 'User Management'
    },
    {
      id: 'courses_lecturer',
      name: 'Lecturer Courses API',
      description: 'Test lecturer courses endpoint',
      endpoint: '/api/courses/lecturer',
      category: 'Course Management',
      requiresRole: 'instructor'
    },
    {
      id: 'lecturer_stats',
      name: 'Lecturer Stats API',
      description: 'Test lecturer statistics endpoint',
      endpoint: '/api/lecturer/stats',
      category: 'Analytics',
      requiresRole: 'instructor'
    },
    {
      id: 'lecturer_students',
      name: 'Lecturer Students API',
      description: 'Test lecturer students endpoint',
      endpoint: '/api/lecturer/students',
      category: 'Student Management',
      requiresRole: 'instructor'
    },
    {
      id: 'lecturer_calendar',
      name: 'Lecturer Calendar API',
      description: 'Test lecturer calendar endpoint',
      endpoint: '/api/lecturer/calendar',
      category: 'Scheduling',
      requiresRole: 'instructor'
    },
    {
      id: 'admin_instructor_applications',
      name: 'Instructor Applications API',
      description: 'Test instructor applications management',
      endpoint: '/api/admin/instructor-applications',
      category: 'Admin Management',
      requiresRole: 'admin'
    },
    {
      id: 'admin_reports',
      name: 'Admin Reports API',
      description: 'Test admin reports endpoint',
      endpoint: '/api/admin/reports?type=overview',
      category: 'Reporting',
      requiresRole: 'admin'
    },
    {
      id: 'instructor_application',
      name: 'Instructor Application API',
      description: 'Test instructor application submission',
      endpoint: '/api/instructor/application',
      category: 'Applications',
      method: 'POST'
    }
  ];

  const pages = [
    {
      id: 'dashboard_student',
      name: 'Student Dashboard',
      path: '/dashboard/student',
      description: 'Student dashboard page',
      requiresRole: 'student'
    },
    {
      id: 'dashboard_lecturer',
      name: 'Lecturer Dashboard',
      path: '/dashboard/lecturer',
      description: 'Lecturer dashboard page',
      requiresRole: 'instructor'
    },
    {
      id: 'lecturer_courses',
      name: 'Lecturer Courses',
      path: '/dashboard/lecturer/courses',
      description: 'Lecturer courses management',
      requiresRole: 'instructor'
    },
    {
      id: 'lecturer_students',
      name: 'Lecturer Students',
      path: '/dashboard/lecturer/students',
      description: 'Lecturer students management',
      requiresRole: 'instructor'
    },
    {
      id: 'lecturer_calendar',
      name: 'Lecturer Calendar',
      path: '/dashboard/lecturer/calendar',
      description: 'Lecturer calendar and scheduling',
      requiresRole: 'instructor'
    },
    {
      id: 'dashboard_admin',
      name: 'Admin Dashboard',
      path: '/dashboard/admin',
      description: 'Admin dashboard page',
      requiresRole: 'admin'
    },
    {
      id: 'admin_users',
      name: 'Admin Users',
      path: '/dashboard/admin/users',
      description: 'Admin user management',
      requiresRole: 'admin'
    },
    {
      id: 'admin_instructor_applications',
      name: 'Instructor Applications',
      path: '/dashboard/admin/instructor-applications',
      description: 'Admin instructor applications review',
      requiresRole: 'admin'
    },
    {
      id: 'admin_reports',
      name: 'Admin Reports',
      path: '/dashboard/admin/reports',
      description: 'Admin reports and analytics',
      requiresRole: 'admin'
    },
    {
      id: 'instructor_signup',
      name: 'Instructor Signup',
      path: '/auth/instructor-signup',
      description: 'Instructor application form',
      requiresRole: null
    },
    {
      id: 'profile',
      name: 'User Profile',
      path: '/profile',
      description: 'User profile management',
      requiresRole: null
    }
  ];

  const runTests = async () => {
    setTesting(true);
    setTestProgress(0);
    const results = {};
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      setTestProgress(((i + 1) / tests.length) * 100);
      
      try {
        // Skip tests that require specific roles
        if (test.requiresRole && test.requiresRole !== role) {
          results[test.id] = {
            status: 'skipped',
            message: `Requires ${test.requiresRole} role`,
            timestamp: new Date().toISOString()
          };
          continue;
        }

        const startTime = Date.now();
        
        let response;
        if (test.method === 'POST' && test.id === 'instructor_application') {
          // Test POST with sample data
          response = await fetch(test.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Test Instructor',
              email: 'test@example.com',
              title: 'Test Title',
              expertise: 'Test Subject',
              experience: 'Test experience',
              education: 'Test education',
              proposed_courses: 'Test courses',
              teaching_philosophy: 'Test philosophy'
            })
          });
        } else {
          response = await fetch(test.endpoint);
        }
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        const data = await response.json();
        
        results[test.id] = {
          status: response.ok ? 'pass' : 'fail',
          statusCode: response.status,
          responseTime,
          message: response.ok ? 'Success' : data.error || 'Request failed',
          data: response.ok ? data : null,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        results[test.id] = {
          status: 'error',
          message: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    setTestResults(results);
    setTesting(false);
    setTestProgress(100);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'skipped':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const canAccessPage = (page) => {
    if (!page.requiresRole) return true;
    if (page.requiresRole === 'admin') return isAdmin;
    if (page.requiresRole === 'instructor') return isInstructor;
    if (page.requiresRole === 'student') return role === 'student';
    return false;
  };

  const groupedTests = tests.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {});

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Health Check</h1>
        <p className="text-slate-600">Test all system components and API endpoints</p>
      </div>

      {/* User Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current User Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium">User ID</Label>
              <p className="text-sm text-slate-600">{user?.id || 'Not authenticated'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-slate-600">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Role</Label>
              <Badge variant="secondary">{role || 'None'}</Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Permissions</Label>
              <div className="flex gap-1">
                {isAdmin && <Badge variant="default">Admin</Badge>}
                {isInstructor && <Badge variant="default">Instructor</Badge>}
                {role === 'student' && <Badge variant="default">Student</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Endpoint Tests</CardTitle>
          <CardDescription>Test all API endpoints for functionality and response times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={runTests} disabled={testing}>
              {testing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
            {testing && (
              <div className="flex-1">
                <Progress value={testProgress} className="w-full" />
                <p className="text-sm text-slate-600 mt-1">{Math.round(testProgress)}% complete</p>
              </div>
            )}
          </div>

          {/* Test Results */}
          {Object.keys(testResults).length > 0 && (
            <div className="space-y-6">
              {Object.entries(groupedTests).map(([category, categoryTests]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3">{category}</h3>
                  <div className="space-y-2">
                    {categoryTests.map((test) => {
                      const result = testResults[test.id];
                      if (!result) return null;

                      return (
                        <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(result.status)}
                            <div>
                              <p className="font-medium">{test.name}</p>
                              <p className="text-sm text-slate-600">{test.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={result.status === 'pass' ? 'default' : 'destructive'}
                              className="mb-1"
                            >
                              {result.status}
                            </Badge>
                            {result.responseTime && (
                              <p className="text-xs text-slate-500">{result.responseTime}ms</p>
                            )}
                            {result.message && (
                              <p className="text-xs text-slate-600">{result.message}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Page Navigation Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Page Navigation</CardTitle>
          <CardDescription>Quick access to all system pages based on your permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => {
              const hasAccess = canAccessPage(page);
              
              return (
                <div 
                  key={page.id} 
                  className={`border rounded-lg p-4 ${hasAccess ? 'hover:border-blue-300' : 'opacity-50'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{page.name}</h4>
                      <p className="text-sm text-slate-600 mb-2">{page.description}</p>
                      {page.requiresRole && (
                        <Badge variant="outline" className="text-xs">
                          Requires {page.requiresRole}
                        </Badge>
                      )}
                    </div>
                    {hasAccess ? (
                      <Link href={page.path}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
