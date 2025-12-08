
import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "info", timeout = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    if (timeout) setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), timeout);
  }, []);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ show, remove }}>
      {children}
      <div style={{ position: "fixed", right: 16, top: 16, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              marginBottom: 8,
              padding: "10px 14px",
              minWidth: 200,
              borderRadius: 6,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              background: t.type === "error" ? "#ffdddd" : t.type === "success" ? "#ddffdd" : "#ffffff",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <strong style={{ display: "block", marginBottom: 4, fontSize: 13 }}>
              {t.type.toUpperCase()}
            </strong>
            <div style={{ fontSize: 13 }}>{t.message}</div>
            <button onClick={() => remove(t.id)} style={{ marginTop: 6, fontSize: 12 }}>
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
