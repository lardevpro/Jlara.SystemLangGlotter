import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'courses',
    loadComponent: () => import('./components/courses/courses.component').then(m => m.CoursesComponent),
  },
  {
    path: 'languages',
    loadComponent: () => import('./components/languages/languages.component').then(m => m.LanguagesComponent),
  }
  ,
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'progress',
    loadComponent: () => import('./components/progress/progress.component').then(m => m.ProgressComponent),
    
  },
  {
    path: 'pronunciation',
    loadComponent: () => import('./components/pronunciation/pronunciation.component').then(m => m.Pronunciation),
  },
  {
    path: 'writing',
    loadComponent: () => import('./components/writing/writing.component').then(m => m.WritingComponent),
  },
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(m => m.AccountModule.forLazy()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.IdentityModule.forLazy()),
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('@abp/ng.tenant-management').then(m => m.TenantManagementModule.forLazy()),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.SettingManagementModule.forLazy()),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
