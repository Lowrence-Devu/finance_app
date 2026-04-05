import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 20px;
  margin: 20px;
  color: #c33;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  margin-top: 0;
  color: #966;
`;

const ErrorDetails = styled.pre`
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  text-align: left;
  overflow: auto;
  font-size: 12px;
`;

const ResetButton = styled.button`
  background-color: #c33;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #966;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ error: null, errorInfo: null });
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <p>{this.state.error.toString()}</p>
          {process.env.NODE_ENV === 'development' && (
            <ErrorDetails>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </ErrorDetails>
          )}
          <ResetButton onClick={this.resetError}>Try Again</ResetButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
