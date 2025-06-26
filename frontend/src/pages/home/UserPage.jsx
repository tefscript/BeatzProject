import React, { useRef, useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { FiUser, FiEdit2, FiCamera } from "react-icons/fi";
import ProfileDropdown from "@/components/header/ProfileDropdown";
import { useUser } from "@/context/UserContext";
import supabase from "@/config/supabaseClient";

const UserPage = () => {
  const { user, saveUser } = useUser();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  if (!user) return null;

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.email.replace(/[^a-zA-Z0-9]/g, "")}_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(fileName);
      saveUser({ ...user, avatar: publicUrl.publicUrl });
    } catch (err) {
      alert("Erro ao fazer upload do avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", background: "#18191A", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 72, padding: 32, color: "#fff", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 32 }}>
          <ProfileDropdown />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Account</h1>
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
          {/* Card de perfil */}
          <div style={{ background: '#232428', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 320, position: 'relative' }}>
            <div style={{ width: 120, height: 120, borderRadius: 60, overflow: 'hidden', background: '#333', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <FiUser size={64} color="#aaa" />
              )}
              <button
                onClick={() => fileInputRef.current.click()}
                style={{ position: 'absolute', bottom: 8, right: 8, background: '#6E54FF', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Alterar avatar"
                disabled={uploading}
              >
                <FiCamera size={20} color="#fff" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
                disabled={uploading}
              />
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>{user.name}</div>
            <div style={{ color: '#aaa', fontSize: 16 }}>{user.email}</div>
            {uploading && <div style={{ color: '#6E54FF', marginTop: 12 }}>Enviando avatar...</div>}
          </div>
          {/* Botão de editar conta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <button style={{ background: '#232428', color: '#fff', border: '1px solid #6E54FF', borderRadius: 16, padding: '18px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              <FiEdit2 size={22} /> Edit account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPage; 