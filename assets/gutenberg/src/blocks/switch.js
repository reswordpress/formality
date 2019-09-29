/** 
 * Formality block
 * 
 */

const blockName = 'formality/switch'

import {
  checkUID,
  editAttribute,
  getBlocks,
  getBlockTypes,
  mainOptions,
  advancedPanel,
  hasRules
} from '../main/utility.js'

const { __ } = wp.i18n;
const { 
  registerBlockType,
  createBlock,
  source
} = wp.blocks;

const { 
  ColorPalette,
  PanelBody,
  PanelRow,
  Button,
  TextControl,
  ToggleControl,
  ButtonGroup,
  BaseControl,
  RadioControl,
  Icon
} = wp.components;

const { 
  RichText,
  MediaUpload,
  InspectorControls
} = wp.blockEditor;

import { iconSwitch as blockicon } from '../main/icons.js'

registerBlockType( blockName, {
  title: __('Switch', 'formality'),
  description: __('Standard text field, good for short answers and 1 line information', 'formality'), 
  icon: blockicon,
  category: 'formality',
  attributes: {
    uid: { type: 'string', default: '' },
    name: { type: 'string', default: ''},
    label: { type: 'string', default: ''},
    placeholder: { type: 'string', default: ''},
    required: { type: 'boolean', default: false },
    halfwidth: { type: 'boolean', default: false },
    style: { type: 'string', default: 'switch' },
    value: { type: 'string', default: ''},
    rules: {
      type: 'string|array',
      attribute: 'rules',
      default: []
    },
  },
  supports: {
    html: false,
    customClassName: false,
  },
  transforms: {
    from: [{
      type: 'block',
      blocks: getBlockTypes(blockName),
      transform: function ( attributes ) { return createBlock( blockName, attributes); },
    }]
  },
  edit(props) {
    
    checkUID(props)
    let name = props.attributes.name
    let label = props.attributes.label
    let placeholder = props.attributes.placeholder
    let required = props.attributes.required
    let halfwidth = props.attributes.halfwidth
    let uid = props.attributes.uid
    let value = props.attributes.value
    let style = props.attributes.style
    let focus = props.isSelected
    let rules = props.attributes.rules

    return ([
      <InspectorControls>
        <PanelBody title={__('Field options', 'formality')}>
          { mainOptions(props, true, true) }
          <RadioControl
            label={__('Appereance', 'formality')}
            selected={ style }
            options={ [
              { label: 'Switch (default)', value: 'switch' },
              { label: 'Checkbox', value: 'checkbox' },
            ]}
            onChange={(value) => editAttribute(props, "style", value)}
          />
        </PanelBody>
        { advancedPanel(props) }
      </InspectorControls>
      ,
      <div
        class={ "formality__field formality__field--switch" + ( focus ? ' formality__field--focus' : '' ) + ( required ? ' formality__field--required' : '' ) + ( value ? ' formality__field--filled' : '' ) }
      >
        <label
          class="formality__label"
          for={ uid }
        >
          { name ? name : __('Field name', 'formality') }
          <Icon icon={ hasRules(rules) ? "hidden" : "" } />
        </label>
        <div
          class="formality__input"
        >
          <input
            type="checkbox"
            id={ uid }
            name={ uid }
            value="1"
            checked={value ? "checked" : ""}
          />
          <label
            class={"formality__label formality__label--" + style }
            for={ uid }
          >
            <i></i>
            <span>{ placeholder ? placeholder : __('Click to confirm', 'formality') }</span>
          </label>
        </div>
      </div>
    ])
  }, 
  save ( props ) {
    return null
  },
});