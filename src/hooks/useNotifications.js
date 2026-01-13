import { useState } from "react";

// Socket connections removed: provide a minimal no-op hook
export const useNotifications = (userId, isAuthenticated) => {
  const [notifications, setNotifications] = useState([]);

  const isConnected = false;

  const removeNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return {
    notifications,
    isConnected,
    removeNotification,
  };
};
