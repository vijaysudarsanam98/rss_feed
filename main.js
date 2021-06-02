const http = require("http")
const rss = require('./rss.js')

const feedUrl = "https://www.cnbc.com/id/100727362/device/rss/rss.html"

const app = http.createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/plain"})
  rss.getRssFeed(feedUrl).then((feed) => {
      response.write(feed.title + '\n');
      feed.items.slice(0, 5).forEach(function(entry) {
          response.write(`${entry.title}: ${entry.link}\n`)
      })
      response.end()
  })
})

console.log("Started Server...")
app.listen(5000)
console.log("Listening on http://127.0.0.1:5000")