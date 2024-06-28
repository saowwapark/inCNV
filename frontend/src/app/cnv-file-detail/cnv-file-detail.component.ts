import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cnv-file-detail',
  templateUrl: './cnv-file-detail.component.html',
  styleUrls: ['./cnv-file-detail.component.scss']
})
export class CnvFileDetailComponent implements OnInit {
  uploadCnvToolResultId: number;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.uploadCnvToolResultId = +this.route.snapshot.paramMap.get('id');
  }
}
