"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // null, "success", "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormState((prev) => ({ ...prev, inquiryType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.1) {
        // 90% success rate for demo
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
      setSubmitting(false);
    }, 1500);
  };

  const resetForm = () => {
    setFormState({
      name: "",
      email: "",
      subject: "",
      message: "",
      inquiryType: "",
    });
    setFormStatus(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Get in <span className="text-blue-600">Touch</span></h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Have questions about our courses, platform, or need assistance? Our
          team is here to help you succeed on your learning journey.
        </p>
      </div>

      {/* Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="border-0 bg-blue-50 dark:bg-blue-900/10 hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Our support team will get back to you within 24 hours.
            </p>
            <a
              href="mailto:support@extralms.com"
              className="text-blue-600 hover:underline font-medium"
            >
              support@minaralearn.com
            </a>
          </CardContent>
        </Card>

        <Card className="border-0 bg-green-50 dark:bg-green-900/10 hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Available Monday to Friday, 9am to 6pm EST.
            </p>
            <a
              href="tel:+1234567890"
              className="text-green-600 hover:underline font-medium"
            >
              +919556307048
            </a>
          </CardContent>
        </Card>

        <Card className="border-0 bg-purple-50 dark:bg-purple-900/10 hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Visit Us</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              123 Education St, Suite 500
              <br />
              Boston, MA 02108
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline font-medium"
            >
              View on Map
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form and Map Section */}
      <div className="grid md:grid-cols-5 gap-8 mb-16">
        <div className="md:col-span-3">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MessageSquare className="mr-2 h-6 w-6 text-blue-600" />
                Send Us a Message
              </h2>

              {formStatus === "success" ? (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="mb-6 text-slate-600 dark:text-slate-400">
                    Thank you for reaching out. We'll get back to you as soon as
                    possible.
                  </p>
                  <Button onClick={resetForm}>Send Another Message</Button>
                </div>
              ) : formStatus === "error" ? (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <AlertTriangle className="h-12 w-12 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Something went wrong
                  </h3>
                  <p className="mb-6 text-slate-600 dark:text-slate-400">
                    We couldn't send your message. Please try again or contact
                    us directly.
                  </p>
                  <Button onClick={resetForm} variant="destructive">
                    Try Again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium mb-2"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="inquiryType"
                        className="block text-sm font-medium mb-2"
                      >
                        Inquiry Type
                      </label>
                      <Select
                        value={formState.inquiryType}
                        onValueChange={handleSelectChange}
                        required
                      >
                        <SelectTrigger id="inquiryType">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Inquiry
                          </SelectItem>
                          <SelectItem value="courses">
                            Course Information
                          </SelectItem>
                          <SelectItem value="technical">
                            Technical Support
                          </SelectItem>
                          <SelectItem value="billing">
                            Billing & Payments
                          </SelectItem>
                          <SelectItem value="partnership">
                            Partnership Opportunities
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="map">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="hours">Office Hours</TabsTrigger>
            </TabsList>
            <TabsContent value="map" className="mt-4">
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="relative h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.220583137485!2d-71.06430772393949!3d42.35866793344391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370868bc2ce7b%3A0x82fa7db94f5fea9e!2sBoston%2C%20MA%2C%20USA!5e0!3m2!1sen!2sus!4v1682535565875!5m2!1sen!2sus"
                    width="100%"
                    height="400"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="border-0"
                  />
                </div>
              </Card>
              <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-600 mt-1" />
                  <div>
                    <h3 className="font-bold">Mirana Learn Headquarters</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      123 Education St, Suite 500
                      <br />
                      Boston, MA 02108
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="hours" className="mt-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-600" />
                    Office Hours
                  </h3>
                  <ul className="space-y-3">
                    {[
                      { day: "Monday", hours: "9:00 AM - 6:00 PM" },
                      { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
                      { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
                      { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
                      { day: "Friday", hours: "9:00 AM - 5:00 PM" },
                      { day: "Saturday", hours: "Closed" },
                      { day: "Sunday", hours: "Closed" },
                    ].map((schedule, i) => (
                      <li
                        key={i}
                        className="flex justify-between py-2 border-b last:border-0"
                      >
                        <span className="font-medium">{schedule.day}</span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {schedule.hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                    <div className="flex items-start gap-3">
                      <div className="bg-yellow-100 dark:bg-yellow-900/20 p-1 rounded-full mt-1">
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-bold">Holiday Hours</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Our office is closed on national holidays. Support is
                          available via email.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30 flex items-start gap-3">
                <Phone className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-bold">24/7 Technical Support</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    For urgent technical issues, our support team is available
                    24/7 via email at{" "}
                    <a
                      href="mailto:support@extralms.com"
                      className="text-blue-600 hover:underline"
                    >
                      support@miranalearn.com
                    </a>
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find quick answers to common questions about our platform and
            services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: "How do I reset my password?",
              a: "You can reset your password by clicking on the 'Forgot Password' link on the login page. We'll send you an email with instructions to create a new password.",
            },
            {
              q: "Can I get a refund if I'm not satisfied with a course?",
              a: "Yes, we offer a 30-day money-back guarantee for most courses. If you're not satisfied, contact our support team within 30 days of purchase for a full refund.",
            },
            {
              q: "How do I get a certificate after completing a course?",
              a: "Certificates are automatically issued once you complete all required modules and pass any assessments. You can download your certificate from your dashboard.",
            },
            {
              q: "Do you offer corporate or group discounts?",
              a: "Yes, we provide special pricing for organizations and groups. Please contact our sales team at sales@extralms.com for more information on bulk purchases.",
            },
            {
              q: "Can I access courses on mobile devices?",
              a: "Absolutely! Our platform is fully responsive and works on all devices. We also offer mobile apps for iOS and Android for a better learning experience on the go.",
            },
            {
              q: "How long do I have access to a course after purchase?",
              a: "Once you purchase a course, you have lifetime access to the course materials, including any future updates to the content.",
            },
          ].map((faq, i) => (
            <Card
              key={i}
              className="border border-slate-200 dark:border-slate-700"
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Still have questions? Our support team is here to help.
          </p>
          <Link href="/faq">
            <Button variant="outline">Visit Our Full FAQ</Button>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our <span className="text-blue-600">Community</span></h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
          Connect with other learners, instructors, and education enthusiasts on
          our social platforms.
        </p>
        <div className="flex justify-center gap-4">
          {["Twitter", "Facebook", "LinkedIn", "Instagram", "YouTube"].map(
            (platform, i) => (
              <Link
                key={i}
                href={`#${platform.toLowerCase()}`}
                className="px-4 py-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {platform}
              </Link>
            )
          )}
        </div>
      </section>
      </div>
    </div>
  );
}
