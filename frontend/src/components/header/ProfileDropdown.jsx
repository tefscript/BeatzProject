import React, { useState, useRef, useEffect } from "react";
import { FiUser, FiChevronDown, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();
  const { user, clearUser } = useUser();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    window.location.href = "/login";
  };

  if (!user) return null;
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          background: "#232428",
          border: "none",
          borderRadius: 24,
          padding: "8px 18px 8px 12px",
          color: "#fff",
          fontWeight: 600,
          fontSize: 16,
          cursor: "pointer",
          gap: 10
        }}
      >
        <span style={{ marginRight: 10, display: 'flex', alignItems: 'center' }}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} style={{ width: 32, height: 32, borderRadius: 16, objectFit: 'cover', marginRight: 8 }} />
          ) : (
            <FiUser size={28} color="#aaa" style={{ marginRight: 8 }} />
          )}
          {user.name}
        </span>
        <FiChevronDown size={20} color="#aaa" />
      </button>
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: 48,
          background: "#232428",
          borderRadius: 16,
          boxShadow: "0 4px 24px #0006",
          minWidth: 220,
          zIndex: 1000,
          padding: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: 40, height: 40, borderRadius: 20, objectFit: 'cover' }} />
            ) : (
              <FiUser size={32} color="#aaa" />
            )}
            <div>
              <div style={{ fontWeight: 700 }}>{user.name}</div>
              <div style={{ color: '#aaa', fontSize: 14 }}>{user.email}</div>
            </div>
          </div>
          <button
            onClick={() => { setOpen(false); navigate("/account"); }}
            style={{ width: '100%', background: 'none', border: 'none', color: '#fff', fontWeight: 600, fontSize: 16, textAlign: 'left', padding: '10px 0', cursor: 'pointer', borderRadius: 8, marginBottom: 8 }}
          >
            Account
          </button>
          <button
            onClick={handleLogout}
            style={{ width: '100%', background: 'none', border: 'none', color: '#ff4d4f', fontWeight: 600, fontSize: 16, textAlign: 'left', padding: '10px 0', cursor: 'pointer', borderRadius: 8 }}
          >
            <FiLogOut size={18} style={{ marginRight: 8, verticalAlign: -3 }} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 