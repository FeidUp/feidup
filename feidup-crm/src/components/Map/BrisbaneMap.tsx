import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../ThemeContext';

// SEQ center (covers Brisbane to Gold Coast to Sunshine Coast)
const SEQ_CENTER: [number, number] = [-27.5, 153.05];
const DEFAULT_ZOOM = 9;

const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

function createIcon(color: string, size: number = 12): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:2px solid rgba(255,255,255,0.8);border-radius:50%;box-shadow:0 0 8px ${color}80;cursor:pointer;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
  });
}

export const MARKER_ICONS = {
  active: createIcon('#22c55e', 12),
  inactive: createIcon('#6b7280', 8),
  highTraffic: createIcon('#dc2626', 16),
  google: createIcon('#f59e0b', 10),
};

interface BrisbaneMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  children?: React.ReactNode;
  className?: string;
}

export function BrisbaneMap({ center = SEQ_CENTER, zoom = DEFAULT_ZOOM, height = '500px', children, className = '' }: BrisbaneMapProps) {
  const { isDark } = useTheme();
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`} style={{ height, border: '1px solid var(--border-color)' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', background: isDark ? '#0f0f0f' : '#f8f8f8' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer attribution={TILE_ATTRIBUTION} url={isDark ? DARK_TILES : LIGHT_TILES} />
        {children}
      </MapContainer>
    </div>
  );
}

export interface CafeMarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  suburb: string;
  postcode?: string;
  address?: string;
  avgDailyFootTraffic: number;
  packagingVolume: number;
  isActive: boolean;
  cuisineType?: string;
  rating?: number;
  reviewCount?: number;
  websiteUrl?: string;
  phone?: string;
}

export function CafeMarkers({ cafes, onAddToLeads }: {
  cafes: CafeMarkerData[];
  onAddToLeads?: (cafe: CafeMarkerData) => void;
}) {
  return (
    <>
      {cafes.map(cafe => {
        const icon = cafe.avgDailyFootTraffic >= 500
          ? MARKER_ICONS.highTraffic
          : cafe.isActive ? MARKER_ICONS.active : MARKER_ICONS.google;

        return (
          <Marker key={cafe.id} position={[cafe.lat, cafe.lng]} icon={icon}>
            <Popup maxWidth={320} minWidth={260}>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 4 }}>
                {/* Header */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15, margin: 0, color: '#111' }}>{cafe.name}</h3>
                    {cafe.rating && (
                      <span style={{ background: '#fbbf24', color: '#111', padding: '2px 6px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                        ★ {cafe.rating}
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>
                    {cafe.address || cafe.suburb}
                    {cafe.postcode ? ` ${cafe.postcode}` : ''}
                  </p>
                  {cafe.cuisineType && (
                    <span style={{ display: 'inline-block', marginTop: 4, padding: '1px 8px', background: '#f3f4f6', borderRadius: 10, fontSize: 10, color: '#6b7280', textTransform: 'capitalize' }}>
                      {cafe.cuisineType}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{cafe.avgDailyFootTraffic.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>visitors/day</div>
                  </div>
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{cafe.packagingVolume.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>cups/day</div>
                  </div>
                </div>

                {/* Review count */}
                {cafe.reviewCount && cafe.reviewCount > 0 && (
                  <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>
                    {cafe.reviewCount.toLocaleString()} Google reviews
                  </p>
                )}

                {/* Links */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                  {cafe.websiteUrl && (
                    <a href={cafe.websiteUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11, color: '#3b82f6', textDecoration: 'none', padding: '3px 8px', background: '#eff6ff', borderRadius: 6 }}>
                      🌐 Website
                    </a>
                  )}
                  {cafe.phone && (
                    <a href={`tel:${cafe.phone}`}
                      style={{ fontSize: 11, color: '#22c55e', textDecoration: 'none', padding: '3px 8px', background: '#f0fdf4', borderRadius: 6 }}>
                      📞 {cafe.phone}
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #f3f4f6', paddingTop: 8 }}>
                  {onAddToLeads && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddToLeads(cafe); }}
                      style={{
                        flex: 1, padding: '6px 0', background: '#dc2626', color: '#fff',
                        border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      + Add to Leads
                    </button>
                  )}
                  <span style={{
                    padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                    background: cafe.isActive ? '#dcfce7' : '#f3f4f6',
                    color: cafe.isActive ? '#16a34a' : '#9ca3af',
                    display: 'flex', alignItems: 'center',
                  }}>
                    {cafe.isActive ? 'Partner' : 'Prospect'}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export function MapLegend({ items }: { items: Array<{ color: string; label: string }> }) {
  return (
    <div className="glass-card rounded-xl p-3 absolute bottom-4 right-4 z-[1000]" style={{ minWidth: 150 }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Legend</p>
      <div className="space-y-1.5">
        {items.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}60` }} />
            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
