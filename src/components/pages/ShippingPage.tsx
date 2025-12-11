"use client";

import { motion } from "framer-motion";
import { Truck, Clock, Globe, Package } from "lucide-react";


const shippingOptions = [
  {
    icon: Truck,
    title: "Standard Shipping",
    price: "Free on orders $50+",
    time: "5-7 business days",
    description: "Our most popular option. Orders under $50 ship for $5.99.",
  },
  {
    icon: Clock,
    title: "Express Shipping",
    price: "$9.99",
    time: "2-3 business days",
    description: "Need it faster? Express gets your order to you in no time.",
  },
  {
    icon: Package,
    title: "Same-Day Delivery",
    price: "$14.99",
    time: "Same day",
    description: "Available in select metro areas. Order by 12pm for same-day delivery.",
  },
];

const ShippingPage = () => {
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
            <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
            <p className="text-muted-foreground">
              Fast, reliable shipping to get your skincare essentials to you.
            </p>
          </motion.div>

          {/* Shipping Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {shippingOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-3xl p-8 text-center"
              >
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <option.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{option.title}</h3>
                <p className="text-xl font-semibold mb-1">{option.price}</p>
                <p className="text-sm text-muted-foreground mb-4">{option.time}</p>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Details */}
          <div className="max-w-3xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-neutral max-w-none"
            >
              <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
              
              <div className="space-y-8 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Processing Time</h3>
                  <p>
                    Orders placed before 2:00 PM EST on business days are processed and shipped the same day. 
                    Orders placed after 2:00 PM EST or on weekends/holidays will be processed the next business day.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Delivery Areas</h3>
                  <p>
                    We currently ship to all 50 US states and Canada. International shipping to additional 
                    countries is coming soon. Sign up for our newsletter to be notified when we expand.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Order Tracking</h3>
                  <p>
                    Once your order ships, you'll receive an email with tracking information. You can also 
                    track your order anytime by logging into your account and viewing your order history.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Packaging</h3>
                  <p>
                    All orders are carefully packaged with eco-friendly materials to ensure your products 
                    arrive safely. Fragile items are wrapped with extra protection.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <div className="text-center p-8 bg-secondary rounded-3xl">
              <h3 className="text-lg font-bold mb-2">Questions about shipping?</h3>
              <p className="text-muted-foreground mb-4">
                Our team is happy to help with any shipping inquiries.
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

export default ShippingPage;
