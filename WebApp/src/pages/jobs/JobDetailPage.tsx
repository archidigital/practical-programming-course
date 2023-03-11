import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { child, get, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../..";
import { JobType } from "./JobsPage";

const containerStyle = {
  width: "80%",
  height: "400px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const JobDetailPage = () => {
  let { jobID } = useParams();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "",
  });

  const [isPickupMarkerVisible, setIsPickupMarkerVisible] =
    useState<boolean>(true);
  const [isDestinationMarkerVisible, setIsDestinationMarkerVisible] =
    useState<boolean>(true);

  const [pickupLatLng, setPickupLatLng] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: -3.745,
    lng: -38.523,
  });

  const [destinationLatLng, setDestinationLatLng] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: -3.745,
    lng: -38.523,
  });

  const [currentDriverLocation, setCurrentDriverLocation] = useState<{
    lat: number;
    lng: number;
  }>();

  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const dbRef = ref(db, "jobList");
    // get job details
    get(child(dbRef, `${jobID}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const currentJob: JobType = snapshot.val();
          setTitle(currentJob.title);
          setPickupLatLng({
            lat: currentJob.pickupAddress.latitude,
            lng: currentJob.pickupAddress.longitude,
          });
          setDestinationLatLng({
            lat: currentJob.destinationAddress.latitude,
            lng: currentJob.destinationAddress.longitude,
          });

          // get driver current location
          const jobID = snapshot.key;
          const currentDriverLocationRef = ref(
            db,
            "currentJobLocations/" + jobID + "/currentLocation"
          );
          onValue(currentDriverLocationRef, (snapshot) => {
            const data = snapshot.val();
            setCurrentDriverLocation({
              lat: data.coords.latitude,
              lng: data.coords.longitude,
            });
          });
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    //console.log(jobID);
  }, []);

  return (
    <Box
      sx={{
        // padding: 10,
        backgroundColor: "white",
        height: "100vh",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create Job
        </Typography>
        <div>
          {/* <Button
                variant="contained"
                onClick={() => {
                  onSaveJob();
                }}
              >
                Save Job
              </Button> */}
          {/* <Button variant="contained" onClick={handleClose}>
                Close
              </Button> */}
        </div>
      </div>
      <FormControl fullWidth sx={{ m: 1 }}>
        <TextField
          id="outlined-basic"
          label="Job Title"
          variant="outlined"
          value={title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(event.target.value);
          }}
        />
      </FormControl>

      <FormControl sx={{ m: 1 }}>
        <div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Pickup
          </Typography>
          <TextField id="outlined-basic" label="lat" value={pickupLatLng.lat} />
          <TextField id="outlined-basic" label="lng" value={pickupLatLng.lng} />
          <Button
            variant="contained"
            onClick={() => {
              setIsPickupMarkerVisible(!isPickupMarkerVisible);
            }}
          >
            Choose
          </Button>
        </div>
        <div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Destination
          </Typography>
          <TextField
            id="outlined-basic"
            label="lat"
            value={destinationLatLng.lat}
          />
          <TextField
            id="outlined-basic"
            label="lng"
            value={destinationLatLng.lat}
          />
          <Button
            variant="contained"
            onClick={() => {
              setIsDestinationMarkerVisible(!isDestinationMarkerVisible);
            }}
          >
            Choose
          </Button>
        </div>
      </FormControl>
      <FormControl fullWidth sx={{ m: 1 }}>
        <TextField
          id="outlined-basic"
          label="Details"
          variant="outlined"
          multiline
          rows={5}
        />
      </FormControl>

      <div style={{ textAlign: "center" }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            <Marker
              position={{
                lat: pickupLatLng.lat,
                lng: pickupLatLng.lng,
              }}
              draggable={true}
              onDragEnd={(e) => {
                setPickupLatLng({
                  lat: e.latLng?.lat() ?? 0,
                  lng: e.latLng?.lng() ?? 0,
                });
              }}
              title="Pickup"
            />

            <Marker
              position={{
                lat: destinationLatLng.lat,
                lng: destinationLatLng.lng,
              }}
              draggable={true}
              onDragEnd={(e) => {
                setDestinationLatLng({
                  lat: e.latLng?.lat() ?? 0,
                  lng: e.latLng?.lng() ?? 0,
                });
              }}
              title="Destination"
            />
            {currentDriverLocation && (
              <Marker
                position={{
                  lat: currentDriverLocation.lat,
                  lng: currentDriverLocation.lng,
                }}
                title="Driver Location"
              />
            )}
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>
    </Box>
  );
};

export default JobDetailPage;
