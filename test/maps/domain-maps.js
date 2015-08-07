import domain from '../domain';

let domainMaps = [
    {
        mapId: 'countryMap',
        createNew: function() {
            return new domain.Country();
        },
        idProperty: {name: 'code'},
        properties: [
            {name: 'name'}
        ]
    },

    {
        mapId: 'fundMap',
        createNew: function() {
            return new domain.Fund();
        },
        idProperty: {name: 'id'},
        properties: [
            {name: 'name'}
        ]
    },

    {
        mapId: 'holdingMap',
        createNew: function() {
            return new domain.Holding();
        },
        idProperty: {name: 'id'},
        properties: [
            {name: 'quantity'}
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
        idProperty: {name: 'symbol'},
        properties: [
            {name: 'name'}
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
        idProperty: {name: 'id'},
        properties: [
            {name: 'uid'},
            {name: 'firstName', column: 'first_name'},
            {name: 'lastName', column: 'last_name'}
        ]
    }
];

export default domainMaps;