"use client";

import { motion } from "framer-motion";
import { Heart, Leaf, Shield, Sparkles } from "lucide-react";
import Image from "next/image";


const values = [
  {
    icon: Leaf,
    title: "Clean Beauty",
    description: "We believe in formulas free from harmful ingredients. Every product is carefully vetted for safety and efficacy.",
  },
  {
    icon: Heart,
    title: "Skin First",
    description: "Your skin's health is our priority. We curate products that deliver real results without compromise.",
  },
  {
    icon: Shield,
    title: "100% Authentic",
    description: "Every product is sourced directly from brands or authorized distributors. No fakes, ever.",
  },
  {
    icon: Sparkles,
    title: "K-Beauty Experts",
    description: "With deep roots in Korean skincare, we bring you the best innovations from Asia's beauty capital.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">

      <main className="pt-28 pb-16">
        {/* Hero Section */}
        <section className="container-luxury mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Born from a passion for Korean skincare, GLOW was founded to bring the world&apos;s 
              most effective beauty products to discerning customers everywhere. We believe 
              that great skincare should be accessible, authentic, and transformative.
            </p>
          </motion.div>
        </section>

        {/* Image Banner */}
        <section className="container-luxury mb-20">
          <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200&h=600&fit=crop"
              alt="Skincare products"
              fill
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-background/80 to-transparent" />
            <div className="absolute inset-0 flex items-center p-8 md:p-16">
              <div className="max-w-md">
                <h2 className="text-3xl font-bold mb-4">Curated with Care</h2>
                <p className="text-muted-foreground">
                  Every product in our collection is handpicked by skincare experts 
                  who understand what works.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="container-luxury mb-20">
          <h2 className="text-2xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="bg-secondary">
          <div className="container-luxury py-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To empower everyone to achieve their healthiest, most radiant skin through 
                authentic, effective, and thoughtfully curated Korean beauty products. 
                We&apos;re not just selling skincare we&apos;re building a community of glow-getters.
              </p>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default AboutPage;
