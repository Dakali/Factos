const express = require('express')
const router = express.Router()


router.get('/search/:fact', async (req, res) => {

    try {



    } catch (error) {
        res.status(401).json({
            message: 'Une erreur est survenue! Veuillez réessayer!'
        })
    }
})








module.exports = router
