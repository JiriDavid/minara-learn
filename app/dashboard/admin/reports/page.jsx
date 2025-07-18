"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  BarChart3,
  Download,
  FileText,
  Filter,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  Eye,
  RefreshCw,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function AdminReportsPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateRange, setDateRange] = useState("30");
  const [reportData, setReportData] = useState({
    overview: {},
    users: [],
    courses: [],
    enrollments: [],
    revenue: {},
  });

  useEffect(() => {
    if (!user) return;
    fetchReportData();
  }, [user, selectedReport, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/reports?type=${selectedReport}&days=${dateRange}`);
      const data = await response.json();
      
      if (data.success) {
        setReportData(prev => ({
          ...prev,
          [selectedReport]: data.data
        }));
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format = 'csv') => {
    try {
      const response = await fetch(`/api/admin/reports/export?type=${selectedReport}&format=${format}&days=${dateRange}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-slate-600">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-green-600">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,432</div>
            <p className="text-xs text-green-600">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,580</div>
            <p className="text-xs text-green-600">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-500">
              <BarChart3 className="h-16 w-16 opacity-50" />
              <div className="ml-4">
                <p>Chart visualization would go here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Top performing courses by enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Mathematics - O Level", enrollments: 342, completion: 87 },
                { name: "English Language - O Level", enrollments: 289, completion: 92 },
                { name: "Combined Science - O Level", enrollments: 234, completion: 78 },
                { name: "Geography - A Level", enrollments: 187, completion: 85 },
                { name: "Business Studies - A Level", enrollments: 156, completion: 90 },
              ].map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{course.name}</span>
                    <span>{course.enrollments} enrollments</span>
                  </div>
                  <Progress value={course.completion} className="h-2" />
                  <p className="text-xs text-slate-500">{course.completion}% completion rate</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsersReport = () => (
    <Card>
      <CardHeader>
        <CardTitle>User Analytics</CardTitle>
        <CardDescription>Detailed user registration and activity data</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>New Users</TableHead>
              <TableHead>Active Users</TableHead>
              <TableHead>Retention Rate</TableHead>
              <TableHead>Growth Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { period: "This Week", newUsers: 47, activeUsers: 1203, retention: "89%", growth: "+12%" },
              { period: "Last Week", newUsers: 52, activeUsers: 1156, retention: "87%", growth: "+8%" },
              { period: "2 Weeks Ago", newUsers: 38, activeUsers: 1089, retention: "91%", growth: "+5%" },
              { period: "3 Weeks Ago", newUsers: 41, activeUsers: 1034, retention: "88%", growth: "+7%" },
              { period: "4 Weeks Ago", newUsers: 35, activeUsers: 967, retention: "85%", growth: "+3%" },
            ].map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.period}</TableCell>
                <TableCell>{row.newUsers}</TableCell>
                <TableCell>{row.activeUsers}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{row.retention}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="text-green-600 bg-green-100">
                    {row.growth}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderCoursesReport = () => (
    <Card>
      <CardHeader>
        <CardTitle>Course Analytics</CardTitle>
        <CardDescription>Course performance and engagement metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Enrollments</TableHead>
              <TableHead>Completion Rate</TableHead>
              <TableHead>Avg. Rating</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { 
                course: "Mathematics - O Level", 
                enrollments: 342, 
                completion: 87, 
                rating: 4.5, 
                revenue: "$6,840", 
                status: "active" 
              },
              { 
                course: "English Language - O Level", 
                enrollments: 289, 
                completion: 92, 
                rating: 4.7, 
                revenue: "$5,780", 
                status: "active" 
              },
              { 
                course: "Combined Science - O Level", 
                enrollments: 234, 
                completion: 78, 
                rating: 4.2, 
                revenue: "$4,680", 
                status: "active" 
              },
              { 
                course: "Geography - A Level", 
                enrollments: 187, 
                completion: 85, 
                rating: 4.4, 
                revenue: "$3,740", 
                status: "active" 
              },
              { 
                course: "Business Studies - A Level", 
                enrollments: 156, 
                completion: 90, 
                rating: 4.6, 
                revenue: "$3,120", 
                status: "active" 
              },
            ].map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.course}</TableCell>
                <TableCell>{row.enrollments}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={row.completion} className="w-16 h-2" />
                    <span className="text-sm">{row.completion}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{row.rating}</span>
                    <div className="text-yellow-500">★</div>
                  </div>
                </TableCell>
                <TableCell>{row.revenue}</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-100 text-green-600">
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-slate-600">Comprehensive platform analytics and reporting</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => fetchReportData()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => exportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="users">User Analytics</SelectItem>
                    <SelectItem value="courses">Course Performance</SelectItem>
                    <SelectItem value="enrollments">Enrollment Trends</SelectItem>
                    <SelectItem value="revenue">Revenue Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Time Period</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Report Content */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
        </div>
      ) : (
        <div>
          {selectedReport === "overview" && renderOverviewReport()}
          {selectedReport === "users" && renderUsersReport()}
          {selectedReport === "courses" && renderCoursesReport()}
          {selectedReport === "enrollments" && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-slate-500">Enrollment trends report coming soon</p>
              </CardContent>
            </Card>
          )}
          {selectedReport === "revenue" && (
            <Card>
              <CardContent className="p-8 text-center">
                <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-slate-500">Revenue report coming soon</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
