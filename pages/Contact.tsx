import React from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      <h1 className="text-4xl font-bold text-zinc-900 mb-6">Contact Us</h1>
      <p className="text-lg text-zinc-500 mb-12">
        We are always looking for motivated students and collaborators.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Info Column */}
        <div className="space-y-8">
          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 space-y-6">
            <h2 className="font-bold text-zinc-900 text-lg">Lab Information</h2>
            
            <div className="flex items-start gap-4">
              <MapPin className="text-blue-600 mt-1" />
              <div>
                <p className="font-medium text-zinc-900">Address</p>
                <p className="text-zinc-600">
                  Social Science Building (N15), Room 459<br />
                  Chungbuk National University<br />
                  Cheongju, Chungbuk 28644, Republic of Korea
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="text-blue-600" />
              <div>
                <p className="font-medium text-zinc-900">Email</p>
                <p className="text-zinc-600">syou@chungbuk.ac.kr</p>
              </div>
            </div>

             <div className="flex items-center gap-4">
              <Phone className="text-blue-600" />
              <div>
                <p className="font-medium text-zinc-900">Phone</p>
                <p className="text-zinc-600">+82 043-261-2188 (Dept)</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Clock size={18} /> Prospective Students
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              If you are interested in joining our lab as a graduate student or intern, please send your CV and transcript to the PI directly. Please use the subject line "[Prospective Student] Your Name".
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="bg-white">
          <h2 className="font-bold text-zinc-900 text-xl mb-6">Send a Message</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-1">Message</label>
              <textarea 
                id="message" 
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                placeholder="How can we help you?"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-zinc-900 text-white font-medium py-3 rounded-xl hover:bg-zinc-800 active:scale-95 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};