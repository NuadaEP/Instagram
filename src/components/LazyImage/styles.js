import styled from 'styled-components/native';

export const Small = styled.Image`
  width: 100%;
  aspect-ratio: ${({ratio}) => ratio};
`;
