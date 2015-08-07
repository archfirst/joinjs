let testMaps = [
    {
        mapId: 'noIdProperty',
        properties: [
            {name: 'name'}
        ]
    },

    {
        mapId: 'withIdProperty',
        idProperty: {name: 'symbol'},
        properties: [
            {name: 'name'}
        ]
    },

    {
        mapId: 'withColumnSpecification',
        idProperty: {name: 'id', column: 'object_id'},
        properties: [
            {name: 'firstName', column: 'first_name'}
        ]
    },

    {
        mapId: 'noProperties'
    },

    {
        mapId: 'customerMap',
        properties: [
            {name: 'name'}
        ],
        collections: [
            {name: 'orders', mapId: 'orderMap', columnPrefix: 'order_'}
        ]
    },

    {
        mapId: 'orderMap',
        properties: [
            {name: 'total'}
        ]
    },

    // Multiple one-to-one relationships with same target entity
    // Note that we cannot have recursive maps
    {
        mapId: 'personMap',
        properties: [
            {name: 'name'}
        ],
        associations: [
            {name: 'father', mapId: 'shallowPersonMap', columnPrefix: 'father_'},
            {name: 'mother', mapId: 'shallowPersonMap', columnPrefix: 'mother_'}
        ]
    },
    {
        mapId: 'shallowPersonMap',
        properties: [
            {name: 'name'}
        ]
    },

    // one-to-one-to-one relationship
    // A ---> 1 B ---> 1 C
    {
        mapId: 'aMap',
        properties: [
            {name: 'prop'}
        ],
        associations: [
            {name: 'b', mapId: 'bMap', columnPrefix: 'b_'}
        ]
    },
    {
        mapId: 'bMap',
        properties: [
            {name: 'prop'}
        ],
        associations: [
            {name: 'c', mapId: 'cMap', columnPrefix: 'c_'}
        ]
    },
    {
        mapId: 'cMap',
        properties: [
            {name: 'prop'}
        ]
    },

    // one-to-one-to-many relationship
    // D ---> 1 E ---> * F
    {
        mapId: 'dMap',
        properties: [
            {name: 'prop'}
        ],
        associations: [
            {name: 'e', mapId: 'eMap', columnPrefix: 'e_'}
        ]
    },
    {
        mapId: 'eMap',
        properties: [
            {name: 'prop'}
        ],
        collections: [
            {name: 'fCollection', mapId: 'fMap', columnPrefix: 'f_'}
        ]
    },
    {
        mapId: 'fMap',
        properties: [
            {name: 'prop'}
        ]
    },

    // one-to-many-to-one relationship
    // G ---> * H ---> 1 I
    {
        mapId: 'gMap',
        properties: [
            {name: 'prop'}
        ],
        collections: [
            {name: 'hCollection', mapId: 'hMap', columnPrefix: 'h_'}
        ]
    },
    {
        mapId: 'hMap',
        properties: [
            {name: 'prop'}
        ],
        associations: [
            {name: 'i', mapId: 'iMap', columnPrefix: 'i_'}
        ]
    },
    {
        mapId: 'iMap',
        properties: [
            {name: 'prop'}
        ]
    },

    // one-to-many-to-many relationship
    // J ---> * K ---> * L
    {
        mapId: 'jMap',
        properties: [
            {name: 'prop'}
        ],
        collections: [
            {name: 'kCollection', mapId: 'kMap', columnPrefix: 'k_'}
        ]
    },
    {
        mapId: 'kMap',
        properties: [
            {name: 'prop'}
        ],
        collections: [
            {name: 'lCollection', mapId: 'lMap', columnPrefix: 'l_'}
        ]
    },
    {
        mapId: 'lMap',
        properties: [
            {name: 'prop'}
        ]
    }
];

export default testMaps;