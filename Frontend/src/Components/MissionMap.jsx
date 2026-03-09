import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    map.flyTo(center, zoom, { animate: true, duration: 1.2, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
};

const MissionMap = ({ missions, mapState }) => {
  const defaultCenter = [13.7563, 100.5018]; 
  const currentCenter = mapState?.center || defaultCenter;
  const currentZoom = mapState?.zoom || 6;

  return (
    <div className="h-full w-full overflow-hidden rounded-[32px] bg-neutral-100 relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={6} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', borderRadius: '32px' }}
        zoomControl={false} // ซ่อน Zoom เดิม เดี๋ยวไปทำปุ่มแยกสวยๆ เอา
      >
        <MapUpdater center={currentCenter} zoom={currentZoom} />

        {/* ✅ ใช้ CartoDB Positron: แผนที่แบบ Clean Minimal (คล้าย Apple Maps พื้นฐาน) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {missions.map((mission) => {
            if (!mission.location?.lat || !mission.location?.lng) return null;

            return (
                <Marker key={mission.id} position={[mission.location.lat, mission.location.lng]}>
                    <Popup className="apple-popup">
                        <div className="w-[200px] p-0 overflow-hidden">
                            {/* รูปใน Popup */}
                            <div className="h-28 w-full relative">
                                <img src={mission.thumbnail} alt={mission.title} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-2 left-3 text-white">
                                   <p className="text-[10px] font-medium opacity-90">{mission.location.name}</p>
                                </div>
                            </div>
                            {/* เนื้อหา Popup */}
                            <div className="p-3 bg-white/90 backdrop-blur-md">
                                <h3 className="font-bold text-[13px] text-[#1d1d1f] leading-tight mb-2 line-clamp-2">
                                  {mission.title}
                                </h3>
                                <button className="w-full py-1.5 bg-[#0071e3] text-white text-[11px] font-bold rounded-full hover:bg-[#0077ED] transition-colors">
                                  View Details
                                </button>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            )
        })}
      </MapContainer>
      
      {/* CSS Override: Popup สไตล์ iOS */}
      <style jsx global>{`
        /* Popup Wrapper */
        .leaflet-popup-content-wrapper {
            border-radius: 18px;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
            padding: 0;
            overflow: hidden;
            background: transparent; /* ให้เห็น backdrop-blur */
        }
        .leaflet-popup-content { margin: 0; width: 200px !important; }
        
        /* ปลายแหลม Popup */
        .leaflet-popup-tip { background-color: white; }
        
        /* ลบกรอบขาวเดิมๆ ของ Marker */
        .leaflet-container a.leaflet-popup-close-button {
            color: white;
            top: 5px;
            right: 5px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

export default MissionMap;