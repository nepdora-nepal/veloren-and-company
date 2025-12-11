"use client";

import { motion } from "framer-motion";


const TermsPage = () => {
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
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
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
                <h2 className="text-xl font-bold text-foreground mb-4">Acceptance of Terms</h2>
                <p>
                  By accessing and using the GLOW website, you accept and agree to be bound by these 
                  Terms of Service. If you do not agree to these terms, please do not use our website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Use of Our Service</h2>
                <p>You agree to:</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Provide accurate and complete information when creating an account</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Use the website only for lawful purposes</li>
                  <li>Not interfere with the proper functioning of the website</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Products & Pricing</h2>
                <p>
                  All product descriptions, pricing, and availability are subject to change without notice. 
                  We reserve the right to limit quantities and refuse orders at our discretion. Prices 
                  displayed are in USD and do not include applicable taxes and shipping.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Orders & Payment</h2>
                <p>
                  By placing an order, you represent that you are authorized to use the payment method 
                  provided. We reserve the right to cancel orders due to pricing errors, suspected 
                  fraud, or product unavailability.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Intellectual Property</h2>
                <p>
                  All content on this website, including text, images, logos, and graphics, is the 
                  property of GLOW or its licensors and is protected by copyright and trademark laws. 
                  You may not reproduce, distribute, or create derivative works without our permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">User Content</h2>
                <p>
                  By submitting reviews, comments, or other content, you grant us a non-exclusive, 
                  royalty-free license to use, modify, and display that content. You are responsible 
                  for ensuring your submissions do not violate any third-party rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Limitation of Liability</h2>
                <p>
                  GLOW shall not be liable for any indirect, incidental, special, or consequential 
                  damages arising from your use of the website or products. Our total liability 
                  shall not exceed the amount you paid for the product in question.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Governing Law</h2>
                <p>
                  These terms shall be governed by and construed in accordance with the laws of the 
                  State of New York, without regard to conflict of law principles.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Changes to Terms</h2>
                <p>
                  We reserve the right to update these Terms of Service at any time. Changes will 
                  be effective immediately upon posting. Your continued use of the website constitutes 
                  acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Contact</h2>
                <p>
                  For questions about these Terms of Service, please contact us at 
                  legal@glowbeauty.com or through our Contact page.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  );
};

export default TermsPage;
