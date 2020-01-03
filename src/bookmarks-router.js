const uuid = require('uuid/v4')
const express = require('express')
const logger = require('./logger')
const bookmarks = require('./store')

const router = express.Router()
const bodyParser = express.json()

router
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const {title, url, description, rating} = req.body
        if(!title) {
            logger.error('Title is required')
            return res.status(400).send('Invalid data')
        }
        if(!url) {
            logger.error('Url is required')
            return res.status(400).send('Invalid data')
        }
        if(!description) {
            logger.error('Description is required')
            return res.status(400).send('Invalid data')
        }
        if(!rating) {
            logger.error('Rating is required')
            return res.status(400).send('Invalid data')
        }

        const id = uuid()
        const bookmark = {
            id,
            title,
            url,
            description,
            rating
        }
        bookmarks.push(bookmark)

        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json(bookmark)
    })

    router
        .route('/bookmarks/:id')
        .get((req, res) => {
            const { id } = req.params
            const bookmark = bookmarks.find(b => b.id == id)

            if (!bookmark) {
                logger.error("Bookmark doesn't exist")
                return res.status(404).send('Bookmark not found')
            }
            res.json(bookmark)
        })
        .delete((req, res) => {
            const {id} = req.params
            const index = bookmarks.findIndex(b => b.id == id)

            if (index === -1){
                logger.error("Bookmark doesn't exist")
                return res.status(404).send('Bookmark not found')
            }

            bookmarks.splice(index, 1)
            logger.info(`bookmark with id ${id} deleted`)

            res.status(204).end()
        
        })

module.exports = router