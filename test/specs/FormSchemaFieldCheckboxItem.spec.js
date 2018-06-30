'use strict'

import { mount } from '@vue/test-utils'
import { loadFields } from '@/lib/parser'
import { init } from '@/lib/components'

import component from '@/components/FormSchemaFieldCheckboxItem.js'

/* global describe beforeEach it expect */

init()

let schema, fields, field, item

describe('FormSchemaFieldCheckboxItem', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  beforeEach(() => {
    schema = {
      type: 'string',
      title: 'choices',
      description: 'choices description',
      attrs: {
        type: 'checkbox',
        name: 'fieldName',
        value: '123'
      }
    }
    fields = []

    loadFields(schema, fields)

    field = fields[0]
    item = {
      id: 'x',
      name: 'checkbox-name',
      label: 'checkbox label',
      value: 'checkbox value'
    }
  })

  it('should successfully render the component', () => {
    const wrapper = mount(component, {
      context: {
        props: {
          item, field
        }
      }
    })

    const expectedInput = '<input id="x" name="checkbox-name" type="checkbox" value="checkbox value">'
    const expectedLabelInput = '<label for="x">checkbox label</label>'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.find('input').html()).toEqual(expectedInput)
    expect(wrapper.find('label').html()).toEqual(expectedLabelInput)
  })

  it('should successfully render the component with missing item.name', () => {
    delete item.name

    const value = field.attrs.value
    const wrapper = mount(component, {
      context: {
        props: {
          item, field, value
        }
      }
    })

    const expected = '<input id="x" name="fieldName" type="checkbox" value="checkbox value">'

    expect(wrapper.find('input').html()).toEqual(expected)
  })

  it('should successfully render the component with explicit props.checked', () => {
    const checked = true
    const value = field.attrs.value
    const wrapper = mount(component, {
      context: {
        props: {
          item, field, value, checked
        }
      }
    })

    const expected = '<input id="x" name="checkbox-name" type="checkbox" value="checkbox value" checked="checked">'

    expect(wrapper.find('input').html()).toEqual(expected)
  })

  it('should successfully render the component with explicit props.checked === false', () => {
    const checked = false
    const value = field.attrs.value
    const wrapper = mount(component, {
      context: {
        props: {
          item, field, value, checked
        }
      }
    })

    const expected = '<input id="x" name="checkbox-name" type="checkbox" value="checkbox value">'

    expect(wrapper.find('input').html()).toEqual(expected)
  })

  it('should successfully render the component with array field', () => {
    schema = {
      type: 'object',
      properties: {
        ckbox: {
          type: 'array',
          anyOf: [ item ],
          default: [ item.value ]
        }
      }
    }

    fields = []

    loadFields(schema, fields)

    field = fields[0]

    const value = field.attrs.value
    const wrapper = mount(component, {
      context: {
        props: {
          item, field, value
        }
      }
    })

    const expected = '<div data-fs-field="x"><label for="x">checkbox label</label><div data-fs-field-input="x"><input id="x" name="checkbox-name" type="checkbox" value="checkbox value" checked="checked"></div></div>'

    expect(wrapper.html()).toEqual(expected)
  })
})
