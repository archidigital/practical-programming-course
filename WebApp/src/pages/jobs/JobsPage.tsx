import {
  Box,
  Button,
  FormControl,
  Modal,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import {
  equalTo,
  onValue,
  orderByChild,
  push,
  query,
  ref,
} from "firebase/database";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../..";

type LocationType = {
  latitude: number;
  longitude: number;
};

enum StatusTypeEnum {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
}

export type JobType = {
  id?: string;
  pickupAddress: LocationType;
  destinationAddress: LocationType;
  status: StatusTypeEnum;
  title: string;
  startTime?: number;
  completedTime?: number;
};

const containerStyle = {
  width: "80%",
  height: "400px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const JobsPage = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "",
  });

  const [alignment, setAlignment] = useState("Pending");
  const [open, setOpen] = useState(false);
  const [DATA, setDATA] = useState<JobType[]>([]);
  const [isPickupMarkerVisible, setIsPickupMarkerVisible] =
    useState<boolean>(false);
  const [isDestinationMarkerVisible, setIsDestinationMarkerVisible] =
    useState<boolean>(false);

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

  const [title, setTitle] = useState<string>("");

  const [testFromBackend, setTestFromBackend] = useState<
    {
      name: string;
    }[]
  >([]);

  useEffect(() => {
    fetch("http://localhost:8000/hello?name=robert")
      .then((response) => response.json())
      .then((data) => {
        setTestFromBackend(data.response);
      });
    // communicate with backend
    // http://localhost:8000/
    // setTestFromBackend
  }, []);

  useEffect(() => {
    let status: StatusTypeEnum = StatusTypeEnum.PENDING;
    if (alignment === "Pending") {
      status = StatusTypeEnum.PENDING;
    }
    if (alignment === "InProgress") {
      status = StatusTypeEnum.IN_PROGRESS;
    }
    if (alignment === "Completed") {
      status = StatusTypeEnum.COMPLETED;
    }

    const starCountRef = query(
      ref(db, "/jobList"),
      orderByChild("status"),
      equalTo(status)
    );
    onValue(starCountRef, (snapshot) => {
      const jobList: JobType[] = [];
      snapshot.forEach((jobDB) => {
        const job: JobType = {
          ...jobDB.val(),
          id: jobDB.key,
        };
        jobList.push(job);
      });
      setDATA(jobList);
    });
  }, [alignment]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const onSaveJob = () => {
    const newJob: JobType = {
      title: title,
      pickupAddress: {
        latitude: pickupLatLng.lat,
        longitude: pickupLatLng.lng,
      },
      destinationAddress: {
        latitude: destinationLatLng.lat,
        longitude: destinationLatLng.lng,
      },
      status: StatusTypeEnum.PENDING,
    };
    // save to firebase
    push(ref(db, "jobList"), newJob);
    handleClose();
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Jobs {testFromBackend.map((m) => m.name).join(",")}</h1>
        <Button variant="contained" onClick={handleOpen}>
          Create Job
        </Button>
      </div>

      <div style={{ textAlign: "left" }}>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="Pending">Pending</ToggleButton>
          <ToggleButton value="InProgress">In Progress</ToggleButton>
          <ToggleButton value="Completed">Completed</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div style={{ textAlign: "left" }}>
        {DATA.map((job, index) => (
          <div>
            {index + 1}: <Link to={`${job.id}`}>{job.title}</Link>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
              <Button
                variant="contained"
                onClick={() => {
                  onSaveJob();
                }}
              >
                Save Job
              </Button>
              <Button variant="contained" onClick={handleClose}>
                Close
              </Button>
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
              <TextField
                id="outlined-basic"
                label="lat"
                value={pickupLatLng.lat}
              />
              <TextField
                id="outlined-basic"
                label="lng"
                value={pickupLatLng.lng}
              />
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
                {isPickupMarkerVisible && pickupLatLng ? (
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
                ) : null}

                {isDestinationMarkerVisible && destinationLatLng ? (
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
                ) : null}
              </GoogleMap>
            ) : (
              <></>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default JobsPage;
