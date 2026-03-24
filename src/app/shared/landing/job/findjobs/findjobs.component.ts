import { Component, OnInit } from '@angular/core';

// Data Get
import { findjob } from './data';

@Component({
  selector: 'app-findjobs',
  standalone: false,
  templateUrl: './findjobs.component.html',
  styleUrls: ['./findjobs.component.scss']
})
export class FindjobsComponent implements OnInit {

  findjobs: any;

  constructor() { }

  ngOnInit(): void {
    this.findjobs = findjob
  }

}
