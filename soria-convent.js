export const conventGeojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        message: "Convent Church",
        icon: "./icons/icon_info.png",
        iconSize: [40, 40],
        link: "./images/Stclara_1910.png", // Image link
        description:
          "The Santa Clara Convent in Soria was founded around 1286 and flourished for centuries, receiving royal privileges and noble protection.<br><br>Though the original monastery no longer stands, the surviving structure, built between 1520 and 1537, reflects its historical significance. <br><br>The convent played a vital role in Soria's religious and cultural life until 1833, when the nuns were forced to leave due to exclaustrations. Many of its sacred artifacts were moved to the Collegiate Church of San Pedro, and in 1881, the remains of the nuns were transferred to Santo Domingo, marking the end of Santa Clara's monastic legacy.",
        name: "The Founding of Santa Clara Convent",
        subtitle: "1286-1833",
        caption: "Arial view of the Santa Clara Convent in 1910",
      },
      geometry: { type: "Point", coordinates: [-2.465624, 41.761797] },
    },
    {
      type: "Feature",
      properties: {
        message: "Military base",
        icon: "./icons/icon_info.png",
        iconSize: [45, 45],
        link: "./images/santaclara1932.png", // Image link
        description:
          "The Santa Clara Convent was abandoned after the nuns' departure and gradually transformed into a military fortress. <br><br>Its church became a warehouse, and its buildings were repurposed for military use, including guard posts and dormitories. Strategically positioned on the plateau of Calaverón, it was fortified in 1834 and became part of the Ministry of War. <br><br>Known as the 'Fortress of Santa Clara' and later the 'Fortress of Loyalty', it played a key role in Soria's defense. In the early 20th century, local efforts aimed to establish a permanent military base there, highlighting its continued strategic importance.",
        name: "Fortress of Santa Clara",
        subtitle: "1833-1936",
        caption: "Arial view of the Santa Clara Convent in 1932",
      },
      geometry: { type: "Point", coordinates: [-2.466027, 41.761672] },
      media: ["./images/Kaiserwald plans.jpg"],
    },
    {
      type: "Feature",
      properties: {
        message: "Video",
        icon: "./icons/icon_play.png",
        iconSize: [40, 40],
        link: "./video/StClaraCampLabour.mp4", // Image link
        description:
          "A local archaeologist involved in the research of the Santa Clara site in Soria shares his insights into the historical significance of the convent and its role in the local context. <br><br>The archaeologist speaks in Spanish, with an English translation provided by a member of the Recuerdo y Dignidad Association.",
        name: "Santa Clara Convent",
        caption: "Video explaining about the Santa Clara Convent",
      },
      geometry: { type: "Point", coordinates: [-2.465787, 41.761594] },
    },
    {
      type: "Feature",
      properties: {
        message: "Video",
        icon: "./icons/icon_play.png",
        iconSize: [40, 40],
        link: "./video/Video_3.mp4", // Image link
        description:
          "A local archaeologist involved in the research of the Santa Clara site in Soria shares his insights into the historical significance of the Santa Clara Complex. <br><br>This video traces the story of the complex's evolution—from its construction to its changing roles over time. More than just a convent or a concentration camp, it also served as a strategic military post, reflecting the many layers of its history.<br><br>The archaeologist speaks in Spanish, with an English translation provided by a member of the Recuerdo y Dignidad Association.",
        name: "Development of the Santa Clara Complex",
        caption:
          "Video of the constructional development of the Santa Clara Complex",
      },
      geometry: { type: "Point", coordinates: [-2.466385, 41.761833] },
    },
    {
      type: "Feature",
      properties: {
        message: "Video",
        icon: "./icons/icon_play.png",
        iconSize: [40, 40],
        link: "./video/Video_4.mp4", // Image link
        description:
          "A local archaeologist involved in the research of the Santa Clara site in Soria shares his insights into the historical significance of the Santa Clara Complex. <br><br>This video offers a brief glimpse into the lives of the prisoners and how they were held within the complex until the 1950s. <br><br>The archaeologist speaks in Spanish, with an English translation provided by a member of the Recuerdo y Dignidad Association.",
        name: "Prisoners",
        caption: "Video about the prisoners of the Santa Clara Complex",
      },
      geometry: { type: "Point", coordinates: [-2.465196, 41.76169] },
    },
    {
      type: "Feature",
      properties: {
        message: "Video",
        icon: "./icons/icon_play.png",
        iconSize: [40, 40],
        link: "./video/Video_2.mp4", // Image link
        description:
          "A local archaeologist involved in the research of the Santa Clara site in Soria shares his insights into the historical significance of the Santa Clara Complex. <br><br>This video provides an overview of the original wall structures and some of the buildings within the complex. It explains how certain buildings were likely used to hold prisoners and describes how the area was divided between military and prisoner sections. It offers a brief look at how the space was organized and used. <br><br>The archaeologist speaks in Spanish, with an English translation provided by a member of the Recuerdo y Dignidad Association.",
        name: "Camp Structure and Use",
        caption: "Video overview of the Santa Clara Complex",
      },
      geometry: { type: "Point", coordinates: [-2.465976, 41.761244] },
    },
    {
      type: "Feature",
      properties: {
        message: "Video",
        icon: "./icons/icon_play.png",
        iconSize: [40, 40],
        link: "./video/Video_5.mp4", // Image link
        description:
          "A local archaeologist involved in the research of the Santa Clara site in Soria shares his insights into the historical significance of the Santa Clara Complex. <br><br>This video explores the remnants of the original structures uncovered during excavations, shedding light on the hidden layers of the complex's past. <br><br>The archaeologist speaks in Spanish, with an English translation provided by a member of the Recuerdo y Dignidad Association.",
        name: "Remains of the Santa Clara Complex",
        caption: "Video about remnants found in the Santa Clara Complex",
      },
      geometry: { type: "Point", coordinates: [-2.465307, 41.761204] },
    },
  ],
};
