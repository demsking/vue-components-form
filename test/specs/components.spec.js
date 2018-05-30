'use strict'

import _ from 'lodash'

import {
  init,
  option,
  components,
  elementOptions,
  defineComponent,
  initObjectAttribute,
  initFields
} from '../../src/lib/components'

/* global describe it expect beforeEach */

describe('lib/components', () => {
  describe('defineComponent(tag, item)', () => {
    beforeEach(() => {
      for (let key in components) {
        delete components[key]
      }
    })

    it('should successfully define object component', () => {
      const tag = 'div'
      const item = {
        component: 'vx-button',
        option: {}
      }
      const expected = {
        component: tag,
        option: { ...option, ...item.option }
      }

      defineComponent(tag, item)

      expect(components['vx-button']).toEqual(expected)
    })

    it('should successfully define string component', () => {
      const tag = 'div'
      const item = 'button'
      const expected = { component: tag, option }

      defineComponent(tag, item)

      expect(components.button).toEqual(expected)
    })
  })

  describe('init()', () => {
    beforeEach(init)

    const divInputs = [
      'error', 'textgroup', 'defaultGroup'
    ]
    const fieldsetInputs = [
      'radiogroup', 'checkboxgroup'
    ]
    const tagInputs = ['form', 'textarea', 'select', 'option', 'label']
    const typedInputs = [
      'checkbox', 'color', 'date', 'datetime', 'datetime-local',
      'email', 'file', 'hidden', 'image', 'month', 'number',
      'password', 'radio', 'range', 'search', 'tel', 'text',
      'time', 'url', 'week'
    ]

    it('should contain the generic title component', () => {
      expect(components.title).toEqual({ component: 'h1', option })
    })

    it('should contain the generic description component', () => {
      expect(components.description).toEqual({ component: 'p', option })
    })

    it('should contain the generic error component', () => {
      expect(components.error).toEqual({ component: 'div', option })
    })

    divInputs.forEach((tag) => {
      it(`should contain the generic div ${tag} component`, () => {
        expect(components[tag]).toEqual({ component: 'div', option })
      })
    })

    fieldsetInputs.forEach((tag) => {
      it(`should contain the fieldset ${tag} component`, () => {
        expect({ ...components[tag], render: undefined }).toEqual({ component: 'fieldset', option })
      })
    })

    tagInputs.forEach((tag) => {
      it(`should contain the generic tagged ${tag} component`, () => {
        expect(components[tag]).toEqual({ component: tag, option })
      })
    })

    typedInputs.forEach((type) => {
      it(`should contain the generic typed ${type} component`, () => {
        const expected = {
          component: 'input',
          option: { ...option, type }
        }

        expect(components[type]).toEqual(expected)
      })
    })

    it('should contain the generic button component', () => {
      const expected = {
        component: 'button',
        option: { ...option, type: 'submit', label: 'Submit' }
      }

      expect(components.button).toEqual(expected)
    })

    it('should contain the generic arraybutton component', () => {
      const expected = {
        component: 'button',
        option: { ...option, type: 'button', label: 'Add' }
      }

      expect(components.arraybutton).toEqual(expected)
    })
  })

  describe('elementOptions(vm, el, extendingOptions = {}, field = {}, item = {})', () => {
    beforeEach(init)

    it('should successfully return option with default args', () => {
      const vm = {}
      const el = components.title
      const expected = {
        attrs: {}
      }

      expect(elementOptions(vm, el)).toEqual(expected)
    })

    it('should successfully return option with the extendingOptions arg', () => {
      const vm = {}
      const el = components.title
      const extendingOptions = { title: 'Hello' }
      const expected = {
        attrs: {
          title: 'Hello'
        }
      }

      expect(elementOptions(vm, el, extendingOptions)).toEqual(expected)
    })

    it('should successfully return option with el.option as function', (done) => {
      const vm = { x: 1 }
      const field = { y: 2 }
      const item = { z: 3 }

      const el = {
        ...components.title,
        option ({ vm, field, item }) {
          expect(vm).toEqual({ x: 1 })
          expect(field).toEqual({ y: 2 })
          expect(item).toEqual({ z: 3 })

          done()
        }
      }

      elementOptions(vm, el, {}, field, item)
    })

    it('should successfully return option with the field arg', () => {
      const vm = {}
      const el = { ...components.title, option: ({ field }) => field.attrs }
      const field = { attrs: { title: 'Hello' } }
      const expected = {
        props: {
          title: 'Hello'
        }
      }

      expect(elementOptions(vm, el, {}, field)).toEqual(expected)
    })
  })

  describe('initObjectAttribute => init data object for nested attributes', () => {
    let value = {
      test: 'test data',
      nested: {
        var: 'test var'
      }
    }
    let data = {}
    let schema = {
      'test': {},
      'nested.var': {}
    }

    // init the data getter-setter
    Object.keys(schema).forEach((key) => {
      initObjectAttribute(data, key)
      data[key] = _.get(value, key)
    })

    expect(data['test']).toEqual('test data')
    expect(data['nested.var']).toEqual('test var')
  })

  describe('initFields', () => {
    let value = {
      test: 'test data',
      nested: {
        var: 'test var'
      }
    }
    let data = {}
    let fields = [
      { attrs: {name: 'test'} },
      { attrs: {name: 'nested.var'} }
    ]

    const vm = {
      value,
      data,
      fields,
      default: {},
      $emit () {}
    }

    initFields(vm)

    expect(vm.data['test']).toEqual('test data')
    expect(vm.data['nested.var']).toEqual('test var')
    expect(vm.default['nested.var']).toEqual('test var')
  })
})
