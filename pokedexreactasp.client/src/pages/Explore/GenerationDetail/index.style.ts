import styled from '@emotion/styled';

export const PageContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 60px;
  padding-bottom: 80px;
`;

export const BackButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const SectionTitle = styled.h2`
  margin: 20px 0;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;