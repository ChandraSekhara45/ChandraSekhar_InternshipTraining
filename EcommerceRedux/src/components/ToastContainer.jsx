import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../redux/notificationSlice';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ id, text, type }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeNotification(id));
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="text-primary" />;
      case 'error':
        return <AlertTriangle size={18} style={{ color: 'var(--danger-color)' }} />;
      default:
        return <Info size={18} className="text-secondary" />;
    }
  };

  return (
    <div className="toast">
      <div className="flex items-center gap-4">
        {getIcon()}
        <span className="text-sm font-medium" style={{ letterSpacing: '0.02em' }}>{text}</span>
      </div>
      <button 
        onClick={() => dispatch(removeNotification(id))} 
        className="flex items-center justify-center text-muted hover:text-primary"
        style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const notifications = useSelector(state => state.notifications);

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {notifications.map(n => (
        <Toast key={n.id} id={n.id} text={n.text} type={n.type} />
      ))}
    </div>
  );
};

export default ToastContainer;
