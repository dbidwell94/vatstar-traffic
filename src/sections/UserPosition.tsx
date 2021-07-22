import { LatLngExpression, latLngBounds, point, LeafletEvent, LatLng, LatLngBounds } from 'leaflet';
import React, { useEffect, useMemo, useState } from 'react';
import { useMap, SVGOverlay, CircleMarker, Popup, Marker, LayerGroup } from 'react-leaflet';
import styled from 'styled-components';
import CessnaSvg from 'src/components/CessnaSvg';
import interpolate from 'color-interpolate';
import { IPilot } from './app';

interface INavMapProps {
  currentPos?: LatLngExpression;
  pilot: IPilot;
  setSelectedPilot: React.Dispatch<React.SetStateAction<IPilot | null>>;
  selectedPilot: IPilot | null;
}

const PopupContainer = styled(Popup)`
  padding: 0;
  margin: 0;

  div {
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    grid-gap: 0.5rem;
    .key,
    .value {
      p {
        font-size: 1.375rem;
        margin: 0;
        padding: 0;
      }
    }
    .key {
      text-transform: uppercase;
      grid-column: 1 / 2;
    }
    .value {
      grid-column: 2 / 3;
    }
  }
`;

function clamp01(num: number): number {
  return num < 0 ? 0 : num > 1 ? 1 : num;
}

function checkClickPos(planeBounds: LatLngBounds, clickPos: LatLng): boolean {
  if (clickPos.lat <= planeBounds.getNorth() && clickPos.lat > planeBounds.getSouth()) {
    if (clickPos.lng <= planeBounds.getEast() && clickPos.lng > planeBounds.getWest()) return true;
  }
  return false;
}

export default function NavMap(props: INavMapProps) {
  const { currentPos, pilot, setSelectedPilot, selectedPilot } = props;

  const map = useMap();

  const colorMap = useMemo(() => {
    return interpolate(['#FF9E00', '#FBFF00', '#19AD0A', '#0D3CDC', '#B00DDC']);
  }, []);

  const [currentZoom, setCurrentZoom] = useState(map.getZoom());

  function getPlaneBounds(): LatLngBounds | undefined {
    if (!currentPos) {
      return undefined;
    }
    const currentPosPoint = map.project(currentPos);

    const scaledTopLeft = point(currentPosPoint.x - 9, currentPosPoint.y + 10.3875);
    const scaledBottomRight = point(point(currentPosPoint.x + 9, currentPosPoint.y - 10.3875));

    const topLeft = map.unproject(scaledTopLeft);
    const bottomRight = map.unproject(scaledBottomRight);

    const bounds = latLngBounds(topLeft, bottomRight);

    return bounds;
  }

  const planeBounds = useMemo<LatLngBounds | undefined>(() => {
    return getPlaneBounds();
  }, [currentPos, currentZoom, pilot.heading]);

  useEffect(() => {
    function setZoom() {
      setCurrentZoom(map.getZoom());
    }

    function clickListener(evt: CustomEvent<LeafletEvent>) {
      if (!planeBounds) return;
      const latLng = (evt.detail as any).latlng as LatLng;
      if (checkClickPos(planeBounds, latLng)) {
        setSelectedPilot(pilot);
        return;
      }
    }

    map.addEventListener('zoomend', setZoom);

    window.addEventListener('map_clicked', clickListener as EventListener);

    return () => {
      map.removeEventListener('zoomend', setZoom);
      window.removeEventListener('map_clicked', clickListener as EventListener);
    };
  });

  return (
    <section>
      {currentPos && planeBounds && (
        <>
          <SVGOverlay bounds={planeBounds}>
            <CessnaSvg
              rotation={pilot.heading}
              fillColor={colorMap(clamp01(pilot.altitude / 40000))}
              strokeColor='black'
            />
          </SVGOverlay>
          {selectedPilot?.cid === pilot.cid && <CircleMarker center={currentPos} radius={30} />}
          {selectedPilot?.cid === pilot.cid && (
            <Marker position={currentPos}>
              <PopupContainer>
                <div>
                  <div className='key'>
                    <p>Callsign: </p>
                  </div>
                  <div className='value'>
                    <p>{pilot.callsign}</p>
                  </div>
                  <div className='key'>
                    <p>Altitude: </p>
                  </div>
                  <div className='value'>
                    <p>{pilot.altitude}</p>
                  </div>
                  <div className='key'>
                    <p>Destination:</p>
                  </div>
                  <div className='value'>
                    <p>{pilot.flight_plan.arrival}</p>
                  </div>
                </div>
              </PopupContainer>
            </Marker>
          )}
        </>
      )}
    </section>
  );
}
