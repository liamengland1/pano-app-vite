'use client'
import React, { useRef, useState } from 'react';
import Viewer from '../components/Viewer';

const App: React.FC = () => {
  const [url, setUrl] = useState('https://cdn.eso.org/images/large/ESO_Paranal_360_Marcio_Cabral_Chile_07-CC.jpg');
  const [minPolar, setMinPolar] = useState(80);
  const [currentPolar, setCurrentPolar] = useState<number>();
  const [maxPolar, setMaxPolar] = useState(150);
  const [minAzimuth, setMinAzimuth] = useState(-180);
  const [currentAzimuth, setCurrentAzimuth] = useState<number>();
  const [maxAzimuth, setMaxAzimuth] = useState(180);
  const hideAzimuthButtonRef = useRef<HTMLButtonElement>(null);
  const [hideWidth, setHideWidth] = useState(80);
  const hideAzimuthSliderRef = useRef<HTMLInputElement>(null);
  const undoButtonRef = useRef<HTMLButtonElement>(null);


  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Viewer
        url={url}
        minPolar={minPolar}
        maxPolar={maxPolar}
        minAzimuth={minAzimuth}
        maxAzimuth={maxAzimuth}
        currentPolar={currentPolar}
        currentAzimuth={currentAzimuth}
        onAngleChange={(az, pol) => {
          setCurrentAzimuth(Math.round(az));
          setCurrentPolar(Math.round(pol));
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "rgba(0, 0, 0, 0.6)",
          padding: "16px",
          borderRadius: "12px",
          color: "white",
          maxWidth: "300px"
        }}
      >
        

        <label>Image URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <div>
          <span style={{ marginLeft: "10px" }}>
            Current Polar: {currentPolar}°
          </span>
          <br />
          <label>Min Polar: {minPolar}°</label>
          <br />
          <input
            type="range"
            min={0}
            max={180}
            value={minPolar}
            onChange={(e) => setMinPolar(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Max Polar: {maxPolar}°</label>
          <br />
          <input
            type="range"
            min={0}
            max={180}
            value={maxPolar}
            onChange={(e) => setMaxPolar(Number(e.target.value))}
          />
        </div>
        <div>
          <br />
          <span style={{ marginLeft: "10px" }}>
            Current Azimuth: {currentAzimuth}°
          </span>
          <br />
          <label>Min Azimuth: {minAzimuth}°</label>
          <br />
          <input
            type="range"
            min={-180}
            max={180}
            value={minAzimuth}
            onChange={(e) => setMinAzimuth(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Max Azimuth: {maxAzimuth}°</label>
          <br />
          <input
            type="range"
            min={-180}
            max={180}
            value={maxAzimuth}
            onChange={(e) => setMaxAzimuth(Number(e.target.value))}
          />
        </div>

        {/* New Buttons */}
        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            style={{ marginTop: "12px", width: "100%" }}
            onClick={() => {
              if (currentAzimuth !== undefined) {
                //setPreviewAzimuth(currentAzimuth);
                let previewAzimuth = currentAzimuth;

                const hiddenMin = (previewAzimuth! - hideWidth + 360) % 360;
                const hiddenMax = (previewAzimuth! + hideWidth + 360) % 360;

                const normalize = (angle: number) =>
                  ((angle + 180) % 360) - 180; // convert to -180 to 180 range

                const newMin = normalize(hiddenMax);
                const newMax = normalize(hiddenMin);

                setMinAzimuth(newMin);
                setMaxAzimuth(newMax);
                hideAzimuthButtonRef.current!.style.display = "none";
                hideAzimuthSliderRef.current!.style.display = "none";
                undoButtonRef.current!.style.display = "block";
              }
            }}
            ref={hideAzimuthButtonRef}
          >
            Hide Area ({hideWidth}° on either side)
          </button>
          <div>
            <input
              type="range"
              min={50}
              max={150}
              value={hideWidth}
              onChange={(e) => setHideWidth(Number(e.target.value))}
              ref={hideAzimuthSliderRef}
            />
          </div>
          <div>
            <button
              style={{ marginTop: "12px", width: "100%", display: "none" }}
              ref={undoButtonRef}
              onClick={() => {
                setMinAzimuth(-180);
                setMaxAzimuth(180);
                hideAzimuthButtonRef.current!.style.display = "block";
                hideAzimuthSliderRef.current!.style.display = "block";
                undoButtonRef.current!.style.display = "none";
              }
              }
            > Undo </button>
          </div>
          <div>
            <button
              style={{ marginTop: "12px", width: "100%" }}
              onClick={() => {
                let paramsObj = {
                  minPolar: minPolar,
                  maxPolar: maxPolar,
                  minAzimuth: minAzimuth,
                  maxAzimuth: maxAzimuth,
                  startingAzimuth: currentAzimuth,
                  startingPolar: currentPolar,
                  url: url
                }
                let b64value = btoa(JSON.stringify(paramsObj));
                let embedURL = window.location.href + "#embed?data=" + b64value;
                navigator.clipboard.writeText(embedURL);
              }
              }
            > Copy URL </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default App;