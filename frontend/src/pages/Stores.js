import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import './Stores.css';

function Stores() {
  const [stores, setStores] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [storeForm, setStoreForm] = useState({ name: '', location: '' });
  const [shelfForm, setShelfForm] = useState({ store_id: '', shelf_name: '', zone: '' });
  const [cameraForm, setCameraForm] = useState({ store_id: '', camera_name: '', location_description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = () => {
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
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getStoreName = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    return store ? store.name : `Store #${storeId}`;
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/stores', storeForm);
      setStoreForm({ name: '', location: '' });
      fetchAll();
    } catch (err) {
      alert('Failed to create store.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateShelf = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/shelves', { ...shelfForm, store_id: parseInt(shelfForm.store_id) });
      setShelfForm({ store_id: '', shelf_name: '', zone: '' });
      fetchAll();
    } catch (err) {
      alert('Failed to create shelf.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCamera = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/cameras', { ...cameraForm, store_id: parseInt(cameraForm.store_id) });
      setCameraForm({ store_id: '', camera_name: '', location_description: '' });
      fetchAll();
    } catch (err) {
      alert('Failed to create camera.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="stores-page">
      <Navbar />
      <main className="stores-content">

        <h2>Add New Store</h2>
        <form className="add-form" onSubmit={handleCreateStore}>
          <input
            type="text"
            placeholder="Store name"
            value={storeForm.name}
            onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={storeForm.location}
            onChange={(e) => setStoreForm({ ...storeForm, location: e.target.value })}
            required
          />
          <button type="submit" disabled={submitting}>Add Store</button>
        </form>

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

        <h2>Add New Shelf</h2>
        <form className="add-form" onSubmit={handleCreateShelf}>
          <select
            value={shelfForm.store_id}
            onChange={(e) => setShelfForm({ ...shelfForm, store_id: e.target.value })}
            required
          >
            <option value="">Select store</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Shelf name"
            value={shelfForm.shelf_name}
            onChange={(e) => setShelfForm({ ...shelfForm, shelf_name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Zone (optional)"
            value={shelfForm.zone}
            onChange={(e) => setShelfForm({ ...shelfForm, zone: e.target.value })}
          />
          <button type="submit" disabled={submitting}>Add Shelf</button>
        </form>

        <h2>Shelves</h2>
        <div className="grid-section">
          {shelves.map((shelf) => (
            <div key={shelf.id} className="info-card">
              <span className="tag shelf-tag">SHELF</span>
              <Link to={`/shelf-detail/${encodeURIComponent(shelf.shelf_name)}`} className="shelf-link">
                <h3>{shelf.shelf_name}</h3>
              </Link>
              <p>{getStoreName(shelf.store_id)}</p>
              {shelf.zone && <p className="zone-label">Zone: {shelf.zone}</p>}
            </div>
          ))}
        </div>

        <h2>Add New Camera</h2>
        <form className="add-form" onSubmit={handleCreateCamera}>
          <select
            value={cameraForm.store_id}
            onChange={(e) => setCameraForm({ ...cameraForm, store_id: e.target.value })}
            required
          >
            <option value="">Select store</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Camera name"
            value={cameraForm.camera_name}
            onChange={(e) => setCameraForm({ ...cameraForm, camera_name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location description (optional)"
            value={cameraForm.location_description}
            onChange={(e) => setCameraForm({ ...cameraForm, location_description: e.target.value })}
          />
          <button type="submit" disabled={submitting}>Add Camera</button>
        </form>

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