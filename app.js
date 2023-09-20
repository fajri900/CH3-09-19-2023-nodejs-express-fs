const fs = require(`fs`);
const express = require(`express`);
const app = express();

// middleware
app.use(express.json());

const port = process.env.port || 3000;

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// menampilkan semua data json
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: `success`,
    data: {
      tours,
    },
  });
});

// membuat create data
app.post("/api/v1/tours", (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newdata = Object.assign({ id: newId }, req.body);

  tours.push(newdata);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      message: "200",
      data: {
        tour: newdata,
      },
    });
  });
});

// mencari data sesuai id nya
app.get("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} this not found`,
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// mengubah data
app.patch(`/api/v1/tours/:id`, (req, res) => {
  const id = req.params.id * 1;
  const tourIndex = tours.findIndex((el) => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: `failed`,
      message: `data with ${id} this not found`,
    });
  }
  tours[tourIndex] = { ...tours[tourIndex], ...req.body };

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(200).json({
      status: `success`,
      message: `tour with this id ${id}edited`,
      data: {
        tour: tours[tourIndex],
      },
    });
  });
});

// menghapus data
app.delete(`/api/v1/tours/:id`, (req, res) => {
  const id = req.params.id * 1;

  const tourIndex = tours.findIndex((el) => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: `failed`,
      message: `data not found`,
    });
  }

  tours.splice(tourIndex, 1);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(200).json({
      status: `success`,
      message: "Berhasil Delete Data",
      data: null,
    });
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
