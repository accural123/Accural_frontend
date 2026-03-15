import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Support',
    details: 'support@accrualaccounting.com',
    description: 'Send us an email anytime!',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    details: '+91 98765 43210',
    description: 'Mon-Fri from 9am to 6pm',
  },
  {
    icon: MapPin,
    title: 'Office Address',
    details: '123 Business Street, Suite 100',
    description: 'Chennai, Tamil Nadu 600001',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: 'Monday - Friday',
    description: '9:00 AM - 6:00 PM IST',
  },
];

const ContactUs = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Contact Us</h1>
            <p className="text-slate-600">We're here to help! Get in touch with our support team.</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Get in touch</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {contactInfo.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <p className="text-slate-700 font-medium">{item.details}</p>
                  <p className="text-slate-500 text-sm">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
