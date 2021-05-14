# Assessment Exercise - David Goerig



## SIB README:

This skeleton project has been generated following the instructions given [here](https://www.valentinog.com/blog/drf/).

It is a simple [django](https://www.djangoproject.com/) - [React](https://reactjs.org/) project, composed of a single
entity `Project`.

## Starting the application

1. To generate and prepare the backend database, run `./manage.py migrate`.
1. In _frontend_ folder, run **webpack** with `npm run dev`.
1. In project home, run `./manage.py runserver`.
1. Create some projects by accessing http://localhost:8000/api/project/.
1. Head over http://127.0.0.1:8000/ to list the just created projects in your **React** client.

## Your mission

To each project, a list of users should be attached.

Technically, we ask you to vertically implement an `User` entity. A `User` is typically composed of following
properties: first/last name and email. To each project, it should be possible to attach some users.

We keep the project very simple and generic so that you could spend time on the area you feel most confident with:
_backend_, _frontend_, ...

We expect following minimal requirements:

- On the _frontend_, we should be able to list each project with associated users
- Some tests

Do not spend more than half a/one day on that exercise. Our goal is to see how you work. Impress us with your skills!
Good luck!

## Submission

Your submission should be pushed to one of the public **Git** repositories like [GitHub](https://github.com/),
[GitLab](https://gitlab.com/), [Bitbucket](https://bitbucket.org), ... and should be _publicly_ available.

If you do not want to make this code _public_, then you will have to tell us how we could access it.

So basically:

1. Clone the project
1. Make the changes
1. Push the result
1. Send us the direct link to the repository



