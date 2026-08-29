import React from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { AlertTriangle, Lock, ShieldAlert, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  code: '404' | '403' | '500';
  onGoHome?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ code, onGoHome }) => {
  const meta = {
    '404': {
      title: '404 — Clinical Resource Not Found',
      description: 'The requested patient file, doctor profile, or module route does not exist or has been relocated.',
      icon: <AlertTriangle className="w-12 h-12 text-amber-500" />,
    },
    '403': {
      title: '403 — Unauthorized Role Access',
      description: 'Your currently active user role does not possess permissions to view or mutate this module.',
      icon: <Lock className="w-12 h-12 text-rose-500" />,
    },
    '500': {
      title: '500 — System Exception Encountered',
      description: 'An unhandled application error occurred on the clinical server. System logs have recorded the trace.',
      icon: <ShieldAlert className="w-12 h-12 text-rose-600" />,
    },
  }[code];

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8 border border-slate-200 shadow-lg">
        <div className="flex justify-center mb-4">{meta.icon}</div>
        <h2 className="text-xl font-bold text-navy-900 tracking-tight">{meta.title}</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{meta.description}</p>
        <div className="mt-6 flex justify-center">
          <Button variant="primary" onClick={onGoHome} icon={<ArrowLeft className="w-4 h-4" />}>
            Return to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};
