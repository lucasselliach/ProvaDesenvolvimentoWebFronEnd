import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { FormBuilder, AbstractControl } from '@angular/forms';

import { formatDate } from '@angular/common';

import { TarefaModel } from './../model/tarefas.model';

import { TarefaService } from './../service/tarefas.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  public formGroup : FormGroup;

  public today = new Date();

  public listaDeTarefasEmAndamento: TarefaModel[];
  public listaDeTarefasFinalizados: TarefaModel[];
  public tarefasNoDrag: TarefaModel;
  
  constructor(private formBuilder: FormBuilder, private tarefaService: TarefaService) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      titulo: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      descricao: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      prioridade: [null, [Validators.required, Validators.min(1)]],
      dataFim: [null, Validators.required]
    });

    this.listaDeTarefasEmAndamento = [];
    this.listaDeTarefasFinalizados = [];

    this.listaDeTarefasEmAndamento = this.tarefaService.getsaveLocalTarefa();
  }

  formGroupOnClick() {
    if (this.formGroup.valid) {

      let tarefa = new TarefaModel();
      tarefa.id = this.listaDeTarefasEmAndamento.length;
      tarefa.titulo = this.formGroup.value.titulo; 
      tarefa.descricao = this.formGroup.value.descricao; 
      tarefa.dataInicio = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
      tarefa.dataFim = this.formGroup.value.dataFim; 
      tarefa.prioridade = this.formGroup.value.prioridade;

      console.log(tarefa);
        
      this.listaDeTarefasEmAndamento.push(tarefa);
      this.tarefaService.saveLocalTarefa(this.listaDeTarefasEmAndamento);
    }
  }

  finalizarOnClick(tarefa: TarefaModel) {
   
    console.log(tarefa);
    this.listaDeTarefasFinalizados.push(tarefa);
    this.listaDeTarefasEmAndamento.splice(this.listaDeTarefasEmAndamento.indexOf(tarefa), 1);
    this.tarefaService.saveLocalTarefa(this.listaDeTarefasEmAndamento);
  }
  
  dataClick(){
    this.listaDeTarefasEmAndamento.sort((a, b) => {
      if (a.dataFim < b.dataFim) return -1;
      else if (a.dataFim > b.dataFim) return 1;
      else return 0;
    });
  }

  prioridadeClick(){
    this.listaDeTarefasEmAndamento.sort((a, b) => {
      if (a.prioridade < b.prioridade) return -1;
      else if (a.prioridade > b.prioridade) return 1;
      else return 0;
    });
  }


  drag(ev, tarefa: TarefaModel) {
    console.log(tarefa);
    this.tarefasNoDrag = tarefa;
  }

  drop(ev) {
    ev.preventDefault();
    
    console.log(this.tarefasNoDrag);
    this.listaDeTarefasFinalizados.push(this.tarefasNoDrag);
    this.listaDeTarefasEmAndamento.splice(this.listaDeTarefasEmAndamento.indexOf(this.tarefasNoDrag), 1);
    this.tarefaService.saveLocalTarefa(this.listaDeTarefasEmAndamento);

    this.tarefasNoDrag = new TarefaModel;
  }

  allowDrop(ev) {
    ev.preventDefault();
  }
}
