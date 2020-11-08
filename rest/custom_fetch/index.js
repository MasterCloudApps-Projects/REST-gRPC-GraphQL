/**
 * In this example, 100 articles have been created, each one with 5 comments. To fetch them, run:

curl "http://localhost:4000/articles"

 * Now, to fetch a specific article, we can:

curl "http://localhost:4000/articles/5fa86e4fd3ec9e5eb38447a1"

 * The above would have returned something like this:

{
  "title": "Title 100",
  "description": "Description 100"
}
 
 * This resource accepts sparse fieldsets. We can choose between 'title', 'description', 'createdAt', 'updatedAt', 'comments'.

curl "http://localhost:4000/articles/5fa86e4fd3ec9e5eb38447a1?fields[]=title&fields=comments"

 * Which will return something like:

{
  "title":"Title 100",
  "comments":[
    {"id":"5fa86f33558bab6f3f048dce","author":"Author 0","text":"Comment text 0"},
    {"id":"5fa86f33558bab6f3f048dcf","author":"Author 1","text":"Comment text 1"},
    {"id":"5fa86f33558bab6f3f048dd0","author":"Author 2","text":"Comment text 2"},
    {"id":"5fa86f33558bab6f3f048dd1","author":"Author 3","text":"Comment text 3"},
    {"id":"5fa86f33558bab6f3f048dd2","author":"Author 4","text":"Comment text 4"}
  ]
}

 * Note that among those fields we find simple, scalar fields (like "id" or "author") and embedded fields (like "comments").
 */

const app = require('express')();
require('./mongoose.js');
const bodyParser = require('body-parser')
const routes = require('./routes/index.js');

app.use(bodyParser.json()) // for parsing application/json
app.use('/articles', routes.article);
app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));
