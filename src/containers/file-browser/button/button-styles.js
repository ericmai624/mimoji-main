import styled from 'styled-components';

const transparent = 'transparent';
const lightgray = 'rgba(219, 219, 219, 0.5)';
const black = 'rgb(0, 0, 0)';
const orange = 'rgba(228, 75, 54, 1)';

export const Container = styled.div`
  width: ${({ w }) => w ? w : '36px'};
  height: ${({ h }) => h ? h : '36px'};
  font-size: ${({ s }) => s ? s : '24px'};
  color: ${({ c }) => c ? c.normal : black};
  background: ${({ bg }) => bg ? bg.normal : transparent};

  &:hover {
    color: ${({ c }) => c ? c.hover : orange};
    background: ${({ bg }) => bg ? bg.hover : lightgray};
  }
`;
