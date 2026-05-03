"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon path issue in Next.js
const icon = L.icon({
  iconUrl: "/images/map-marker.png",
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -40],
});

interface ContactMapProps {
  lat: number;
  lng: number;
}

export default function ContactMap({ lat, lng }: ContactMapProps) {
  return (
    <div className="h-80 md:h-96 w-full" role="application" aria-label="Office location map">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={icon}>
          <Popup>
            <strong>Ethos Habitats</strong>
            <br />
            <span className="text-sm text-gray-600">123 Design District</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
