/** Import Angular Module **/
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

/** Custom Modules */
import { AppRoutingModule } from './app-routing.module';
import { AuthenModule } from './authen/authen.module';
import { SharedModule } from './shared/shared.module';

import { NavigationModule } from './navigation/navigation.module';

/** Components */
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeMenuComponent } from './pages/home-page/home-menu/home-menu.component';
import { HomeContentComponent } from './pages/home-page/home-content/home-content.component';
import { AppPageComponent } from './pages/app-page/app-page.component';
import { AppMenuComponent } from './pages/app-page/app-menu/app-menu.component';
import { ExportFilesComponent } from './export-files/export-files.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

import { AuthenInterceptor } from './authen/authen-interceptor';

/** Services or Resolvers */
import { ConstantsService } from './services/constants.service';
import { TabFileMappingService } from './tab-file-mapping/tab-file-mapping.service';
import { SamplesetService } from './sampleset/sampleset.service';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';

/** Entry Components */
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from './shared/components/error-dialog/error-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatasourceService } from './datasource/datasource.service';
import { DatasourceComponent } from './datasource/datasource.component';
import { NavigationService } from './navigation/navigation.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AppPageComponent,
    ExportFilesComponent,
    PageNotFoundComponent,
    ConfirmDialogComponent,
    ErrorDialogComponent,
    AppMenuComponent,
    HomeContentComponent,
    HomeMenuComponent,
    DatasourceComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

    // custom modules
    AuthenModule,
    SharedModule,
    NavigationModule,

    // app routing must be last
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    TabFileMappingService,
    ConstantsService,
    SamplesetService,
    DatasourceService,
    NavigationService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent, ErrorDialogComponent]
})
export class AppModule {}
