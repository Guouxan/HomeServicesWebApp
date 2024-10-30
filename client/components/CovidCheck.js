import { useState, useEffect } from 'react';
import { checkLocationRestrictions } from '../utils/covidZones';

export default function CovidCheck({ service, onRestrictionCheck }) {
  const [locationStatus, setLocationStatus] = useState('checking');
  const [restrictions, setRestrictions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkLocation();
  }, []);

  const checkLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocationStatus('checking');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const restrictionInfo = checkLocationRestrictions(latitude, longitude);
        setRestrictions(restrictionInfo);
        setLocationStatus('completed');
        onRestrictionCheck(restrictionInfo);
      },
      (error) => {
        setError('Unable to get your location. Using default restrictions.');
        setLocationStatus('error');
        onRestrictionCheck({
          inHotZone: false,
          riskLevel: 'unknown',
          restrictions: ['Default restrictions apply']
        });
      }
    );
  };

  if (locationStatus === 'checking') {
    return (
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <div className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Checking COVID-19 restrictions for your area...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md mb-4">
        <p className="text-yellow-800">{error}</p>
      </div>
    );
  }

  if (!restrictions) return null;

  const getBgColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-50';
      case 'medium':
        return 'bg-yellow-50';
      default:
        return 'bg-green-50';
    }
  };

  const getTextColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-800';
      case 'medium':
        return 'text-yellow-800';
      default:
        return 'text-green-800';
    }
  };

  return (
    <div className={`${getBgColor(restrictions.riskLevel)} p-4 rounded-md mb-4`}>
      <h3 className={`font-bold ${getTextColor(restrictions.riskLevel)} mb-2`}>
        COVID-19 Risk Level: {restrictions.riskLevel.toUpperCase()}
      </h3>
      <ul className="list-disc list-inside">
        {restrictions.restrictions.map((restriction, index) => (
          <li key={index} className={getTextColor(restrictions.riskLevel)}>
            {restriction}
          </li>
        ))}
      </ul>
    </div>
  );
} 