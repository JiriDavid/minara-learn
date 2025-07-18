"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  User, 
  Mail, 
  Phone,
  ExternalLink,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export default function InstructorApplicationsPage() {
  const { isAdmin } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchApplications();
    }
  }, [isAdmin]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/instructor-applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        toast.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Error loading applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId, action) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/instructor-applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          action,
          adminNotes,
        }),
      });

      if (response.ok) {
        toast.success(`Application ${action}ed successfully`);
        fetchApplications(); // Refresh the list
        setSelectedApplication(null);
        setAdminNotes("");
      } else {
        const result = await response.json();
        toast.error(result.error || `Failed to ${action} application`);
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      toast.error(`Error ${action}ing application`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    };

    return (
      <Badge className={variants[status]}>
        {icons[status]}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
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

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Instructor Applications</h1>
        <p className="text-slate-600">Review and manage instructor applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No instructor applications found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.name}</div>
                        <div className="text-sm text-slate-500">{application.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{application.title}</TableCell>
                    <TableCell className="max-w-48 truncate">{application.expertise}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>
                      {new Date(application.submitted_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(application);
                              setAdminNotes(application.admin_notes || "");
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Review Application - {application.name}</DialogTitle>
                          </DialogHeader>
                          
                          {selectedApplication && (
                            <div className="space-y-6">
                              {/* Basic Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Contact Information
                                  </h3>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Name:</strong> {selectedApplication.name}</div>
                                    <div><strong>Email:</strong> {selectedApplication.email}</div>
                                    {selectedApplication.phone && (
                                      <div><strong>Phone:</strong> {selectedApplication.phone}</div>
                                    )}
                                    {selectedApplication.linkedin && (
                                      <div>
                                        <strong>LinkedIn:</strong> 
                                        <a 
                                          href={selectedApplication.linkedin} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline ml-1"
                                        >
                                          View Profile <ExternalLink className="w-3 h-3 inline" />
                                        </a>
                                      </div>
                                    )}
                                    {selectedApplication.website && (
                                      <div>
                                        <strong>Website:</strong> 
                                        <a 
                                          href={selectedApplication.website} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline ml-1"
                                        >
                                          Visit Site <ExternalLink className="w-3 h-3 inline" />
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Professional Details</h3>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Title:</strong> {selectedApplication.title}</div>
                                    <div><strong>Expertise:</strong> {selectedApplication.expertise}</div>
                                    <div><strong>Status:</strong> {getStatusBadge(selectedApplication.status)}</div>
                                    <div><strong>Submitted:</strong> {new Date(selectedApplication.submitted_at).toLocaleString()}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Detailed Information */}
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold mb-2">Education</h3>
                                  <p className="text-sm bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                                    {selectedApplication.education}
                                  </p>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Experience</h3>
                                  <p className="text-sm bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                                    {selectedApplication.experience}
                                  </p>
                                </div>

                                {selectedApplication.certifications && (
                                  <div>
                                    <h3 className="font-semibold mb-2">Certifications</h3>
                                    <p className="text-sm bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                                      {selectedApplication.certifications}
                                    </p>
                                  </div>
                                )}

                                <div>
                                  <h3 className="font-semibold mb-2">Proposed Courses</h3>
                                  <p className="text-sm bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                                    {selectedApplication.proposed_courses}
                                  </p>
                                </div>

                                <div>
                                  <h3 className="font-semibold mb-2">Teaching Philosophy</h3>
                                  <p className="text-sm bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                                    {selectedApplication.teaching_philosophy}
                                  </p>
                                </div>

                                {/* Admin Notes */}
                                <div>
                                  <h3 className="font-semibold mb-2">Admin Notes</h3>
                                  <Textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes about this application..."
                                    rows={3}
                                  />
                                </div>

                                {/* Action Buttons */}
                                {selectedApplication.status === 'pending' && (
                                  <div className="flex gap-4 pt-4">
                                    <Button
                                      onClick={() => handleApplicationAction(selectedApplication.id, 'approve')}
                                      disabled={isProcessing}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleApplicationAction(selectedApplication.id, 'reject')}
                                      disabled={isProcessing}
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                )}

                                {selectedApplication.admin_notes && (
                                  <div>
                                    <h3 className="font-semibold mb-2">Previous Admin Notes</h3>
                                    <p className="text-sm bg-yellow-50 p-3 rounded-lg">
                                      {selectedApplication.admin_notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
