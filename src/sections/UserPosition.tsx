import { LatLngExpression, latLngBounds, LatLngBoundsExpression, point } from 'leaflet';
import React, { useEffect, useMemo, useState } from 'react';
import { useMap, SVGOverlay } from 'react-leaflet';
import styled from 'styled-components';
import CessnaSvg from 'src/components/CessnaSvg';
import interpolate from 'color-interpolate';

interface INavMapProps {
  currentPos?: LatLngExpression;
  heading: number;
  altitude: number;
}

const ImageContainer = styled.div`
  transform: rotate(50deg);
`;

function clamp01(num: number): number {
  return num < 0 ? 0 : num > 1 ? 1 : num;
}

export default function NavMap(props: INavMapProps) {
  const { currentPos, heading, altitude } = props;

  const map = useMap();

  const colorMap = useMemo(() => {
    return interpolate(['#FF9E00', '#FBFF00', '#19AD0A', '#0D3CDC', '#B00DDC']);
  }, []);

  const [currentZoom, setCurrentZoom] = useState(map.getZoom());

  function getPlaneBounds(): LatLngBoundsExpression | undefined {
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

  useEffect(() => {
    function setZoom() {
      setCurrentZoom(map.getZoom());
    }

    map.addEventListener('zoomend', setZoom);

    return () => {
      map.removeEventListener('zoomend', setZoom);
    };
  });

  const planeBounds = useMemo<LatLngBoundsExpression | undefined>(() => {
    return getPlaneBounds();
  }, [currentPos, currentZoom, heading]);

  return (
    <ImageContainer>
      {currentPos && planeBounds && (
        <SVGOverlay bounds={planeBounds}>
          <CessnaSvg rotation={heading} fillColor={colorMap(clamp01(altitude / 40000))} />
        </SVGOverlay>
      )}
    </ImageContainer>
  );
}
