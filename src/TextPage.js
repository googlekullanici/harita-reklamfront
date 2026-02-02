import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function TextPage() {
  const [texts, setTexts] = useState(["", "", ""]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const saveTexts = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/data/texts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text1: texts[0],
          text2: texts[1],
          text3: texts[2]
        })
      });

      if (response.ok) {
        alert("✅ Metinler kaydedildi!");
        setTexts(["", "", ""]);
        navigate('/');
      } else {
        alert("❌ Kaydetme hatası!");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Bağlantı hatası!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 600, 
      margin: '50px auto', 
      padding: 30,
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: 30, color: '#1a1a1a' }}>Metin Girişi</h2>

      <div style={{ marginBottom: 20 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          fontWeight: 600,
          color: '#555'
        }}>
          Başlık
        </label>
        <input
          value={texts[0]}
          onChange={(e) => handleChange(0, e.target.value)}
          placeholder="Reklam başlığı"
          style={{
            width: '100%',
            padding: 12,
            fontSize: 16,
            border: '2px solid #e5e7eb',
            borderRadius: 8,
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          fontWeight: 600,
          color: '#555'
        }}>
          Açıklama
        </label>
        <textarea
          value={texts[1]}
          onChange={(e) => handleChange(1, e.target.value)}
          placeholder="Reklam açıklaması"
          style={{
            width: '100%',
            padding: 12,
            fontSize: 16,
            border: '2px solid #e5e7eb',
            borderRadius: 8,
            minHeight: 100,
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: 30 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          fontWeight: 600,
          color: '#555'
        }}>
          Fiyat
        </label>
        <input
          value={texts[2]}
          onChange={(e) => handleChange(2, e.target.value)}
          placeholder="₺0"
          style={{
            width: '100%',
            padding: 12,
            fontSize: 16,
            border: '2px solid #e5e7eb',
            borderRadius: 8,
            boxSizing: 'border-box'
          }}
        />
      </div>

      <button 
        onClick={saveTexts}
        disabled={isSaving}
        style={{
          width: '100%',
          padding: 14,
          background: isSaving ? '#9ca3af' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: isSaving ? 'not-allowed' : 'pointer'
        }}
      >
        {isSaving ? '⏳ Kaydediliyor...' : '✓ Kaydet ve Haritaya Dön'}
      </button>
    </div>
  );
}

export default TextPage;