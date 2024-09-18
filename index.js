const express = require("express");
const { connect } = require("mongoose");

const youtubesearchapi = require("youtube-search-api");
const { z } = require("zod");
const { Stream } = require("./models/Stream.js");
const cors = require("cors");

const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*", // Temporarily allow all origins for testing
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["*"],
};
app.use(cors(corsOptions));

app.options("/api/stream", cors(corsOptions));

const YT_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/;

const CreateSchemeSchema = z.object({
  url: z.string(),
});

// async function getVideoDetail(videoId, retries = 30) {
//   try {
//     const { videoDetails } = await youtubesearchapi.GetVideoDetails(videoId);
//     return videoDetails;
//   } catch (error) {
//     if (retries > 0) {
//       console.warn(`Retrying to fetch video details... (${3 - retries + 1})`);
//       return getVideoDetail(videoId, retries - 1);
//     } else {
//       console.error("Error fetching video details after retries:", error);
//     }
//   }
// }

app.post("/api/stream", async (req, res) => {
  await connect(
    "mongodb+srv://projectyjka:53yjka21@asciicluster0.pgohfwc.mongodb.net/muzify"
  ); // Replace with your actual connection string

  try {
    // const data = CreateSchemeSchema.parse(req.body);
    // const isYt = data.url.match(YT_REGEX);

    // if (!isYt) {
    //   return res.status(400).json({ message: "Invalid YouTube URL!" });
    // }

    // // Extract video ID more robustly
    // const extractedId =
    //   isYt[1] ||
    //   data.url.split("v=")[1]?.split("&")[0] ||
    //   data.url.split("youtu.be/")[1]?.split("?")[0];
    // console.log("extracted id : ", extractedId);
    // const videoDetails = await youtubesearchapi.GetVideoDetails(extractedId);
    const { song, url } = req.body;
    if (!song) {
      return res.status(500).json({ message: "song not found" });
    }

    const thumbnails = await song.thumbnail.thumbnails;
    thumbnails.sort((a, b) => (a.width < b.width ? -1 : 1));

    const newStream = await Stream.create({
      type: "Youtube",
      url,
      extractedId: song.id,
      title: song.title || "No Title",
      smallImg:
        thumbnails.length > 1
          ? thumbnails[thumbnails.length - 2]?.url
          : thumbnails[0]?.url || "defaultSmallImgUrl",
      bigImg: thumbnails[thumbnails.length - 1]?.url || "defaultBigImgUrl",
    });

    return res
      .status(200)
      .json({ message: "Stream added successfully!", newStream });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Error while adding a stream new!: ${error}` });
  }
});

app.get("/api/stream", async (req, res) => {
  await connect(
    "mongodb+srv://projectyjka:53yjka21@asciicluster0.pgohfwc.mongodb.net/muzify"
  ); // Replace with your actual connection string

  try {
    const streams = await Stream.find();
    return res.status(200).json({ streams });
  } catch (error) {
    console.error("Error fetching streams:", error);
    return res.status(500).json({ message: `Error: ${error}` });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
