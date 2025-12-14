"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSubmitContactForm } from "@/hooks/use-contact";
import { PhoneInput } from "../ui/phone-input";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "support@glowbeauty.com",
    description: "We'll respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (888) 456-7890",
    description: "Mon-Fri, 9am-6pm EST",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "123 Beauty Lane, Suite 100",
    description: "New York, NY 10001",
  },
  {
    icon: Clock,
    title: "Hours",
    value: "9:00 AM - 6:00 PM EST",
    description: "Monday to Friday",
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    message: "",
  });

  const { mutate: submitContact, isPending } = useSubmitContactForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact(formData, {
      onSuccess: () => {
        toast.success("Message sent!", {
            description: "We'll get back to you as soon as possible.",
        });
        setFormData({ name: "", email: "", phone_number: "", message: "" });
      },
      onError: () => {
          // Error handling is done in the hook via toast, but we can prevent reset here
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">

      <main className="pt-28 pb-16">
        <div className="container-luxury">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-muted-foreground">
              Have a question or need help? We&apos;re here for you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-card border border-border rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <PhoneInput
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={(value: string | undefined) => setFormData({ ...formData, phone_number: value || "" })}
                    defaultCountry="NP"
                  />
                  <textarea
                    placeholder="Your message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-4 bg-secondary rounded-xl focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    required
                  />
                  <Button type="submit" className="gap-2" disabled={isPending}>
                    {isPending ? (
                        <>Sending...</>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Send Message
                        </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {contactInfo.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-card border border-border rounded-2xl"
                >
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-foreground">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default ContactPage;
