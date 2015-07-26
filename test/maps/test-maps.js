let testMaps = [
    {
        mapId: 'noIdProperty',
        properties: [
            {name: 'name', column: 'name'}
        ]
    },

    {
        mapId: 'withIdProperty',
        idProperty: {name: 'symbol', column: 'symbol'},
        properties: [
            {name: 'name', column: 'name'}
        ]
    },

    {
        mapId: 'noProperties'
    },

    {
        mapId: 'noIdProperty',
        properties: [
            {name: 'name', column: 'name'}
        ]
    },

    {
        mapId: 'customerMap',
        properties: [
            {name: 'name', column: 'name'}
        ],
        collections: [
            {name: 'orders', mapId: 'orderMap', columnPrefix: 'order_'}
        ]
    },

    {
        mapId: 'orderMap',
        properties: [
            {name: 'total', column: 'total'}
        ]
    },

    // Multiple one-to-one relationships with same target entity
    // Note that we cannot have recursive maps
    {
        mapId: 'personMap',
        properties: [
            {name: 'name', column: 'name'}
        ],
        associations: [
            {name: 'father', mapId: 'shallowPersonMap', columnPrefix: 'father_'},
            {name: 'mother', mapId: 'shallowPersonMap', columnPrefix: 'mother_'}
        ]
    },
    {
        mapId: 'shallowPersonMap',
        properties: [
            {name: 'name', column: 'name'}
        ]
    },

    // one-to-one-to-one relationship
    // A ---> 1 B ---> 1 C
    {
        mapId: 'aMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ],
        associations: [
            {name: 'b', mapId: 'bMap', columnPrefix: 'b_'}
        ]
    },
    {
        mapId: 'bMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ],
        associations: [
            {name: 'c', mapId: 'cMap', columnPrefix: 'c_'}
        ]
    },
    {
        mapId: 'cMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ]
    },

    // one-to-one-to-many relationship
    // D ---> 1 E ---> * F
    {
        mapId: 'dMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ],
        associations: [
            {name: 'e', mapId: 'eMap', columnPrefix: 'e_'}
        ]
    },
    {
        mapId: 'eMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ],
        collections: [
            {name: 'fCollection', mapId: 'fMap', columnPrefix: 'f_'}
        ]
    },
    {
        mapId: 'fMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ]
    },

    // one-to-many-to-one relationship
    // G ---> * H ---> 1 I
    {
        mapId: 'gMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ],
        collections: [
            {name: 'hCollection', mapId: 'hMap', columnPrefix: 'h_'}
        ]
    },
    {
        mapId: 'hMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ],
        associations: [
            {name: 'i', mapId: 'iMap', columnPrefix: 'i_'}
        ]
    },
    {
        mapId: 'iMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ]
    },

    // one-to-many-to-many relationship
    // J ---> * K ---> * L
    {
        mapId: 'jMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ],
        collections: [
            {name: 'kCollection', mapId: 'kMap', columnPrefix: 'k_'}
        ]
    },
    {
        mapId: 'kMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ],
        collections: [
            {name: 'lCollection', mapId: 'lMap', columnPrefix: 'l_'}
        ]
    },
    {
        mapId: 'lMap',
        properties: [
            {name: 'prop', column: 'prop'}
        ]
    }
];

export default testMaps;