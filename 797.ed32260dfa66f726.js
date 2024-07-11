"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[797],{7797:(F,d,l)=>{l.r(d),l.d(d,{AddEntryPage:()=>S});var u=l(467),e=l(3953),y=l(177),n=l(4341),a=l(7920),_=l(9650),g=l(4987),T=l(7990);const h=(r,s)=>s.id;function f(r,s){if(1&r&&(e.j41(0,"ion-select-option",10),e.EFF(1),e.k0s()),2&r){const o=s.$implicit;e.Y8G("value",o),e.R7$(),e.JRh(o.name)}}function v(r,s){if(1&r&&(e.j41(0,"ion-select-option",10),e.EFF(1),e.k0s()),2&r){const o=s.$implicit;e.Y8G("value",o),e.R7$(),e.Lme("",o.name," - (Rs. ",o.amount,")")}}function E(r,s){if(1&r){const o=e.RV6();e.j41(0,"ion-item",3)(1,"ion-select",16),e.bIt("selectionChange",function(i){e.eBV(o);const m=e.XpG();return e.Njj(m.onCharityTypeSelection(i))}),e.Z7z(2,v,2,3,"ion-select-option",10,h),e.k0s()()}if(2&r){const o=e.XpG();e.R7$(2),e.Dyx(o.charityTypes)}}function C(r,s){1&r&&(e.qex(0,14),e.j41(1,"ion-item",17),e.nrm(2,"ion-input",18),e.k0s(),e.j41(3,"ion-item",17),e.nrm(4,"ion-input",19),e.k0s(),e.bVm())}let S=(()=>{var r;class s{constructor(t,i,m,c,p){this.entryService=t,this.formBuilder=i,this.pdfService=m,this.loader=c,this.toaster=p,this.temples=[],this.charityTypes=[],this.currentSegment="preset",this.updatedTemplesEffect=(0,e.QZP)(()=>{this.entryService.getTemplesUpdatedSignal(),this.getTemples()}),this.updatedCharityTypesEffect=(0,e.QZP)(()=>{this.entryService.getCharityTypesUpdatedSignal(),this.getCharityTypes()}),this.entryForm=this.formBuilder.group({title:[null,[n.k0.required]],name:[null,[n.k0.required,n.k0.maxLength(100),n.k0.pattern("[a-zA-Z0-9 ]+")]],temple:[null,[n.k0.required]],charityType:[null,[n.k0.required]]})}ngOnInit(){this.getTemples(),this.getCharityTypes()}getTemples(){this.entryService.getTemples().then(t=>{this.temples=t,1===this.temples.length&&this.entryForm.patchValue({temple:this.temples[0]})})}getCharityTypes(){this.entryService.getCharityTypes().then(t=>{this.charityTypes=t,1===this.charityTypes.length&&this.entryForm.patchValue({charityType:this.charityTypes[0]})})}onSubmit(){var t=this;return(0,u.A)(function*(){if(t.entryForm.valid){const i=yield t.loader.create({message:"Adding temple..."});yield i.present();const m=yield t.entryService.getEntryNextId(),c=(new Date).toISOString();t.entryService.addEntry({...t.entryForm.getRawValue(),id:m,createdOn:c}).subscribe(p=>{t.pdfService.generateAndDownloadPDF(p),t.resetForm(),i.dismiss()})}else t.entryForm.markAllAsTouched()})()}onTempleSelection(t){}onCharityTypeSelection(t){}onSegmentChange(t){const i=t.target.value;"custom"===i?(this.entryForm.removeControl("charityType"),this.entryForm.addControl("charityType",this.formBuilder.group({name:[null,[n.k0.required,n.k0.min(1)]],amount:[null,[n.k0.required,n.k0.min(1)]]}))):(0===this.charityTypes.length&&this.toaster.presentToast({message:"No preset services found. Go to Services => Add Service to add preset services.",color:"danger",duration:5e3}),this.entryForm.removeControl("charityType"),this.entryForm.addControl("charityType",new n.MJ(null,[n.k0.required])),1===this.charityTypes.length&&this.entryForm.patchValue({charityType:this.charityTypes[0]})),this.currentSegment=i}resetForm(){let t={};1===this.temples.length&&(t.temple=this.temples[0]),this.entryForm.reset(t)}}return(r=s).\u0275fac=function(t){return new(t||r)(e.rXU(_.q),e.rXU(n.ok),e.rXU(g.C),e.rXU(a.Xi),e.rXU(T.W))},r.\u0275cmp=e.VBU({type:r,selectors:[["app-add-entry"]],standalone:!0,features:[e.aNF],decls:34,vars:3,consts:[["slot","start"],[1,"container"],[3,"ngSubmit","formGroup"],["lines","full"],["formControlName","title","label","Title *","label-placement","floating","placeholder","Select title","required","","name","title"],["value","Sri."],["value","Smt."],["value","Kum."],["formControlName","name","label","Name *","label-placement","floating","placeholder","Enter name","type","text","name","name","required","","helperText","Only a-z, A-Z and 0-9 characters allowed","errorText","Only a-z, A-Z and 0-9 characters allowed"],["formControlName","temple","label","Temple *","label-placement","floating","placeholder","Select temple","required","","name","temple",3,"selectionChange"],[3,"value"],[3,"ionChange","value"],["value","preset"],["value","custom"],["formGroupName","charityType"],["expand","full","type","submit"],["formControlName","charityType","label","Service *","label-placement","floating","placeholder","Select service","required","","name","service",3,"selectionChange"],["lines","none"],["formControlName","name","label","Service Name *","label-placement","floating","placeholder","Enter service name","type","text","name","name","required","","maxlength","100","helperText","Only a-z, A-Z and 0-9 characters allowed","errorText","Only a-z, A-Z and 0-9 characters allowed"],["formControlName","amount","label","Service Amount *","label-placement","floating","placeholder","1001","type","number","name","amount","required","","min","1"]],template:function(t,i){1&t&&(e.j41(0,"ion-header")(1,"ion-toolbar")(2,"ion-buttons",0),e.nrm(3,"ion-menu-button"),e.k0s(),e.j41(4,"ion-title"),e.EFF(5,"Add Entry"),e.k0s()()(),e.j41(6,"ion-content")(7,"div",1)(8,"form",2),e.bIt("ngSubmit",function(){return i.onSubmit()}),e.j41(9,"ion-item",3)(10,"ion-select",4)(11,"ion-select-option",5),e.EFF(12,"Sri. (Shriman)"),e.k0s(),e.j41(13,"ion-select-option",6),e.EFF(14,"Smt. (Shrimati)"),e.k0s(),e.j41(15,"ion-select-option",7),e.EFF(16,"Kum. (Kumar/Kumari)"),e.k0s()()(),e.j41(17,"ion-item",3),e.nrm(18,"ion-input",8),e.k0s(),e.j41(19,"ion-item",3)(20,"ion-select",9),e.bIt("selectionChange",function(c){return i.onTempleSelection(c)}),e.Z7z(21,f,2,2,"ion-select-option",10,h),e.k0s()(),e.j41(23,"ion-segment",11),e.bIt("ionChange",function(c){return i.onSegmentChange(c)}),e.j41(24,"ion-segment-button",12)(25,"ion-label"),e.EFF(26,"Preset services"),e.k0s()(),e.j41(27,"ion-segment-button",13)(28,"ion-label"),e.EFF(29,"Custom service"),e.k0s()()(),e.DNE(30,E,4,0,"ion-item",3)(31,C,5,0,"ng-container",14),e.j41(32,"ion-button",15),e.EFF(33,"Submit"),e.k0s()()()()),2&t&&(e.R7$(8),e.Y8G("formGroup",i.entryForm),e.R7$(13),e.Dyx(i.temples),e.R7$(2),e.Y8G("value",i.currentSegment),e.R7$(7),e.vxM("preset"===i.currentSegment?30:31))},dependencies:[a.eP,a.Gp,a.he,y.MD,n.X1,n.qT,n.BC,n.cb,n.YS,n.tU,n.j4,n.JD,n.$R,a.Jm,a.W9,a.eU,a.BC,a.ai,a.Nm,a.Ip,a.$w,a.QW,a.MC,a.uz]}),s})()}}]);