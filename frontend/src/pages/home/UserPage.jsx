import React, { useRef, useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { FiUser, FiEdit2, FiCamera } from "react-icons/fi";
import ProfileDropdown from "@/components/header/ProfileDropdown";
import { useUser } from "@/context/UserContext";
import supabase from "@/config/supabaseClient";
import api from "@/config/api";
import Modal from 'react-modal';

const UserPage = () => {
  const { user, saveUser } = useUser();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  if (!user) return null;

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      // Garante que o usuário está autenticado no Supabase
      let session = await supabase.auth.getSession();
      if (!session.data.session) {
        const jwt = localStorage.getItem('token');
        if (jwt) {
          await supabase.auth.setSession({ access_token: jwt, refresh_token: jwt });
          session = await supabase.auth.getSession();
        }
      }
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.email.replace(/[^a-zA-Z0-9]/g, "")}_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(fileName);
      await api.put('/api/user/profilePhoto', { url: publicUrl.publicUrl });
      saveUser({ ...user, avatar: publicUrl.publicUrl });
    } catch (err) {
      console.error('Erro ao fazer upload do avatar:', err, err?.response, JSON.stringify(err));
      alert('Erro ao fazer upload do avatar: ' + (err?.message || JSON.stringify(err)));
    } finally {
      setUploading(false);
    }
  };

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setShowEdit(true);
  };

  const handleSaveEdit = () => {
    // Aqui você pode integrar com o backend futuramente
    saveUser({ ...user, name: editName, email: editEmail });
    setShowEdit(false);
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
            <button onClick={handleOpenEdit} style={{ background: '#232428', color: '#fff', border: '1px solid #6E54FF', borderRadius: 16, padding: '18px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              <FiEdit2 size={22} /> Edit account
            </button>
            <Modal
              isOpen={showEdit}
              onRequestClose={() => setShowEdit(false)}
              style={{
                overlay: {
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                },
                content: {
                  position: 'static',
                  inset: 'unset',
                  maxWidth: 400,
                  width: '100%',
                  borderRadius: 16,
                  padding: 32,
                  background: '#232428',
                  color: '#fff',
                  minHeight: 'auto',
                  maxHeight: '90vh',
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 2px 24px rgba(0,0,0,0.4)'
                }
              }}
              ariaHideApp={false}
            >
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Editar Conta</h2>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', marginBottom: 6, color: '#aaa' }}>Nome</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #444', background: '#18191A', color: '#fff', fontSize: 16 }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 6, color: '#aaa' }}>Email</label>
                <input value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #444', background: '#18191A', color: '#fff', fontSize: 16 }} />
              </div>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowEdit(false)} style={{ background: 'none', border: '1px solid #aaa', color: '#aaa', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
                <button onClick={handleSaveEdit} style={{ background: '#6E54FF', border: 'none', color: '#fff', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Salvar</button>
              </div>
            </Modal>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPage; 