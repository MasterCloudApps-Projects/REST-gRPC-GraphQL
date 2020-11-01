/**
 * To create a new entry, run:

curl -v --header "Content-Type: application/json" \
--request POST \
--data '{"title": "This is my first operation", "description": "Description of the operation"}' \
http://localhost:4000/operations/tasks

 * It will return a task id in the `Content-Location` header, as in `/operations/tasks/82c0373c-8005-42d3-b4ee-693d3b7b8e11`
 *
 * To fetch the task, run:

curl -v -X GET http://localhost:4000/operations/tasks/82c0373c-8005-42d3-b4ee-693d3b7b8e11
 
 * If the operation is not ready, you'll get `200 {"status": "pending"}`
 * Otherwise, a `303 {"status": "done"}`, with a `Location: operations/2622efee-6207-4438-a059-e9bf6d77ba31` will be returned.
 * Now you can fetch the operation:
 * 

 curl -v -X GET http://localhost:4000/operations/2622efee-6207-4438-a059-e9bf6d77ba31

*/

const app = require('express')();
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');

var tasksCollection = new Map();
var operationsCollection = new Map();

app.use(bodyParser.json()) // for parsing application/json
app
    // Factory method to register a new async `task` that will create a new resource of type `operations`:
    .post('/operations/tasks', (req, res) => {
        const operation = req.body;

        // To simplify, we won't accept client-provided slugs:
        const slug = uuidv4();

        // A new task is registered
        tasksCollection.set(slug, {
            operation: operation,
            status: 'pending'
        });

        // This represents the asynchronous operation
        const time = 15000;
        setTimeout(slug => {
            const operationSlug = uuidv4();
            operationsCollection.set(operationSlug, tasksCollection.get(slug).operation);
            tasksCollection.set(slug, {
                status: 'done',
                operationSlug: operationSlug
            });
        }, time, slug);

        const identifier = '/operations/tasks/' + slug;
        res.status(202);
        res.set('Content-Location', identifier);
        res.format({
            'application/json': () => res.json({'status': 'pending'})
        })
    })

    // Return 200 when found or 404 when not found:
    .get('/operations/tasks/:id', (req, res) => {
        if (tasksCollection.has(req.params.id)) {
            const task = tasksCollection.get(req.params.id);
            const response = {
                status: task.status
            };
            if (task.status == 'done') {
                res.location('/operations/' + task.operationSlug);
                res.status(303);
            }
            res.format({'application/json': () => res.json(response)});
        } else {
            res.sendStatus(404)
        }
    })

    // Return 200 when found or 404 when not found:
    .get('/operations/:id', (req, res) => operationsCollection.has(req.params.id) ?
        res.format({
            'application/json': () => res.json(operationsCollection.get(req.params.id))
        }) :
        res.sendStatus(404)
    );

app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));

