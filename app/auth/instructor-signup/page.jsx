"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Upload, User, Mail, Lock, BookOpen, Award, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function InstructorSignupPage() {
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Professional Info
    title: "",
    expertise: "",
    experience: "",
    education: "",
    certifications: "",
    
    // Course Info
    proposedCourses: "",
    teachingPhilosophy: "",
    
    // Contact & Social
    phone: "",
    linkedin: "",
    website: "",
    
    // Agreement
    agreeToTerms: false,
    agreeToReview: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Professional validation
    if (!formData.title.trim()) newErrors.title = "Professional title is required";
    if (!formData.expertise.trim()) newErrors.expertise = "Area of expertise is required";
    if (!formData.experience.trim()) newErrors.experience = "Teaching experience is required";
    if (!formData.education.trim()) newErrors.education = "Educational background is required";

    // Course validation
    if (!formData.proposedCourses.trim()) newErrors.proposedCourses = "Proposed courses are required";
    if (!formData.teachingPhilosophy.trim()) newErrors.teachingPhilosophy = "Teaching philosophy is required";

    // Agreement validation
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms";
    if (!formData.agreeToReview) newErrors.agreeToReview = "You must agree to the review process";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage("Please fix the errors below");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // First, create the basic user account
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "instructor",
        }),
      });

      const signupResult = await signupResponse.json();

      if (!signupResponse.ok) {
        if (signupResult.code === "USER_EXISTS") {
          setMessage("An account with this email already exists. Please try signing in instead.");
          return;
        }
        throw new Error(signupResult.error || "Failed to create account");
      }

      // Then, submit the instructor application
      const applicationResponse = await fetch("/api/instructor/application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: signupResult.user.id,
          ...formData,
        }),
      });

      if (!applicationResponse.ok) {
        console.warn("Application submission failed, but user was created");
      }

      setMessage("success");
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/auth/signin?message=instructor-pending");
      }, 3000);

    } catch (error) {
      console.error("Signup error:", error);
      setMessage(error.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  if (message === "success") {
    return (
      <div className="container flex items-center justify-center min-h-screen py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Application Submitted!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              Thank you for your instructor application. Your account has been created and is now pending admin review.
            </p>
            <p className="text-sm text-slate-500">
              You will receive an email notification once your application has been reviewed. This typically takes 1-3 business days.
            </p>
            <p className="text-sm text-slate-500">
              Redirecting to sign-in page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Become an Instructor</h1>
          <p className="text-slate-600">
            Join our community of educators and share your expertise with students worldwide.
          </p>
        </div>

        {message && message !== "success" && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Dr. John Smith"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.smith@university.edu"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Professional Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Professor, Senior Developer, PhD"
                  />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="expertise">Area of Expertise *</Label>
                  <Input
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    placeholder="e.g., Web Development, Data Science, Machine Learning"
                  />
                  {errors.expertise && <p className="text-sm text-red-500 mt-1">{errors.expertise}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="education">Educational Background *</Label>
                <Textarea
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="Please describe your educational background, degrees, and institutions..."
                  rows={3}
                />
                {errors.education && <p className="text-sm text-red-500 mt-1">{errors.education}</p>}
              </div>

              <div>
                <Label htmlFor="experience">Teaching/Professional Experience *</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Describe your teaching experience, years in the field, notable positions..."
                  rows={3}
                />
                {errors.experience && <p className="text-sm text-red-500 mt-1">{errors.experience}</p>}
              </div>

              <div>
                <Label htmlFor="certifications">Certifications & Achievements</Label>
                <Textarea
                  id="certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="List any relevant certifications, awards, or achievements..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="proposedCourses">Proposed Courses *</Label>
                <Textarea
                  id="proposedCourses"
                  name="proposedCourses"
                  value={formData.proposedCourses}
                  onChange={handleChange}
                  placeholder="Describe the courses you would like to teach, including topics and target audience..."
                  rows={3}
                />
                {errors.proposedCourses && <p className="text-sm text-red-500 mt-1">{errors.proposedCourses}</p>}
              </div>

              <div>
                <Label htmlFor="teachingPhilosophy">Teaching Philosophy *</Label>
                <Textarea
                  id="teachingPhilosophy"
                  name="teachingPhilosophy"
                  value={formData.teachingPhilosophy}
                  onChange={handleChange}
                  placeholder="Share your teaching philosophy and approach to education..."
                  rows={3}
                />
                {errors.teachingPhilosophy && <p className="text-sm text-red-500 mt-1">{errors.teachingPhilosophy}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Links (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <Label htmlFor="website">Personal Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Agreement */}
          <Card>
            <CardHeader>
              <CardTitle>Agreement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked }))}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> *
                </Label>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToReview"
                  name="agreeToReview"
                  checked={formData.agreeToReview}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToReview: checked }))}
                />
                <Label htmlFor="agreeToReview" className="text-sm">
                  I understand that my application will be reviewed by administrators and that approval is required before I can access instructor features *
                </Label>
              </div>
              {errors.agreeToReview && <p className="text-sm text-red-500">{errors.agreeToReview}</p>}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <Link 
              href="/auth/signin" 
              className="text-blue-600 hover:underline"
            >
              Already have an account? Sign in
            </Link>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-8"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
