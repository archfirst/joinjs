let testMaps = [
    {
        mapId: 'noIdProperty',
        properties: ['name']
    },

    {
        mapId: 'withIdProperty',
        idProperty: 'symbol',
        properties: ['name']
    },

    {
        mapId: 'withColumnSpecification',
        idProperty: {name: 'id', column: 'object_id'},
        properties: [
            {name: 'firstName', column: 'first_name'}
        ]
    },

    {
        mapId: 'withCompositeIdProperty',
        idProperty: ['person_id', 'language_id'],
        properties: ['name']
    },

    {
        mapId: 'withCompositeIdPropertyAndColumnSpecification',
        idProperty: [
            {name: 'personId', column: 'person_id'},
            {name: 'languageId', column: 'language_id'}
        ],
        properties: ['name']
    },

    {
        mapId: 'noProperties'
    },

    {
        mapId: 'customerMap',
        properties: ['name'],
        collections: [
            {name: 'orders', mapId: 'orderMap', columnPrefix: 'order_'}
        ]
    },

    {
        mapId: 'orderMap',
        properties: ['total']
    },

    // Multiple one-to-one relationships with same target entity
    // Note that we cannot have recursive maps
    {
        mapId: 'personMap',
        properties: ['name'],
        associations: [
            {name: 'father', mapId: 'shallowPersonMap', columnPrefix: 'father_'},
            {name: 'mother', mapId: 'shallowPersonMap', columnPrefix: 'mother_'}
        ]
    },
    {
        mapId: 'shallowPersonMap',
        properties: ['name']
    },

    // one-to-one-to-one relationship
    // A ---> 1 B ---> 1 C
    {
        mapId: 'aMap',
        properties: ['prop'],
        associations: [
            {name: 'b', mapId: 'bMap', columnPrefix: 'b_'}
        ]
    },
    {
        mapId: 'bMap',
        properties: ['prop'],
        associations: [
            {name: 'c', mapId: 'cMap', columnPrefix: 'c_'}
        ]
    },
    {
        mapId: 'cMap',
        properties: ['prop']
    },

    // one-to-one-to-many relationship
    // D ---> 1 E ---> * F
    {
        mapId: 'dMap',
        properties: ['prop'],
        associations: [
            {name: 'e', mapId: 'eMap', columnPrefix: 'e_'}
        ]
    },
    {
        mapId: 'eMap',
        properties: ['prop'],
        collections: [
            {name: 'fCollection', mapId: 'fMap', columnPrefix: 'f_'}
        ]
    },
    {
        mapId: 'fMap',
        properties: ['prop']
    },

    // one-to-many-to-one relationship
    // G ---> * H ---> 1 I
    {
        mapId: 'gMap',
        properties: ['prop'],
        collections: [
            {name: 'hCollection', mapId: 'hMap', columnPrefix: 'h_'}
        ]
    },
    {
        mapId: 'hMap',
        properties: ['prop'],
        associations: [
            {name: 'i', mapId: 'iMap', columnPrefix: 'i_'}
        ]
    },
    {
        mapId: 'iMap',
        properties: ['prop']
    },

    // one-to-many-to-many relationship
    // J ---> * K ---> * L
    {
        mapId: 'jMap',
        properties: ['prop'],
        collections: [
            {name: 'kCollection', mapId: 'kMap', columnPrefix: 'k_'}
        ]
    },
    {
        mapId: 'kMap',
        properties: ['prop'],
        collections: [
            {name: 'lCollection', mapId: 'lMap', columnPrefix: 'l_'}
        ]
    },
    {
        mapId: 'lMap',
        properties: ['prop']
    },

    // Two one-to-many relationships
    // M ---> * N
    // M ---> * O
    // M ---> * P
    {
        mapId: 'mMap',
        properties: ['prop'],
        collections: [
            {name: 'nCollection', mapId: 'nMap', columnPrefix: 'n_'},
            {name: 'oCollection', mapId: 'oMap', columnPrefix: 'o_'},
            {name: 'pCollection', mapId: 'pMap', columnPrefix: 'p_'},
        ]
    },
    {
        mapId: 'nMap',
        properties: ['prop']
    },
    {
        mapId: 'oMap',
        properties: ['prop']
    },
    {
        mapId: 'pMap',
        properties: ['prop']
    }
];

export default testMaps;
