import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { APP_INITIALIZER } from '@angular/core';
import { ConfigService } from './app/core/services/config.service';

bootstrapApplication(
  AppComponent,
{
  
  providers:[
  
  provideRouter(
    routes
  ),
  {
    provide:
    APP_INITIALIZER,
  
    multi:true,
  
    deps:[
      ConfigService
    ],
  
    useFactory:
    (
      cfg:
      ConfigService
    )=>
      ()=>
      cfg.load()
  }
  ]
}

);