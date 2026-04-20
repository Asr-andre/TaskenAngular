import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chamado } from 'src/app/core/models/chamado.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

/**
 * Details Component
 */
export class DetailsComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  chamado: Chamado | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Tickets' }, { label: 'Detalhes', active: true }];

    const navigation = this.router.getCurrentNavigation();
    const chamadoState = navigation?.extras?.state?.['chamado'] as Chamado | undefined;
    const chamadoId = Number(this.route.snapshot.paramMap.get('id'));

    if (chamadoState && Number(chamadoState.chamadoId) === chamadoId) {
      this.chamado = chamadoState;
      return;
    }
  }

}
