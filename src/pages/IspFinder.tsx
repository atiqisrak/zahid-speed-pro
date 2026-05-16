import { useEffect, useRef, useState, useMemo } from 'react';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import HugeIconPicker from '../components/HugeIconPicker';
import { Link } from 'react-router-dom';

type ISP = { name: string; speed: string; price: string; rating: number; available: boolean; fiberOnly: boolean; logo: string; priceVal: number; };

const MOCK_ISPS: ISP[] = [
  { name: 'Link3 Technologies', speed: '100 Mbps', price: '৳ 1,200', priceVal: 1200, rating: 4.8, available: true, fiberOnly: true, logo: 'L' },
  { name: 'Carnival Internet', speed: '75 Mbps', price: '৳ 1,000', priceVal: 1000, rating: 4.5, available: true, fiberOnly: false, logo: 'C' },
  { name: 'Dot Internet', speed: '60 Mbps', price: '৳ 800', priceVal: 800, rating: 4.2, available: false, fiberOnly: true, logo: 'D' },
  { name: 'Amber IT', speed: '120 Mbps', price: '৳ 1,500', priceVal: 1500, rating: 4.7, available: true, fiberOnly: true, logo: 'A' },
  { name: 'Triangle Broadband', speed: '50 Mbps', price: '৳ 600', priceVal: 600, rating: 4.0, available: true, fiberOnly: false, logo: 'T' },
  { name: 'KS Network', speed: '200 Mbps', price: '৳ 2,500', priceVal: 2500, rating: 4.9, available: true, fiberOnly: true, logo: 'K' },
];

export default function IspFinder() {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [marker, setMarker] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isps, setIsps] = useState<ISP[]>([]);
  const [searching, setSearching] = useState(false);
  
  // Filters
  const [filterFiber, setFilterFiber] = useState(false);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [sortPrice, setSortPrice] = useState<'none' | 'asc' | 'desc'>('none');

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      setError("Google Maps API key is missing.");
      setLoading(false);
      return;
    }

    loadGoogleMaps(apiKey)
      .then((google) => {
        if (mapRef.current && !map) {
          const initialMap = new google.maps.Map(mapRef.current, {
            center: { lat: 23.8103, lng: 90.4125 }, // Dhaka
            zoom: 13,
            styles: [
              { "elementType": "geometry", "stylers": [{"color": "#0f172a"}] },
              { "elementType": "labels.icon", "stylers": [{"visibility": "off"}] },
              { "elementType": "labels.text.fill", "stylers": [{"color": "#94a3b8"}] },
              { "elementType": "labels.text.stroke", "stylers": [{"color": "#020617"}] },
              { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{"color": "#64748b"}] },
              { "featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#1e293b"}] },
              { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{"color": "#94a3b8"}] },
              { "featureType": "road", "elementType": "geometry", "stylers": [{"color": "#334155"}] },
              { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{"color": "#94a3b8"}] },
              { "featureType": "road.highway", "elementType": "geometry", "stylers": [{"color": "#475569"}] },
              { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{"color": "#cbd5e1"}] },
              { "featureType": "water", "elementType": "geometry", "stylers": [{"color": "#020617"}] },
              { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{"color": "#475569"}] }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
          setMap(initialMap);

          if (inputRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
              componentRestrictions: { country: "bd" },
              fields: ["formatted_address", "geometry", "name"],
            });

            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              if (!place.geometry || !place.geometry.location) return;
              handleLocationSelect(initialMap, place.geometry.location, place.formatted_address || place.name || "Selected Location", google);
            });
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load Google Maps.");
        setLoading(false);
      });
  }, [map]);

  const handleLocationSelect = (mapInstance: any, location: any, address: string, googleObj: any) => {
    mapInstance.setCenter(location);
    mapInstance.setZoom(15);

    setMarker((prev: any) => {
      if (prev) prev.setMap(null);
      return new googleObj.maps.Marker({
        map: mapInstance,
        position: location,
        animation: googleObj.maps.Animation.DROP,
        icon: {
          path: googleObj.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#2dd4bf", // Teal 400
          fillOpacity: 1,
          strokeColor: "#020617",
          strokeWeight: 3,
        }
      });
    });

    setSelectedLocation(address);
    setSearching(true);
    setTimeout(() => {
      const shuffled = [...MOCK_ISPS].sort(() => 0.5 - Math.random());
      setIsps(shuffled.slice(0, Math.floor(Math.random() * 4) + 2));
      setSearching(false);
    }, 1500);
  };

  const getUserLocation = () => {
    const win = window as any;
    if (!map || !win.google) return;
    if (navigator.geolocation) {
      setSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          const geocoder = new win.google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results: any, status: any) => {
            if (status === "OK" && results && results[0]) {
              handleLocationSelect(map, new win.google.maps.LatLng(pos), results[0].formatted_address, win.google);
            } else {
              handleLocationSelect(map, new win.google.maps.LatLng(pos), "Your Location", win.google);
            }
          });
        },
        () => {
          alert("Geolocation failed or permission denied.");
          setSearching(false);
        }
      );
    } else {
      alert("Browser doesn't support Geolocation");
    }
  };

  const filteredIsps = useMemo(() => {
    let result = [...isps];
    if (filterFiber) result = result.filter(isp => isp.fiberOnly);
    if (filterAvailable) result = result.filter(isp => isp.available);
    if (sortPrice === 'asc') result.sort((a, b) => a.priceVal - b.priceVal);
    if (sortPrice === 'desc') result.sort((a, b) => b.priceVal - a.priceVal);
    return result;
  }, [isps, filterFiber, filterAvailable, sortPrice]);

  return (
    <div className="min-h-screen flex flex-col relative bg-slate-950 font-sans text-slate-100 selection:bg-teal-500/30 selection:text-teal-900">
      
      {/* Absolute Header Panel */}
      <div className="absolute top-32 left-4 md:left-8 z-10 w-[calc(100%-2rem)] md:w-full max-w-[380px] md:max-w-md flex flex-col gap-4 pointer-events-none">
        
        {/* Search Box */}
        <div className="bg-slate-950/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-black text-white tracking-wider uppercase flex items-center gap-3">
              <span className="bg-teal-500/20 text-teal-400 border border-teal-500/30 p-2.5 rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.3)]"><HugeIconPicker name="map01Icon" size={20} /></span>
              ISP Finder
            </h1>
          </div>
          
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter address..."
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white font-bold placeholder:text-slate-500 placeholder:uppercase placeholder:tracking-widest focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all uppercase tracking-wider"
                disabled={loading || !!error}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <HugeIconPicker name="search01Icon" size={18} />
              </div>
            </div>
            <button 
              onClick={getUserLocation}
              disabled={loading || !!error}
              className="p-3.5 bg-white/5 border-2 border-white/10 rounded-2xl text-slate-400 hover:text-teal-400 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all shadow-inner hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]"
              title="Use My Location"
            >
              <HugeIconPicker name="location04Icon" size={20} />
            </button>
          </div>
        </div>

        {/* Results Sidebar */}
        {(selectedLocation || searching) && (
          <div className="bg-slate-950/80 backdrop-blur-xl rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto flex flex-col max-h-[calc(100vh-280px)] overflow-hidden transition-all duration-300">
            {searching ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin" />
                  <HugeIconPicker name="radar01Icon" size={24} className="absolute inset-0 m-auto text-teal-400 animate-pulse drop-shadow-[0_0_10px_currentColor]" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Scanning Area...</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-2 truncate w-full">{selectedLocation}</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-white/10 bg-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-1">Coverage Results</p>
                  <p className="text-sm font-bold text-white uppercase tracking-wider truncate">{selectedLocation}</p>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button 
                      onClick={() => setFilterAvailable(!filterAvailable)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${filterAvailable ? 'bg-teal-500/20 border-teal-500/30 text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.2)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      Available Only
                    </button>
                    <button 
                      onClick={() => setFilterFiber(!filterFiber)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${filterFiber ? 'bg-teal-500/20 border-teal-500/30 text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.2)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      Fiber Optics
                    </button>
                    <button 
                      onClick={() => setSortPrice(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none')}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors flex items-center gap-1 ${sortPrice !== 'none' ? 'bg-teal-500/20 border-teal-500/30 text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.2)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      Price {sortPrice === 'asc' ? '↑' : sortPrice === 'desc' ? '↓' : ''}
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {filteredIsps.length === 0 ? (
                    <div className="text-center p-8 text-slate-500 font-black uppercase tracking-widest text-[11px]">No ISPs match your filters.</div>
                  ) : (
                    filteredIsps.map((isp, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-[1.5rem] p-5 hover:border-teal-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)] transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-teal-400 text-xl shadow-inner group-hover:border-teal-500/30 transition-colors">
                              {isp.logo}
                            </div>
                            <div>
                              <h3 className="font-black text-white text-sm uppercase tracking-wider">{isp.name}</h3>
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-1">
                                <span className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]">★</span> {isp.rating}
                              </div>
                            </div>
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${isp.available ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                            {isp.available ? 'Available' : 'Limited'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 p-3.5 bg-slate-950/50 rounded-xl border border-white/5 group-hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <HugeIconPicker name="zapIcon" size={18} className="text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                            <div>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Speed</p>
                              <p className="text-sm font-bold text-white">{isp.speed}</p>
                            </div>
                          </div>
                          <div className="h-8 w-px bg-white/10" />
                          <div className="flex items-center gap-3">
                            <HugeIconPicker name="bankNote01Icon" size={18} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                            <div>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">From</p>
                              <p className="text-sm font-bold text-white">{isp.price}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 w-full h-full z-0">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-20">
            <div className="text-center">
              <div className="w-14 h-14 border-4 border-white/10 border-t-teal-500 rounded-full animate-spin mx-auto mb-6" />
              <p className="font-black uppercase tracking-widest text-slate-400 text-xs">Loading Maps Engine...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-20">
            <div className="text-center p-8 bg-white/5 rounded-[2rem] shadow-2xl border border-rose-500/20 backdrop-blur-md">
              <div className="bg-rose-500/10 text-rose-400 p-4 rounded-full inline-block mb-4 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <HugeIconPicker name="alertCircleIcon" size={32} />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">Map Error</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{error}</p>
            </div>
          </div>
        )}
        
        <div ref={mapRef} className="w-full h-full opacity-80 mix-blend-screen" />
      </div>
    </div>
  );
}
