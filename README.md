# JoinJS

JoinJS is a JavaScript library to map complex database joins to nested objects. It is a simpler alternative that gives you direct control over your database interactions compared to a full-blown Object-Relation Mapper (ORM).

## Motivation
ORMs generally introduce a thick layer of abstraction between objects and the database which usually hinders rather than helps the productivity of the developer. In complex use cases, it is difficult enough to devise queries that will generate the desired results, but now you have to *teach* the ORM to generate the same query. For anyone who has worked with an ORM knows that that's extra time and you may not be able to produce the same query. In the worst case scenario, the ORM may hit the database multiple times for something that you were able to do in a single query.

JoinJS takes a much simpler approach (inspired by a Java library called [MyBatis](http://mybatis.github.io/mybatis-3/)). You can use any database driver or query builder (such as [Kenx.js](http://knexjs.org/)) to query your database, however you use JoinJS to convert the returned result set in to a hierarchy of nested objects.

## Example
Suppose you have a one-to-many relationship between a `Team` and its `Player`s. You want to retrieve all teams along with their players. Here's the query for to do this:

```sql
SELECT t.id              AS team_id,
       t.name            AS team_name,
       p.id              AS player_id,
       p.name            AS player_name
FROM   teams t
       LEFT OUTER JOIN players p
                    ON t.id = p.team_id;
```

Assume that this query returns the following result set

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
            { id: 2, name: 'Rob Gronkowski' },
        ]
    },
    {
        id: 2,
        name: 'New York Jets'
        players: [
            { id: 1, name: 'Tom Brady'      },
            { id: 2, name: 'Rob Gronkowski' },
        ]
    }
]
```

To teach JoinJS how to do this, you must create result maps that describe your objects:

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

Once you have created these result maps, you can simply call JoinJS to map your result set in to objects:

```javascript
var mappedResult = joinjs.map(resultSet, resultMaps, 'teamMap', 'team_');
```

That's it! It doesn't matter how deep or complex your object hierarchy is, JoinJS can map it for you by supplying the appropriate result maps. Read the documentation below for more details. You can find more examples in the [test suite](https://github.com/archfirst/joinjs/tree/master/test). Check out the following project for an example of a real application built with JoinJS:

- [Manage My Money](https://github.com/archfirst/manage-my-money-server) - An application to manage your personal finances

## Installation

```bash
$ npm install join-js
```

## Documentation

### ResultMap
ResulpMaps are used to teach JoinJS how to map result sets to objects. Each result map focuses on a single object. The properties of a ResultMap are described below. You can find many examples of result maps in the [test suite](https://github.com/archfirst/joinjs/tree/master/test).

- `{String} mapId` - A unique identifier for the map

- `{function} createNew` (optional) - A function that returns a blank new instance of the mapped object. Use these property to construct your custom objects instead of generic `Object`s.

- `{Object} idProperty` (optional) - mapping of id property from result set to mapped object. Default is `{name: 'id', column: 'id'}`.
    - `name` - property that identifies the mapped object
    - `column` - property that identifies the database record in the result set

- `{Array} properties` - mapping of other properties from result set to mapped object
    - `name` - property name in the mapped object
    - `column` - property name in the result set

- `{Array} associations` - specifies references to other objects
    - `name` - property name of the association reference in the mapped object
    - `mapId` - identifier of the map for the associated object
    - `columnPrefix` (optional) - a column prefix to apply to every element of the associated object. Default is an empty string.

- `{Array} collections` - specifies an array of references to other objects
    - `name` - property name of the array in the mapped object
    - `mapId` - identifier of the map for the associated objects
    - `columnPrefix` (optional) - a column prefix to apply to every element of the associated objects. Default is an empty string.

### API
JoinJS exposes two very simple functions that give you the power to map any result set to one of more JavaScript objects.


#### map(resultSet, maps, mapId, columnPrefix)

Maps a resultSet to a collection.

- `{Array} resultSet` - an array of database results
- `{Array} maps` - an array of result maps
- `{String} mapId` - mapId of the top-level objects in the resultSet
- `{String} columnPrefix` (optional) - prefix that should be applied to the column names of the top-level objects

Returns a collection of mapped objects.


#### mapOne(resultSet, maps, mapId, columnPrefix, isRequired)

This is a convenience method that maps a resultSet to a single object.

- `{Array} resultSet` - an array of database results
- `{Array} maps` - an array of result maps
- `{String} mapId` - mapId of the top-level objects in the resultSet
- `{String} columnPrefix` (optional) - prefix that should be applied to the column names of the top-level objects
- `{boolean} isRequired` (optional) - is a mapped object required to be returned? Default is true.

Returns the mapped object or `null` if no object was mapped.

Throws a NotFoundError if no object is mapped and isRequired is true.
