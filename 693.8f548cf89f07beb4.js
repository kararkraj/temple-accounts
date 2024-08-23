"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[693,953],{8573:(C,h,y)=>{y.r(h),y.d(h,{EditCharityTypePage:()=>E});var p=y(467),e=y(3953),s=y(4341),o=y(5751),m=y(7365),g=y(9228);let E=(()=>{var _;class u extends m.AddCharityTypePage{constructor(){super(...arguments),this.router=(0,e.WQX)(g.Ix)}ngOnInit(){var r=this;return(0,p.A)(function*(){r.title="Edit Service";try{r.charityType=yield r.charityTypeService.getCharityTypeById(r.charityTypeId),r.resetForm()}catch(t){r.toaster.presentToast({message:t.code,color:"danger"}),r.router.navigate(["tabs"],{replaceUrl:!0})}})()}onSubmit(){var r=this;return(0,p.A)(function*(){if(r.charityTypeForm.valid&&r.charityTypeForm.dirty){var t,a,n,i;const c=yield r.loading.create({message:"Updating service..."});yield c.present();const d={};null!==(t=r.charityTypeForm.get("name"))&&void 0!==t&&t.dirty&&(d.name=null===(a=r.charityTypeForm.get("name"))||void 0===a?void 0:a.value),null!==(n=r.charityTypeForm.get("amount"))&&void 0!==n&&n.dirty&&(d.amount=null===(i=r.charityTypeForm.get("amount"))||void 0===i?void 0:i.value);try{r.charityType=yield r.charityTypeService.updateCharityType(r.charityTypeId,d),r.toaster.presentToast({message:"Service was updated successfully.",color:"success"})}catch(l){r.toaster.presentToast({message:`Error: ${l.code}`,color:"danger"}),console.error("Error updating document: ",l)}finally{r.resetForm(),c.dismiss()}}else r.charityTypeForm.valid?r.toaster.presentToast({message:"Nothing to update."}):r.charityTypeForm.markAllAsTouched()})()}resetForm(){this.charityTypeForm.reset(this.charityType)}}return(_=u).\u0275fac=(()=>{let T;return function(t){return(T||(T=e.xGo(_)))(t||_)}})(),_.\u0275cmp=e.VBU({type:_,selectors:[["app-edit-charity-type"]],standalone:!0,features:[e.Vt3,e.aNF],decls:21,vars:2,consts:[["slot","start"],["defaultHref","tabs/services"],[3,"ngSubmit","formGroup"],["lines","none"],["formControlName","name","label","Service Name *","label-placement","floating","placeholder","Enter service name","type","text","name","name","required","","maxlength","100","helperText","Only a-z, A-Z and 0-9 characters allowed","errorText","Only a-z, A-Z and 0-9 characters allowed"],["formControlName","amount","label","Service Amount *","label-placement","floating","placeholder","1001","type","number","name","amount","required","","min","1"],[1,"ion-no-padding"],["expand","full","type","button","color","light",3,"click"],["expand","full","type","submit"]],template:function(r,t){1&r&&(e.j41(0,"ion-header")(1,"ion-toolbar")(2,"ion-buttons",0),e.nrm(3,"ion-back-button",1),e.k0s(),e.j41(4,"ion-title"),e.EFF(5),e.k0s()()(),e.j41(6,"ion-content")(7,"form",2),e.bIt("ngSubmit",function(){return t.onSubmit()}),e.j41(8,"ion-item-group")(9,"ion-item",3),e.nrm(10,"ion-input",4),e.k0s(),e.j41(11,"ion-item",3),e.nrm(12,"ion-input",5),e.k0s()(),e.j41(13,"ion-grid",6)(14,"ion-row")(15,"ion-col")(16,"ion-button",7),e.bIt("click",function(){return t.resetForm()}),e.EFF(17,"Reset"),e.k0s()(),e.j41(18,"ion-col")(19,"ion-button",8),e.EFF(20,"Submit"),e.k0s()()()()()()),2&r&&(e.R7$(5),e.JRh(t.title),e.R7$(2),e.Y8G("formGroup",t.charityTypeForm))},dependencies:[o.Jm,o.hU,o.lO,o.uz,o.jh,o.el,o.ln,o.QW,o.W9,o.eU,o.BC,o.ai,s.X1,s.qT,s.BC,s.cb,s.YS,s.tU,s.j4,s.JD,o.$w]}),u})()},1953:(C,h,y)=>{y.d(h,{y:()=>_});var p=y(467),e=y(4262),s=y(2943),o=y(3953),m=y(7291),g=y(5621),E=y(3606);let _=(()=>{var u;class T{constructor(t,a,n,i){this.storage=t,this.fireStore=a,this.auth=n,this.network=i}getCharityTypes(){var t=this;return(0,p.A)(function*(){const a=yield t.storage.get(s.d.CHARITY_TYPES.charityTypes);if(null===a){var n;const i=(0,e.P)((0,e.rJ)(t.fireStore,"charityTypes"),(0,e._M)("createdBy","==",null===(n=t.auth.currentUser)||void 0===n?void 0:n.uid)),d=(yield(0,e.GG)(i)).docs.map(l=>({id:l.id,...l.data()}));return yield t.storage.set(s.d.CHARITY_TYPES.charityTypes,d),d}return a})()}getCharityTypeById(t){var a=this;return(0,p.A)(function*(){const i=(yield a.storage.get(s.d.CHARITY_TYPES.charityTypes)).find(c=>c.id===t);if(i)return i;throw{code:"permission-denied"}})()}addCharityType(t){var a=this;return(0,p.A)(function*(){try{var n;yield a.network.isNetworkConnected();const i=(new Date).toISOString(),c={name:t.name,amount:t.amount,createdBy:null===(n=a.auth.currentUser)||void 0===n?void 0:n.uid,createdAt:i,updatedAt:i},l={id:(yield(0,e.gS)((0,e.rJ)(a.fireStore,"charityTypes"),c)).id,...c},v=yield a.storage.get(s.d.CHARITY_TYPES.charityTypes);return v.push(l),yield a.storage.set(s.d.CHARITY_TYPES.charityTypes,v),l}catch(i){throw i}})()}updateCharityType(t,a){var n=this;return(0,p.A)(function*(){try{yield n.network.isNetworkConnected();const i=(0,e.H9)(n.fireStore,"charityTypes",t);a.updatedAt=(new Date).toISOString(),yield(0,e.mZ)(i,a);const c=yield n.storage.get(s.d.CHARITY_TYPES.charityTypes),d=c.findIndex(l=>l.id===t);return c[d]={...c[d],...a},yield n.storage.set(s.d.CHARITY_TYPES.charityTypes,c),c[d]}catch(i){throw i}})()}deleteCharityType(t){var a=this;return(0,p.A)(function*(){try{yield a.network.isNetworkConnected(),yield(0,e.kd)((0,e.H9)(a.fireStore,"charityTypes",t));const n=yield a.storage.get(s.d.CHARITY_TYPES.charityTypes),i=n.findIndex(d=>d.id===t),c=n.splice(i,1)[0];return yield a.storage.set(s.d.CHARITY_TYPES.charityTypes,n),c}catch(n){throw n}})()}}return(u=T).\u0275fac=function(t){return new(t||u)(o.KVO(m.n),o.KVO(e._7),o.KVO(g.Nj),o.KVO(E.A))},u.\u0275prov=o.jDH({token:u,factory:u.\u0275fac,providedIn:"root"}),T})()}}]);