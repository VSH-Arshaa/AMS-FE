
import React, { useEffect, useState, useRef } from "react";
import { getUsers } from "../services/userService";

const BACKEND_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageMap, setImageMap] = useState({});
  const objectUrlsRef = useRef([]); 

  useEffect(() => {
    fetchUsers();
    return () => {
      objectUrlsRef.current.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch(e){}
      });
    };
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await getUsers();
      const content = res?.data?.data?.content ?? [];
      const list = Array.isArray(content) ? content : [];
      setUsers(list);
      fetchAllImages(list);
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }
  const buildImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("/uploads")) return `${BACKEND_BASE}${url}`;
    return `${BACKEND_BASE}/uploads/${url}`;
  };

  async function fetchAllImages(list) {
    if (!Array.isArray(list) || list.length === 0) return;

    const fetchOptions = {};

    const promises = list.map(async (user) => {
      const imgPath = user.profileImageUrl;
      const url = buildImageUrl(imgPath);
      if (!url) return { id: user.id, objectUrl: null };

      try {
        const resp = await fetch(url, fetchOptions);
        if (!resp.ok) {
          return { id: user.id, objectUrl: null };
        }
        const blob = await resp.blob();
        const objectUrl = URL.createObjectURL(blob);
        objectUrlsRef.current.push(objectUrl);
        return { id: user.id, objectUrl };
      } catch (err) {
        return { id: user.id, objectUrl: null };
      }
    });

    const results = await Promise.all(promises);
    const map = {};
    results.forEach((r) => {
      if (r && r.id != null) map[r.id] = r.objectUrl || null;
    });
    setImageMap(map);
  }

  const initials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(s => s[0]?.toUpperCase()).slice(0,2).join("");
  };

  if (loading) return <p>Loading users...</p>;
  if (errorMsg) return <p style={{ color: "red" }}>Error: {errorMsg}</p>;
  if (!users.length) return <p>No users found</p>;

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table style={{
          borderCollapse: "collapse",
          width: "100%",
          minWidth: 800,
          border: "1px solid #999"
        }}>
          <thead>
            <tr style={{ background: "#f7f7f7" }}>
              <th style={thStyle}>Profile Image</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Employee ID</th>
              <th style={thStyle}>Phone</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => {
              const objectUrl = imageMap[user.id];
              const rawPath = user.profileImageUrl;
              return (
                <tr key={user.id ?? user._id} style={{ borderTop: "1px solid #ddd" }}>
                  <td style={tdStyleCenter}>
                    {objectUrl ? (
                      <img
                        src={objectUrl}
                        alt={user.name || "user"}
                        width={64}
                        height={64}
                        style={{ borderRadius: "50%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <div style={{
                        width: 64, height: 64, borderRadius: "50%", background: "#ddd",
                        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600
                      }}>
                        {initials(user.name)}
                      </div>
                    )}

                  </td>

                  <td style={tdStyle}>{user.name ?? "N/A"}</td>
                  <td style={tdStyle}>{user.email ?? "N/A"}</td>
                  <td style={tdStyle}>{user.employeeId ?? "N/A"}</td>
                  <td style={tdStyle}>{user.phone ?? "N/A"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px 10px",
  borderBottom: "1px solid #ccc",
  fontWeight: 700
};

const tdStyle = {
  padding: "14px 10px",
  verticalAlign: "middle"
};

const tdStyleCenter = {
  ...tdStyle,
  textAlign: "center",
  width: 100
};
