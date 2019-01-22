const redisConnection = require('./redis-connection');
const bluebird = require("bluebird");
const axios = require("axios");
const redis = require("redis");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);

console.log("Worker started");

const trimUrl = url => {
    if (url) {
        if (url.indexOf('?') != -1)
            url = url.substring(0, url.indexOf('?'));
        if (url.indexOf('biz_photos') != -1)
            url = url.replace('biz_photos', 'biz');
        return url.trim();
    }
}

const get_highlights = async link => {
    const { stdout, stderr } = await exec(`python data_science/yelp_main.py ${link}`);
    if (stdout) {
        let data = JSON.parse(stdout);
        data.highlights = data.highlights[data.name];
        delete data.highlights[data.name];
        return data;
    }
    else if (stderr) {
        const error = { 'error': stderr };
        throw error;
    }
}

const send_existing_highlights = async link => {
    redisConnection.emit('post-highlights-existing', JSON.parse(await client.getAsync(link)));
}

const create_new_highlights = async link => {
    const highlights = await get_highlights(link);
    await client.setexAsync(link, 14 * 24 * 60 * 60 /* Cache expires after 2 weeks */, JSON.stringify(highlights));
    redisConnection.emit('post-highlights-new', highlights);
}

redisConnection.on('get-highlights', async (data, channel) => {
    const link = trimUrl(data.url);
    if (link) {
        if (data.forceNew === false && await client.existsAsync(link))
            await send_existing_highlights(link);
        else await create_new_highlights(link);
    } else redisConnection.emit('error', 'Invalid URL provided.');
});