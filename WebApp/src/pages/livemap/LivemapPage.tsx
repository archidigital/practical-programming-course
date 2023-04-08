import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../..";

const containerStyle = {
  width: "100%",
  height: "800px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

type UserLocation = {
  userId: string;
  latitude: number;
  longitude: number;
  lastSeen: number;
};

const LivemapPage = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "",
  });

  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);

  useEffect(() => {
    const locationsRef = ref(db, "/locations");
    onValue(locationsRef, (snapshot) => {
      const userLocationDB: UserLocation[] = [];
      snapshot.forEach((location) => {
        const newUserLocation: UserLocation = {
          userId: location.key ?? "",
          lastSeen: location.val().currentLocation.timestamp,
          latitude: location.val().currentLocation.coords.latitude,
          longitude: location.val().currentLocation.coords.longitude,
        };
        userLocationDB.push(newUserLocation);
      });
      setUserLocations(userLocationDB);
    });
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {isLoaded ? (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={3}>
          {userLocations.map((loc) => (
            <MarkerF
              position={{
                lat: loc.latitude,
                lng: loc.longitude,
              }}
              title={`${loc.userId}-Location`}
              clickable
            />
          ))}
        </GoogleMap>
      ) : (
        <></>
      )}
    </div>
  );
};

export default LivemapPage;
