import React from 'react';
import styled from '@emotion/styled';

const SkeletonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;

  /* Radix UI-inspired shadow system */
  box-shadow:
    0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);

  .skeleton-image {
    width: 96px;
    height: 96px;
    margin: 12px auto;
    border-radius: 50%;
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
  }

  .skeleton-id {
    width: 30px;
    height: 14px;
    margin: 0 auto 4px;
    border-radius: 4px;
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
  }

  .skeleton-name {
    width: 80px;
    height: 20px;
    margin: 0 auto 10px;
    border-radius: 4px;
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
  }

  .skeleton-types {
    display: flex;
    justify-content: center;
    gap: 8px;

    .skeleton-type {
      width: 40px;
      height: 16px;
      border-radius: 4px;
      background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
      background-size: 200% 100%;
      animation: 1.5s shine linear infinite;
    }
  }

  @keyframes shine {
    to {
      background-position-x: -200%;
    }
  }
`;

const SkeletonCard: React.FC = () => {
  return (
    <SkeletonContainer>
      <div className="skeleton-image" />
      <div className="skeleton-id" />
      <div className="skeleton-name" />
      <div className="skeleton-types">
        <div className="skeleton-type" />
        <div className="skeleton-type" />
      </div>
    </SkeletonContainer>
  );
};

export default SkeletonCard;
