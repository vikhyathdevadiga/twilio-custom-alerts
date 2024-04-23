import express from 'express'
const app = express()
const port = 3000
import { alertMiddleware } from './alertMiddleware.js'

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/alert', alertMiddleware, (req, res) => {
    res.send('Success!');
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})