# JoinJS

JoinJS is a JavaScript library to map complex database joins to nested objects. It's a simpler alternative to a full-blown Object-Relation Mapper (ORM), and gives you direct control over your database interactions.

## Motivation
ORMs generally introduce a thick layer of abstraction between objects and database tables. This usually hinders, rather than helps, developer productivity. In complex use cases, it is difficult enough to devise efficient queries, but with ORMs you also have to *teach* them to generate the same query. It takes extra time to do this and you may not be able to produce the same query. In the worst case scenario, the ORM may hit the database multiple times for something that you were able to do in a single query.

JoinJS takes a much simpler and straightforward approach inspired by a Java library called [MyBatis](http://mybatis.github.io/mybatis-3/). You can use any database driver or query builder (such as [Knex.js](http://knexjs.org/)) to query your database, however you use JoinJS to convert the returned results to a hierarchy of nested objects.

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
var resultSet = [
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
        name: 'New England Patriots'
        players: [
            { id: 1, name: 'Tom Brady'      },
            { id: 2, name: 'Rob Gronkowski' }
        ]
    },
    {
        id: 2,
        name: 'New York Jets'
        players: [
            { id: 3, name: 'Geno Smith'     },
            { id: 4, name: 'Darrelle Revis' }
        ]
    }
]
```

To teach JoinJS how to do this, you must create two result maps that describe your objects:

```javascript
var resultMaps = [
    {
        mapId: 'teamMap',
        idProperty: {name: 'id', column: 'id'},
        properties: [
            {name: 'name', column: 'name'}
        ],
        collections: [
            {name: 'players', mapId: 'playerMap', columnPrefix: 'player_'}
        ]
    },
    {
        mapId: 'playerMap',
        idProperty: {name: 'id', column: 'id'},
        properties: [
            {name: 'name', column: 'name'}
        ]
    }
]
```

Once you have created these result maps, you can simply call JoinJS to convert your result set in to objects:

```javascript
var mappedResult = joinjs.map(resultSet, resultMaps, 'teamMap', 'team_');
```

That's it! It doesn't matter how deep or complex your object hierarchy is, JoinJS can map it for you. Read the documentation below for more details. You can find more examples in the [test suite](https://github.com/archfirst/joinjs/tree/master/test). Also check out the [Manage My Money](https://github.com/archfirst/manage-my-money-server) project for an example of a full-fledged application built with JoinJS and other libraries to manage personal finances.

## Installation

```bash
$ npm install join-js
```

## Documentation

### ResultMap
ResultMaps are used to teach JoinJS how to map database results to objects. Each result map focuses on a single object. The properties of a ResultMap are described below. You can find several examples in the [test suite](https://github.com/archfirst/joinjs/tree/master/test).

- `mapId {String}` - A unique identifier for the map

- `createNew {function} (optional)` - A function that returns a blank new instance of the mapped object. Use this property to construct a custom object instead of a generic JavaScript `Object`.

- `idProperty {Object} (optional)` - specifies the name of the id property in the mapped object and in the result set. Default is `{name: 'id', column: 'id'}`.
    - `name` - property that identifies the mapped object
    - `column` - property that identifies the database record in the result set

- `properties {Array} (optional)` - mappings for other properties. Each mapping contains:
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
