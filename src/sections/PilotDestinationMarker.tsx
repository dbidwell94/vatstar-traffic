import axios, { Canceler } from 'axios';
import { LatLng } from 'leaflet';
import React, { useEffect, useMemo, useState } from 'react';
import { useMap, Polyline, CircleMarker } from 'react-leaflet';
import { SERVER_URL } from 'src';
import { IPilot } from './app';

interface IAiportData {
  carriers: string;
  city: string;
  code: string;
  country: string;
  /** number as string */
  direct_flights: string;
  /** number as string */
  elev: string;
  icao: string;
  /** number as string */
  lat: string;
  /** number as string */
  lon: string;
  name: string;
  phone: string;
  runway_length: string;
  state: string;
  type: string;
  tz: string;
  url: string;
  woeid: string;
}

interface IPilotDestinationMarkerProps {
  pilot: IPilot;
}

export default function PilotDestinationMarker(props: IPilotDestinationMarkerProps) {
  const { pilot } = props;

  const [arrivalAirport, setArrivalAirport] = useState<LatLng | null>(null);
  const [departureAirport, setDepartureAirport] = useState<LatLng | null>(null);

  const map = useMap();

  useEffect(() => {
    const CancelToken = axios.CancelToken;

    let cancelDepartureRequest: Canceler | null = null;
    let cancelArrivalRequest: Canceler | null = null;

    (async () => {
      try {
        if (!pilot.flight_plan || !pilot.flight_plan.departure || !pilot.flight_plan.arrival) return;

        const departureAirportData = await axios.get<IAiportData>(
          `${SERVER_URL}/airport/${pilot.flight_plan.departure.toLowerCase()}`,
          {
            cancelToken: new CancelToken((e) => {
              cancelDepartureRequest = e;
            }),
          }
        );
        const arrivalAirportData = await axios.get<IAiportData>(
          `${SERVER_URL}/airport/${pilot.flight_plan.arrival.toLowerCase()}`,
          {
            cancelToken: new CancelToken((e) => {
              cancelArrivalRequest = e;
            }),
          }
        );

        setArrivalAirport(new LatLng(Number(arrivalAirportData.data.lat), Number(arrivalAirportData.data.lon)));
        setDepartureAirport(new LatLng(Number(departureAirportData.data.lat), Number(departureAirportData.data.lon)));
      } catch (ex) {
        setArrivalAirport(null);
        setDepartureAirport(null);
      }
    })();

    return () => {
      if (cancelArrivalRequest) {
        cancelArrivalRequest();
      }
      if (cancelDepartureRequest) {
        cancelDepartureRequest();
      }
    };
  }, [pilot]);

  return (
    <>
      {arrivalAirport && departureAirport && (
        <>
          <Polyline positions={[departureAirport, arrivalAirport]} />
          <CircleMarker center={departureAirport} radius={20} fillColor='green' color='green' opacity={0.5} />
          <CircleMarker center={arrivalAirport} radius={20} fillColor='red' color='red' opacity={0.5} />
        </>
      )}
    </>
  );
}
