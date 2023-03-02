const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

let Counter = mongoose.model('Counter', new mongoose.Schema({
    seq: {
        type: Number,
        default: 1,
    }
}));


const urlSchema = new mongoose.Schema({
    fullUrl: {
        type: String,
        required: true,
        unique: true,
    },
    shortUrl: {
        type: Number,
        unique: true,
    },
});

urlSchema.pre('save', function (next) {
    if (this.$isNew) {
        Counter.findByIdAndUpdate(process.env.COUNTER_ID, { $inc: { seq: 1 } }, (err, counter) => {
            if (err) next(err);
            this.shortUrl = counter.seq;
            next();
        })
    }
});

let Url = mongoose.model('Url', urlSchema);

router.post('/api/shorturl', (req, res) => {
    let fullUrl = req.body.url;

    fetch(fullUrl)
        .then(async () => {
            let existing = await Url.findOne({ fullUrl })
            if (existing) {
                res.json({
                    original_url: existing.fullUrl,
                    short_url: existing.shortUrl,
                });
            } else {
                let newUrl = await Url.create({ fullUrl });
                res.json({
                    original_url: newUrl.fullUrl,
                    short_url: newUrl.shortUrl,
                });
            }
        })
        .catch(err => {
            res.json({ error: 'invalid url' })
        })
});

router.get('/api/shorturl/:shortUrl(\\d+)', (req, res) => {
    let shortUrl = Number.parseInt(req.params.shortUrl)

    Url.findOne({ shortUrl }).then((url) => {
        res.redirect(url.fullUrl)
    }).catch((reason) => {
        res.json({
            error: 'unable to find url',
        });
    })
});


module.exports = router;
