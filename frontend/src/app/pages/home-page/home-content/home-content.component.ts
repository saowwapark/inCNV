import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from 'src/app/authen/authen.service';
import { DatasourceService } from 'src/app/datasource/datasource.service';

@Component({
  selector: 'home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss'],
})
export class HomeContentComponent implements OnInit, AfterViewInit {
  @ViewChild('individual', {static: true}) individual: ElementRef;
  @ViewChild('multiple', {static: true} ) multiple: ElementRef;
  showImage1 = true;
  constructor(private router: Router, private datasourceService: DatasourceService, private autheService: AuthenService) {
    
  }

  toggleImages() {
  
    if (this.showImage1) {
      this.individual.nativeElement.classList.remove('show');
      this.individual.nativeElement.classList.add('hide');
      this.multiple.nativeElement.classList.remove('hide');
      this.multiple.nativeElement.classList.add('show');
    } else {
      this.individual.nativeElement.classList.remove('hide');
      this.individual.nativeElement.classList.add('show');
      this.multiple.nativeElement.classList.remove('show');
      this.multiple.nativeElement.classList.add('hide');
    }
  
    this.showImage1 = !this.showImage1;
  }

  logValue(eventType: string) {
    console.log(`
      [${eventType}]
      individual: ${this.individual}, value: ${this.individual.nativeElement.innerHTML}}
      `
    )
  }

  
  ngAfterViewInit(): void {
    this.logValue('ngAfterViewInit');
    setInterval(this.toggleImages.bind(this), 10000);
  }
  ngOnInit(): void {
    this.logValue('ngOnInit');
    this.checkShouldUpdateDatasource();
    
  }

  checkShouldUpdateDatasource() {
    this.datasourceService.shouldUpdateDatasource().subscribe((result: boolean) => {
      this.autheService.isAuthen$.subscribe(isAuthen => {
        if(isAuthen === true && result === true) {
          this.goToInstallPage();
          this.datasourceService.onAllDownloadsCompleted().subscribe(() => {
            this.goToDefaultPage();
          })
        }
      })
    })
  }

  goToInstallPage() {
    this.router.navigate(['app/install']);
  }
  goToDefaultPage() {
    this.router.navigate(['app/upload-cnvs']);
  }
}
