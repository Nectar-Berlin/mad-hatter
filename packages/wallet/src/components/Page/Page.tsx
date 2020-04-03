import React, { useEffect } from 'react';
import styled from 'styled-components';
import { PageProps } from '@burner-wallet/types';
import PageTitleBar from './PageTitleBar';
import ErrorBoundary from './ErrorBoundary';

const PageContainer = styled.main<{ backgroundImage?: string, fullscreen?: boolean }>`
  margin: 0 var(--page-margin) var(--page-margin);
  padding: var(--page-margin);
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  color: rgba(255, 255, 255, 0.9);
  background: linear-gradient(
    rgba(0, 0, 0, 0.4), 
    rgba(0, 0, 0, 0.9)
  ), no-repeat center/100% url(${({ backgroundImage }) => backgroundImage});

  ${({ fullscreen }) => fullscreen ? `
    position: absolute;
    top: 60px;
    left: 10px;
    right: 10px;
    bottom: 10px;
  ` : ''}
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Page: React.FC<PageProps & { backgroundImage?: string, className?: string }> = ({ children, title, backgroundImage, variant, className }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return (
    <PageContainer backgroundImage={backgroundImage} className={className} fullscreen={variant === 'fullscreen'}>
      <Content>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </Content>
    </PageContainer>
  );
};

export default Page;
