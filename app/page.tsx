import Image from "next/image";
import Head from 'next/head';
import Welcome from "./welcome";


export default function Home() {
  return (
    <div className="bg-gray-100 text-zinc-900">
      <Head>
        <title>Chudisoft Technologies - Estate Management System</title>
        <meta name="description" content="Chudisoft Technologies - Estate Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Welcome Section */}
      <Welcome />
      {/* Other sections like About, Services, Features, Contact, Footer */}

      {/* About Section */}
      <section className="py-20 px-10">
        <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
        <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
          Chudisoft Technologies is a leading software firm dedicated to delivering cutting-edge software solutions. 
          Our latest product, the Estate Management System, is designed to simplify and streamline property management for modern real estate businesses.
        </p>
      </section>

      {/* Services Section */}
      <section className="bg-blue-600 py-20 px-10">
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="text-center p-6 bg-white shadow-md rounded-lg">
            <div className="mb-4">
              <svg className="w-12 h-12 text-blue-900 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8v-3a4 4 0 00-8 0v3m0-8a4 4 0 118 0m8 8v-3a4 4 0 00-8 0v3m0-8a4 4 0 118 0m8-8v16a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Custom Software Development</h3>
            <p className="text-gray-600">We build tailor-made software solutions to meet your specific business needs.</p>
          </div>
          <div className="text-center p-6 bg-white shadow-md rounded-lg">
            <div className="mb-4">
              <svg className="w-12 h-12 text-blue-900 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3a4 4 0 00-4 4v4H4a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2h-3V7a4 4 0 00-4-4h-2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Enterprise Solutions</h3>
            <p className="text-gray-600">Our enterprise solutions help organizations increase efficiency and drive growth.</p>
          </div>
          <div className="text-center p-6 bg-white shadow-md rounded-lg">
            <div className="mb-4">
              <svg className="w-12 h-12 text-blue-900 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m0-4h.01M12 20h.01M4 6h16M4 10h16m-7 4h7m-4 4h4"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Consulting Services</h3>
            <p className="text-gray-600">We offer expert consulting services to guide your business to success.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-10">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features of Our Estate Management System</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="text-center p-6 bg-gray-200 shadow-md rounded-lg">
            <h3 className="text-xl font-bold mb-4">Automated Billing & Payments</h3>
            <p className="text-gray-600">Streamline your financial operations with our automated billing and payment system.</p>
          </div>
          <div className="text-center p-6 bg-gray-200 shadow-md rounded-lg">
            <h3 className="text-xl font-bold mb-4">Tenant & Lease Management</h3>
            <p className="text-gray-600">Efficiently manage tenant information, lease agreements, and renewals.</p>
          </div>
          <div className="text-center p-6 bg-gray-200 shadow-md rounded-lg">
            <h3 className="text-xl font-bold mb-4">Property Maintenance Tracking</h3>
            <p className="text-gray-600">Keep track of maintenance requests and ensure timely resolutions.</p>
          </div>
          <div className="text-center p-6 bg-gray-200 shadow-md rounded-lg">
            <h3 className="text-xl font-bold mb-4">Comprehensive Reporting</h3>
            <p className="text-gray-600">Generate detailed reports on your property performance and financials.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-blue-600 py-20 px-10">
        <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
        <div className="max-w-xl mx-auto">
          <form className="bg-white p-8 shadow-md rounded-lg">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Name</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900" type="text" id="name" placeholder="Your name" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900" type="email" id="email" placeholder="Your email" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="message">Message</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900" id="message" placeholder="Your message" rows={4}></textarea>
            </div>
            <button className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300" type="submit">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-10">
        <p className="text-lg">&copy; 2024 Chudisoft Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
