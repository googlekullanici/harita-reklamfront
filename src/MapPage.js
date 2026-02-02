import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import image from "./imagesss.png";

// Marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Marker'ı güncellemek için özel component
function DraggableMarker({ position, onDragEnd, text }) {
  const [markerPos, setMarkerPos] = useState(position);

  useEffect(() => {
    setMarkerPos(position);
  }, [position]);

  const eventHandlers = {
    dragend(e) {
      const marker = e.target;
      const pos = marker.getLatLng();
      setMarkerPos([pos.lat, pos.lng]);
      onDragEnd(e);
    },
  };

  return (
    <Marker 
      position={markerPos} 
      draggable={true} 
      eventHandlers={eventHandlers}
    >
      {text && (
        <Tooltip permanent direction="top" offset={[0, -12]} opacity={1}>
          <div
            style={{
              background: "#ffffff",
              padding: "8px 14px",
              borderRadius: 10,
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              fontSize: 14,
              fontWeight: 700,
              color: "#1f2937",
              whiteSpace: "nowrap",
              border: "2px solid #4285f4"
            }}
          >
            📍 {text}
          </div>
        </Tooltip>
      )}
    </Marker>
  );
}

function MapPage() {
  const navigate = useNavigate();
  const [markerPos, setMarkerPos] = useState([41.015137, 28.97953]);
  const [texts, setTexts] = useState(["", "", ""]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/data`);
      const data = await response.json();
      
      setTexts([data.text1, data.text2, data.text3]);
      setMarkerPos([parseFloat(data.latitude), parseFloat(data.longitude)]);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPos([lat, lng]);

    try {
      await fetch(`${API_URL}/api/data/location`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng })
      });
      console.log("✅ Konum kaydedildi");
    } catch (error) {
      console.error("❌ Konum kaydetme hatası:", error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ 
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ 
            fontSize: 48, 
            marginBottom: 16,
            animation: 'pulse 1.5s infinite'
          }}>⏳</div>
          <h2 style={{ margin: 0, fontWeight: 300 }}>Yükleniyor...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f4f8" }}>
      
      {/* SOL PANEL - PROFESYONEl TASARIM */}
      <div
        style={{
          width: 420,
          background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
          padding: 32,
          boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "auto"
        }}
      >
        {/* ÜST BAŞLIK VE DÜZENLE BUTONU */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: "2px solid #e5e7eb"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              background: "linear-gradient(135deg, #4285f4 0%, #34a853 100%)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(66, 133, 244, 0.3)"
            }}>
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#fff"/>
                <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#fff"/>
              </svg>
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#1f2937",
                letterSpacing: "-0.5px"
              }}>
                Google Harita
              </h1>
              <p style={{
                margin: 0,
                fontSize: 12,
                color: "#6b7280",
                fontWeight: 500
              }}>
                Harita Yönetimi
              </p>
            </div>
          </div>
          
         
        </div>

        {/* GÖRSEL KARTI */}
        <div style={{ 
          position: "relative",
          marginBottom: 28,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
        }}>
          <img
            src={image}
            alt="reklam görseli"
            style={{
              width: "100%",
              display: "block",
              borderRadius: 16
            }}
          />
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)",
            borderRadius: 16
          }} />
        </div>

        {/* BİLGİ KARTI - MODERN TASARIM */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            padding: 28,
            flexGrow: 1,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            border: "1px solid #e5e7eb"
          }}
        >
          {/* KONUM ETİKETİ */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "linear-gradient(135deg, #4285f4 0%, #34a853 100%)",
            color: "white",
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.5,
            marginBottom: 16,
            boxShadow: "0 2px 8px rgba(66, 133, 244, 0.25)"
          }}>
            📍 İşletme Konumu
          </div>

          {/* BAŞLIK */}
          {texts[0] ? (
            <h2 style={{ 
              margin: "0 0 16px 0", 
              fontSize: 26, 
              fontWeight: 700, 
              color: "#111827",
              lineHeight: 1.3,
              letterSpacing: "-0.5px"
            }}>
              {texts[0]}
            </h2>
          ) : (
            <div style={{
              height: 32,
              background: "#f3f4f6",
              borderRadius: 8,
              marginBottom: 16,
              animation: "pulse 1.5s infinite"
            }} />
          )}

          {/* AÇIKLAMA */}
          {texts[1] ? (
            <p style={{ 
              margin: "0 0 24px 0", 
              color: "#4b5563", 
              lineHeight: 1.7,
              fontSize: 15
            }}>
              {texts[1]}
            </p>
          ) : (
            <div>
              <div style={{
                height: 16,
                background: "#f3f4f6",
                borderRadius: 6,
                marginBottom: 8
              }} />
              <div style={{
                height: 16,
                background: "#f3f4f6",
                borderRadius: 6,
                width: "80%"
              }} />
            </div>
          )}

          {/* FİYAT KARTI */}
          {texts[2] && (
            <div style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              borderRadius: 14,
              padding: 20,
              marginTop: 24,
              border: "2px solid #86efac"
            }}>
              <div style={{
                fontSize: 11,
                letterSpacing: 1,
                color: "#166534",
                fontWeight: 700,
                marginBottom: 8
              }}>
                ÖDEME TUTARI
              </div>
              <div style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#15803d",
                letterSpacing: "-1px"
              }}>
                {texts[2]}
              </div>
              
            </div>
            
          )}
          <p style={{
                fontSize: 11, }}>Kalan Kullanım 2 Gün</p>
        </div>

        {/* ALT BİLGİ */}
        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            padding: "16px 0",
            fontSize: 12,
            color: "#9ca3af",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}
        >
          <span style={{ fontSize: 16 }}>📍</span>
          <span>Google Hizmet </span>
        </div>
      </div>

      {/* HARİTA */}
      <MapContainer 
        center={markerPos} 
        zoom={13} 
        style={{ flex: 1 }}
        scrollWheelZoom={true}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
        />
        
        <DraggableMarker 
          position={markerPos}
          onDragEnd={handleDragEnd}
          text={texts[0]}
        />
      </MapContainer>
    </div>
  );
}

export default MapPage;