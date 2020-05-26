import React from 'react';
import loadable from '@loadable/component';

const Home = loadable(() => import('./views/Home'));
const App = () => {
  return (
    <div>
      hello
      <Home />
    </div>
  );
};

export default App;
