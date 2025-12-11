"use client";

import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "Orders & Shipping",
    faqs: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 5-7 business days. Express shipping is 2-3 business days. Orders placed before 2pm EST ship the same day.",
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes! We offer free standard shipping on all orders over $50. Express shipping is available for $9.99.",
      },
      {
        question: "Do you ship internationally?",
        answer: "Currently, we ship to the United States and Canada. We're working on expanding to more countries soon.",
      },
      {
        question: "Can I track my order?",
        answer: "Absolutely! Once your order ships, you'll receive an email with tracking information. You can also track your order in your account dashboard.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    faqs: [
      {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days of delivery for unopened products in their original packaging. Opened products can be returned within 14 days if you're not satisfied.",
      },
      {
        question: "How do I start a return?",
        answer: "Log into your account, go to your orders, and select 'Start Return' next to the item you wish to return. You'll receive a prepaid shipping label via email.",
      },
      {
        question: "When will I receive my refund?",
        answer: "Refunds are processed within 5-7 business days after we receive your return. The refund will be credited to your original payment method.",
      },
    ],
  },
  {
    title: "Products & Authenticity",
    faqs: [
      {
        question: "Are all products authentic?",
        answer: "100% yes. We source all products directly from brands or their authorized distributors. Every product is guaranteed authentic.",
      },
      {
        question: "How do I know which products are right for my skin?",
        answer: "Each product page includes skin type recommendations. You can also use our Skincare Routine Builder for personalized recommendations, or contact our beauty consultants.",
      },
      {
        question: "What does 'K-Beauty' mean?",
        answer: "K-Beauty refers to Korean Beauty—skincare and makeup products from South Korea known for innovative formulas, gentle ingredients, and effective results.",
      },
    ],
  },
  {
    title: "Account & Rewards",
    faqs: [
      {
        question: "How do I create an account?",
        answer: "Click 'Sign In' in the top navigation and select 'Create Account'. You can sign up with email or use Google/Facebook for quick registration.",
      },
      {
        question: "How does the rewards program work?",
        answer: "Earn 1 point for every $1 spent. 100 points = $5 off your next order. Plus, get bonus points on your birthday and for writing reviews!",
      },
      {
        question: "I forgot my password. What do I do?",
        answer: "Click 'Sign In', then 'Forgot Password'. Enter your email and we'll send you a link to reset your password.",
      },
    ],
  },
];

const FAQPage = () => {
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
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">
              Find answers to common questions about orders, shipping, returns, and more.
            </p>
          </motion.div>

          {/* FAQ Sections */}
          <div className="max-w-3xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h2 className="text-xl font-bold mb-6">{category.title}</h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="bg-card border border-border rounded-2xl px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-5">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          {/* Still Need Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl mx-auto mt-16 text-center p-8 bg-secondary rounded-3xl"
          >
            <h3 className="text-lg font-bold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our customer service team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </main>

    </div>
  );
};

export default FAQPage;
