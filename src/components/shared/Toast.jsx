import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />
  };

  const styles = {
    success: 'border-emerald-500/20 bg-emerald-500/10',
    error: 'border-red-500/20 bg-red-500/10',
    warning: 'border-yellow-500/20 bg-yellow-500/10',
    info: 'border-indigo-500/20 bg-indigo-500/10'
  };

  return (
    <div className={`${styles[type]} rounded-lg border backdrop-blur-md shadow-lg`}>
      <div className="flex items-center gap-3 p-4">
        {icons[type]}
        <p className="text-sm text-gray-900 dark:text-white flex-1">
          {message}
        </p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Toast;