export const conventGeojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          message: "Convent Church",
          iconSize: [30, 30],
          link: "./images/Stclara_1910.png",  // Image link
          description: "This church formed the heart of the Santa Clara convent built in 1286...",
          name: "Santa Clara Convent"
        },
        geometry: { type: "Point", coordinates: [-2.465624, 41.761797] },
      },
      {
        type: "Feature",
        properties: {
          message: "Video",
          iconSize: [30, 30],
          link: "./video/StClaraCampLabour.mp4",  // Image link
          description: "This church formed the heart of the Santa Clara convent built in 1286...",
          name: "Santa Clara Convent"
        },
        geometry: { type: "Point", coordinates: [-2.465787, 41.761594] },
      },
    ],
  };
  