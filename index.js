const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny'));

app.use(logger);

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];

app.get('/', (req, resp) => {
    resp.send('Hello world - api restful');
});

app.get('/api/courses', (req, resp) => {
    resp.send(courses);
});

app.get('/api/courses/:id', (req, resp) => {
    const course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) resp.status(404).send('The course with the given ID was not found');
    resp.send(course);
});

app.post('/api/courses', (req, resp) => {
    const result = validateCourse(req.body);
    if (result.error) {
        resp.status(400).send(result.error.details[0].message);
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    resp.send(course);
});

app.put('/api/courses/:id', (req, resp) => {
    const course = courses.find(item => item.id === parseInt(req.params.id));

     if (!course) {
        resp.status(400).send('The given course is not valid');
        return;
    }
    const result = validateCourse(req.body);

    if (result.error) {
        resp.status(400).send(result.error.details[0].message);
        return;
    }
    course.name = req.body.name;
    resp.send(course);
});

app.delete('/api/courses/:id', (req, resp) => {
    const course = courses.find(item => item.id === parseInt(req.params.id));
     if (!course) {
        resp.status(400).send('The given course is not valid');
        return;
    }
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    resp.send(course);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required()
    });

    return schema.validate(course);
};



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

