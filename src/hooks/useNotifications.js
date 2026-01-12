import { useEffect, useState } from "react";
import { io } from "socket.io-client";

/**
 * Custom Hook for Socket.IO notifications
 * Manages socket connection and notification state
 */
export const useNotifications = (userId, isAuthenticated) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      return;
    }

    // Initialize socket connection
    const socketInstance = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
      {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      }
    );

    socketInstance.on("connect", () => {
      setIsConnected(true);

      // Register user with the server
      socketInstance.emit("register_user", userId);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Listen for hire notifications
    socketInstance.on("hire_notification", (notification) => {
      console.log("Notification received:", notification);
      addNotification(notification);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [userId, isAuthenticated]);

  /**
   * Add notification to state with unique ID and remove after 5 seconds
   */
  const addNotification = (notification) => {
    const notificationWithId = {
      ...notification,
      id: Date.now(),
    };

    setNotifications((prev) => [...prev, notificationWithId]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(notificationWithId.id);
    }, 5000);
  };

  /**
   * Remove notification by ID
   */
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return {
    socket,
    notifications,
    isConnected,
    removeNotification,
  };
};
