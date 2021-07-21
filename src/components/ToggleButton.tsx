import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ToggleButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;

  filter: opacity(0.125);
  transition: 0.25s ease-in-out all;

  &:hover {
    filter: opacity(1);
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    p {
      font-family: ${({ theme }) => theme.fonts.ubuntu};
    }
    input {
      position: relative;
      all: unset;
      width: 5rem;
      height: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0rem 0rem 1rem 0rem inset ${({ theme }) => theme.colors.black};
      cursor: pointer;

      &::after {
        position: absolute;
        content: ' ';
        top: 50%;
        left: 50%;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 1rem;
        background: ${({ theme }) => theme.colors.black};
        transition: 0.125s ease-in-out all;
      }

      &.inactive {
        background: whitesmoke;
        &::after {
          transform: translate(-100%, 0%);
        }
      }

      &.active {
        background: darkgreen;
        &::after {
          transform: translate(0%, 0%);
        }
      }
    }
  }
`;

interface IToggleButtonProps {
  onChange?: (enabled: boolean) => void;
  className?: string;
  labelText?: string;
}

export default function ToggleButton(props: IToggleButtonProps) {
  const { className, onChange, labelText } = props;

  const [enabled, setEnabled] = useState(false);

  function invertToggle(evt: React.MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    setEnabled(!enabled);
  }

  useEffect(() => {
    if (onChange) {
      onChange(enabled);
    }
  }, [enabled]);

  return (
    <ToggleButtonContainer className={className}>
      <label>
        {labelText && <p>{labelText}</p>}
        <input type='checkbox' onClick={invertToggle} className={`${enabled ? 'active' : 'inactive'}`} />
      </label>
    </ToggleButtonContainer>
  );
}
