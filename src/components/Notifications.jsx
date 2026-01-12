import React from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

/**
 * Notifications Component
 * Displays toast-style notifications for real-time updates
 */
const Notifications = ({ notifications, onRemove }) => {
  const getNotificationStyles = (type) => {
    switch (type) {
      case "hired":
        return {
          bg: "bg-green-50 border-green-200",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          textColor: "text-green-800",
        };
      case "rejected":
        return {
          bg: "bg-red-50 border-red-200",
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
          textColor: "text-red-800",
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: <AlertCircle className="w-5 h-5 text-blue-600" />,
          textColor: "text-blue-800",
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => {
        const styles = getNotificationStyles(notification.type);
        return (
          <div
            key={notification.id}
            className={`${styles.bg} border rounded-lg p-4 shadow-lg animate-fadeIn`}
          >
            <div className="flex items-start gap-3">
              {styles.icon}
              <div className="flex-1">
                <p className={`font-semibold ${styles.textColor}`}>
                  {notification.type === "hired"
                    ? "Congratulations!"
                    : "Update"}
                </p>
                <p className={`text-sm ${styles.textColor} mt-1`}>
                  {notification.message}
                </p>
                {notification.budget && (
                  <p className={`text-xs ${styles.textColor} mt-2 font-medium`}>
                    Budget: ${notification.budget.toLocaleString()}
                  </p>
                )}
                {notification.clientName && (
                  <p className={`text-xs ${styles.textColor} mt-1`}>
                    Client: {notification.clientName}
                  </p>
                )}
              </div>
              <button
                onClick={() => onRemove(notification.id)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
