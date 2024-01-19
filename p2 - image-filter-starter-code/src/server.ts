import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // validate the image url
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url }: { image_url: string } = req.query;

    if (!image_url) {
      res.status(400).send({ message: "image_url is required or malformed" });
      return;
    }

    if (
      !image_url.toLocaleLowerCase().endsWith(".jpeg") &&
      !image_url.toLocaleLowerCase().endsWith(".jpg") &&
      !image_url.toLocaleLowerCase().endsWith(".png") &&
      !image_url.toLocaleLowerCase().endsWith(".bmp") &&
      !image_url.toLocaleLowerCase().endsWith(".tiff")
    ) {
      res.status(400).send({ message: "wrong media type support." });
      return;
    }

    const promiseImage = filterImageFromURL(image_url);

    promiseImage
      .then((image) => {
        res.status(200).sendFile(image, () => {
          //const imagesToBeDeleted: Array<string> = new Array(image);
          deleteLocalFiles([image]);
        });
      })
      .catch((err) => {
        //res.status(400).send({ message: err });
        throw err;
      });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
