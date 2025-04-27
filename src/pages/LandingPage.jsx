
import React from 'react';
import ProviderLeads from './ProviderLeads';
import FreeTrialSection from "../components/FreeTrialSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 px-10">
          Find healthcare providers now
        </h1>
        <p className="text-gray-600 text-lg px-10">
          Access <span className="font-bold">9M+ verified providers</span> with complete{' '}
          <span className="underline">contact information</span> and{' '}
          <span className="underline">practice details</span> to accelerate your healthcare sales.
        </p>
      </section>

      {/* Trusted By Section */}
      <section className="flex flex-col items-center justify-center py-10 bg-gray-100">
        <p className="text-gray-500 mb-6">Trusted by leading healthcare sales teams at:</p>
        <div className="flex flex-wrap justify-center gap-10">
          {/* Placeholder Logos */}
          <div className="h-10 w-32 bg-gray-300">Logo 1</div>
          <div className="h-10 w-32 bg-gray-300">Logo 2</div>
          <div className="h-10 w-32 bg-gray-300">Logo 3</div>
          <div className="h-10 w-32 bg-gray-300">Logo 4</div>
          <div className="h-10 w-32 bg-gray-300">Logo 5</div>
        </div>
      </section>

      {/* Center Section */}
      <section className="flex-grow p-10">
        <ProviderLeads/>
      </section>
      {/* Free Trial Section */}
      <FreeTrialSection />
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default LandingPage;