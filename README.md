# JoinJS

[![Build Status](https://travis-ci.org/archfirst/joinjs.svg?branch=master)](https://travis-ci.org/archfirst/joinjs)
[![Coverage Status](https://coveralls.io/repos/github/archfirst/joinjs/badge.svg?branch=master)](https://coveralls.io/github/archfirst/joinjs?branch=master)

JoinJS is a JavaScript library to map complex database joins to nested objects. It's a simpler alternative to a full-blown Object-Relation Mapper (ORM), and gives you direct control over your database interactions.

## Motivation: Direct, no-nonsense control over your database

Traditional ORMs introduce a thick layer of abstraction between objects and database tables. This usually hinders, rather than helps, developer productivity. In complex use cases, it is difficult enough to devise efficient queries, but with ORMs you also have to *teach* them to generate the same query. It takes extra time to do this and you may not be able to produce the same query. In the worst case scenario, the ORM may hit the database multiple times for something that you were able to do in a single query.

JoinJS takes a much simpler and straightforward approach inspired by a popular Java mapping framework called [MyBatis](http://mybatis.github.io/mybatis-3/) (see the post on [MyBatis vs. other ORMs](https://archfirst.org/mybatis-vs-other-orms/). You can use any database driver or query builder (such as [Knex.js](http://knexjs.org/)) to query your database, however you use JoinJS to convert the returned results into a hierarchy of nested objects.

## Example

Suppose you have a one-to-many relationship between a `Team` and its `Players`. You want to retrieve all teams along with their players. Here's the query for to do this:

```sql
SELECT t.id              AS team_id,
       t.name            AS team_name,
       p.id              AS player_id,
       p.name            AS player_name
FROM   teams t
       LEFT OUTER JOIN players p
                    ON t.id = p.team_id;
```

Assume that this query returns the following result set:

```javascript
let resultSet = [
    { team_id: 1, team_name: 'New England Patriots', player_id: 1, player_name: 'Tom Brady'      },
    { team_id: 1, team_name: 'New England Patriots', player_id: 2, player_name: 'Rob Gronkowski' },
    { team_id: 2, team_name: 'New York Jets',        player_id: 3, player_name: 'Geno Smith'     },
    { team_id: 2, team_name: 'New York Jets',        player_id: 4, player_name: 'Darrelle Revis' }
];

```

You can use JoinJS to convert this result set in to an array of teams with nested players:

```javascript
[
    {
        id: 1,
        name: 'New England Patriots',
        players: [
            { id: 1, name: 'Tom Brady'      },
            { id: 2, name: 'Rob Gronkowski' }
        ]
    },
    {
        id: 2,
        name: 'New York Jets',
        players: [
            { id: 3, name: 'Geno Smith'     },
            { id: 4, name: 'Darrelle Revis' }
        ]
    }
]
```

To teach JoinJS how to do this, you must create two result maps that describe your objects:

```javascript
const resultMaps = [
    {
        mapId: 'teamMap',
        idProperty: 'id',
        properties: ['name'],
        collections: [
            {name: 'players', mapId: 'playerMap', columnPrefix: 'player_'}
        ]
    },
    {
        mapId: 'playerMap',
        idProperty: 'id',
        properties: ['name']
    }
]
```

Once you have created these result maps, you can simply call JoinJS to convert your result set in to objects:

```javascript
let mappedResult = joinjs.map(resultSet, resultMaps, 'teamMap', 'team_');
```

That's it! It doesn't matter how deep or complex your object hierarchy is, JoinJS can map it for you. Read the documentation below for more details. You can find more examples in the [test suite](https://github.com/archfirst/joinjs/tree/master/test). Follow the [step-by-step tutorial](https://archfirst.org/joinjs-an-alternative-to-complex-orms/) for a hands-on introduction. Once you have mastered the basics, check out the [Manage My Money](https://github.com/archfirst/manage-my-money-server) project to see how you can build a full-fledged application complete with a front-end using JoinJS and other useful libraries.

## Installation

```bash
$ npm install --save join-js
```

Don't forget the dash in the package name (`join-js`).

Using with ES5:

    var joinjs = require('join-js').default;

Using with ES6:

    import joinjs from 'join-js';

## Documentation

### ResultMap

ResultMaps are used to teach JoinJS how to map database results to objects. Each result map focuses on a single object. The properties of a ResultMap are described below. You can find several examples in the [test suite](https://github.com/archfirst/joinjs/tree/master/test).

- `mapId {String}` - A unique identifier for the map

- `createNew {function} (optional)` - A function that returns a blank new instance of the mapped object. Use this property to construct a custom object instead of a generic JavaScript `Object`.

- `idProperty {String | Object | Array(String|Object)} (optional)` - specifies the name of the id property in the mapped object and in the result set. Default is `id`, which implies that the name of the id property in the mapped object as well as the column name in the result set are both `id`. If the two names are different, then you must specify the Object form, e.g. `{name: 'id', column: 'person_id'}`.
    - `name` - property that identifies the mapped object
    - `column` - property that identifies the database record in the result set
    
    In addition, you can specify composite key by passing an array of string and/or object, e.g. `['person_id', {name: 'language', column: 'language_id'}]`

- `properties {Array} (optional)` - names of other properties. For any property that has a different name in the mapped object vs. the result set, you must specify the object form, e.g. `{name: 'firstName', column: 'first_name'}`. The properties of the object form are:
    - `name` - property name in the mapped object
    - `column` - property name in the result set

- `associations {Array} (optional)` - mappings for associations to other objects. Each mapping contains:
    - `name` - property name of the association in the mapped object
    - `mapId` - identifier of the result map of the associated object
    - `columnPrefix (optional)` - a prefix to apply to every column of the associated object. Default is an empty string.

- `collections {Array} (optional)` - mappings for collections of other objects. Each mapping contains:
    - `name` - property name of the collection in the mapped object
    - `mapId` - identifier of the result map of the associated objects
    - `columnPrefix (optional)` - a prefix to apply to every column of the associated object. Default is an empty string.

### API

JoinJS exposes two very simple functions that give you the full power to map any result set to one of more JavaScript objects.

#### map(resultSet, maps, mapId, columnPrefix)

Maps a resultSet to an array of objects.

- `resultSet {Array}` - an array of database results
- `maps {Array}` - an array of result maps
- `mapId {String}` - mapId of the top-level objects in the resultSet
- `columnPrefix {String} (optional)` - prefix that should be applied to the column names of the top-level objects

Returns an array of mapped objects.

#### mapOne(resultSet, maps, mapId, columnPrefix, isRequired)

This is a convenience method that maps a resultSet to a single object. It is used when your select query is expected to return only one result (e.g. `SELECT * FROM table WHERE id = 1234`).

- `resultSet {Array}` - an array of database results
- `maps {Array}` - an array of result maps
- `mapId {String}` - mapId of the top-level object in the resultSet
- `columnPrefix {String} (optional)` - prefix that should be applied to the column names of the top-level objects
- `isRequired {boolean} (optional)` - is it required to have a mapped object as a return value? Default is `true`.

Returns the mapped object or `null` if no object was mapped.

Throws a `NotFoundError` if no object is mapped and `isRequired` is `true`.

## Resources

- [JoinJS test suite](https://github.com/archfirst/joinjs/tree/master/test) - contains examples of various use cases
- [Step-by-step tutorial](https://archfirst.org/joinjs-an-alternative-to-complex-orms/) - provides a hands-on introduction to JoinJS
- [Manage My Money](https://github.com/archfirst/manage-my-money-server) - a full-fledged application complete with a front-end using JoinJS and other useful libraries
