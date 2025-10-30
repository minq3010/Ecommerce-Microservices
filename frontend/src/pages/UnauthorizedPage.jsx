import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you do not have permission to access this page."
      extra={
        <>
          <Button type="primary" onClick={() => navigate('/admin/dashboard')}>
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate(-1)} style={{ marginLeft: '8px' }}>
            Go Back
          </Button>
        </>
      }
    />
  );
};

export default UnauthorizedPage;
