'use strict'

import { mount } from '@vue/test-utils'

import component from '@/components/FormSchema.js'

/* global describe it expect */

const props = {
  schema: {},
  value: {},
  action: undefined,
  autocomplete: undefined,
  enctype: 'application/x-www-form-urlencoded',
  method: 'post',
  novalidate: false
}

const data = {
  schemaLoaded: { schema: {}, fields: [] },
  default: {},
  error: null,
  data: {},
  inputValues: {}
}

const schema = {
  type: 'object',
  title: 'Subscription',
  description: 'Subscription Form',
  properties: {
    name: {
      type: 'string',
      title: 'Your name'
    }
  },
  required: ['name']
}

describe('FormSchema', () => {
  describe('component', () => {
    it('should not be a functional component', () => {
      expect(component.functional).toBe(undefined)
    })

    it('should have the FormSchema name', () => {
      expect(component.name).toEqual('FormSchema')
    })

    it('should have a changed method', () => {
      expect(typeof component.methods.changed).toBe('function')
    })

    it('should have a reset method', () => {
      expect(typeof component.methods.reset).toBe('function')
    })

    it('should have a submit method', () => {
      expect(typeof component.methods.submit).toBe('function')
    })

    it('should have a setErrorMessage method', () => {
      expect(typeof component.methods.setErrorMessage).toBe('function')
    })

    it('should have a clearErrorMessage method', () => {
      expect(typeof component.methods.clearErrorMessage).toBe('function')
    })

    const wrapper = mount(component, {
      propsData: { schema: {} }
    })

    Object.keys(props).forEach((prop) => {
      it(`should have prop ${prop} with default value`, () => {
        expect(prop in wrapper.vm).toBe(true)
        expect(wrapper.vm[prop]).toEqual(props[prop])
      })
    })

    Object.keys(data).forEach((prop) => {
      it(`should have data ${prop}`, () => {
        expect(prop in wrapper.vm).toBe(true)
        expect(wrapper.vm[prop]).toEqual(data[prop])
      })
    })

    it('should successfully render the component with an empty schema', () => {
      expect(wrapper.html()).toEqual(undefined)
    })

    it('should successfully render the component', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      expect(wrapper.findAll('div').length).toEqual(2)

      expect(wrapper.findAll('h1').length).toEqual(1)
      expect(wrapper.find('h1').html()).toEqual(`<h1>${schema.title}</h1>`)

      expect(wrapper.findAll('p').length).toEqual(1)
      expect(wrapper.find('p').html()).toEqual(`<p>${schema.description}</p>`)

      expect(wrapper.findAll('form').length).toEqual(1)

      expect(wrapper.find('form').element.hasAttribute('enctype')).toBe(true)
      expect(wrapper.find('form').element.getAttribute('enctype')).toEqual(props.enctype)

      expect(wrapper.find('form').element.hasAttribute('method')).toBe(true)
      expect(wrapper.find('form').element.getAttribute('method')).toEqual(props.method)

      expect(wrapper.findAll('label').length).toEqual(1)

      expect(wrapper.findAll('span').length).toEqual(1)
      expect(wrapper.find('span').html()).toEqual('<span data-required-field="true">Your name</span>')

      expect(wrapper.findAll('input').length).toEqual(1)
      expect(wrapper.find('input').html()).toEqual('<input type="text" value="" required="required" name="name">')

      expect(wrapper.findAll('button').length).toEqual(1)
      expect(wrapper.find('button').html()).toEqual('<button type="submit">Submit</button>')
    })

    it('should successfully render component with reactive schema', () => {
      const wrapper = mount(component, {
        propsData: { schema: {} }
      })

      expect(wrapper.html()).toEqual(undefined)

      wrapper.setProps({ schema })

      expect(wrapper.findAll('div').length).toEqual(2)

      expect(wrapper.findAll('h1').length).toEqual(1)
      expect(wrapper.find('h1').html()).toEqual(`<h1>${schema.title}</h1>`)

      expect(wrapper.findAll('p').length).toEqual(1)
      expect(wrapper.find('p').html()).toEqual(`<p>${schema.description}</p>`)

      expect(wrapper.findAll('form').length).toEqual(1)

      expect(wrapper.find('form').element.hasAttribute('enctype')).toBe(true)
      expect(wrapper.find('form').element.getAttribute('enctype')).toEqual(props.enctype)

      expect(wrapper.find('form').element.hasAttribute('method')).toBe(true)
      expect(wrapper.find('form').element.getAttribute('method')).toEqual(props.method)

      expect(wrapper.findAll('label').length).toEqual(1)

      expect(wrapper.findAll('span').length).toEqual(1)
      expect(wrapper.find('span').html()).toEqual('<span data-required-field="true">Your name</span>')

      expect(wrapper.findAll('input').length).toEqual(1)
      expect(wrapper.find('input').html()).toEqual('<input type="text" value="" required="required" name="name">')

      expect(wrapper.findAll('button').length).toEqual(1)
      expect(wrapper.find('button').html()).toEqual('<button type="submit">Submit</button>')
    })

    it('should successfully emit events', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      const input = wrapper.find('input')
      const expected = {
        name: 'Sébastien'
      }

      expect(wrapper.vm.data).toEqual({ name: '' })

      input.element.value = expected.name
      input.trigger('input')

      expect('input' in wrapper.emitted()).toBe(true)
      expect(wrapper.emitted('input')[0][0]).toEqual(expected)

      expect(wrapper.vm.data).toEqual(expected)
    })

    it('vm.form()', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      expect(wrapper.vm.form().tagName).toEqual('FORM')
    })

    it('vm.reportValidity()', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      const input = wrapper.find('input')

      input.element.value = 'Sébastien'

      expect(wrapper.vm.reportValidity()).toBe(true)
      expect(wrapper.vm.checkValidity()).toBe(true)
    })

    it('vm.reset()', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      const input = wrapper.find('input')
      const expected = {
        name: 'Sébastien'
      }

      input.element.value = expected.name
      input.trigger('input')

      expect(wrapper.vm.data).toEqual(expected)

      wrapper.vm.reset()

      expect(wrapper.vm.data).toEqual({ name: '' })
    })

    it('vm.setErrorMessage(message) & vm.clearErrorMessage()', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      wrapper.vm.setErrorMessage('error message')

      expect(wrapper.vm.error).toEqual('error message')
      expect(wrapper.findAll('div').length).toEqual(3)
      expect(wrapper.findAll('div').at(1).html()).toEqual('<div>error message</div>')

      wrapper.vm.clearErrorMessage()

      expect(wrapper.vm.error).toEqual(null)
      expect(wrapper.findAll('div').length).toEqual(2)
    })
  /*
    it('should successfully emit input event', () => {
      const field = {
        attrs: {
          name: 'fieldName'
        },
        itemsNum: 2
      }
      const input = {
        data: {
          attrs: {
            type: 'text'
          }
        },
        element: components.text,
        native: true
      }
      const name = `${field.attrs.name}-0`
      const value = {
        'fieldName-0': 'Value 1',
        'fieldName-1': 'Value 2'
      }
      const wrapper = mount(component, {
        context: {
          props: { field, value, input, name }
        }
      })

      const expected = {
        fieldName: [
          'Hello',
          'Value 2'
        ]
      }
      const inputElement = wrapper.find('input')

      inputElement.element.value = 'Hello'
      inputElement.trigger('input')

      expect(wrapper.emitted().input[0][0]).toEqual(expected)
    })

    it('should successfully emit input event with an empty value', () => {
      const field = {
        attrs: {
          name: 'fieldName'
        },
        itemsNum: 2
      }
      const input = {
        data: {
          attrs: {
            type: 'text'
          }
        },
        element: components.text,
        native: true
      }
      const name = `${field.attrs.name}-0`
      const vm = {
        inputValues: {
          'fieldName-0': 'Value 1',
          'fieldName-1': 'Value 2'
        },
        data: {
          fieldName: [
            'Value 1',
            'Value 2'
          ]
        },
        changed: () => {}
      }
      const wrapper = mount(component, {
        context: {
          props: { field, input, vm, name }
        }
      })

      vm.$emit = wrapper.vm.$emit

      const expected = {
        fieldName: [
          'Value 2'
        ]
      }
      const inputElement = wrapper.find('input')

      inputElement.element.value = ''
      inputElement.trigger('input')

      expect(wrapper.emitted().input[0][0]).toEqual(expected)
      expect(vm.data).toEqual(expected)
    })
  */
  })

  describe('redering', () => {
    describe('select element', () => {
      it('should render with type === string and the enum field with stringify values', () => {
        const schema = {
          type: 'object',
          properties: {
            list: {
              type: 'string',
              title: 'choices',
              description: 'choices description',
              enum: ['v0', 'v1']
            }
          }
        }
        const wrapper = mount(component, {
          propsData: { schema }
        })

        const expected = '<div><form enctype="application/x-www-form-urlencoded" method="post"><label><span data-required-field="false">choices</span><select name="list"><option value="v0">v0</option><option value="v1">v1</option></select><small>choices description</small></label><div><button type="submit">Submit</button></div></form></div>'

        expect(wrapper.html()).toEqual(expected)
      })
    })

    describe('checkbox element', () => {
      it('should render with truely default value', () => {
        const schema = {
          type: 'boolean',
          default: true,
          attrs: {
            name: 'checkbox-name'
          }
        }
        const wrapper = mount(component, {
          propsData: { schema }
        })

        const expected = '<input name="checkbox-name" type="checkbox" checked="checked">'

        expect(wrapper.find('input').html()).toEqual(expected)
      })

      it('should render with falsely default value', () => {
        const schema = {
          type: 'boolean',
          default: false,
          attrs: {
            name: 'checkbox-name'
          }
        }
        const wrapper = mount(component, {
          propsData: { schema }
        })

        const expected = '<input name="checkbox-name" type="checkbox">'

        expect(wrapper.find('input').html()).toEqual(expected)
      })
    })
  })

  describe('events', () => {})
})
