import { toast } from 'react-hot-toast';
import Toast from '@/components/shared/Toast';

export const showToast = {
  success: (message) => 
    toast.custom((t) => (
      <Toast
        type="success"
        message={message}
        onClose={() => toast.dismiss(t.id)}
      />
    )),
  
  error: (message) =>
    toast.custom((t) => (
      <Toast
        type="error"
        message={message}
        onClose={() => toast.dismiss(t.id)}
      />
    )),
  
  warning: (message) =>
    toast.custom((t) => (
      <Toast
        type="warning"
        message={message}
        onClose={() => toast.dismiss(t.id)}
      />
    )),
  
  info: (message) =>
    toast.custom((t) => (
      <Toast
        type="info"
        message={message}
        onClose={() => toast.dismiss(t.id)}
      />
    ))
};