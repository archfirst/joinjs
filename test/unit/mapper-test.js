/* jshint camelcase: false */

import joinjs from '../../src';
import domainMaps from '../maps/domain-maps';
import testMaps from '../maps/test-maps';

describe('Mapper', () => {
    it('should work when idProperty is not specified', () => {
        let resultSet = [
            {
                id: 1234,
                name: 'Elvis Presley'
            }
        ];

        var mappedResult = joinjs.mapOne(resultSet, testMaps, 'noIdProperty');

        expect(mappedResult).to.deep.equal(resultSet[0]);
    });

    it('should work when idProperty is specified', () => {
        let resultSet = [
            {
                symbol: 'AAPL',
                name: 'Apple Inc.'
            }
        ];

        var mappedResult = joinjs.mapOne(resultSet, testMaps, 'withIdProperty');

        expect(mappedResult).to.deep.equal(resultSet[0]);
    });

    it('should work when column name is specified', () => {
        let resultSet = [
            {
                object_id: 1234,
                first_name: 'Elvis'
            }
        ];

        let expectedResult = {
            id: 1234,
            firstName: 'Elvis'
        };

        var mappedResult = joinjs.mapOne(resultSet, testMaps, 'withColumnSpecification');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work when properties are not specified', () => {
        let resultSet = [
            {
                id: 1234
            }
        ];

        var mappedResult = joinjs.mapOne(resultSet, testMaps, 'noProperties');

        expect(mappedResult).to.deep.equal(resultSet[0]);
    });

    it('should work when columnPrefix is specified', () => {
        let resultSet = [
            {
                user_id: 1234,
                user_name: 'Elvis Presley'
            }
        ];

        let expectedResult = {
            id: 1234,
            name: 'Elvis Presley'
        };

        var mappedResult = joinjs.mapOne(resultSet, testMaps, 'noIdProperty', 'user_');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work when custom constructor is specified', () => {
        let resultSet = [
            {
                id: 1234,
                uid: 'epresley',
                first_name: 'Elvis',
                last_name: 'Presley'
            }
        ];

        let expectedResult = {
            id: 1234,
            uid: 'epresley',
            firstName: 'Elvis',
            lastName: 'Presley'
        };

        var mappedResult = joinjs.mapOne(resultSet, domainMaps, 'userMap');

        expect(mappedResult).to.deep.equal(expectedResult);
        expect(mappedResult.getFullName()).to.equal('Elvis Presley');
    });

    it('should throw a NotFoundError when mapOne() does not find an object', () => {

        let fn = function() {
            joinjs.mapOne([], domainMaps, 'userMap');
        };

        expect(fn).to.throw(joinjs.NotFoundError);
    });

    it('should not throw an Error when mapOne() does not find an object, but isRequired is set to false', () => {

        var mappedResult = joinjs.mapOne([], domainMaps, 'userMap', '', false);

        assert.isNull(mappedResult);
    });

    it('should work when resultSet contains multiple top-level objects', () => {
        let resultSet = [
            {
                security_symbol: 'AAPL',
                security_name: 'Apple Inc.',
                country_code: 'US',
                country_name: 'United States of America'
            },
            {
                security_symbol: 'ACE',
                security_name: 'Ace Ltd',
                country_code: 'SZ',
                country_name: 'Switzerland'
            }
        ];

        let expectedResult = [
            {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                country: {
                    code: 'US',
                    name: 'United States of America'
                }
            },
            {
                symbol: 'ACE',
                name: 'Ace Ltd',
                country: {
                    code: 'SZ',
                    name: 'Switzerland'
                }
            }
        ];

        var mappedResult = joinjs.map(resultSet, domainMaps, 'securityMap', 'security_');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work for one-to-one relationships', () => {
        let resultSet = [
            {
                security_symbol: 'AAPL',
                security_name: 'Apple Inc.',
                country_code: 'US',
                country_name: 'United States of America'
            }
        ];

        let expectedResult = {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            country: {
                code: 'US',
                name: 'United States of America'
            }
        };

        var mappedResult = joinjs.mapOne(resultSet, domainMaps, 'securityMap', 'security_');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work for multiple one-to-one relationships with same target entity', () => {
        let resultSet = [
            {
                id: 102,
                name: 'Prince William',
                father_id: 100,
                father_name: 'Prince Charles',
                mother_id: 101,
                mother_name: 'Princess Diana'
            },
            {
                id: 104,
                name: 'Prince George',
                father_id: 102,
                father_name: 'Prince William',
                mother_id: 103,
                mother_name: 'Kate'
            }
        ];

        let expectedResult = [
            {
                id: 102,
                name: 'Prince William',
                father: {
                    id: 100,
                    name: 'Prince Charles'
                },
                mother: {
                    id: 101,
                    name: 'Princess Diana'
                }
            },
            {
                id: 104,
                name: 'Prince George',
                father: {
                    id: 102,
                    name: 'Prince William'
                },
                mother: {
                    id: 103,
                    name: 'Kate'
                }
            }
        ];

        var mappedResult = joinjs.map(resultSet, testMaps, 'personMap');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work for one-to-many relationships', () => {
        let resultSet = [
            { customer_id: 100, customer_name: 'Elvis Presley', order_id: 1000, order_total: 100 },
            { customer_id: 100, customer_name: 'Elvis Presley', order_id: 2000, order_total: 200 },
            { customer_id: 101, customer_name: 'John Lennon',   order_id: 3000, order_total: 300 },
            { customer_id: 101, customer_name: 'John Lennon',   order_id: 4000, order_total: 400 }
        ];

        let expectedResult = [
            {
                id: 100,
                name: 'Elvis Presley',
                orders: [
                    { id: 1000, total: 100 },
                    { id: 2000, total: 200 }
                ]
            },
            {
                id: 101,
                name: 'John Lennon',
                orders: [
                    { id: 3000, total: 300 },
                    { id: 4000, total: 400 }
                ]
            }
        ];

        var mappedResult = joinjs.map(resultSet, testMaps, 'customerMap', 'customer_');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work for one-to-one relationships where the target entity is null', () => {
        let resultSet = [
            {
                security_symbol: 'AAPL',
                security_name: 'Apple Inc.',
                country_code: null,
                country_name: null
            }
        ];

        let expectedResult = {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            country: null
        };

        var mappedResult = joinjs.mapOne(resultSet, domainMaps, 'securityMap', 'security_');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work for one-to-many relationships where the target entity is null', () => {
        let resultSet = [
            { customer_id: 100, customer_name: 'Elvis Presley', order_id: 1000, order_total: 100 },
            { customer_id: 100, customer_name: 'Elvis Presley', order_id: 2000, order_total: 200 },
            { customer_id: 101, customer_name: 'John Lennon',   order_id: null, order_total: null }
        ];

        let expectedResult = [
            {
                id: 100,
                name: 'Elvis Presley',
                orders: [
                    { id: 1000, total: 100 },
                    { id: 2000, total: 200 }
                ]
            },
            {
                id: 101,
                name: 'John Lennon',
                orders: [
                ]
            }
        ];

        var mappedResult = joinjs.map(resultSet, testMaps, 'customerMap', 'customer_');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work for one-to-one-to-one relationships', () => {
        let resultSet = [
            { a_id: 1, a_prop: 10, b_id: 11, b_prop: 110, c_id: 111, c_prop: 1110 },
            { a_id: 2, a_prop: 20, b_id: 21, b_prop: 210, c_id: 211, c_prop: 2110 }
        ];

        let expectedResult = [
            {
                id: 1,
                prop: 10,
                b: {
                    id: 11,
                    prop: 110,
                    c: {
                        id: 111,
                        prop: 1110
                    }
                }
            },
            {
                id: 2,
                prop: 20,
                b: {
                    id: 21,
                    prop: 210,
                    c: {
                        id: 211,
                        prop: 2110
                    }
                }
            }
        ];

        var mappedResult = joinjs.map(resultSet, testMaps, 'aMap', 'a_');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work for one-to-one-to-many relationships', () => {
        let resultSet = [
            { d_id: 1, d_prop: 10, e_id: 11, e_prop: 110, f_id: 111, f_prop: 1110 },
            { d_id: 1, d_prop: 10, e_id: 11, e_prop: 110, f_id: 112, f_prop: 1120 },
            { d_id: 2, d_prop: 20, e_id: 21, e_prop: 210, f_id: 211, f_prop: 2110 },
            { d_id: 2, d_prop: 20, e_id: 21, e_prop: 210, f_id: 212, f_prop: 2120 }
        ];

        let expectedResult = [
            {
                id: 1,
                prop: 10,
                e: {
                    id: 11,
                    prop: 110,
                    fCollection: [
                        {
                            id: 111,
                            prop: 1110
                        },
                        {
                            id: 112,
                            prop: 1120
                        }
                    ]
                }
            },
            {
                id: 2,
                prop: 20,
                e: {
                    id: 21,
                    prop: 210,
                    fCollection: [
                        {
                            id: 211,
                            prop: 2110
                        },
                        {
                            id: 212,
                            prop: 2120
                        }
                    ]
                }
            }
        ];

        var mappedResult = joinjs.map(resultSet, testMaps, 'dMap', 'd_');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work for one-to-many-to-one relationships', () => {
        let resultSet = [
            { g_id: 1, g_prop: 10, h_id: 11, h_prop: 110, i_id: 111, i_prop: 1110 },
            { g_id: 1, g_prop: 10, h_id: 12, h_prop: 120, i_id: 121, i_prop: 1210 },
            { g_id: 2, g_prop: 20, h_id: 21, h_prop: 210, i_id: 211, i_prop: 2110 },
            { g_id: 2, g_prop: 20, h_id: 22, h_prop: 220, i_id: 221, i_prop: 2210 }
        ];

        let expectedResult = [
            {
                id: 1,
                prop: 10,
                hCollection: [
                    {
                        id: 11,
                        prop: 110,
                        i: {
                            id: 111,
                            prop: 1110
                        }
                    },
                    {
                        id: 12,
                        prop: 120,
                        i: {
                            id: 121,
                            prop: 1210
                        }
                    }
                ]
            },
            {
                id: 2,
                prop: 20,
                hCollection: [
                    {
                        id: 21,
                        prop: 210,
                        i: {
                            id: 211,
                            prop: 2110
                        }
                    },
                    {
                        id: 22,
                        prop: 220,
                        i: {
                            id: 221,
                            prop: 2210
                        }
                    }
                ]
            }
        ];

        var mappedResult = joinjs.map(resultSet, testMaps, 'gMap', 'g_');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work for one-to-many-to-many relationships', () => {
        let resultSet = [
            { j_id: 1, j_prop: 10, k_id: 11, k_prop: 110, l_id: 111, l_prop: 1110 },
            { j_id: 1, j_prop: 10, k_id: 11, k_prop: 110, l_id: 112, l_prop: 1120 },
            { j_id: 1, j_prop: 10, k_id: 12, k_prop: 120, l_id: 121, l_prop: 1210 },
            { j_id: 1, j_prop: 10, k_id: 12, k_prop: 120, l_id: 122, l_prop: 1220 },
            { j_id: 2, j_prop: 20, k_id: 21, k_prop: 210, l_id: 211, l_prop: 2110 },
            { j_id: 2, j_prop: 20, k_id: 21, k_prop: 210, l_id: 212, l_prop: 2120 },
            { j_id: 2, j_prop: 20, k_id: 22, k_prop: 220, l_id: 221, l_prop: 2210 },
            { j_id: 2, j_prop: 20, k_id: 22, k_prop: 220, l_id: 222, l_prop: 2220 }
        ];

        let expectedResult = [
            {
                id: 1,
                prop: 10,
                kCollection: [
                    {
                        id: 11,
                        prop: 110,
                        lCollection: [
                            {
                                id: 111,
                                prop: 1110
                            },
                            {
                                id: 112,
                                prop: 1120
                            }
                        ]
                    },
                    {
                        id: 12,
                        prop: 120,
                        lCollection: [
                            {
                                id: 121,
                                prop: 1210
                            },
                            {
                                id: 122,
                                prop: 1220
                            }
                        ]
                    }
                ]
            },
            {
                id: 2,
                prop: 20,
                kCollection: [
                    {
                        id: 21,
                        prop: 210,
                        lCollection: [
                            {
                                id: 211,
                                prop: 2110
                            },
                            {
                                id: 212,
                                prop: 2120
                            }
                        ]
                    },
                    {
                        id: 22,
                        prop: 220,
                        lCollection: [
                            {
                                id: 221,
                                prop: 2210
                            },
                            {
                                id: 222,
                                prop: 2220
                            }
                        ]
                    }
                ]
            }
        ];

        var mappedResult = joinjs.map(resultSet, testMaps, 'jMap', 'j_');

        expect(mappedResult).to.deep.equal(expectedResult);
    });

    it('should work for multiple one-to-many relationships', () => {
        let resultSet = [
            { m_id: 1, m_prop: 10, n_id: 11, n_prop: 110, o_id: 21, o_prop: 210, p_id: null, p_prop: null },
            { m_id: 1, m_prop: 10, n_id: 11, n_prop: 110, o_id: 22, o_prop: 220, p_id: null, p_prop: null },
            { m_id: 1, m_prop: 10, n_id: 12, n_prop: 120, o_id: 21, o_prop: 210, p_id: null, p_prop: null },
            { m_id: 1, m_prop: 10, n_id: 12, n_prop: 120, o_id: 22, o_prop: 220, p_id: null, p_prop: null }
        ];

        let expectedResult = [
            {
                id: 1,
                prop: 10,
                nCollection: [
                    { id: 11, prop: 110 },
                    { id: 12, prop: 120 }
                ],
                oCollection: [
                    { id: 21, prop: 210 },
                    { id: 22, prop: 220 }
                ],
                pCollection: [
                ]
            }
        ];

        var mappedResult = joinjs.map(resultSet, testMaps, 'mMap', 'm_');

        expect(mappedResult).to.deep.equal(expectedResult);
    });
});
