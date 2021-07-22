import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { MapContainer as LeafletContainer, TileLayer } from 'react-leaflet';
import UserPosition from './UserPosition';
import ToggleButton from 'src/components/ToggleButton';
import MapEventHandler from 'src/components/MapEventHandler';
import PilotDestinationMarker from './PilotDestinationMarker';
import { SERVER_URL } from 'src';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const MapContainer = styled(LeafletContainer)`
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
  background: none;
  div.toggle-button {
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translate(-50%, 10%);
    z-index: 999999 !important;
  }
`;

export interface IFlightPlan {
  aircraft: string;
  aircraft_faa: string;
  aircraft_short: string;
  alternate: string;
  altitude: string;
  arrival: string;
  cruise_tas: string;
  departure: string;
  deptime: string;
  enroute_time: string;
  flight_rules: string;
  fuel_time: string;
  remarks: string;
  revision_id: number;
  route: string;
}

export interface IPilot {
  altitude: number;
  callsign: string;
  cid: number;
  groundspeed: number;
  heading: number;
  /** Date as string */
  last_updated: string;
  latitude: number;
  /** Date as string */
  logon_time: string;
  longitude: number;
  name: string;
  pilot_rating: number;
  qnh_i_hg: number;
  qnh_mb: number;
  server: string;
  transponder: string;
  flight_plan: IFlightPlan;
}

export default function App() {
  const [pilots, setPilots] = useState<IPilot[]>([]);

  const [showAllPilots, setShowAllPilots] = useState(true);

  const [selectedPilot, setSelectedPilot] = useState<IPilot | null>(null);

  useEffect(() => {
    const pilotEventStream = new EventSource(`${SERVER_URL}/pilots${showAllPilots ? '' : '?vatstar=true'}`);

    function messageEventReceived(evt: MessageEvent<any>) {
      const parsedPilots = JSON.parse(evt.data) as IPilot[];

      setPilots(parsedPilots);
    }

    pilotEventStream.addEventListener('message', messageEventReceived);

    return () => {
      pilotEventStream.removeEventListener('message', messageEventReceived);
      pilotEventStream.close();
    };
  }, [showAllPilots]);

  return (
    <AppContainer>
      <div id='map__container'>
        <link rel='stylesheet' href='https://unpkg.com/leaflet@1.7.1/dist/leaflet.css' />
        <script src='https://unpkg.com/leaflet@1.7.1/dist/leaflet.js' />
        <MapContainer zoom={2} center={{ lat: 0, lng: 0 }}>
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> VATSTAR'
          />
          <ToggleButton
            className='toggle-button'
            labelText='Show all VATSIM pilots'
            onChange={(show) => setShowAllPilots(show)}
          />

          <MapEventHandler />

          {pilots &&
            pilots.map((pilot) => {
              return (
                <UserPosition
                  key={pilot.cid}
                  currentPos={{ lat: pilot.latitude, lng: pilot.longitude }}
                  pilot={pilot}
                  setSelectedPilot={setSelectedPilot}
                  selectedPilot={selectedPilot}
                />
              );
            })}
          {selectedPilot && <PilotDestinationMarker pilot={selectedPilot} />}
        </MapContainer>
      </div>
    </AppContainer>
  );
}
