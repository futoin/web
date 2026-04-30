import { useLayoutEffect } from 'react'
import { navigate } from 'gatsby';

const Landing = () => {
  useLayoutEffect(() => {
    navigate('/docs/');
  }, []);
};

export default Landing

