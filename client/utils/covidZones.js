// Fake COVID-19 hot zones (using latitude and longitude for Adelaide suburbs)
export const hotZones = [
  {
    center: { lat: -34.8583, lng: 138.6318 }, // Lightsview
    radius: 2, // kilometers
    riskLevel: 'high',
    restrictions: ['No indoor services', 'Outdoor services with masks only', 'Essential services only']
  },
  {
    center: { lat: -34.8567, lng: 138.6476 }, // Oakden
    radius: 2.5,
    riskLevel: 'medium',
    restrictions: ['Indoor services with masks and vaccination proof', 'Limited number of service providers']
  },
  {
    center: { lat: -34.9196, lng: 138.6841 }, // Magill
    radius: 3,
    riskLevel: 'medium',
    restrictions: ['Indoor services with masks', 'Social distancing required', 'Regular sanitization']
  },
  {
    center: { lat: -34.9500, lng: 138.6000 }, // Unley
    radius: 2,
    riskLevel: 'high',
    restrictions: ['Emergency services only', 'Strict mask mandate', 'No indoor services']
  }
];

// Function to calculate distance between two points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Function to check if a location is in a hot zone
export function checkLocationRestrictions(lat, lng) {
  for (const zone of hotZones) {
    const distance = getDistanceFromLatLonInKm(
      lat, 
      lng, 
      zone.center.lat, 
      zone.center.lng
    );
    
    if (distance <= zone.radius) {
      return {
        inHotZone: true,
        riskLevel: zone.riskLevel,
        restrictions: zone.restrictions
      };
    }
  }
  
  return {
    inHotZone: false,
    riskLevel: 'low',
    restrictions: ['Normal services available', 'Basic precautions apply']
  };
} 