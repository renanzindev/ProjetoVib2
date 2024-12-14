import React from 'react';
import { CheckSquare, Users, Share } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            About Vibbraneo ToDo
          </h1>
          <p className="text-slate-600">
            A powerful collaborative task management tool for Vibbraneo's teams
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            What We Offer
          </h2>
          
          <div className="space-y-6">
            <Feature
              icon={<CheckSquare className="w-6 h-6 text-cyan-500" />}
              title="Hierarchical Task Management"
              description="Create main tasks and organize sub-tasks in a clear, hierarchical structure"
            />
            
            <Feature
              icon={<Users className="w-6 h-6 text-cyan-500" />}
              title="Team Collaboration"
              description="Share your lists with colleagues and work together in real-time"
            />
            
            <Feature
              icon={<Share className="w-6 h-6 text-cyan-500" />}
              title="Easy Sharing"
              description="Share your lists via email with one or multiple team members"
            />
          </div>
        </div>

        <div className="text-center text-slate-600">
          <p>
            Built with ❤️ for Vibbraneo's internal teams
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
}