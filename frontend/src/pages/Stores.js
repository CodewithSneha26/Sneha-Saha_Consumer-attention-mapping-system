import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import './Stores.css';

function Stores() {
  const [stores, setStores] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/stores'),
      api.get('/shelves'),
      api.get('/cameras'),
    ]).then(([storesRes, shelvesRes, camerasRes]) => {
      setStores(storesRes.data);
      setShelves(shelvesRes.data);
      setCameras(camerasRes.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getStoreName = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    return store ? store.name : `Store #${storeId}`;
  };

  return (
    <div className="stores-page">
      <Navbar />
      <main className="stores-content">
        <h2>Stores</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid-section">
            {stores.map((store) => (
              <div key={store.id} className="info-card">
                <span className="tag store-tag">STORE</span>
                <h3>{store.name}</h3>
                <p>{store.location}</p>
              </div>
            ))}
          </div>
        )}

        <h2>Shelves</h2>
        <div className="grid-section">
          {shelves.map((shelf) => (
            <div key={shelf.id} className="info-card">
              <span className="tag shelf-tag">SHELF</span>
              <h3>{shelf.shelf_name}</h3>
              <p>{getStoreName(shelf.store_id)}</p>
              {shelf.zone && <p className="zone-label">Zone: {shelf.zone}</p>}
            </div>
          ))}
        </div>

        <h2>Cameras</h2>
        <div className="grid-section">
          {cameras.map((camera) => (
            <div key={camera.id} className="info-card">
              <span className="tag camera-tag">CAMERA</span>
              <h3>{camera.camera_name}</h3>
              <p>{getStoreName(camera.store_id)}</p>
              {camera.location_description && <p className="zone-label">{camera.location_description}</p>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Stores;