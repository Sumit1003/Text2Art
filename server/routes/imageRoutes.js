import express from 'express'
import { generateImage, getUserGenerations, getGeneration, serveImage, testClipDrop } from '../controllers/imageControllers.js'
import userAuth from '../middlewares/auth.js'

const imageRouter = express.Router()

imageRouter.post('/generate-image', userAuth, generateImage)
imageRouter.get('/user-generations', userAuth, getUserGenerations)
imageRouter.get('/generation/:id', userAuth, getGeneration)
imageRouter.get('/images/:filename', serveImage) // Add this route to serve images

export default imageRouter;