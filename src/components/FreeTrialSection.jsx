import React from 'react';

const FreeTrialSection = () => {
  return (
    <div className="bg-gray-100 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Access 9M+ Healthcare Provider Contacts
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Start your free 30-day trial to unlock verified emails, phone
            numbers, and practice details of healthcare providers across all 50
            states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <label
                htmlFor="work-email"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your work email
              </label>
              <input
                type="email"
                name="work-email"
                id="work-email"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="you@example.com"
              />
            </div>
            <button className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Start Free Trial
            </button>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Instant Access</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>No Credit Card</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Cancel Anytime</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap justify-around md:justify-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">9M+</p>
              <p className="text-gray-600">Verified Providers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">50</p>
              <p className="text-gray-600">States Covered</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">34+</p>
              <p className="text-gray-600">Specialties</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialSection;