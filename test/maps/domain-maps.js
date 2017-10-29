import domain from '../domain';

let domainMaps = [
    {
        mapId: 'countryMap',
        createNew: function() {
            return new domain.Country();
        },
        idProperty: 'code',
        properties: ['name']
    },

    {
        mapId: 'fundMap',
        createNew: function() {
            return new domain.Fund();
        },
        idProperty: 'id',
        properties: ['name']
    },

    {
        mapId: 'holdingMap',
        createNew: function() {
            return new domain.Holding();
        },
        idProperty: 'id',
        properties: ['quantity'],
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
        idProperty: 'symbol',
        properties: ['name'],
        associations: [
            {name: 'country', mapId: 'countryMap', columnPrefix: 'country_'}
        ]
    },

    {
        mapId: 'userMap',
        createNew: function() {
            return new domain.User();
        },
        idProperty: 'id',
        properties: [
            'uid',
            {name: 'firstName', column: 'first_name'},
            {name: 'lastName', column: 'last_name'}
        ]
    }
];

export default domainMaps;
