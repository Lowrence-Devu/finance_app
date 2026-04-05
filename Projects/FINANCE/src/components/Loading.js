import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const Spinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
`;

const LoadingText = styled.p`
  margin-top: 15px;
  color: #666;
  font-size: 14px;
`;

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

const Loading = ({ text = 'Loading...' }) => {
  return (
    <LoadingContainer>
      <div>
        <Spinner variants={spinnerVariants} animate="animate" />
        {text && <LoadingText>{text}</LoadingText>}
      </div>
    </LoadingContainer>
  );
};

export default Loading;
