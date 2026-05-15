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
              { "elementType": "geometry", "stylers": [{"color": "#f5f5f5"}] },
              { "elementType": "labels.icon", "stylers": [{"visibility": "off"}] },
              { "elementType": "labels.text.fill", "stylers": [{"color": "#616161"}] },
              { "elementType": "labels.text.stroke", "stylers": [{"color": "#f5f5f5"}] },
              { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{"color": "#bdbdbd"}] },
              { "featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#eeeeee"}] },
              { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{"color": "#757575"}] },
              { "featureType": "road", "elementType": "geometry", "stylers": [{"color": "#ffffff"}] },
              { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{"color": "#757575"}] },
              { "featureType": "road.highway", "elementType": "geometry", "stylers": [{"color": "#dadada"}] },
              { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{"color": "#616161"}] },
              { "featureType": "water", "elementType": "geometry", "stylers": [{"color": "#c9c9c9"}] },
              { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{"color": "#9e9e9e"}] }
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
          fillColor: "#4f46e5", // Indigo 600
          fillOpacity: 1,
          strokeColor: "#ffffff",
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
    <div className="min-h-full flex flex-col relative bg-slate-100 font-sans">
      
      {/* Absolute Header Panel */}
      <div className="absolute top-4 left-4 z-10 w-full max-w-[380px] md:max-w-md flex flex-col gap-4 pointer-events-none">
        
        {/* Search Box */}
        <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] shadow-2xl shadow-indigo-900/10 border border-white pointer-events-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="bg-indigo-600 text-white p-2 rounded-xl shadow-md"><HugeIconPicker name="map01Icon" size={20} /></span>
              Coverage Map
            </h1>
          </div>
          
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter address..."
                className="w-full bg-slate-50 border-2 border-slate-100/80 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-800 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                disabled={loading || !!error}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <HugeIconPicker name="search01Icon" size={18} />
              </div>
            </div>
            <button 
              onClick={getUserLocation}
              disabled={loading || !!error}
              className="p-3 bg-slate-50 border-2 border-slate-100/80 rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              title="Use My Location"
            >
              <HugeIconPicker name="location04Icon" size={20} />
            </button>
          </div>
        </div>

        {/* Results Sidebar */}
        {(selectedLocation || searching) && (
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-indigo-900/10 border border-white pointer-events-auto flex flex-col max-h-[calc(100vh-180px)] overflow-hidden transition-all duration-300">
            {searching ? (
              <div className="p-10 flex flex-col items-center justify-center text-center">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                  <HugeIconPicker name="radar01Icon" size={24} className="absolute inset-0 m-auto text-indigo-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Scanning Area...</h3>
                <p className="text-xs font-bold text-slate-500 mt-2 truncate w-full">{selectedLocation}</p>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-slate-100 bg-white/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Coverage Results</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{selectedLocation}</p>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button 
                      onClick={() => setFilterAvailable(!filterAvailable)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${filterAvailable ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      Available Only
                    </button>
                    <button 
                      onClick={() => setFilterFiber(!filterFiber)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${filterFiber ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      Fiber Optics
                    </button>
                    <button 
                      onClick={() => setSortPrice(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${sortPrice !== 'none' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      Price {sortPrice === 'asc' ? '↑' : sortPrice === 'desc' ? '↓' : ''}
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {filteredIsps.length === 0 ? (
                    <div className="text-center p-8 text-slate-500 font-medium">No ISPs match your filters.</div>
                  ) : (
                    filteredIsps.map((isp, idx) => (
                      <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group relative">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 flex items-center justify-center font-black text-indigo-700 text-lg shadow-inner">
                              {isp.logo}
                            </div>
                            <div>
                              <h3 className="font-black text-slate-800 text-sm">{isp.name}</h3>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-0.5">
                                <span className="text-amber-400">★</span> {isp.rating}
                              </div>
                            </div>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${isp.available ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {isp.available ? 'Available' : 'Limited'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-indigo-50/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <HugeIconPicker name="zapIcon" size={16} className="text-indigo-500" />
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase">Speed</p>
                              <p className="text-xs font-bold text-slate-800">{isp.speed}</p>
                            </div>
                          </div>
                          <div className="h-6 w-px bg-slate-200" />
                          <div className="flex items-center gap-2">
                            <HugeIconPicker name="bankNote01Icon" size={16} className="text-teal-500" />
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase">From</p>
                              <p className="text-xs font-bold text-slate-800">{isp.price}</p>
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
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="font-bold text-slate-600 text-sm">Loading Maps Engine...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-20">
            <div className="text-center p-6 bg-white rounded-3xl shadow-xl border border-red-100">
              <div className="bg-red-100 text-red-600 p-3 rounded-full inline-block mb-3">
                <HugeIconPicker name="alertCircleIcon" size={28} />
              </div>
              <h2 className="text-lg font-black text-slate-900 mb-1">Map Error</h2>
              <p className="text-sm font-medium text-slate-500">{error}</p>
            </div>
          </div>
        )}
        
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
}
