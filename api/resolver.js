var key = require('../utils/key');
var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');

// The API that returns the in-email representation.
module.exports = function(req, res) {
  var url = req.query.url.trim();

  // mixmax regex: itunes.apple.com\/[a-z]{2}\/app\/

  var matches = url.match(/\/id([0-9]{9})/);
  if (!matches) {
    res.status(400).send('Invalid App URL format');
    return;
  }

  var id = matches[1];

  //console.log(id);
  //console.log(url);

  var response;
  try {
    response = sync.await(request({
      url: 'https://itunes.apple.com/lookup?id=' + encodeURIComponent(id),
      json: true,
      timeout: 15 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  if(response.body.resultCount < 1) {
    res.status(404).send("No app with such ID found");
    return;
  }

  //console.log(response.body.resultCount);

  response = response.body.results[0];

  var appLogoUrl = response.artworkUrl512;
  var appPrice = response.formattedPrice;
  var appName = response.trackName;
  var creatorName = response.sellerName;
  var ratingPercentage = 0;
  var numRatings = 0;
  if(response.averageUserRatingForCurrentVersion) {
    ratingPercentage = (response.averageUserRatingForCurrentVersion / 5) * 100;
    numRatings = response.userRatingCountForCurrentVersion;
  }
  var appDescription = response.description.substring(0, 300);
  if(response.description.length > 300) appDescription += "...";
  var appScreenshotUrl = response.screenshotUrls[0];

  var html = '\
    <a href="' + url + '">\
<div id="mixmax-app-preview-container" style="position: relative;width: 600px;height: 300px;font-family: \'proxima-nova\', \'Avenir Next\', \'Segoe UI\', \'Calibri\', \'Helvetica Neue\', Helvetica, Arial, sans-serif;">\
\
  <div id="mixmax-app-preview-left" style="position: relative;float: left;width: 400px;height: 300px;display: inline-block;">\
\
    <div id="mixmax-app-quick-info" style="width: 400px;height: 170px;left: 0;top: 0;float: left;display: inline-block;">\
\
      <div id="mixmax-app-logo-container" style="float: left;width: 125px;">\
        <img id="mixmax-app-logo" src="' + appLogoUrl + '" style="width: 125px;border-radius: 30px;">\
        <div id="mixmax-app-price" style="text-align: center;border: 1px solid #007EFF;border-radius: 5px;color: #007EFF;padding: 2px 7px;width: 45px;font-size: 10pt;margin: 0 auto;margin-top: 10px;">' + appPrice + '</div>\
      </div>\
\
      <div id="mixmax-app-name-container" style="margin-top: 10px;max-width: 230px;margin-left: 20px;float: left;">\
        <div id="mixmax-app-name" style="font-size: 15pt;font-weight: 600;word-wrap: break-word;max-height: 3.3em;line-height: 1.1em;overflow: hidden;color: #000;">' + appName + '</div>\
        <div id="mixmax-app-creator" style="margin-top: 5px;white-space: nowrap;width: 230px;overflow: hidden;text-overflow: ellipsis;color: #000;">' + creatorName + '</div>\
\
        <div id="mixmax-rating-container" style="margin-top: 10px;background: url(http://i.imgur.com/Cdr0KVR.png) repeat-x;font-size: 0;height: 15px;line-height: 0;overflow: hidden;text-indent: -999em;width: 90px;display: inline-block;"><span style="width: ' + ratingPercentage + '%;background: url(http://i.imgur.com/Cdr0KVR.png) repeat-x;background-position: 0 100%;float: left;height: 15px;display: block;" id="star-ratings-sprite-rating"></span></div>\
        <span id="mixmax-rating-count" style="display: inline-block;color: #ABABAB;font-size: 10pt;line-height: 15px;">(' + numRatings + ')</span>\
      </div>    \
      \
    </div>\
\
    <div id="mixmax-app-description" style="position: relative;float: left;width: 360px;height: 110px;padding: 10px;font-size: 11pt;overflow-y: hidden;color: #000;">\
      ' + appDescription + '\
    </div>\
\
  </div>\
  \
\
  <div id="mixmax-app-screenshot-container" style="position: relative;float: left;width: 200px;height: 300px;text-align: center;overflow: hidden;">\
        <img id="mixmax-app-screenshot" src="' + appScreenshotUrl + '" style="max-height: 300px;">\
    </div>\
\
</div>\
</a>\
  ';


  res.json({
    body: html
    // Add raw:true if you're returning content that you want the user to be able to edit
  });
};