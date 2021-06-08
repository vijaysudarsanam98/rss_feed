const http = require("http")
const rss = require('./rss.js')
const concat = require("concat-stream")
var qs = require('qs');


const feedUrl = "https://www.cnbc.com/id/100727362/device/rss/rss.html"
function formatSlackFeed(feed, feedSize) {
  let titleBlock = {type: "section", text: {type: "mrkdwn", text: feed.title}}
  let feedText = feed.items.slice(0, feedSize).map((entry) => `- <${entry.link}|${entry.title}>`).join("\n")
  let feedBlock = {type: "section", text: {type: "mrkdwn", text: feedText}}
  return { blocks: [titleBlock, feedBlock]}
}

const app = http.createServer((request, response) => {
  request.pipe(
    concat( data => {
      let body = data.toString();
      let formbody = qs.parse(body)
      let feedSize = parseInt(formbody.text)
      isNaN(feedSize) ? feedSize = 10 : feedSize = Math.max(1, Math.min(feedSize, 25))
      response.writeHead(200, {"Content-Type": "application/json"})
      rss.getRssFeed(feedUrl).then((feed) => {
        let formatted = formatSlackFeed(feed, feedSize)
        response.write(JSON.stringify(formatted))
          response.end()
        })
    }
  ))
})

console.log("Started Server...")
app.listen(5000)
console.log("Listening on http://127.0.0.1:5000")