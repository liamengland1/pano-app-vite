'use client';

import { Suspense } from 'react';
import EmbedClient from '../components/EmbedClient';

const Embed = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmbedClient />
    </Suspense>
  );
};

export default Embed;