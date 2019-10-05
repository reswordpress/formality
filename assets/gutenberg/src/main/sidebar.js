/**
 * Internal block libraries
 */

const { __ } = wp.i18n;

const {
  PluginSidebar,
  PluginSidebarMoreMenuItem,
} = wp.editPost;

const { registerPlugin } = wp.plugins;

const { 
  source
} = wp.blocks;

const { 
  ColorPalette,
  ColorPicker,
  ColorIndicator,
  PanelBody,
  PanelRow,
  Button,
  TextControl,
  ToggleControl,
  RadioControl,
  ButtonGroup,
  BaseControl,
  Dropdown,
  Tooltip,
  FontSizePicker,
  RangeControl,
  DropZoneProvider,
  DropZone,
  Spinner,
  ResponsiveWrapper
} = wp.components;

const { 
  RichText,
  MediaUpload,
  InspectorControls
} = wp.blockEditor;

const {
	Component,
	Fragment,
	createElement
} = wp.element;

import templates from '../templates/templates.js'

const { withSelect } = wp.data;
const { compose } = wp.compose;

class Formality_Sidebar extends Component {
  
	constructor() {
		super( ...arguments );
    
    //get post metas
    let formality_keys = wp.data.select('core/editor').getEditedPostAttribute('meta')
    const formality_pluginurl = wp.data.select('core').getTaxonomy('formality_meta').description
    
    //define default values    
    let default_keys = {
      '_formality_type': "standard",
      '_formality_color1': "#000000",
      '_formality_color2': "#ffffff",
      '_formality_fontsize': 20,
      '_formality_logo': '',
      '_formality_logo_id': 0,
      '_formality_bg': '',
      '_formality_bg_id': 0,
      '_formality_overlay_opacity': 80,
      '_formality_template': '',
      '_formality_position': 'center center',
      '_formality_credits': '',
      '_formality_credits_url': ''
    }
    
    //check if formality keys are already defined
    if(!formality_keys) {
      formality_keys = default_keys
      wp.data.dispatch('core/editor').editPost({meta: formality_keys})
    } else if("_formality_type" in formality_keys) {
      if(!formality_keys["_formality_type"]) {
        formality_keys = default_keys
        wp.data.dispatch('core/editor').editPost({meta: formality_keys})
      }
    }
    
    //remove editor         
    this.hideFormalityLoading = function() {
      let element = document.getElementsByClassName("edit-post-visual-editor");
      element[0].classList.add("is-loaded");
    }
    
    //update general form options function
    this.updateFormalityOptions = function(name, value) {
    	let value_id = 0;
    	let key_id = "";
      if(name=="_formality_logo"||name=="_formality_bg") {
        if(value) {
          value_id = value.id;
          value = value.sizes.full.url
        }
        key_id = name+"_id";
      }
    	let option_array = {}
    	option_array[name] = value;
    	//reset template
      if(name=="_formality_bg") {
        option_array['_formality_template'] = '';
        option_array['_formality_credits'] = '';
        option_array['_formality_position'] = 'center center';
      }
    	if(key_id) { option_array[key_id] = value_id; }
  		this.setState(option_array, () => {
        wp.data.dispatch('core/editor').editPost({meta: option_array})
        this.applyFormalityStyles()
      });
  	}
  	
  	//apply styles to editor
  	this.applyFormalityStyles = function() {
    	let root = document.documentElement;
      let element = document.getElementsByClassName("edit-post-visual-editor");
    	root.style.setProperty('--formality_col1', this.state['_formality_color1']);
      root.style.setProperty('--formality_col2', this.state['_formality_color2']);
      root.style.setProperty('--formality_fontsize', (this.state['_formality_fontsize'] + "px"));
      root.style.setProperty('--formality_bg', this.state['_formality_bg'] ? ( "url(" + this.state['_formality_bg'] + ")" ) : "none");
      root.style.setProperty('--formality_overlay', this.state['_formality_overlay_opacity'] ? ( "0." + ("0" + this.state['_formality_overlay_opacity']).slice(-2) ) : "0");
      root.style.setProperty('--formality_position', this.state['_formality_position']);    
      if(this.state['_formality_type']=="conversational") {
        element[0].classList.add("conversational");
      } else {
        element[0].classList.remove("conversational");
      }
  	}
  	
  	//load template
  	this.loadFormalityTemplate = function(item) {
    	const entries = Object.entries(item)
    	let option_array = {}
    	for (let [key, value] of entries) {
      	if(key=="name"||key=="description") {
        	//exclude these keys
      	} else if(key=="template"||key=="overlay_opacity"||key=="credits") {
          option_array[`_formality_${key}`] = value
        } else if(key=="bg") {
          value = (value=="none") ? "" : (formality_pluginurl + 'public/templates/images/bg/' + value);
          option_array[`_formality_${key}`] = value
      	} else if (value) {
        	option_array[`_formality_${key}`] = value
      	}
      }
      this.setState(option_array, () => {
        wp.data.dispatch('core/editor').editPost({meta: option_array})
        this.applyFormalityStyles()
      });
  	}
  	
  	//build template selection input
  	this.buildFormalityTemplates = function() {
    	let parent = this; 
    	let options = []    	
    	templates.forEach(function (item, index) {
      	const option = (
      	  <div
  					className="components-radio-control__option"
  				>
  					<input
  						className="components-radio-control__input"
  						type="radio"
  						name="formality_radio_templates"
  						id={ "formality_radio_templates_" + index }
  						value={ item.template }
  						onChange={ () => parent.loadFormalityTemplate(item) }
  						checked={ item.template == parent.state['_formality_template']  }
  					/>
  					<label
  					  htmlFor={ "formality_radio_templates_" + index }
  					  style={{
    					  backgroundImage: (item.bg && item.bg != "none") ? ("url(" + formality_pluginurl + "public/templates/images/thumb/" + item.bg + ")") : "",
    					  color: item.color1,
    					  backgroundColor: item.color2
    				  }}
            >
  						<strong>{ item.name }</strong>
  						<span>{ item.description }</span>
  						<i style={{
    					  opacity: ("0." + ("0" + item.overlay_opacity).slice(-2)),
    					  backgroundColor: item.color2
    				  }}></i>
  					</label>
  				</div>
        )
        options.push(option)
      });
      return options
  	}
    
    //set state and remove loading layer
    this.state = formality_keys
    this.applyFormalityStyles()
    this.hideFormalityLoading()

	}

	render() {
  	  	
		return (
			<Fragment>
  			<BaseControl
  			  label={__("Form type")}
          help={ this.state['_formality_type']=="standard" ? 'Classic layout form' : 'Distraction free form' }
        >
          <ButtonGroup>
            <Button
              isPrimary={ this.state['_formality_type']=="standard" ? true : false }
              isDefault={ this.state['_formality_type']=="standard" ? false : true }
              onClick={() => this.updateFormalityOptions('_formality_type', 'standard')}
            >Standard</Button>
            <Button
              isPrimary={ this.state['_formality_type']=="conversational" ? true : false }
              isDefault={ this.state['_formality_type']=="conversational" ? false : true }
              onClick={() => this.updateFormalityOptions('_formality_type', 'conversational')}
            >Conversational</Button>
          </ButtonGroup>
        </BaseControl>
        <PanelRow
            className="formality_colorpicker"
          >
          <BaseControl
            label={ __("Primary color") }
            help="Texts, Labels, Borders, etc."
            >
            <Dropdown
              className="components-color-palette__item-wrapper components-color-palette__custom-color"
              contentClassName="components-color-palette__picker"
              renderToggle={ ( { isOpen, onToggle } ) => (
                <button
                  type="button"
                  style={{ background: this.state['_formality_color1'] }}
                  aria-expanded={ isOpen }
                  className="components-color-palette__item"
                  onClick={ onToggle }
                ></button>
              ) }
              renderContent={ () => (
                <ColorPicker
                  color={ this.state['_formality_color1'] }
                  onChangeComplete={(value) => this.updateFormalityOptions('_formality_color1', value.hex)}
                  disableAlpha
                />
              ) }
            />
          </BaseControl>
          <BaseControl
            label={ __( 'Secondary color' ) }
            help="Backgrounds, Input suggestions, etc."
          >
            <Dropdown
              className="components-color-palette__item-wrapper components-color-palette__custom-color"
              contentClassName="components-color-palette__picker"
              renderToggle={ ( { isOpen, onToggle } ) => (
                <button
                  type="button"
                  style={{ background: this.state['_formality_color2'] }}
                  aria-expanded={ isOpen }
                  className="components-color-palette__item"
                  onClick={ onToggle }
                ></button>
              ) }
              renderContent={ () => (
                <ColorPicker
                  color={ this.state['_formality_color2'] }
                  onChangeComplete={(value) => this.updateFormalityOptions('_formality_color2', value.hex)}
                  disableAlpha
                />
              ) }
            />
          </BaseControl>
        </PanelRow>
        <PanelRow
          className="formality_fontsize"
        >
          <BaseControl
            label={ __( 'Font size', 'formality' ) }
            help={ __( "Align this value to your theme's fontsize", 'formality' ) }
          >
            <RangeControl
              value={ this.state['_formality_fontsize'] }
              onChange={ ( newFontSize ) => this.updateFormalityOptions('_formality_fontsize', newFontSize) }
              min={ 16 }
              max={ 24 }
              beforeIcon="editor-textcolor"
              afterIcon="editor-textcolor"
            />
          </BaseControl>
        </PanelRow>
        <PanelBody
          title={__('Advanced', 'formality')}
          initialOpen={ false }
        >
            <BaseControl
              label={ __( 'Logo', 'formality' ) }
              help={ __( "Replace Formality logo", 'formality' ) }
            >
              <MediaUpload
                onSelect={(file) => this.updateFormalityOptions('_formality_logo', file)}
                type="image"
                value={ this.state['_formality_logo_id'] }
                render={({ open }) => (
                  <Fragment>
                    <Button
      								className={ this.state['_formality_logo'] ? 'editor-post-featured-image__preview' : 'editor-post-featured-image__toggle' }
      								onClick={ open }
      								aria-label={ ! this.state['_formality_logo'] ? null : __( 'Edit or update the image', 'formality' ) }>
      								{ this.state['_formality_logo'] ? <img src={ this.state['_formality_logo'] } alt="" /> : ''}
      								{ this.state['_formality_logo'] ? '' : __('Set a custom logo', 'formality' ) }
      							</Button>
      							{ this.state['_formality_logo'] ? <Button onClick={() => this.updateFormalityOptions('_formality_logo', '')} isLink isDestructive>{ __('Remove custom logo', 'formality' )}</Button> : ''}
    							</Fragment>
                )}
              />
            </BaseControl>
            <BaseControl
              label={ __( 'Background image', 'formality' ) }
              help={ __( "Add background image", 'formality' ) }
            >
              <MediaUpload
                onSelect={(file) => this.updateFormalityOptions('_formality_bg', file)}
                type="image"
                value={ this.state['_formality_bg_id'] }
                render={({ open }) => (
                  <Fragment>
                    <Button
      								className={ this.state['_formality_bg'] ? 'editor-post-featured-image__preview' : 'editor-post-featured-image__toggle' }
      								onClick={ open }
      								aria-label={ ! this.state['_formality_bg'] ? null : __( 'Edit or update the image', 'formality' ) }>
      								{ this.state['_formality_bg'] ? <img src={ this.state['_formality_bg'] } alt="" /> : ''}
      								{ this.state['_formality_bg'] ? '' : __('Set a background image', 'formality' ) }
      							</Button>
      							{ this.state['_formality_bg'] ? <Button onClick={() => this.updateFormalityOptions('_formality_bg', '')} isLink isDestructive>{ __('Remove background image', 'formality' )}</Button> : ''}
    							</Fragment>
                )}
              />
            </BaseControl>
            <BaseControl
              label={ __( 'Background overlay opacity', 'formality' ) }
              help={ __( "Set background overlay opacity (%)", 'formality' ) }
            >
              <RangeControl
                value={ this.state['_formality_overlay_opacity'] }
                onChange={ ( newOpacity ) => this.updateFormalityOptions('_formality_overlay_opacity', newOpacity) }
                min={ 0 }
                max={ 100 }
              />
            </BaseControl>
        </PanelBody>
        <PanelBody
          title={__('Templates', 'formality')}
          initialOpen={ false }
          //icon={ "hidden" }
        >
          <BaseControl
            className="formality_radio-templates"
          >
            <label
              class="components-base-control__label"
            >
              { __( 'Select one of our templates made with a selection of the best', 'formality' ) + ' ' }
              <a target="_blank" href="https://unsplash.com">Unplash</a>
              { ' ' + __( 'photos.', 'formality' ) }
            </label>
            { this.buildFormalityTemplates() }
          </BaseControl>
        </PanelBody>
			</Fragment>
		)
	}
}

const FS = withSelect( ( select, { forceIsSaving } ) => {
	const {
		getCurrentPostId,
		isSavingPost,
		isPublishingPost,
		isAutosavingPost,
	} = select( 'core/editor' );
	return {
		postId: getCurrentPostId(),
		isSaving: forceIsSaving || isSavingPost(),
		isAutoSaving: isAutosavingPost(),
		isPublishing: isPublishingPost(),
	};
} )( Formality_Sidebar );


//registerPlugin( 'formality-sidebar', { icon: 'admin-site', render: FS });

function customizeFormalityMeta( OriginalComponent ) {
	return function( props ) {
		if ( props.slug === 'formality_meta' ) {
			return createElement(FS, props);
		} else {
			return createElement(OriginalComponent, props );
		}
	}
};

wp.hooks.addFilter(
	'editor.PostTaxonomyType',
	'formality',
	customizeFormalityMeta
);

