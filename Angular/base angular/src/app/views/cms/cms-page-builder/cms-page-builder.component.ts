import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CONFIG } from '../../../config/app-config';
import { EncrDecrService } from '../../../_services/encr-decr.service';
declare var grapesjs: any;
@Component({
  selector: 'app-cms-page-builder',
  templateUrl: './cms-page-builder.component.html',
  styleUrls: ['./cms-page-builder.component.scss'],
})
export class CmsPageBuilderComponent implements OnInit {
  cmsId: any;
  private routeSub: Subscription;
  editMode: Boolean = false;
  private editCmsId: number;
  model: any = {};
  authToken = '';
  editor: any;
  constructor(private route: ActivatedRoute, private EncrDecr: EncrDecrService) {
    const decrypted = localStorage.getItem('currentUser');
    if (decrypted) {
      const currentUser = JSON.parse(this.EncrDecr.get(CONFIG.EncrDecrKey, decrypted));
      if (currentUser && currentUser.access_token) {
        this.authToken = `Bearer ${currentUser.access_token}`;
      }
    }
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.cmsId = params['id'];
      this.editMode = params['id'] !== undefined;
      //     setTimeout(() => {
      // 	// <<<---    using ()=> syntax
      //     	this.initForm();
      // }, 100);
    });

    this.editor = grapesjs.init({
      // Indicate where to init the editor. You can also pass an HTMLElement
      container: '#gjs',
      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      fromElement: true,
      // Size of the editor
      height: '500px',
      width: 'auto',
      // Disable the storage manager for the moment
      storageManager: {
        id: 'gjs-', // Prefix identifier that will be used on parameters
        type: 'remote', // Type of the storage 'local','remote'
        urlStore: CONFIG.storePageBuilderURL,
        params: {
          cms_page_name: sessionStorage.getItem('cms_page_name'),
          action_type: 'edit', // add
          id: this.cmsId,
        },
        headers: { Authorization: this.authToken },
        urlLoad: CONFIG.loadPageBuilderURL + this.cmsId,
        // autosave: true,         // Store data automatically
        autoload: true, // Autoload stored data on init
        stepsBeforeSave: 1,
        // contentTypeJson: true,
        credentials: 'omit',
      },
      assetManager: {
        // 5.3
        assets: ['assets/img/image1.jpg'],
      },
      styleManager: { clearProperties: 1 },
      plugins: ['gjs-preset-webpage', 'product'], // 5.6
      pluginsOpts: {
        product: {},
        'gjs-preset-webpage': {
          navbarOpts: false,
          countdownOpts: false,
          blocksBasicOpts: {
            blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image'],
          },
        },
      },
    });
    // Create block type dropdown
    this.editor.TraitManager.addType('div-type-call', {
      // Expects as return a simple HTML string or an HTML element
      createInput() {
        const typeList = ['Survey', 'Enquiry', 'FAQ', 'Review'];
        let type = '<select class="dropchange"><option value="">--Select--</option>';
        typeList.forEach((item) => {
          type = type + '<option>' + item + '</option>';
        });
        type = type + '</select>';

        return type;
      },
    });
    this.editor.TraitManager.addType('div-category-call', {
      // Expects as return a simple HTML string or an HTML element
      createInput() {
        const cate = '<select id="BlockCategory" class="catdrop"><option value="">--Select--</option></select>';
        return cate;
      },
    });
    this.customListBlock();
    this.customListTrait();
    this.product();
    this.productTrait();
  }
  customListBlock() {
    this.editor.BlockManager.add('CUSTOMBLOCK', {
      category: 'Custom',
      attributes: {
        type: 'Insert h1 block',
        class: 'fa fa-list gjs-block gjs-one-bg gjs-four-color-h',
      },

      label: 'Listing',
      content: `<div class="customblocksnippet" brian="customblocksnippet"><h1 category="">Section Title will come here</h1><h3>Title 1 will come here</h3><p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..</p><h3>Title 2 will come here</h3><p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..</p></div>`,
    });
  }

  /*PRODUCT CODE*/
  product() {
    this.editor.BlockManager.add('product', {
      editable: true,
      category: 'Custom',
      attributes: {
        type: 'Insert h1 block',
        class: 'fa fa-product-hunt gjs-block gjs-one-bg gjs-four-color-h',
      },

      label: 'Product',
      content: `<div class="planblock"><div class="col-md-12"><div class="col-md-3" style="float: left;">Plan Name:</div><div class="col-md-3" data-gjs-type="productComponent"> label</div></div><div class="col-md-12"><div class="col-md-3" style="float: left;">Plan price:</div><div class="col-md-3" data-gjs-type="productComponent">label</div></div></div><div class="col-md-12"><div class="col-md-3" style="float: left;">Plan validity:</div><div  class="col-md-3" data-gjs-type="productComponent">label</div></div></div><div class="col-md-12"><div style="float: left;">Plan discount:</div><div data-gjs-type="productComponent">label</div></div></div><div class="col-md-12"><div style="float: left;">Plan description:</div><div data-gjs-type="productComponent">label</div></div></div><div class="newappendplanblock"></div>`,
    });
  }

  productTrait() {
    this.editor.DomComponents.addType('productComponent', {
      model: {
        defaults: {
          traits: [
            {
              type: '', // { type: 'checkbox', name: 'required' }, or ''
              name: 'id',
              label: 'id',
            },
            {
              type: '', // { type: 'checkbox', name: 'required' }, or ''
              name: 'title',
              label: 'Title',
            },
            {
              type: 'dripping', // { type: 'checkbox', name: 'required' }, or ''
              name: 'dripping',
              label: 'Select field',
            },
          ],
        },

        init() {
          this.on('change:propchange', this.handlePropChange);
          // Listen to any attribute change
          this.on('change:attributes', this.handleAttrChange);
          // Listen to title attribute change
          this.on('change:attributes:title', this.handleTitleChange);
        },

        handlePropChange() {
          const { someprop } = this.props();
          this.logger.log('New value of someprop: ', someprop);
        },

        handleAttrChange(el) { },

        handleTitleChange() { },
      },
    });

    const fieldArray = ['name', 'price', 'validity', 'description', 'discount'];
    this.editor.TraitManager.addType('dripping', {
      // Expects as return a simple HTML string or an HTML element

      createInput({ trait }) {
        // Here we can decide to use properties from the trait
        const traitOpts = trait.get('options') || [];
        const options = traitOpts.lenght
          ? traitOpts
          : [
            { id: 'url', name: 'URL' },
            { id: 'email', name: 'Email' },
          ];

        let el6 = '<select class="inputField" id="inputField"><option value="">--Select--</option>';
        fieldArray.forEach(function (item) {
          el6 = el6 + '<option value="' + item + '">' + item + '</option>';
        });
        el6 = el6 + '</select>';
        return el6;
      },

      onEvent({ elInput, component, event }) {
        const valueOfDropdown = (<HTMLInputElement>document.getElementById('inputField')).value;
        component.toHTML({
          attributes(compo, attributes) {
            if (compo.get('tagName') === 'h4') {
              attributes.title = 'Custom attribute';
            }
            return attributes;
          },
        });
        component.set('content', '{{' + valueOfDropdown + '}}');
      },
    });
  }

  customListTrait() {
    this.editor.DomComponents.addType('default', {
      model: {
        defaults: {
          traits: [
            {
              type: '',
              name: 'id',
              label: 'id',
            },
            {
              type: '',
              name: 'title',
              label: 'Title',
            },
            {
              type: 'div-type-call',
              name: 'customtype',
              label: 'Custom-Type',
            },
            {
              type: 'div-category-call',
              name: 'customcategory',
              label: 'Custom-Category',
            },
          ],
        },

        init() {
          // Listen to any attribute change
          this.on('change:attributes:customtype', this.handleAttrChange);
          // Listen to title attribute change
          this.on('change:attributes:title', this.handleTitleChange);
        },

        handleAttrChange(el) {
          const dynamicCatList = [];
          if (this.getAttributes().customtype === 'Survey') {
            dynamicCatList.push('Pending', 'Inprocess');
          } else if (this.getAttributes().customtype === 'FAQ') {
            dynamicCatList.push('Active', 'Inactive');
          } else if (this.getAttributes().customtype === 'Enquiry') {
            dynamicCatList.push('Working', 'Pending', 'Close');
          } else if (this.getAttributes().customtype === 'Review') {
            dynamicCatList.push('Latest');
          }
          let el2 = '<option value="">--Select--</option>';
          dynamicCatList.forEach((item) => {
            el2 = el2 + '<option value="' + item + '">' + item + '</option>';
          });
          document.getElementById('BlockCategory').innerHTML = el2;
        },

        handleTitleChange() {
          this.logger.log('Attribute title updated: ', this.getAttributes().title);
        },
      },
    });
  }
}
