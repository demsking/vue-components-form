import { VNode } from 'vue';
import { FormSchemaComponent } from '@/types';
import { UniqueId as UniqueIdLib } from '@/lib/UniqueId';
import { Objects as ObjectsLib } from '@/lib/Objects';
import { Components as ComponentsLib } from '@/lib/Components';
import { Parser as ParserLib } from '@/parsers/Parser';
import { NativeElements } from '@/lib/NativeElements';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

import '@/parsers';
import { Schema } from '@/lib/Schema';

export const GLOBAL = {
  Elements: NativeElements,
  Descriptor: NativeDescriptor
};

export const Objects = ObjectsLib;
export const UniqueId = UniqueIdLib;
export const Components = ComponentsLib;
export const Parser = ParserLib;

const FormSchema: FormSchemaComponent = {
  name: 'FormSchema',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    /**
     * The input JSON Schema object.
     */
    schema: { type: Object, required: true },

    /**
     * Use this directive to create two-way data bindings with the
     * component. It automatically picks the correct way to update the
     * element based on the input type.
     */
    value: {
      type: [ Number, String, Array, Object, Boolean ],
      default: undefined
    },

    /**
     * The id property of the Element interface represents the form's identifier,
     * reflecting the id global attribute.
     */
    id: {
      type: String,
      default: UniqueId.get('form')
    },

    /**
     * The name of the form. It must be unique among the forms in a document.
     */
    name: {
      type: String,
      default: undefined
    },

    /**
     * When set to true (default), checkbox inputs and nested object inputs will
     * automatically include brackets at the end of their names
     * (e.g. name="Multicheckbox-Value1[]".
     * Setting this property to false, disables this behaviour.
     */
    bracketedObjectInputName: {
      type: Boolean,
      default: true
    },

    /**
     * Use this prop to enable `search` landmark role to identify a section
     * of the page used to search the page, site, or collection of sites.
     */
    search: { type: Boolean, default: false },

    /**
     * Indicates whether the form elements are disabled or not.
     */
    disabled: { type: Boolean, default: false },

    /**
     * Use this prop to overwrite the default Native HTML Elements with
     * custom components.
     */
    components: {
      type: Components,
      default: () => GLOBAL.Elements
    },

    /**
     * UI Schema Descriptor to use for rendering.
     *
     * @type {ScalarDescriptor|ObjectDescriptor|ArrayDescriptor|DescriptorConstructor}
     */
    descriptor: {
      type: [ Object, Function ],
      default: () => GLOBAL.Descriptor
    }
  },
  data: () => ({
    ref: UniqueId.get('formschema'),
    initialModel: undefined,
    ready: false
  }),
  computed: {
    fieldId() {
      return `${this.id}-field`;
    },
    descriptorConstructor() {
      return typeof this.descriptor === 'function'
        ? this.descriptor
        : GLOBAL.Descriptor.get;
    },
    schemaDescriptor() {
      return typeof this.descriptor === 'function'
        ? this.descriptor(this.schema)
        : this.descriptor || GLOBAL.Descriptor.get(this.schema);
    },
    parser() {
      return Parser.get({
        schema: this.schema,
        model: this.initialModel,
        name: this.name,
        id: this.fieldId,
        required: true,
        descriptor: this.schemaDescriptor,
        descriptorConstructor: this.descriptorConstructor,
        bracketedObjectInputName: this.bracketedArrayInputName,
        onChange: this.emitInputEvent
      });
    },
    field() {
      return this.parser instanceof Parser ? this.parser.field : null;
    },
    listeners() {
      const on = { ...this.$listeners };

      // remove the injected vue's input event
      // to prevent vue errors on the submit event
      delete on.input;

      return on;
    }
  },
  watch: {
    schema: {
      handler() {
        this.ready = false;
        this.initialModel = this.clone(this.value);
      },
      immediate: true
    }
  },
  render(createElement) {
    if (this.field === null || this.ready === false) {
      return null as any; // nothing to render
    }

    const attrs = {
      ...this.field.input.attrs,
      disabled: this.disabled
    };

    const props = {
      field: this.field,
      disabled: this.disabled
    };

    const element = createElement(this.field.input.component, { attrs, props });
    const root = Schema.isScalar(this.schema)
      ? createElement(this.components.get('field'), { props }, [ element ])
      : element;

    const nodes = [ root ];

    if (this.$slots.default) {
      nodes.push(...this.$slots.default);
    }

    // FIXME Updating props `search` and `disabled` fires compute of `parser -> field`.
    // This is not the expected behaviour.

    return createElement(this.components.get('form'), {
      ref: this.ref,
      attrs: {
        id: this.id,
        name: this.name,
        role: this.search ? 'search' : undefined
      },
      props: props,
      on: this.listeners
    }, nodes);
  },
  methods: {
    clone(value) {
      if (Objects.isScalar(value)) {
        return value;
      }

      const object = value instanceof Array ? [] : {};

      return Objects.assign(object, value as any);
    },

    /**
     * Get the HTML form reference.
     *
     * @returns {HTMLFormElement|VNode|undefined} - Returns the HTML form element or `undefined` for empty object
     */
    form(): HTMLFormElement | VNode | undefined {
      return this.$refs[this.ref] as any;
    },

    /**
     * @private
     */
    emitInputEvent(value: unknown) {
      /**
       * Fired synchronously when the value of an element is changed.
       */
      this.$emit('input', value);

      this.$nextTick(() => {
        this.ready = true;
      });
    }
  }
};

export default FormSchema;
