export const loadGoogleMaps = (apiKey: string): Promise<typeof google> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google);
      return;
    }

    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) {
      // Script is already loading, wait for it
      let checkCount = 0;
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          resolve(window.google);
        }
        if (checkCount++ > 100) {
          clearInterval(interval);
          reject(new Error('Google Maps script load timeout'));
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google);
      } else {
        reject(new Error('Google Maps loaded but object not found'));
      }
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};
