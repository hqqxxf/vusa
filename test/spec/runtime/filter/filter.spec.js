import Vue from '../../../helpers/vue';

describe('Filters', () => {
    it('basic usage', () => {
        const vm = new Vue({
            template: '<div>{{ msg | upper }}</div>',
            data: {
                msg: 'hi',
            },
            filters: {
                upper: v => v.toUpperCase(),
            },
        }).$mount();
        expect(vm.$el.textContent).toBe('HI');
    });

    it('chained usage', () => {
        const vm = new Vue({
            template: '<div>{{ msg | upper | reverse }}</div>',
            data: {
                msg: 'hi',
            },
            filters: {
                upper: v => v.toUpperCase(),
                reverse: v => v.split('').reverse().join(''),
            },
        }).$mount();
        expect(vm.$el.textContent).toBe('IH');
    });

    // FIXME：ref 不支持变量
    it('in v-bind', () => {
        const vm = new Vue({
            template: `
                <div
                v-bind:id="id | upper | reverse"
                :class="cls | reverse">
                </div>
            `,
            filters: {
                upper: v => v.toUpperCase(),
                reverse: v => v.split('').reverse().join(''),
            },
            data: {
                id: 'abc',
                cls: 'foo',
                ref: 'BAR',
            },
        }).$mount();
        expect(vm.$el.id).toBe('CBA');
        expect(vm.$el.className).toBe('oof');
    });

    it('handle division', () => {
        const vm = new Vue({
            data: {
                a: 2,
            },
            template: '<div>{{ 1/a / 4 | double }}</div>',
            filters: {
                double: v => v * 2,
            },
        }).$mount();
        expect(vm.$el.textContent).toBe(String(1 / 4));
    });

    it('handle division with parenthesis', () => {
        const vm = new Vue({
            data: {
                a: 20,
            },
            template: '<div>{{ (a*2) / 5 | double }}</div>',
            filters: {
                double: v => v * 2,
            },
        }).$mount();
        expect(vm.$el.textContent).toBe(String(16));
    });

    // FIXME：“20.” 在 san 编译时出错
    // it('handle division with dot', () => {
    //     const vm = new Vue({
    //         template: '<div>{{ 20. / 5 | double }}</div>',
    //         filters: {
    //             double: v => v * 2,
    //         },
    //     }).$mount();
    //     expect(vm.$el.textContent).toBe(String(8));
    // });

    it('handle division with array values', () => {
        const vm = new Vue({
            data: {
                a: [20],
            },
            template: '<div>{{ a[0] / 5 | double }}</div>',
            filters: {
                double: v => v * 2,
            },
        }).$mount();
        expect(vm.$el.textContent).toBe(String(8));
    });

    it('handle division with hash values', () => {
        const vm = new Vue({
            data: {
                a: {
                    n: 20,
                },
            },
            template: '<div>{{ a[\'n\'] / 5 | double }}</div>',
            filters: {
                double: v => v * 2,
            },
        }).$mount();
        expect(vm.$el.textContent).toBe(String(8));
    });

    it('handle division with variable_', () => {
        const vm = new Vue({
            data: {
                a_: 8
            },
            template: '<div>{{ a_ / 2 | double }}</div>',
            filters: {double: v => v * 2},
        }).$mount();
        expect(vm.$el.textContent).toBe(String(8));
    });

    it('arguments', () => {
        const vm = new Vue({
            template: '<div>{{ msg | add(a, 3) }}</div>',
            data: {
                msg: 1,
                a: 2,
            },
            filters: {
                add: (v, arg1, arg2) => v + arg1 + arg2,
            },
        }).$mount();
        expect(vm.$el.textContent).toBe('6');
    });

    it('quotes', () => {
        const vm = new Vue({
            template: '<div>{{ msg + "b | c" + \'d\' | upper }}</div>',
            data: {
                msg: 'a',
            },
            filters: {
                upper: v => v.toUpperCase(),
            },
        }).$mount();
        expect(vm.$el.textContent).toBe('AB | CD');
    });

    it('double pipe', () => {
        const vm = new Vue({
            template: '<div>{{ b || msg | upper }}</div>',
            data: {
                b: false,
                msg: 'a',
            },
            filters: {
                upper: v => v.toUpperCase(),
            },
        }).$mount();
        expect(vm.$el.textContent).toBe('A');
    });
    it('object literal', () => {
        const vm = new Vue({
            template: '<div>{{ { a: 123 } | pick(\'a\') }}</div>',
            filters: {
                pick: (v, key) => v[key],
            },
        }).$mount();
        expect(vm.$el.textContent).toBe('123');
    });

    it('array literal', () => {
        const vm = new Vue({
            template: '<div>{{ [1, 2, 3] | reverse }}</div>',
            filters: {
                reverse: arr => arr.reverse().join(','),
            },
        }).$mount();
        expect(vm.$el.textContent).toBe('3,2,1');
    });

    //   it('warn non-existent', () => {
    //     new Vue({
    //       template: '<div>{{ msg | reverse }}</div>',
    //       data: { msg: 'foo' }
    //     }).$mount()
    //     expect('Failed to resolve filter: reverse').toHaveBeenWarned()
    //   })
    //   it('support template string', () => {
    //     expect(parseFilters('`a | ${b}c` | d')).toBe('_f("d")(`a | ${b}c`)')
    //   })

    // FIXME: text combine
    // it('build in filters', () => {
    //     const vm = new Vue({
    //         template: `
    //             <div :data-lo="'AB' | lower" :data-up="'ab' | upper">
    //                 {{ {a: 1} | json }}
    //             </div>
    //         `,
    //     }).$mount();
    //     expect(vm.$el.textContent.trim()).toBe('{"a":1}');
    //     expect(vm.$el.getAttribute('data-lo')).toBe('ab');
    //     expect(vm.$el.getAttribute('data-up')).toBe('AB');
    // });
});
