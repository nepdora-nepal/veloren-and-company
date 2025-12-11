"use client";

import { motion } from "framer-motion";


const PrivacyPage = () => {
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
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: January 1, 2024
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto prose prose-neutral"
          >
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Information We Collect</h2>
                <p>
                  We collect information you provide directly, such as when you create an account, 
                  make a purchase, or contact us. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Name and contact information (email, phone, address)</li>
                  <li>Payment information (processed securely by our payment providers)</li>
                  <li>Order history and preferences</li>
                  <li>Communications with our customer service team</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate about your orders and account</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Improve our products and services</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Information Sharing</h2>
                <p>
                  We do not sell your personal information. We share your information only with:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Service providers who help us operate our business (shipping, payments)</li>
                  <li>Legal authorities when required by law</li>
                  <li>Business partners with your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your information. 
                  All payment transactions are encrypted and processed through secure, PCI-compliant systems.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Cookies</h2>
                <p>
                  We use cookies to improve your browsing experience, analyze site traffic, and 
                  personalize content. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy or your personal data, please 
                  contact us at privacy@glowbeauty.com or through our Contact page.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  );
};

export default PrivacyPage;
