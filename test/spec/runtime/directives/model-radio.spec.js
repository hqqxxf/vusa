/* eslint-disable no-undef */
import Vue from '../../../helpers/vue';

describe('Directive a-model radio', () => {
    it('should work', done => {
        const vm = new Vue({
            data: {
                test: '1',
            },
            template: `
                <div1>
                    <input type="radio" value="1" a-model="test" name="test">
                    <input type="radio" value="2" a-model="test" name="test">
                </div1>
            `,
        }).$mount();
        document.body.appendChild(vm.$el);
        expect(vm.$el.children[0].checked).toBe(true);
        expect(vm.$el.children[1].checked).toBe(false);
        vm.test = '2';
        waitForUpdate(() => {
            expect(vm.$el.children[0].checked).toBe(false);
            expect(vm.$el.children[1].checked).toBe(true);
            vm.$el.children[0].click();
            expect(vm.$el.children[0].checked).toBe(true);
            expect(vm.$el.children[1].checked).toBe(false);
            expect(vm.test).toBe('1');
        }).then(() => {
            document.body.removeChild(vm.$el);
        }).then(done);
    });

    // ATTENTION san 不区分number和string
    it('should respect value bindings', done => {
        const vm = new Vue({
            data: {
                test: 1,
            },
            template: `
                <div>
                    <input type="radio" :value="1" a-model="test" name="test">
                    <input type="radio" :value="2" a-model="test" name="test">
                </div>
            `,
        }).$mount();
        document.body.appendChild(vm.$el);
        expect(vm.$el.children[0].checked).toBe(true);
        expect(vm.$el.children[1].checked).toBe(false);
        vm.test = 2;
        waitForUpdate(() => {
            expect(vm.$el.children[0].checked).toBe(false);
            expect(vm.$el.children[1].checked).toBe(true);
            vm.$el.children[0].click();
            expect(vm.$el.children[0].checked).toBe(true);
            expect(vm.$el.children[1].checked).toBe(false);
            // expect(vm.test).toBe(1);
            expect(vm.test).toBe('1');
        }).then(() => {
            document.body.removeChild(vm.$el);
        }).then(done);
    });

    // TODO radio 不支持对象
    // it('should respect value bindings (object loose equal)', done => {
    //     const vm = new Vue({
    //         data: {
    //             test: {
    //                 a: 1,
    //             },
    //         },
    //         template: `
    //             <div>
    //                 <input type="radio" :value="{ a: 1 }" a-model="test" name="test">
    //                 <input type="radio" :value="{ a: 2 }" a-model="test" name="test">
    //             </div>
    //         `,
    //     }).$mount();
    //     document.body.appendChild(vm.$el);
    //     expect(vm.$el.children[0].checked).toBe(true);
    //     expect(vm.$el.children[1].checked).toBe(false);
    //     vm.test = {
    //         a: 2,
    //     };
    //     waitForUpdate(() => {
    //         expect(vm.$el.children[0].checked).toBe(false);
    //         expect(vm.$el.children[1].checked).toBe(true);
    //         vm.$el.children[0].click();
    //         expect(vm.$el.children[0].checked).toBe(true);
    //         expect(vm.$el.children[1].checked).toBe(false);
    //         expect(vm.test).toEqual({
    //             a: 1,
    //         });
    //     }).then(() => {
    //         document.body.removeChild(vm.$el);
    //     }).then(done);
    // });

    it('multiple radios ', done => {
        const spy = jasmine.createSpy();
        const vm = new Vue({
            data: {
                selections: ['a', '1'],
                radioList: [{
                    name: 'questionA',
                    data: ['a', 'b', 'c'],
                }, {
                    name: 'questionB',
                    data: ['1', '2'],
                }],
            },
            watch: {
                selections: spy,
            },
            template:
                '<div>'
                + '<div a-for="(radioGroup, idx) in radioList">'
                +     '<div>'
                +       '<span a-for="(item, index) in radioGroup.data">'
                +         '<input :name="radioGroup.name" type="radio" :value="item" a-model="selections[idx]" :id="idx"/>'
                +         '<label>{{item}}</label>'
                +       '</span>'
                +     '</div>'
                + '</div>'
                + '</div>',
        }).$mount();
        document.body.appendChild(vm.$el);
        var inputs = vm.$el.getElementsByTagName('input');
        inputs[1].click();
        waitForUpdate(() => {
            expect(vm.selections).toEqual(['b', '1']);
            expect(spy).toHaveBeenCalled();
        }).then(done);
    });

    // TODO 不支持.number
    // it('.number modifier', () => {
    //     const vm = new Vue({
    //         data: {
    //             test: 1,
    //         },
    //         template: `
    //             <div>
    //             <input type="radio" value="1" a-model="test" name="test">
    //             <input type="radio" value="2" a-model.number="test" name="test">
    //             </div>
    //         `,
    //     }).$mount();
    //     document.body.appendChild(vm.$el);
    //     expect(vm.$el.children[0].checked).toBe(true);
    //     expect(vm.$el.children[1].checked).toBe(false);
    //     vm.$el.children[1].click();
    //     expect(vm.$el.children[0].checked).toBe(false);
    //     expect(vm.$el.children[1].checked).toBe(true);
    //     expect(vm.test).toBe(2);
    // });

    it('should respect different primitive type value', done => {
        const vm = new Vue({
            data: {
                test: 1,
            },
            template:
                '<div>'
                + '<input type="radio" value="" a-model="test" name="test">'
                + '<input type="radio" value="0" a-model="test" name="test">'
                + '<input type="radio" value="1" a-model="test" name="test">'
                + '<input type="radio" value="false" a-model="test" name="test">'
                + '<input type="radio" value="true" a-model="test" name="test">'
                + '</div>',
        }).$mount();
        var radioboxInput = vm.$el.children;
        expect(radioboxInput[0].checked).toBe(false);
        expect(radioboxInput[1].checked).toBe(false);
        // expect(radioboxInput[2].checked).toBe(true);
        expect(radioboxInput[2].checked).toBe(false);
        expect(radioboxInput[3].checked).toBe(false);
        expect(radioboxInput[4].checked).toBe(false);
        vm.test = 0;
        waitForUpdate(() => {
            expect(radioboxInput[0].checked).toBe(false);
            // expect(radioboxInput[1].checked).toBe(true);
            expect(radioboxInput[1].checked).toBe(false);
            expect(radioboxInput[2].checked).toBe(false);
            expect(radioboxInput[3].checked).toBe(false);
            expect(radioboxInput[4].checked).toBe(false);
            vm.test = '';
        }).then(() => {
            expect(radioboxInput[0].checked).toBe(true);
            expect(radioboxInput[1].checked).toBe(false);
            expect(radioboxInput[2].checked).toBe(false);
            expect(radioboxInput[3].checked).toBe(false);
            expect(radioboxInput[4].checked).toBe(false);
            vm.test = false;
        }).then(() => {
            expect(radioboxInput[0].checked).toBe(false);
            expect(radioboxInput[1].checked).toBe(false);
            expect(radioboxInput[2].checked).toBe(false);
            // expect(radioboxInput[3].checked).toBe(true);
            expect(radioboxInput[3].checked).toBe(false);
            expect(radioboxInput[4].checked).toBe(false);
            vm.test = true;
        }).then(() => {
            expect(radioboxInput[0].checked).toBe(false);
            expect(radioboxInput[1].checked).toBe(false);
            expect(radioboxInput[2].checked).toBe(false);
            expect(radioboxInput[3].checked).toBe(false);
            // expect(radioboxInput[4].checked).toBe(true);
            expect(radioboxInput[4].checked).toBe(false);
        }).then(done);
    });

    // #4521
    it('should work with click event', done => {
        const vm = new Vue({
            data: {
                num: 1,
                checked: 1,
            },
            template:
                '<div @click="add">'
                + 'click {{ num }}<input name="test" type="radio" value="1" a-model="checked"/>'
                + '<input name="test" type="radio" value="2" a-model="checked"/>'
                + '</div>',
            methods: {
                add: function () {
                    this.num++;
                },
            },
        }).$mount();
        document.body.appendChild(vm.$el);
        const radios = vm.$el.getElementsByTagName('input');
        radios[0].click();
        waitForUpdate(() => {
            expect(radios[0].checked).toBe(true);
            expect(radios[1].checked).toBe(false);
            expect(vm.num).toBe(2);
            radios[0].click();
        }).then(() => {
            expect(radios[0].checked).toBe(true);
            expect(radios[1].checked).toBe(false);
            expect(vm.num).toBe(3);
            radios[1].click();
        }).then(() => {
            expect(radios[0].checked).toBe(false);
            expect(radios[1].checked).toBe(true);
            expect(vm.num).toBe(4);
        }).then(done);
    });

    it('should get updated with model when in focus', done => {
        const vm = new Vue({
            data: {
                a: '2',
            },
            template: '<input type="radio" value="1" a-model="a"/>',
        }).$mount();
        document.body.appendChild(vm.$el);
        vm.$el.click();
        waitForUpdate(() => {
            expect(vm.$el.checked).toBe(true);
            vm.a = 2;
        }).then(() => {
            expect(vm.$el.checked).toBe(false);
        }).then(done);
    });
});
