"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[953],{1953:(p,h,c)=>{c.d(h,{y:()=>f});var a=c(467),u=c(3953),s=c(3026),y=c(5621);let f=(()=>{var n;class _{constructor(e,t){this.fireStore=e,this.auth=t,this.services=(0,u.vPA)([])}getCharityTypes(){var e=this;return(0,a.A)(function*(){return e.servicesListener?e.services():new Promise(t=>{var r;const i=(0,s.P)((0,s.rJ)(e.fireStore,"services"),(0,s._M)("createdBy","==",null===(r=e.auth.currentUser)||void 0===r?void 0:r.uid),(0,s._M)("isActive","==",!0));e.servicesListener=(0,s.aQ)(i,o=>{const v=o.docs.map(d=>({id:d.id,...d.data()}));e.services.set(v),t(v)})})})()}getCharityTypeById(e){var t=this;return(0,a.A)(function*(){const r=(0,s.H9)(t.fireStore,"services",e),i=yield(0,s.x7)(r);if(i.exists())return{id:i.id,...i.data()};throw{code:"permission-denied"}})()}addCharityType(e){var t=this;return(0,a.A)(function*(){try{var r;const i=(new Date).toISOString(),o={name:e.name,amount:e.amount,createdBy:null===(r=t.auth.currentUser)||void 0===r?void 0:r.uid,createdAt:i,updatedAt:i,isActive:!0};return{id:(yield(0,s.gS)((0,s.rJ)(t.fireStore,"services"),o)).id,...o}}catch(i){throw i}})()}updateCharityType(e,t){var r=this;return(0,a.A)(function*(){try{const i=(0,s.H9)(r.fireStore,"services",e);return t.updatedAt=(new Date).toISOString(),yield(0,s.mZ)(i,t),t}catch(i){throw i}})()}deleteCharityType(e){var t=this;return(0,a.A)(function*(){try{const r={isActive:!1};return yield t.updateCharityType(e,r)}catch(r){throw r}})()}}return(n=_).\u0275fac=function(e){return new(e||n)(u.KVO(s._7),u.KVO(y.Nj))},n.\u0275prov=u.jDH({token:n,factory:n.\u0275fac,providedIn:"root"}),_})()}}]);