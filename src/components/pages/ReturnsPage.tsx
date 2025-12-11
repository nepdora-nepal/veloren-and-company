"use client";

import { motion } from "framer-motion";
import { RotateCcw, Clock, Package } from "lucide-react";


const returnSteps = [
  {
    step: 1,
    title: "Start Your Return",
    description: "Log into your account and select the order you want to return. Click 'Start Return' and select your items.",
  },
  {
    step: 2,
    title: "Print Your Label",
    description: "We'll email you a prepaid shipping label. Print it and attach it to your package.",
  },
  {
    step: 3,
    title: "Ship It Back",
    description: "Drop off your package at any UPS location. You can also schedule a pickup for convenience.",
  },
  {
    step: 4,
    title: "Get Your Refund",
    description: "Once we receive your return, your refund will be processed within 5-7 business days.",
  },
];

const ReturnsPage = () => {
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
            <h1 className="text-4xl font-bold mb-4">Returns & Exchanges</h1>
            <p className="text-muted-foreground">
              Not satisfied? We make returns easy and hassle-free.
            </p>
          </motion.div>

          {/* Policy Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: RotateCcw,
                title: "30-Day Returns",
                description: "Return unopened products within 30 days for a full refund.",
              },
              {
                icon: Clock,
                title: "14-Day Satisfaction",
                description: "Opened products can be returned within 14 days if you're not satisfied.",
              },
              {
                icon: Package,
                title: "Free Return Shipping",
                description: "We provide prepaid return labels for all domestic returns.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-3xl p-8 text-center"
              >
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-12">How Returns Work</h2>
            <div className="space-y-6">
              {returnSteps.map((step) => (
                <div key={step.step} className="flex gap-6">
                  <div className="shrink-0">
                    <div className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Policy Details */}
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6">Return Policy Details</h2>
              
              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Eligible Items</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Unopened products in original packaging within 30 days</li>
                    <li>Opened products within 14 days with at least 75% remaining</li>
                    <li>Damaged or defective products at any time</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Non-Returnable Items</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Gift cards and promotional items</li>
                    <li>Sale items marked as final sale</li>
                    <li>Products that have been used beyond sampling</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Exchanges</h3>
                  <p>
                    We don&apos;t offer direct exchanges. To exchange an item, please return it for a refund 
                    and place a new order for the item you want. This ensures you get your new item as 
                    quickly as possible.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Refund Processing</h3>
                  <p>
                    Refunds are processed to your original payment method within 5-7 business days 
                    after we receive your return. You&apos;ll receive an email confirmation once your 
                    refund has been processed.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <div className="text-center p-8 bg-secondary rounded-3xl">
              <h3 className="text-lg font-bold mb-2">Need help with a return?</h3>
              <p className="text-muted-foreground mb-4">
                Our customer service team is ready to assist.
              </p>
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default ReturnsPage;
