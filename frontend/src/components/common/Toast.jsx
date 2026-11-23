import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = () => {
  const { toastMessage, setToastMessage } = useAuth();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white font-medium text-sm transition-all ${
          isSuccess ? 'bg-emerald-600' : 'bg-rose-600'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
        )}
        <span>{toastMessage.message}</span>
        <button
          onClick={() => setToastMessage(null)}
          className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
