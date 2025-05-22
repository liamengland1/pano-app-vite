'use client'
import React, { useEffect, useState } from 'react';
import Viewer from './Viewer';
import { useSearchParams } from "react-router";

const EmbedClient: React.FC = () => {
  const [url, setUrl] = useState('https://cdn.eso.org/images/large/ESO_Paranal_360_Marcio_Cabral_Chile_07-CC.jpg');
  const [minPolar, setMinPolar] = useState(80);
  const [startingPolar, setCurrentPolar] = useState<number>();
  const [maxPolar, setMaxPolar] = useState(150);
  const [minAzimuth, setMinAzimuth] = useState(-180);
  const [startingAzimuth, setCurrentAzimuth] = useState<number>();
  const [maxAzimuth, setMaxAzimuth] = useState(180);
  const [hasData, setHasData] = useState(false);


  const [searchParams] = useSearchParams();

  useEffect(() => {
    const dataParam = searchParams.get("data");

    if (dataParam) {
      try {
        const data = JSON.parse(atob(dataParam));

        if (data.url) {
          setUrl(data.url);
        }
        if (data.minPolar) {
          setMinPolar(data.minPolar);
        }
        if (data.maxPolar) {
          setMaxPolar(data.maxPolar);
        }
        if (data.minAzimuth) {
          setMinAzimuth(data.minAzimuth);
        }
        if (data.maxAzimuth) {
          setMaxAzimuth(data.maxAzimuth);
        }
        if (data.startingPolar) {
          setCurrentPolar(data.startingPolar);
        }
        if (data.startingAzimuth) {
          setCurrentAzimuth(data.startingAzimuth);
        }

        setHasData(true);
      } catch (error) {
        console.error("Failed to parse data from URL:", error);
      }
    }
  }, [searchParams]);



  return ((!hasData) ? <div>Loading...</div> : <>
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Viewer
        url={url}
        minPolar={minPolar}
        maxPolar={maxPolar}
        minAzimuth={minAzimuth}
        maxAzimuth={maxAzimuth}
        currentPolar={startingPolar}
        currentAzimuth={startingAzimuth}
      />

    </div>


  </>

  );
};

export default EmbedClient;