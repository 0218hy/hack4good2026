import React from 'react';
import { Heart, Users, Calendar, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from 'figma:asset/31aafb7be209c41dd63a586051c18a4a58b4f123.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Activity Hub Logo" className="h-10" />
              <span className="text-3xl font-bold text-gray-900">Activity Hub</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
            Find activities that fit your needs
          </h1>
          <p className="text-2xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            Join Activity Hub - connecting participants, caregivers, and volunteers
            for meaningful community engagement.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/login"
              className="bg-sky-500 text-white px-12 py-5 rounded-xl text-xl font-semibold hover:bg-sky-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Log In
            </Link>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-10">
          <div className="bg-white rounded-2xl p-10 shadow-lg text-center">
            <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-sky-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Easy Scheduling</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Browse and book activities that match your availability and interests
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-lg text-center">
            <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-sky-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Accessible Programs</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Activities designed with accessibility in mind, including wheelchair access and sign language support
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-lg text-center">
            <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-sky-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Community Impact</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Connect with others and make a difference in your community
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xl font-bold mb-6">Contact Us</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-lg">+65 6479 5655</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span className="text-lg">minds@minds.org.sg</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6">Follow Us</h4>
              <div className="flex gap-5">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="w-8 h-8" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Twitter className="w-8 h-8" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="w-8 h-8" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6">Accessibility</h4>
              <p className="text-lg text-gray-300 leading-relaxed">
                We are committed to making our activities accessible to everyone.
                Contact us for specific accommodation requests.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-12 text-center text-gray-400">
            <p className="text-lg">&copy; 2026 Activity Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}