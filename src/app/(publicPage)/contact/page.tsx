"use client";

import React, { useState } from "react";
import { motion, Variants } from "motion/react";
import { z } from "zod";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  Github,
  Twitter,
  Linkedin,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error for that field when user starts typing
    if (errors[id as keyof ContactFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id as keyof ContactFormData];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = contactSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form Submitted:", result.data);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Header */}
      <section className="bg-slate-50 dark:bg-slate-930 py-20 border-b border-gray-100 dark:border-gray-800">
        <div className="container px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight"
          >
            Get in <span className="text-blue-600">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Have a question about our collection or services? We're here to help. Reach out to the BookNest team anytime.
          </motion.p>
        </div>
      </section>

      <section className="py-24 container px-4">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Contact Information */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                Feel free to contact us through any of the following channels or fill out the form for a quick response.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email Us", value: "hello@booknest.com", color: "text-blue-600 bg-blue-50" },
                { icon: Phone, label: "Call Us", value: "+1 (555) 000-0000", color: "text-emerald-600 bg-emerald-50" },
                { icon: MapPin, label: "Visit Us", value: "123 Library Way, Knowledge City, NY 10001", color: "text-amber-600 bg-amber-50" },
                { icon: Clock, label: "Opening Hours", value: "Mon - Fri: 9am - 6pm EST", color: "text-purple-600 bg-purple-50" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-4 group p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <div className={`p-3 rounded-xl ${item.color} dark:bg-opacity-10 dark:text-opacity-90 transition-transform group-hover:scale-110`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.label}</h3>
                    <p className="text-muted-foreground">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media */}
            <motion.div variants={itemVariants} className="pt-8">
              <h3 className="font-semibold mb-4">Follow Our Journey</h3>
              <div className="flex gap-4">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <Button key={i} variant="outline" size="icon" className="rounded-full hover:bg-blue-600 hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </motion.div> 
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
              <div className="bg-blue-600 h-2 w-full" />
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">Direct Support</span>
                </div>
                <CardTitle className="text-3xl font-bold">Send us a Message</CardTitle>
                <CardDescription className="text-lg">
                  We usually respond within 24 hours during business days.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                {isSubmitted ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-foreground">Message Sent!</h3>
                    <p className="text-muted-foreground mb-8">
                      Thank you for contacting us. One of our team members will get back to you shortly.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline" className="rounded-full">
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <FieldGroup className="gap-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Field>
                          <FieldLabel htmlFor="name">Full Name</FieldLabel>
                          <Input 
                            id="name" 
                            placeholder="John Doe" 
                            value={formData.name}
                            onChange={handleChange}
                            aria-invalid={!!errors.name}
                          />
                          {errors.name && <FieldError errors={[{ message: errors.name }]} />}
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="email">Email Address</FieldLabel>
                          <Input 
                            id="email" 
                            placeholder="m@example.com" 
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            aria-invalid={!!errors.email}
                          />
                          {errors.email && <FieldError errors={[{ message: errors.email }]} />}
                        </Field>
                      </div>

                      <Field>
                        <FieldLabel htmlFor="subject">Subject</FieldLabel>
                        <Input 
                          id="subject" 
                          placeholder="How can we help you?" 
                          value={formData.subject}
                          onChange={handleChange}
                          aria-invalid={!!errors.subject}
                        />
                        {errors.subject && <FieldError errors={[{ message: errors.subject }]} />}
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="message">Message</FieldLabel>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us what you need in detail..." 
                          className="min-h-[160px] resize-none"
                          value={formData.message}
                          onChange={handleChange}
                          aria-invalid={!!errors.message}
                        />
                        <div className="flex justify-between items-center mt-1">
                          {errors.message && <FieldError errors={[{ message: errors.message }]} />}
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formData.message.length} characters
                          </span>
                        </div>
                      </Field>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full rounded-2xl py-6 text-lg font-bold shadow-lg shadow-blue-500/20 group hover:shadow-blue-500/40 transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </FieldGroup>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;