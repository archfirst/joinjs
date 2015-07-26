import domain from '../domain';

let domainMaps = [
    {
        mapId: 'countryMap',
        createNew: function() {
            return new domain.Country();
        },
        idProperty: {name: 'code', column: 'code'},
        properties: [
            {name: 'name', column: 'name'}
        ]
    },

    {
        mapId: 'fundMap',
        createNew: function() {
            return new domain.Fund();
        },
        idProperty: {name: 'id', column: 'id'},
        properties: [
            {name: 'name', column: 'name'}
        ]
    },

    {
        mapId: 'holdingMap',
        createNew: function() {
            return new domain.Holding();
        },
        idProperty: {name: 'id', column: 'id'},
        properties: [
            {name: 'quantity', column: 'quantity'}
        ],
        associations: [
            {name: 'fund', mapId: 'fundMap', columnPrefix: 'fund_'},
            {name: 'security', mapId: 'securityMap', columnPrefix: 'security_'}
        ]
    },

    {
        mapId: 'securityMap',
        createNew: function() {
            return new domain.Security();
        },
        idProperty: {name: 'symbol', column: 'symbol'},
        properties: [
            {name: 'name', column: 'name'}
        ],
        associations: [
            {name: 'country', mapId: 'countryMap', columnPrefix: 'country_'}
        ]
    },

    {
        mapId: 'userMap',
        createNew: function() {
            return new domain.User();
        },
        idProperty: {name: 'id', column: 'id'},
        properties: [
            {name: 'uid', column: 'uid'},
            {name: 'firstName', column: 'first_name'},
            {name: 'lastName', column: 'last_name'}
        ]
    }
];

export default domainMaps;