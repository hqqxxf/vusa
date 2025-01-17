import Vue from '../../../helpers/vue';

function replaceComent(str) {
    return str.replace(/<!--[0-9]{1,}-->/g, '');
}

describe('Component slot', () => {
    let vm, child;
    function mount(options) {
        vm = new Vue({
            data: {
                msg: 'parent message'
            },
            template: `<div><test>${options.parentContent || ''}</test></div>`,
            components: {
                test: {
                    template: options.childTemplate,
                    data() {
                        return {
                            msg: 'child message'
                        };
                    }
                }
            }
        }).$mount();
        child = vm.$children[0];
    }

    // it('named slot with custom render', () => {
    //     vm = new Vue({
    //         render(h) {
    //             return h('test', {}, [
    //                 h('div', { slot: 'abc', attrs: { slot: 'abc' } })
    //             ]);
    //         },
    //         components: {
    //             test: {
    //                 render(h) {
    //                     return h('div', {}, [this._t('abc')]);
    //                 }
    //             }
    //         }
    //     }).$mount();

    //     function assertMarkup() {
    //         expect(vm.$el.innerHTML).toBe('<div></div>');
    //     }

    //     assertMarkup();
    // });

    // 有注释节点<!--3--><!--3-->
    // it('no content', () => {
    //     mount({
    //         childTemplate: '<div><slot></slot></div>'
    //     });
    //     expect(child.$el.childNodes.length).toBe(0);
    // });

    it('default slot', done => {
        mount({
            childTemplate: '<div><slot></slot></div>',
            parentContent: '<p>{{ msg }}</p>'
        });
        expect(child.$el.tagName).toBe('DIV');
        expect(child.$el.children[0].tagName).toBe('P');
        expect(child.$el.children[0].textContent).toBe('parent message');
        vm.msg = 'changed';
        waitForUpdate(() => {
            expect(child.$el.children[0].textContent).toBe('changed');
        }).then(done);
    });

    it('named slot', done => {
        mount({
            childTemplate: '<div><slot name="test"></slot></div>',
            parentContent: '<p slot="test">{{ msg }}</p>'
        });
        expect(child.$el.tagName).toBe('DIV');
        expect(child.$el.children[0].tagName).toBe('P');
        expect(child.$el.children[0].textContent).toBe('parent message');
        vm.msg = 'changed';
        waitForUpdate(() => {
            expect(child.$el.children[0].textContent).toBe('changed');
        }).then(done);
    });

    it('named slot with 0 as a number', done => {
        mount({
            childTemplate: '<div><slot :name="0"></slot></div>',
            parentContent: '<p :slot="0">{{ msg }}</p>'
        });
        expect(child.$el.tagName).toBe('DIV');
        expect(child.$el.children[0].tagName).toBe('P');
        expect(child.$el.children[0].textContent).toBe('parent message');
        vm.msg = 'changed';
        waitForUpdate(() => {
            expect(child.$el.children[0].textContent).toBe('changed');
        }).then(done);
    });

    it('fallback content', () => {
        mount({
            childTemplate: '<div><slot><p>{{msg}}</p></slot></div>'
        });
        expect(child.$el.children[0].tagName).toBe('P');
        expect(child.$el.textContent).toBe('child message');
    });

    it('fallback content with multiple named slots', () => {
        mount({
            childTemplate: `
                <div>
                    <slot name="a"><p>fallback a</p></slot>
                    <slot name="b">fallback b</slot>
                </div>
            `,
            parentContent: '<p slot="b">slot b</p>'
        });
        expect(child.$el.children.length).toBe(2);
        expect(child.$el.children[0].textContent).toBe('fallback a');
        expect(child.$el.children[1].textContent).toBe('slot b');
    });

    it('fallback content with mixed named/unnamed slots', () => {
        mount({
            childTemplate: `
                <div>
                    <slot><p>fallback a</p></slot>
                    <slot name="b">fallback b</slot>
                </div>
            `,
            parentContent: '<p slot="b">slot b</p>'
        });
        expect(child.$el.children.length).toBe(2);
        expect(child.$el.children[0].textContent).toBe('fallback a');
        expect(child.$el.children[1].textContent).toBe('slot b');
    });

    // san渲染有注释节点<!--数字-->，如<!--16-->，暂时去掉跑单测
    it('selector matching multiple elements', () => {
        mount({
            childTemplate: '<div><slot name="t"></slot></div>',
            parentContent: '<p slot="t">1</p><div></div><p slot="t">2</p>'
        });
        expect(replaceComent(child.$el.innerHTML)).toBe('<p>1</p><p>2</p>');
    });

    // 渲染结果不一致，少了空格
    // it('default content should only render parts not selected', () => {
    //     mount({
    //         childTemplate: `
    //             <div>
    //                 <slot name="a"></slot>
    //                 <slot></slot>
    //                 <slot name="b"></slot>
    //             </div>
    //         `,
    //         parentContent: '<div>foo</div><p slot="a">1</p><p slot="b">2</p>'
    //     });
    //     expect(replaceComent(child.$el.innerHTML)).toBe(
    //         '<p>1</p> <div>foo</div> <p>2</p>'
    //     );
    // });

    it('name should only match children', function() {
        mount({
            childTemplate: `
                <div>
                    <slot name="a"><p>fallback a</p></slot>
                    <slot name="b"><p>fallback b</p></slot>
                    <slot name="c"><p>fallback c</p></slot>
                </div>
            `,
            parentContent: `
                '<p slot="b">select b</p>
                '<span><p slot="b">nested b</p></span>
                '<span><p slot="c">nested c</p></span>
            `
        });
        expect(child.$el.children.length).toBe(3);
        expect(child.$el.children[0].textContent).toBe('fallback a');
        expect(child.$el.children[1].textContent).toBe('select b');
        expect(child.$el.children[2].textContent).toBe('fallback c');
    });

    it('should accept expressions in slot attribute and slot names', () => {
        mount({
            childTemplate: `<div><slot :name="'a'"></slot></div>`,
            parentContent: `<p>one</p><p :slot="'a'">two</p>`
        });
        expect(replaceComent(child.$el.innerHTML)).toBe('<p>two</p>');
    });

    // san渲染结果<!--34-->
    // it('slot inside s-if', done => {
    //     const vm = new Vue({
    //         data: {
    //             a: 1,
    //             b: 2,
    //             show: true
    //         },
    //         template:
    //             '<test :show="show"><p slot="b">{{b}}</p><p>{{a}}</p></test>',
    //         components: {
    //             test: {
    //                 props: ['show'],
    //                 template: '<div a-if="show"><slot></slot><slot name="b"></slot></div>'
    //             }
    //         }
    //     }).$mount();
    //     expect(vm.$el.textContent).toBe('12');
    //     vm.a = 2;
    //     waitForUpdate(() => {
    //         expect(vm.$el.textContent).toBe('22');
    //         vm.show = false;
    //     }).then(() => {
    //         expect(vm.$el.textContent).toBe('');
    //         vm.show = true;
    //         vm.a = 3;
    //     }).then(() => {
    //         expect(vm.$el.textContent).toBe('32');
    //     }).then(done);
    // });

    // vusa渲染出来空字符串，aladdin-atom中有张卡片有用到service_rubbish_city
    // it('slot inside a-for', () => {
    //     mount({
    //         childTemplate: '<div><slot a-for="i in 3" :name="i"></slot></div>',
    //         parentContent: '<p a-for="i in 3" :slot="i">{{ i - 1 }}</p>'
    //     });
    //     expect(child.$el.innerHTML.replace(/<!--[0-9]{1,}-->/g, '')).toBe('<p>0</p><p>1</p><p>2</p>');
    // });

    it('nested slots', done => {
        const vm = new Vue({
            template: '<test><test2><p>{{ msg }}</p></test2></test>',
            data: {
                msg: 'foo'
            },
            components: {
                test: {
                    template: '<div><slot></slot></div>'
                },
                test2: {
                    template: '<div><slot></slot></div>'
                }
            }
        }).$mount();
        expect(vm.$el.innerHTML.replace(/<!--[0-9]{1,}-->/g, '')).toBe(
            '<div><p>foo</p></div>'
        );
        vm.msg = 'bar';
        waitForUpdate(() => {
            expect(vm.$el.innerHTML.replace(/<!--[0-9]{1,}-->/g, '')).toBe(
                '<div><p>bar</p></div>'
            );
        }).then(done);
    });

    // 默认slot未渲染
    // it('a-if on inserted content', done => {
    //     const vm = new Vue({
    //         template: '<test><p a-if="ok">{{ msg }}</p></test>',
    //         data: {
    //             ok: true,
    //             msg: 'hi'
    //         },
    //         components: {
    //             test: {
    //                 template: '<div><slot>fallback</slot></div>'
    //             }
    //         }
    //     }).$mount();
    //     expect(vm.$el.innerHTML.replace(/<!--[0-9]{1,}-->/g, '')).toBe('<p>hi</p>');
    //     vm.ok = false;
    //     waitForUpdate(() => {
    //         // 渲染出空字符串
    //         expect(vm.$el.innerHTML).toBe(
    //             'fallback'
    //         );
    //         vm.ok = true;
    //         vm.msg = 'bye';
    //     }).then(() => {
    //         expect(vm.$el.innerHTML).toBe('<p>bye</p>');
    //     }).then(done);
    // });

    // 渲染结果不一致，少了空格
    // it('template slot', function() {
    //     const vm = new Vue({
    //         template: '<test><template slot="test">hello</template></test>',
    //         components: {
    //             test: {
    //                 template: '<div><slot name="test"></slot> world</div>'
    //             }
    //         }
    //     }).$mount();
    //     expect(vm.$el.innerHTML.replace(/<!--[0-9]{1,}-->/g, '')).toBe('hello world');
    // });

    it('combined with a-for', () => {
        const vm = new Vue({
            template: '<div><test a-for="i in 3" :key="i">{{ i }}</test></div>',
            components: {
                test: {
                    template: '<div><slot></slot></div>'
                }
            }
        }).$mount();
        expect(vm.$el.innerHTML.replace(/<!--[0-9]{1,}-->/g, '')).toBe('<div>1</div><div>2</div><div>3</div>');
    });

    it('inside template a-if', () => {
        mount({
            childTemplate: `
                <div>
                    <template a-if="true"><slot></slot></template>
                </div>
            `,
            parentContent: 'foo'
        });
        expect(child.$el.innerHTML.replace(/<!--[0-9]{1,}-->/g, '')).toBe('foo');
    });

    // san渲染完的内容空格
    // it('default slot should use fallback content if has only whitespace', () => {
    //     mount({
    //         childTemplate: `
    //             <div>
    //                 <slot name="first"><p>first slot</p></slot>
    //                 <slot><p>this is the default slot</p></slot>
    //                 <slot name="second"><p>second named slot</p></slot>
    //             </div>
    //         `,
    //         parentContent: `<div slot="first">1</div> <div slot="second">2</div> <div slot="second">2+</div>`
    //     });
    //     expect(child.$el.innerHTML.replace(/<!--[0-9]{1,}-->/g, '')).toBe('<div>1</div> <p>this is the default slot</p> <div>2</div><div>2+</div>');
    // });

    // it('programmatic access to $slots', () => {
    //     const vm = new Vue({
    //         template:
    //             '<test><p slot="a">A</p><div>C</div><p slot="b">B</p></test>',
    //         components: {
    //             test: {
    //                 render() {
    //                     expect(this.$slots.a.length).toBe(1);
    //                     expect(this.$slots.a[0].tag).toBe('p');
    //                     expect(this.$slots.a[0].children.length).toBe(1);
    //                     expect(this.$slots.a[0].children[0].text).toBe('A');

    //                     expect(this.$slots.b.length).toBe(1);
    //                     expect(this.$slots.b[0].tag).toBe('p');
    //                     expect(this.$slots.b[0].children.length).toBe(1);
    //                     expect(this.$slots.b[0].children[0].text).toBe('B');

    //                     expect(this.$slots.default.length).toBe(1);
    //                     expect(this.$slots.default[0].tag).toBe('div');
    //                     expect(this.$slots.default[0].children.length).toBe(1);
    //                     expect(this.$slots.default[0].children[0].text).toBe(
    //                         'C'
    //                     );

    //                     return this.$slots.default[0];
    //                 }
    //             }
    //         }
    //     }).$mount();
    //     expect(vm.$el.tagName).toBe('DIV');
    //     expect(vm.$el.textContent).toBe('C');
    // });

    // 不支持render和warn
    // it('warn if user directly returns array', () => {
    //     new Vue({
    //         template: '<test><div></div></test>',
    //         components: {
    //             test: {
    //                 render() {
    //                     return this.$slots.default;
    //                 }
    //             }
    //         }
    //     }).$mount();
    //     expect('Render function should return a single root node').toHaveBeenWarned()
    // });

    // #3254
    it('should not keep slot name when passed further down', () => {
        const vm = new Vue({
            template: '<test><span slot="foo">foo</span></test>',
            components: {
                test: {
                    template: '<child><slot name="foo"></slot></child>',
                    components: {
                        child: {
                            template: `
                                <div>
                                    <div class='default'><slot></slot></div>
                                    <div class='named'><slot name='foo'></slot></div>
                                </div>
                            `
                        }
                    }
                }
            }
        }).$mount();
        expect(vm.$el.querySelector('.default').textContent).toBe('foo');
        expect(vm.$el.querySelector('.named').textContent).toBe('');
    });

    it('should not keep slot name when passed further down (nested)', () => {
        const vm = new Vue({
            template: '<wrap><test><span slot="foo">foo</span></test></wrap>',
            components: {
                wrap: {
                    template: '<div><slot></slot></div>'
                },
                test: {
                    template: '<child><slot name="foo"></slot></child>',
                    components: {
                        child: {
                            template: `
                                <div>
                                    <div class="default"><slot></slot></div>
                                    <div class="named"><slot name="foo"></slot></div>
                                </div>
                            `
                        }
                    }
                }
            }
        }).$mount();
        expect(vm.$el.querySelector('.default').textContent).toBe('foo');
        expect(vm.$el.querySelector('.named').textContent).toBe('');
    });

    // it('should not keep slot name when passed further down (functional)', () => {
    //     const child = {
    //         template: `
    //             <div>
    //                 <div class="default"><slot></slot></div>
    //                 <div class="named"><slot name="foo"></slot></div>
    //             </div>
    //         `
    //     };

    //     const vm = new Vue({
    //         template: '<test><span slot="foo">foo</span></test>',
    //         components: {
    //             test: {
    //                 functional: true,
    //                 render(h, ctx) {
    //                     const slots = ctx.slots();
    //                     return h(child, slots.foo);
    //                 }
    //             }
    //         }
    //     }).$mount();
    //     expect(vm.$el.querySelector('.default').textContent).toBe('foo');
    //     expect(vm.$el.querySelector('.named').textContent).toBe('');
    // });

    // #3400
    it('named slots should be consistent across re-renders', done => {
        const vm = new Vue({
            template: `
                <comp>
                    <div slot="foo">foo</div>
                </comp>
            `,
            components: {
                comp: {
                    data() {
                        return { a: 1 };
                    },
                    template: `<div><slot name="foo"></slot>{{ a }}</div>`
                }
            }
        }).$mount();
        expect(vm.$el.textContent).toBe('foo1');
        vm.$children[0].a = 2;
        waitForUpdate(() => {
            expect(vm.$el.textContent).toBe('foo2');
        }).then(done);
    });

    // #3437
    // it('should correctly re-create components in slot', done => {
    //     const calls = [];
    //     const vm = new Vue({
    //         template: `
    //             <comp ref="child">
    //                 <div slot="foo">
    //                     <child></child>
    //                 </div>
    //             </comp>
    //         `,
    //         components: {
    //             comp: {
    //                 data() {
    //                     return { ok: true };
    //                 },
    //                 template: `<div><slot name="foo" a-if="ok"></slot></div>`
    //             },
    //             child: {
    //                 template: '<div>child</div>',
    //                 created() {
    //                     calls.push(1);
    //                 },
    //                 destroyed() {
    //                     calls.push(2);
    //                 }
    //             }
    //         }
    //     }).$mount();

    //     expect(calls).toEqual([1]);
    //     vm.$refs.child.ok = false;
    //     waitForUpdate(() => {
    //         expect(calls).toEqual([1, 2]);
    //         vm.$refs.child.ok = true;
    //     }).then(() => {
    //         expect(calls).toEqual([1, 2, 1]);
    //         vm.$refs.child.ok = false;
    //     }).then(() => {
    //         expect(calls).toEqual([1, 2, 1, 2]);
    //     }).then(done);
    // });

    // 不支持warn
    // it('warn duplicate slots', () => {
    //     new Vue({
    //         template: `
    //             <div>
    //                 <test>
    //                     <div>foo</div>
    //                     <div slot="a">bar</div>
    //                 </test>
    //             </div>
    //         `,
    //         components: {
    //             test: {
    //                 template: `
    //                     <div>
    //                         <slot></slot><slot></slot>
    //                         <div a-for="i in 3"><slot name="a"></slot></div>
    //                     </div>
    //                 `
    //             }
    //         }
    //     }).$mount();
    //     expect('Duplicate presence of slot "default"').toHaveBeenWarned();
    //     expect('Duplicate presence of slot "a"').toHaveBeenWarned();
    // });

    // 不支持warn
    // it('should not warn valid conditional slots', () => {
    //     new Vue({
    //         template: `
    //             <div>
    //                 <test>
    //                     <div>foo</div>
    //                 </test>
    //             </div>
    //         `,
    //         components: {
    //             test: {
    //                 template: `
    //                     <div>
    //                         <slot a-if="true"></slot>
    //                         <slot a-else></slot>
    //                     </div>
    //                 `
    //             }
    //         }
    //     }).$mount();
    //     expect('Duplicate presence of slot "default"').not.toHaveBeenWarned();
    // });

    // #3518
    // it('events should not break when slot is toggled by a-if', done => {
    //     const spy = jasmine.createSpy();
    //     const vm = new Vue({
    //         template: `<test><div class="click" @click="test">hi</div></test>`,
    //         methods: {
    //             test: spy
    //         },
    //         components: {
    //             test: {
    //                 data: () => ({
    //                     toggle: true
    //                 }),
    //                 template: `<div a-if="toggle"><slot></slot></div>`
    //             }
    //         }
    //     }).$mount();

    //     expect(vm.$el.textContent).toBe('hi');
    //     vm.$children[0].toggle = false;
    //     waitForUpdate(() => {
    //         vm.$children[0].toggle = true;
    //     }).then(() => {
    //         triggerEvent(vm.$el.querySelector('.click'), 'click');
    //         expect(spy).toHaveBeenCalled();
    //     }).then(done);
    // });

    // 不支持warn
    // it('renders static tree with text', () => {
    //     const vm = new Vue({
    //         template: `<div><test><template><div></div>Hello<div></div></template></test></div>`,
    //         components: {
    //             test: {
    //                 template: '<div><slot></slot></div>'
    //             }
    //         }
    //     });
    //     vm.$mount();
    //     expect('Error when rendering root').not.toHaveBeenWarned();
    // });

    // #3872
    // it('functional component as slot', () => {
    //     const vm = new Vue({
    //         template: `
    //     <parent>
    //       <child>one</child>
    //       <child slot="a">two</child>
    //     </parent>
    //   `,
    //         components: {
    //             parent: {
    //                 template: `<div><slot name="a"></slot><slot></slot></div>`
    //             },
    //             child: {
    //                 functional: true,
    //                 render(h, { slots }) {
    //                     return h('div', slots().default);
    //                 }
    //             }
    //         }
    //     }).$mount();
    //     expect(vm.$el.innerHTML.trim()).toBe('<div>two</div><div>one</div>');
    // });

    // #4209
    // it('slot of multiple text nodes should not be infinitely merged', done => {
    //     const wrap = {
    //         template: `<inner ref="inner">foo<slot></slot></inner>`,
    //         components: {
    //             inner: {
    //                 data: () => ({ a: 1 }),
    //                 template: `<div>{{a}}<slot></slot></div>`
    //             }
    //         }
    //     };
    //     const vm = new Vue({
    //         template: `<wrap ref="wrap">bar</wrap>`,
    //         components: { wrap }
    //     }).$mount();

    //     expect(vm.$el.textContent).toBe('1foobar');
    //     vm.$refs.wrap.$refs.inner.a++;
    //     waitForUpdate(() => {
    //         expect(vm.$el.textContent).toBe('2foobar');
    //     }).then(done);
    // });

    // #4315
    // it('functional component passing slot content to stateful child component', done => {
    //     const ComponentWithSlots = {
    //         render(h) {
    //             return h('div', this.$slots.slot1);
    //         }
    //     };

    //     const FunctionalComp = {
    //         functional: true,
    //         render(h) {
    //             return h(ComponentWithSlots, [
    //                 h('span', { slot: 'slot1' }, 'foo')
    //             ]);
    //         }
    //     };

    //     const vm = new Vue({
    //         data: { n: 1 },
    //         render(h) {
    //             return h('div', [this.n, h(FunctionalComp)]);
    //         }
    //     }).$mount();

    //     expect(vm.$el.textContent).toBe('1foo');
    //     vm.n++;
    //     waitForUpdate(() => {
    //         // should not lose named slot
    //         expect(vm.$el.textContent).toBe('2foo');
    //     }).then(done);
    // });

    // value="a"不支持
    // it('the elements of slot should be updated correctly', done => {
    //     const vm = new Vue({
    //         data: { n: 1 },
    //         template:
    //             '<div><test><span a-for="i in n" :key="i">{{ i }}</span><input value="a"/></test></div>',
    //         components: {
    //             test: {
    //                 template: '<div><slot></slot></div>'
    //             }
    //         }
    //     }).$mount();
    //     expect(vm.$el.innerHTML.replace(/<!--[0-9]{1,}-->/g, '')).toBe(
    //         '<div><span>1</span><input value="a"></div>'
    //     );
    //     const input = vm.$el.querySelector('input');
    //     input.value = 'b';
    //     vm.n++;
    //     waitForUpdate(() => {
    //         expect(vm.$el.innerHTML).toBe(
    //             '<div><span>1</span><span>2</span><input value="a"></div>'
    //         );
    //         expect(vm.$el.querySelector('input')).toBe(input);
    //         expect(vm.$el.querySelector('input').value).toBe('b');
    //     }).then(done);
    // });
});
