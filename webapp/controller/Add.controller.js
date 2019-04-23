sap.ui.define([
	"opensap/manageproducts/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
	],function(BaseController, History, MessageToast){
		"use strict";
		return BaseController.extend("opensap.manageproducts.controller.Add",{
			
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the add controller is instantiated.
		 * @public
		 */
		 onInit:function() {
		 	//Register to the add route matched
		 	this.getRouter().getRoute("add").attachPatternMatched(this._onRouteMatched,this);
		 },
		
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		
		_onRouteMatched:function()
		{
			var oModel=this.getModel();
			oModel.metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},
		
		_onMetadataLoaded:function(){
			var oProperties={
				ProductID: ""+parseInt(Math.random() * 1000000000, 10),
				TypeCode:"PR",
				TaxTarifCode:1,
				CurrencyCode:"EUR",
				MeasureUnit:"EA"
			};
			this._oContext=this.getModel().createEntry("/ProductSet",{
				properties:oProperties,
				success:this._onCreateSuccess.bind(this)
			});
			this.getView().setBindingContext(this._oContext);
		},
		
		_onCreateSuccess:function(oProduct){
			var sId=oProduct.ProductID;
			this.getRouter().navTo("object",{
				objectId:sId
			}, true);
			this.getView().unbindObject();
			var sMessage=this.getResourceBundle().getText("newObjectCreated",
			[oProduct.Name]);
			MessageToast.show(sMessage, {
				closeonBrowserNavigation: false
			});
			
		},
		
		onCancel:function(){
			this.onNavBack();
		},
		
		onSave:function(){
			this.getModel().submitChanges();	
		},
		
		onNavBack:function()
		{
			this.getModel().deleteCreateEntry(this._oContext);
			var oHistory=History.getInstance();
			var sPreviousHash=oHistory.getPreviousHash();
			if(sPreviousHash!==undefined){
				history.go(-1);
			}else{
				var bReplace=true;
				this.getRouter().navTo("worklist",{},bReplace);
			}
		}
		});
	});