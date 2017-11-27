var osmosis = require('osmosis');
var json2csv = require('json2csv');
var fs = require('fs');

var meetings = []

function crawl(day) {
  osmosis
    .post('https://lacoaa.org/find-a-meeting/', {
      "sZIP": "",
      "sRADIUS": 0,
      "sDAY": day,
      "sLOCATION": "-any-",
      "sTIME": "-any-",
      "sCLOSED": "-any-",
      "sMEN-WOMEN": "-any-",
      "sGAY": "-any-",
      "Submit": "Submit",
      "search_meeting": 1,
    })
    .find('.meeting_item')
    .set({
      title: '.meeting_title',
      time: '.meeting_time > span',
      dayOfWeek: '//div[3]/div/div[1]/text()',
      address: '.meeting_desc > p:nth(0)',
      details: '.meeting_desc > p:nth(1)'
    })
    .data(function(item) {
      meetings.push(item);
    })
    .done(function() {
      console.log(`Finished crawling day ${day}`)
      if(day < 7) {
        next = day + 1;
        crawl(next);
      } else {
        console.log('All done! Writing to file...')

        var result = json2csv({
          data: meetings, 
          fields: ["title","time","dayOfWeek","address","details"]
        });

        fs.writeFile('meetings.csv', result, function() {
          console.log('Finished writing to file.');
        })
      }
    })
}

crawl(1);
