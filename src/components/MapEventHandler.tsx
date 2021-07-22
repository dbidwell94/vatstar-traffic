import { LeafletEvent } from 'leaflet';
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapEventHandler() {
  const map = useMap();

  useEffect(() => {
    function dispatchCustomEvent(e: LeafletEvent) {
      const clickEvent = new CustomEvent('map_clicked', { detail: e, cancelable: true, bubbles: false });
      window.dispatchEvent(clickEvent);
    }

    map.addEventListener('click', dispatchCustomEvent);

    return () => {
      map.removeEventListener('click', dispatchCustomEvent);
    };
  }, []);

  return <></>;
}
