import React, { useMemo } from 'react';
import styled from 'styled-components';

interface IColorKeyProps {
  colors: string[];
  altitudeMin: number;
  altitudeMax: number;
  className?: string;
}

const ColorKeyContainer = styled.div`
  border-radius: 0.5rem;
  section {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    border-right: thin solid black;
    &:last-child {
      border: none;
    }
    p {
      margin: 0;
      padding: 0;
      width: auto;
      /* text-align: center; */
      color: black;
      float: right;
      font-size: 1.25rem;
    }
  }
`;

export default function ColorKey(props: IColorKeyProps) {
  const { className, colors, altitudeMax, altitudeMin } = props;

  const colorSections = useMemo<string[]>(() => {
    const altitudeKeys: string[] = [];

    const sectionAmount = altitudeMax / colors.length;

    for (let i = 1; i < colors.length + 1; i++) {
      altitudeKeys.push((altitudeMax - sectionAmount * (colors.length - i)).toString());
    }
    return altitudeKeys;
  }, [colors, altitudeMax, altitudeMin]);

  return (
    <ColorKeyContainer className={className}>
      {colorSections.map((altitude) => {
        return (
          <section key={`color-key-altitude-${altitude}`} className='altitude-section'>
            <p>{altitude}</p>
          </section>
        );
      })}
    </ColorKeyContainer>
  );
}
