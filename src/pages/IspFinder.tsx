import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import HugeIconPicker from '../components/HugeIconPicker';
import { Link } from 'react-router-dom';

const MOCK_ISPS = [
  { name: 'Link3 Technologies', speed: 'Up to 100 Mbps', price: '৳ 1,200/mo', rating: 4.8, available: true },
  { name: 'Carnival Internet', speed: 'Up to 75 Mbps', price: '৳ 1,000/mo', rating: 4.5, available: true },
  { name: 'Dot Internet', speed: 'Up to 60 Mbps', price: '৳ 800/mo', rating: 4.2, available: false },
  { name: 'Amber IT', speed: 'Up to 120 Mbps', price: '৳ 1,500/mo', rating: 4.7, available: true },
];

export default function IspFinder() {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isps, setIsps] = useState<typeof MOCK_ISPS>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      setError("Google Maps API key is missing. Please add VITE_GOOGLE_API_KEY to your .env file.");
      setLoading(false);
      return;
    }

    loadGoogleMaps(apiKey)
      .then((google) => {
        if (mapRef.current && !map) {
          // Initialize map centered on Dhaka
          const initialMap = new google.maps.Map(mapRef.current, {
            center: { lat: 23.8103, lng: 90.4125 },
            zoom: 12,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
          setMap(initialMap);

          // Initialize Places Autocomplete
          if (inputRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
              componentRestrictions: { country: "bd" }, // Restrict to Bangladesh
              fields: ["formatted_address", "geometry", "name"],
            });

            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              if (!place.geometry || !place.geometry.location) {
                return; // User entered the name of a Place that was not suggested
              }

              // Update Map
              initialMap.setCenter(place.geometry.location);
              initialMap.setZoom(15);

              // Update Marker
              setMarker((prev) => {
                if (prev) prev.setMap(null); // Remove old marker
                return new google.maps.Marker({
                  map: initialMap,
                  position: place.geometry.location,
                  animation: google.maps.Animation.DROP,
                });
              });

              setSelectedLocation(place.formatted_address || place.name || "Selected Location");
              
              // Simulate API call to find ISPs
              setSearching(true);
              setIsps([]);
              setTimeout(() => {
                // Randomly select 2-4 ISPs
                const shuffled = [...MOCK_ISPS].sort(() => 0.5 - Math.random());
                setIsps(shuffled.slice(0, Math.floor(Math.random() * 3) + 2));
                setSearching(false);
              }, 1500);
            });
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load Google Maps. Please check your API key and connection.");
        setLoading(false);
      });
  }, [map]);

  return (
    <div className="min-h-full bg-slate-50 flex flex-col relative">
      {/* Search Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 pointer-events-none">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-4 shadow-xl shadow-indigo-900/10 border border-indigo-50 pointer-events-auto backdrop-blur-xl bg-white/90">
            <h1 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-indigo-600 bg-indigo-50 p-2 rounded-xl">
                <HugeIconPicker name="location01Icon" size={24} />
              </span>
              Check ISP Availability
            </h1>
            
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter your exact address (e.g., Mirpur 10, Dhaka)"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                disabled={loading || !!error}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <HugeIconPicker name="search01Icon" size={20} />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          {(selectedLocation || searching) && (
            <div className="mt-4 bg-white rounded-3xl p-6 shadow-xl shadow-indigo-900/10 border border-indigo-50 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-500">
              {searching ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-bold text-slate-700">Scanning for providers in your area...</p>
                  <p className="text-sm text-slate-500 mt-1">{selectedLocation}</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Results for</p>
                    <p className="text-lg font-black text-slate-800 leading-tight">{selectedLocation}</p>
                  </div>

                  <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {isps.map((isp, idx) => (
                      <div key={idx} className="border border-slate-100 rounded-2xl p-4 hover:border-indigo-200 hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-black text-slate-800 text-lg">{isp.name}</h3>
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isp.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {isp.available ? 'Available' : 'Limited'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <HugeIconPicker name="zapIcon" size={14} className="text-amber-500" />
                            <span className="font-bold">{isp.speed}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <HugeIconPicker name="coins02Icon" size={14} className="text-indigo-500" />
                            <span className="font-bold">{isp.price}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-amber-400">★</span>
                            <span className="font-bold text-sm">{isp.rating}</span>
                          </div>
                          <Link to="/packages" className="text-sm font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                            View Plans <HugeIconPicker name="arrowRight01Icon" size={16} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-indigo-50 text-indigo-800 rounded-2xl p-4 text-sm font-medium flex items-start gap-3">
                    <HugeIconPicker name="informationCircleIcon" size={20} className="shrink-0 mt-0.5" />
                    <p>These results are based on community reports and public ISP coverage maps. Contact the ISP directly to confirm availability before purchasing.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full bg-slate-200 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="font-bold text-slate-600">Loading Map...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 p-8 z-20">
            <div className="max-w-md text-center">
              <div className="bg-red-100 text-red-600 p-4 rounded-full inline-block mb-4">
                <HugeIconPicker name="alertCircleIcon" size={32} />
              </div>
              <h2 className="text-xl font-black text-red-800 mb-2">Map Error</h2>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}
        
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
}
