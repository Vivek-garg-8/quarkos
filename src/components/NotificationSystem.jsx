import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const NotificationItem = ({ notification, onRemove }) => {
  const { id, type, title, message, duration = 4000 } = notification;

  const icons = {
    success: FiCheck,
    error: FiX,
    info: FiInfo,
    warning: FiAlertTriangle
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };

  const Icon = icons[type] || FiInfo;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-2 min-w-80 animate-slide-in-right">
      <div className="flex items-start space-x-3">
        <div className={`${colors[type]} rounded-full p-1 flex-shrink-0`}>
          <Icon size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          {message && <p className="text-sm text-gray-600 mt-1">{message}</p>}
        </div>
        <button
          onClick={() => onRemove(id)}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
};

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Expose addNotification globally for easy access
  useEffect(() => {
    window.showNotification = addNotification;
    return () => {
      delete window.showNotification;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationSystem;