import styled from "@emotion/styled";

export const Page = styled.section`
  max-width: 1120px;
  margin: 0 auto;
  padding: 12px 16px 130px;
`;

export const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin: 16px 0;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Select = styled.select`
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px;
  background: #fff;
`;

export const Input = styled.input`
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px;
`;

export const Grid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`;

export const Card = styled.div`
  border: 2px solid #cbd5e1;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;

  img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
  }
`;

export const CardBody = styled.div`
  padding: 10px;
  display: grid;
  gap: 6px;
`;

export const Pager = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
`;
