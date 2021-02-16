const Handlebars = require("handlebars");
const navbar = require('./navbar');
const playlistCard = require('./playlistCard');
const userCard = require('./userCard');
const addToPlaylistButton = require('./addToPlaylistButton');

const fancyTimeFormat = (duration) => {
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
    let ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}


module.exports = () => {
    Handlebars.registerPartial("navbar", navbar);
    Handlebars.registerPartial("playlistCard", playlistCard);
    Handlebars.registerPartial("userCard", userCard);
    Handlebars.registerPartial("addToPlaylistButton", addToPlaylistButton);
    Handlebars.registerHelper('fancyDuration', d => {
        return fancyTimeFormat(d)
    })
}
