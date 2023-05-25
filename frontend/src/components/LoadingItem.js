import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';

const LoadingItem = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulating a 2-second loading time. Replace it with your actual loading logic.

    return () => clearTimeout(timer); // Clean up the timer on component unmount.
  }, []);
    
  return isLoading ? <div className="loading-wrapper"><CircularProgress className="loading" /></div> : null;
};

export default LoadingItem;
