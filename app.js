const fs = require(`fs`)
const express = require(`express`)
const morgan = require(`morgan`)
const app = express()

// middleware
app.use(express.json())
app.use(morgan("dev"))

// our own middleware
// app.use((req, res, next) => {
//   console.log("hallo fsw 2")
//   next()
// })

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString()
//   console.log(req.requestTime)
//   next()
// })

const port = process.env.port || 3000

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
)

const getAllTors = (req, res) => {
  res.status(200).json({
    status: `success`,
    requestTime: req.requestTime,
    data: {
      tours,
    },
  })
}

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1
  const newdata = Object.assign(
    { id: newId },
    req.body
  )

  tours.push(newdata)
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        message: "200",
        data: {
          tour: newdata,
        },
      })
    }
  )
}

const getToursById = (req, res) => {
  const id = req.params.id * 1
  const tour = tours.find((el) => el.id === id)

  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} this not found`,
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  })
}

const editTour = (req, res) => {
  const id = req.params.id * 1
  const tourIndex = tours.findIndex(
    (el) => el.id === id
  )

  if (tourIndex === -1) {
    return res.status(404).json({
      status: `failed`,
      message: `data with ${id} this not found`,
    })
  }
  tours[tourIndex] = {
    ...tours[tourIndex],
    ...req.body,
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: `success`,
        message: `tour with this id ${id}edited`,
        data: {
          tour: tours[tourIndex],
        },
      })
    }
  )
}

const deleteTour = (req, res) => {
  const id = req.params.id * 1

  const tourIndex = tours.findIndex(
    (el) => el.id === id
  )

  if (tourIndex === -1) {
    return res.status(404).json({
      status: `failed`,
      message: `data not found`,
    })
  }

  tours.splice(tourIndex, 1)

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: `success`,
        message: "Berhasil Delete Data",
        data: null,
      })
    }
  )
}

// ==============================================

const users = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/users.json`
  )
)

const getAllUser = (req, res) => {
  res.status(200).json({
    status: `success`,
    requestTime: req.requestTime,
    data: {
      users,
    },
  })
}

const createUser = (req, res) => {
  const newId = users[users.length - 1]._id + 1
  const newdata = Object.assign(
    { id: newId },
    req.body
  )

  users.push(newdata)
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        message: "200",
        data: {
          user: newdata,
        },
      })
    }
  )
}

const getUsersById = (req, res) => {
  const id = req.params.id
  const user = users.find((el) => el._id === id)

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} this not found`,
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
}

const editUser = (req, res) => {
  const id = req.params.id
  const userIndex = users.findIndex(
    (el) => el._id === id
  )

  if (userIndex === -1) {
    return res.status(404).json({
      status: `failed`,
      message: `data with ${id} this not found`,
    })
  }
  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: `success`,
        message: `tour with this id ${id}edited`,
        data: {
          user: users[userIndex],
        },
      })
    }
  )
}

const deleteUser = (req, res) => {
  const id = req.params.id

  const userIndex = users.findIndex(
    (el) => el._id === id
  )

  if (userIndex === -1) {
    return res.status(404).json({
      status: `failed`,
      message: `data not found`,
    })
  }

  users.splice(userIndex, 1)

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(200).json({
        status: `success`,
        message: "Berhasil Delete Data",
        data: null,
      })
    }
  )
}

// menampilkan semua data json
// app.get("/api/v1/tours", getAllTors)
// // mencari data sesuai id nya
// app.get("/api/v1/tours/:id", getToursById)
// // membuat create data
// app.post("/api/v1/tours", createTour)
// // mengubah data
// app.patch(`/api/v1/tours/:id`, editTour)
// // menghapus data
// app.delete(`/api/v1/tours/:id`, deleteTour)

// ===========================================================

const tourRouter = express.Router()
const userRouter = express.Router()

// ROUTES UNTUK TOUERS
tourRouter
  .route("/")
  .get(getAllTors)
  .post(createTour)

tourRouter
  .route("/:id")
  .get(getToursById)
  .patch(editTour)
  .delete(deleteTour)

// ROUTES UNTUK USERS
userRouter
  .route("/")
  .get(getAllUser)
  .post(createUser)

userRouter
  .route("/:id")
  .get(getUsersById)
  .patch(editUser)
  .delete(deleteUser)

app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
