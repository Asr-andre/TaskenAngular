import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { projectDocument, ProjectTeam } from 'src/app/core/data';

@Component({
  selector: 'app-details',
  standalone: false,
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

/**
 * Details Component
 */
export class DetailsComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  projectListWidgets!: any;
  teamOverviewList: any;
  submitted = false;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Tickets' }, { label: 'Detalhes', active: true }];
    this.projectListWidgets = projectDocument;
    this.teamOverviewList = ProjectTeam;
  }

  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
  }

  activeMenu(id: any) {
    document.querySelector('.star_' + id)?.classList.toggle('active');
  }
}
