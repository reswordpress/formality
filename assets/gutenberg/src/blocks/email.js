/** 
 * Formality block
 * 
 */

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
  BaseControl
} = wp.components;

const { 
  RichText,
  MediaUpload,
  InspectorControls
} = wp.editor;


registerBlockType( 'formality/email', {
  title: __('E-mail', 'formality'),
  description: __('Standard text field, good for short answers and 1 line information', 'formality'), 
  icon: 'universal-access-alt',
  category: 'formality',
  attributes: {
    uid: { type: 'string', default: '' },
    name: { type: 'string', default: ''},
    label: { type: 'string', default: ''},
    placeholder: { type: 'string', default: ''},
    required: { type: 'boolean', default: false },
    halfwidth: { type: 'boolean', default: false },
    value: { type: 'string', default: ''},
  },
  supports: {
    html: false,
    customClassName: false,
  },
  transforms: {
    from: [{
      type: 'block',
      blocks: [ 'formality/text', 'formality/select', 'formality/textarea'  ],
      transform: function ( attributes ) { return createBlock( 'formality/email', attributes); },
    }]
  },
  edit(props) {
    let name = props.attributes.name
    let label = props.attributes.label
    let placeholder = props.attributes.placeholder
    let required = props.attributes.required
    let halfwidth = props.attributes.halfwidth
    let uid = props.attributes.uid
    let value = props.attributes.value
    let focus = props.isSelected
    if(!uid) {
      props.setAttributes({uid: ([1e7]+1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)) })
    }
    
    function editAttribute(key, value, toggle = false) {
      let tempArray = {}
      if(toggle){ value = props.attributes[key] ? false : true }
      tempArray[key] = value
      props.setAttributes(tempArray)
    }          

    return ([
      <InspectorControls>
        <PanelBody title={__('Field options', 'formality')}>
          <ToggleControl
            label={ required ? __('This is a required field', 'formality') : __('This is a not required field', 'formality') }
            checked={ required }
            onChange={() => editAttribute("required", true, true )}
          />
          <BaseControl
            label={__('Width', 'formality')}
          >
            <ButtonGroup>
              <Button
                isPrimary={ halfwidth ? true : false }
                isDefault={ halfwidth ? false : true }
                onClick={() => editAttribute("halfwidth", true)}
              >{__('Half width', 'formality')}</Button>
              <Button
                isPrimary={ halfwidth ? false : true }
                isDefault={ halfwidth ? true : false }
                onClick={() => editAttribute("halfwidth", false)}
              >{__('Full width', 'formality')}</Button>
            </ButtonGroup>
          </BaseControl>
          <TextControl
            label={__('Label / Question', 'formality')}
            value={name}
            onChange={(value) => editAttribute("name", value)}
          />
          <TextControl
            label={__('Placeholder', 'formality')}
            help={__('Ex: "Type your answer here"', 'formality')}
            value={placeholder}
            onChange={(value) => editAttribute("placeholder", value)}
          />
        </PanelBody>
        <PanelBody
          title={__('Advanced', 'formality')}
          initialOpen={ false }
        >
          <TextControl
            label={__('Initial value', 'formality')}
            value={value}
            onChange={(value) => editAttribute("value", value)}
          />
          <TextControl
            label={__('Field ID/Name', 'formality')}
            value={uid}
            disabled
            help={__('You can set an initial variable value by using field ID as a query var. Ex: http://abc.com/form1/?', 'formality') + uid + '=test'}
          />
        </PanelBody>
      </InspectorControls>
      ,
      <div
        class={ "formality__field formality__field--email" + ( focus ? ' formality__field--focus' : '' ) + ( required ? ' formality__field--required' : '' ) + ( value ? ' formality__field--filled' : '' ) }
      >
        <label
          class="formality__label"
          for={ uid }
        >
          { name ? name : __('Field name', 'formality') }
        </label>
        <div
          class="formality__input"
          data-placeholder={ placeholder ? placeholder : __('Type your answer here', 'formality') }
        >
          <input
            type="text"
            id={ uid }
            name={ uid }
            value={value}
            placeholder={ placeholder ? placeholder : __('Type your answer here', 'formality') }
          />
        </div>
      </div>
    ])
  }, 
  save ( props ) {
    return null
  },
});