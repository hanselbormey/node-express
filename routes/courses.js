const express = require('express');
const router = express.Router();

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];

router.get('/', (req, resp) => {
    resp.send(courses);
});

router.post('/', (req, resp) => {
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

router.get('/:id', (req, resp) => {
    const course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) resp.status(404).send('The course with the given ID was not found');
    resp.send(course);
});

router.put('/:id', (req, resp) => {
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

router.delete('/:id', (req, resp) => {
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

module.exports = router;

