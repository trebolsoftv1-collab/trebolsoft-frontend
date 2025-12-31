// sync-forced-2025
import React, { useState, useRef } from 'react';
import { MapPinIcon, CameraIcon } from '@heroicons/react/24/outline';

export default function ClientLocationPhoto({ onLocationUpdate, onPhotoSelect, initialLocation, initialPhoto }) {
  const [location, setLocation] = useState(initialLocation || null);
  const [photo, setPhoto] = useState(initialPhoto || null);
  const [locationLoading, setLocationLoading] = useState(false);
  const fileInputRef = useRef(null);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada por este navegador');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setLocation(newLocation);
        onLocationUpdate(newLocation);
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        alert('Error al obtener la ubicación');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      onPhotoSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Ubicación */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación
        </label>
        <div className="space-y-2">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <MapPinIcon className="h-5 w-5 mr-2" />
            {locationLoading ? 'Obteniendo ubicación...' : 'Obtener ubicación actual'}
          </button>
          {location && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
            </div>
          )}
        </div>
      </div>

      {/* Foto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foto
        </label>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <CameraIcon className="h-5 w-5 mr-2" />
            Seleccionar foto
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
          />
          {photo && (
            <div className="mt-2">
              <img
                src={photo}
                alt="Vista previa"
                className="h-32 w-32 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
